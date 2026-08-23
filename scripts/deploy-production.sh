#!/usr/bin/env bash
set -Eeuo pipefail

umask 077

project_dir="$(git rev-parse --show-toplevel)"
cd "$project_dir"

exec 9>/var/lock/property-seeker-deploy.lock
if ! flock -n 9; then
  echo "Another production deployment is already running."
  exit 1
fi

if [[ ! -f .env.production ]]; then
  echo "Missing $project_dir/.env.production"
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Refusing deployment from a dirty working tree."
  exit 1
fi

current_sha="$(git rev-parse HEAD)"
if [[ -n "${DEPLOY_SHA:-}" && "$current_sha" != "$DEPLOY_SHA" ]]; then
  echo "Checked-out commit $current_sha does not match tested commit $DEPLOY_SHA."
  exit 1
fi

compose=(docker compose --env-file .env.production)
protected_volumes=(
  property_seeker_postgres_data
  property_seeker_redis_data
  property_seeker_media_volume
  property_seeker_divar_profile
)

for volume in "${protected_volumes[@]}"; do
  if ! docker volume inspect "$volume" >/dev/null 2>&1; then
    echo "Required protected volume is missing: $volume"
    echo "Refusing to start with an empty replacement volume."
    exit 1
  fi
done

"${compose[@]}" config --quiet

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup_dir="/root/property_seeker-backups/${timestamp}-pre-deploy-${current_sha:0:12}"
mkdir -p "$backup_dir"

postgres_id="$("${compose[@]}" ps -q postgres)"
if [[ -n "$postgres_id" ]] && [[ "$(docker inspect -f '{{.State.Running}}' "$postgres_id")" == "true" ]]; then
  tmp_dump="$backup_dir/postgres.sql.gz.tmp"
  "${compose[@]}" exec -T postgres sh -lc \
    'export PGPASSWORD="$POSTGRES_PASSWORD"; pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \
    | gzip -9 > "$tmp_dump"
  mv "$tmp_dump" "$backup_dir/postgres.sql.gz"
fi

redis_id="$("${compose[@]}" ps -q redis)"
if [[ -n "$redis_id" ]] && [[ "$(docker inspect -f '{{.State.Running}}' "$redis_id")" == "true" ]]; then
  docker exec "$redis_id" redis-cli SAVE >/dev/null
  docker cp "$redis_id:/data/dump.rdb" "$backup_dir/redis.rdb" >/dev/null
fi

printf '%s\n' "$current_sha" > "$backup_dir/git-head.txt"

echo "Building the tested revision $current_sha..."
"${compose[@]}" build

echo "Checking Django model/migration consistency..."
"${compose[@]}" run --rm --no-deps backend \
  python manage.py makemigrations --check --dry-run
"${compose[@]}" run --rm --no-deps backend python manage.py check

echo "Starting services without deleting volumes..."
"${compose[@]}" up -d --remove-orphans

backend_id="$("${compose[@]}" ps -q backend)"
health=""
for _ in $(seq 1 30); do
  health="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$backend_id")"
  if [[ "$health" == "healthy" ]]; then
    break
  fi
  sleep 5
done

if [[ "$health" != "healthy" ]]; then
  echo "Backend did not become healthy (status: $health)."
  "${compose[@]}" logs --tail=150 backend migrate
  exit 1
fi

curl --fail --silent --show-error --retry 5 --retry-delay 2 \
  https://dilanmelk.ir/ >/dev/null

docker image prune -f >/dev/null

echo "Deployment completed: $current_sha"
echo "Pre-deploy backup: $backup_dir"

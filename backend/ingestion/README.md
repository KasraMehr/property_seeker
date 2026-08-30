# Divar ingestion

`ingestion` owns external Divar candidates. A scraped `listing.Listing` remains
independent of `properties.Property`; promotion copies reviewed source values into
a new managed property once and later source refreshes cannot overwrite it.

## Runtime topology

- PostgreSQL: listings, targets, runs, resumable items, and changed snapshots.
- Redis: Celery broker and the source-wide Divar request limiter.
- `worker`: non-browser dispatch work on the `default` queue.
- `scraper-worker`: browser work on the `scraping` queue, concurrency one.
- `divar_profile`: persistent Chromium login state, mounted only in the scraper
  worker.
- `beat`: the only scheduler instance.

Copy `.env.example` to `.env`, set secrets, then start the stack from the project
root with `docker compose up --build`. The web service applies migrations before
starting. Create a `listing.Source` named Divar and an enabled `ScrapeTarget` in
the Django admin.

## One-time Divar login

Phone ingestion is enabled in both Docker Compose stacks. Before the first run,
stop the scraper worker and authenticate the profile interactively:

```console
docker compose stop scraper-worker
docker compose run --rm scraper-worker python manage.py divar_login --phone 09xxxxxxxxx
docker compose up -d scraper-worker
```

The command sends the login request through Divar's web UI, asks for the SMS OTP
without echoing it, and saves the resulting refreshable session in the
`divar_profile` volume. Container rebuilds and VPS restarts retain that volume.
Run the command again only if Divar revokes/expires the session. Divar can also
occasionally require a separate contact-reveal OTP or CAPTCHA; the scraper marks
that item as failed instead of silently storing a missing phone number.

Do not run `divar_login` while `scraper-worker` is active: Chromium permits only
one process to use a profile at a time. `docker compose down -v` deletes the
profile volume and therefore requires another OTP login.

## Operator commands

```console
python manage.py ingest_divar --target 1 --mode full
python manage.py ingest_divar --target 1 --mode discovery
python manage.py ingest_divar --target 1 --mode reconciliation
python manage.py resume_ingestion_run RUN_UUID
python manage.py export_ingestion_run RUN_UUID
```

Use `--sync` for local validation without a Celery broker. A bounded semantic
audit can be run with `--detail-limit 100`; it records every discovered token in
the run but fetches only the first 100 detail pages.

The scheduler performs incremental discovery and due refresh dispatch every 15
minutes, plus one daily token/card reconciliation. A partial scan or transport
failure never expires a listing. Only two explicit removed-page observations at
least six hours apart set a listing to expired.

Every export defaults to a timestamped file under `Data_log/`. PostgreSQL remains
the source of truth; snapshots are created only when the normalized payload hash
changes.

## Actively normalized source fields

- identity: source, Divar token, canonical URL
- content: title, advertiser description, image count, image-match flag
- contact: authenticated advertiser phone number (when the ad exposes one)
- dimensions: area, build year, room count, floor, total floors
- money: sale price, price per meter, mortgage, deposit, monthly rent
- source time: publication and last-update timestamps
- ingestion state: first/last seen, last checked/changed, status, review status,
  removal failures, content hash, and latest normalized payload

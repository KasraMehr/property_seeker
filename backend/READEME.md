# Local Development with Docker

This Docker Compose file is used to run the project in a **local development environment**.

The development environment uses:

* Django `runserver`
* SQLite
* Redis
* Celery Worker
* Celery Scraper Worker
* Celery Beat
* Docker bind mounts

Unlike the production environment, PostgreSQL and Gunicorn are **not used** here.

---

## Services

| Service          | Purpose                         |
| ---------------- | ------------------------------- |
| `redis`          | Message broker for Celery       |
| `migrate`        | Runs Django database migrations |
| `web`            | Runs Django development server  |
| `worker`         | Runs the default Celery worker  |
| `scraper-worker` | Runs the scraping Celery worker |
| `beat`           | Runs scheduled Celery tasks     |

The overall architecture is:

```text
                    Local Machine
                         │
                         │
                    localhost:8000
                         │
                         ▼
                  ┌──────────────┐
                  │     web      │
                  │    Django    │
                  │  runserver   │
                  │    :8000     │
                  └──────┬───────┘
                         │
             ┌───────────┴───────────┐
             │                       │
             ▼                       ▼
       ┌─────────────┐         ┌─────────────┐
       │    SQLite   │         │    Redis    │
       │  db.sqlite3 │         │    :6379    │
       └─────────────┘         └──────┬──────┘
                                      │
                         ┌────────────┼────────────┐
                         ▼            ▼            ▼
                      worker    scraper-worker    beat
```

---

# Prerequisites

Make sure the following are installed on your machine:

* Docker
* Docker Compose

Check Docker:

```bash
docker --version
```

Check Docker Compose:

```bash
docker compose version
```

---

# Running the Project

For the first run, or after changing `requirements.txt`:

```bash
docker compose -f docker-compose.dev.yml up --build
```

To run the project in the background:

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

The Django application will be available at:

```text
http://localhost:8000
```

---

# Running Without Rebuilding

If you only changed Python or project source code, you do not need to rebuild the image:

```bash
docker compose -f docker-compose.dev.yml up
```

Or in detached mode:

```bash
docker compose -f docker-compose.dev.yml up -d
```

This works because the project uses a bind mount:

```yaml
volumes:
  - ./backend:/app
```

The local `backend` directory is mounted directly into `/app` inside the container.

Therefore, changes made on the host are immediately available inside the container.

Django's `StatReloader` automatically detects Python file changes and restarts the development server.

---

# SQLite Database

The development environment uses SQLite:

```yaml
DB_ENGINE: django.db.backends.sqlite3
SQLITE_PATH: db.sqlite3
```

The database file is located at:

```text
backend/db.sqlite3
```

The `backend` directory is bind-mounted:

```yaml
volumes:
  - ./backend:/app
```

Therefore, the SQLite database is stored on the host machine.

Running:

```bash
docker compose -f docker-compose.dev.yml down
```

does **not** delete:

```text
backend/db.sqlite3
```

There is also no PostgreSQL service in the development Compose file.

---

# Redis

Redis is provided by:

```yaml
redis:
  image: redis:7-alpine
```

Inside the Docker network, Redis is available at:

```text
redis://redis:6379/0
```

This URL is used by Celery:

```yaml
REDIS_URL: redis://redis:6379/0
```

Redis is used for:

* Celery message brokering
* Task queues
* Celery workers
* Scraper workers
* Celery Beat

Redis data is stored in the Docker volume:

```text
redis_data_dev
```

---

# Django Migrations

The `migrate` service runs Django migrations:

```yaml
command:
  - python
  - manage.py
  - migrate
  - --noinput
```

The `web` service waits for the migration service to complete successfully:

```yaml
depends_on:
  migrate:
    condition: service_completed_successfully
```

The general startup order is:

```text
Redis
  ↓
migrate
  ↓
web
worker
scraper-worker
beat
```

---

# Django Development Server

The `web` service uses the `dev` target from the multi-stage Dockerfile:

```yaml
build:
  context: ./backend
  target: dev
```

Django is started with:

```bash
python manage.py runserver 0.0.0.0:8000
```

Port `8000` is exposed to the host:

```yaml
ports:
  - "8000:8000"
```

So the request flow is:

```text
Browser
   ↓
localhost:8000
   ↓
Docker web container
   ↓
Django runserver
```

---

# Celery Worker

The default Celery worker runs:

```yaml
command:
  - celery
  - -A
  - amlak
  - worker
  - -Q
  - default
  - --concurrency=2
  - --loglevel=INFO
```

It processes tasks from the:

```text
default
```

queue.

---

# Scraper Worker

The scraper worker runs:

```yaml
command:
  - celery
  - -A
  - amlak
  - worker
  - -Q
  - scraping
  - --concurrency=1
  - --loglevel=INFO
```

It processes tasks from the:

```text
scraping
```

queue.

The scraper worker also has increased shared memory:

```yaml
shm_size: 1gb
```

This is useful for Chromium/Selenium-based scraping.

---

# Celery Beat

Celery Beat is responsible for dispatching scheduled tasks:

```yaml
command:
  - celery
  - -A
  - amlak
  - beat
  - --loglevel=INFO
  - --schedule=/tmp/celerybeat-schedule
```

It runs the scheduled tasks configured in the Django/Celery settings.

---

# Environment Variables

The development Compose file provides safe default values, so no environment file is required for a basic local setup.

Important development values include:

```env
DB_ENGINE=django.db.backends.sqlite3
SQLITE_PATH=db.sqlite3

REDIS_URL=redis://redis:6379/0

SECRET_KEY=django-insecure-local-key
DEBUG=True

ALLOWED_HOSTS=localhost,127.0.0.1

SECURE_SSL_REDIRECT=False
SESSION_COOKIE_SECURE=False
CSRF_COOKIE_SECURE=False
AUTH_COOKIE_SECURE=False

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

CSRF_TRUSTED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

CELERY_TIMEZONE=Asia/Tehran
DIVAR_REQUEST_INTERVAL_SECONDS=2.5
```

These values are intended for **local development only** and must not be reused for production.

---

# Viewing Logs

View logs from all services:

```bash
docker compose -f docker-compose.dev.yml logs -f
```

View Django logs:

```bash
docker compose -f docker-compose.dev.yml logs -f web
```

View Celery worker logs:

```bash
docker compose -f docker-compose.dev.yml logs -f worker
```

View scraper worker logs:

```bash
docker compose -f docker-compose.dev.yml logs -f scraper-worker
```

View Redis logs:

```bash
docker compose -f docker-compose.dev.yml logs -f redis
```

---

# Checking Container Status

Run:

```bash
docker compose -f docker-compose.dev.yml ps
```

You should see:

```text
redis
migrate
web
worker
scraper-worker
beat
```

---

# Accessing the Django Container

Open a shell inside the `web` container:

```bash
docker compose -f docker-compose.dev.yml exec web bash
```

Open the Django shell:

```bash
docker compose -f docker-compose.dev.yml exec web python manage.py shell
```

Run migrations manually:

```bash
docker compose -f docker-compose.dev.yml exec web python manage.py migrate
```

Create migrations:

```bash
docker compose -f docker-compose.dev.yml exec web python manage.py makemigrations
```

---

# Stopping the Project

Stop and remove the containers:

```bash
docker compose -f docker-compose.dev.yml down
```

This removes the containers and Docker network but keeps:

```text
backend/db.sqlite3
```

and the Redis volume:

```text
redis_data_dev
```

---

# Removing Redis Data

To remove the Redis Docker volume as well:

```bash
docker compose -f docker-compose.dev.yml down -v
```

⚠️ This removes the Docker volumes defined by this Compose project.

The SQLite database is still stored in:

```text
backend/db.sqlite3
```

because it is part of the host-mounted `backend` directory.

---

# Updating Requirements

If the following file changes:

```text
backend/requirements.txt
```

rebuild the Docker image:

```bash
docker compose -f docker-compose.dev.yml up --build
```

For normal Python source-code changes such as:

```text
*.py
```

a rebuild is not required.

---

# Development vs Production

| Feature         | Development | Production           |
| --------------- | ----------- | -------------------- |
| Docker target   | `dev`       | `production`         |
| Django server   | `runserver` | Gunicorn             |
| Database        | SQLite      | PostgreSQL           |
| Debug           | `True`      | `False`              |
| `collectstatic` | No          | Yes                  |
| Code mount      | Bind mount  | Baked into image     |
| Redis           | Yes         | Yes                  |
| Celery          | Yes         | Yes                  |
| Scraper Worker  | Yes         | Yes                  |
| Celery Beat     | Yes         | Yes                  |
| HTTPS           | No          | Deployment-dependent |
| Nginx           | No          | Frontend container   |

---

# Important Note

This Compose file is intended specifically for **local development**.

For production, use:

```text
docker-compose.yml
```

The development environment is intentionally simpler:

```text
SQLite
   +
Redis
   +
Django runserver
   +
Celery
   +
Scraper Worker
   +
Celery Beat
```

This allows developers to work locally without running PostgreSQL, Gunicorn, or a separate Nginx server.

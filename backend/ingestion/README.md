# Divar ingestion

`ingestion` owns external Divar candidates. A scraped `listing.Listing` remains
independent of `properties.Property`; promotion copies reviewed source values into
a new managed property once and later source refreshes cannot overwrite it.

## Runtime topology

- PostgreSQL: listings, targets, runs, resumable items, and changed snapshots.
- Redis: Celery broker and the source-wide Divar request limiter.
- `worker`: non-browser dispatch work on the `default` queue.
- `scraper-worker`: browser work on the `scraping` queue, concurrency one.
- `beat`: the only scheduler instance.

Copy `.env.example` to `.env`, set secrets, then start the stack from the project
root with `docker compose up --build`. The web service applies migrations before
starting. Create a `listing.Source` named Divar and an enabled `ScrapeTarget` in
the Django admin.

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
- dimensions: area, build year, room count, floor, total floors
- money: sale price, price per meter, mortgage, deposit, monthly rent
- source time: publication and last-update timestamps
- ingestion state: first/last seen, last checked/changed, status, review status,
  removal failures, content hash, and latest normalized payload

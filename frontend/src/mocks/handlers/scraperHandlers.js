import { http, HttpResponse } from "msw";
import {
  MOCK_SCRAPE_TARGETS,
  MOCK_ingestion_RUNS,
  MOCK_ingestion_RUN_ITEMS,
  MOCK_TARGET_LISTINGS,
  MOCK_LISTING_SNAPSHOTS,
} from "@/mocks/data/mockScraper";

function paginate(array, { page = 1, pageSize = 25 }) {
  const count = array.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    count,
    next: end < count ? `?page=${page + 1}&page_size=${pageSize}` : null,
    previous: page > 1 ? `?page=${page - 1}&page_size=${pageSize}` : null,
    results: array.slice(start, end),
  };
}

export const scraperHandlers = [
  // DASHBOARD AGGREGATE (legacy /api/admin/scraper/*)
  http.get("*/api/admin/scraper/status/", () => {
    const running = MOCK_ingestion_RUNS.find((r) => r.status === "running");
    const lastSucceeded = MOCK_ingestion_RUNS
      .filter((r) => r.status === "succeeded")
      .sort((a, b) => new Date(b.finished_at) - new Date(a.finished_at))[0];

    const today = new Date().toISOString().slice(0, 10);
    const todayScraped = MOCK_ingestion_RUNS
      .filter((r) => r.finished_at?.startsWith(today))
      .reduce((sum, r) => sum + (r.discovered_count || 0), 0);

    return HttpResponse.json(
      {
        is_running: !!running,
        last_run: lastSucceeded?.finished_at || null,
        total_scraped_today: todayScraped,
        failed_jobs: MOCK_ingestion_RUNS.filter((r) => r.status === "failed").length,
        sources: MOCK_SCRAPE_TARGETS.map((t) => ({
          name: t.source?.name || t.name,
          status: t.enabled ? "ACTIVE" : "PAUSED",
          last_success: t.last_discovery_at,
          today_scraped: MOCK_ingestion_RUNS
            .filter((r) => r.target?.id === t.id && r.finished_at?.startsWith(today))
            .reduce((sum, r) => sum + (r.discovered_count || 0), 0),
        })),
      },
      { status: 200 }
    );
  }),

  http.get("*/api/admin/scraper/logs/", () => {
    // Aggregate errors from runs as logs
    const logs = MOCK_ingestion_RUNS
      .filter((r) => r.error_summary)
      .map((r, idx) => ({
        id: idx + 1,
        source: r.target?.source?.name || "unknown",
        level: r.status === "failed" ? "ERROR" : "WARNING",
        message: r.error_summary,
        created_at: r.finished_at || r.started_at,
      }));
    return HttpResponse.json(logs, { status: 200 });
  }),

 // SCRAPE TARGETS
  http.get("*/api/ingestion/targets/", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("page_size")) || 25;
    const enabled = url.searchParams.get("enabled");
    let results = [...MOCK_SCRAPE_TARGETS];
    if (enabled !== null && enabled !== "") {
      const flag = enabled === "true";
      results = results.filter((t) => t.enabled === flag);
    }
    return HttpResponse.json(paginate(results, { page, pageSize }), { status: 200 });
  }),

  http.get("*/api/ingestion/targets/:id/", ({ params }) => {
    const id = Number(params.id);
    const target = MOCK_SCRAPE_TARGETS.find((t) => t.id === id);
    if (!target) return HttpResponse.json({ detail: "not found" }, { status: 404 });
    return HttpResponse.json(target, { status: 200 });
  }),

  http.post("*/api/ingestion/targets/", async ({ request }) => {
    const body = await request.json();
    const newTarget = {
      id: MOCK_SCRAPE_TARGETS.length + 1,
      ...body,
      last_watermark_external_id: "",
      last_discovery_at: null,
      last_full_discovery_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_SCRAPE_TARGETS.push(newTarget);
    return HttpResponse.json(newTarget, { status: 201 });
  }),

  http.put("*/api/ingestion/targets/:id/", async ({ params, request }) => {
    const id = Number(params.id);
    const index = MOCK_SCRAPE_TARGETS.findIndex((t) => t.id === id);
    if (index === -1) return HttpResponse.json({ detail: "not found" }, { status: 404 });
    const body = await request.json();
    MOCK_SCRAPE_TARGETS[index] = {
      ...MOCK_SCRAPE_TARGETS[index],
      ...body,
      updated_at: new Date().toISOString(),
    };
    return HttpResponse.json(MOCK_SCRAPE_TARGETS[index], { status: 200 });
  }),

  http.delete("*/api/ingestion/targets/:id/", ({ params }) => {
    const id = Number(params.id);
    const index = MOCK_SCRAPE_TARGETS.findIndex((t) => t.id === id);
    if (index === -1) return HttpResponse.json({ detail: "not found" }, { status: 404 });
    MOCK_SCRAPE_TARGETS.splice(index, 1);
    return HttpResponse.json({ detail: "deleted" }, { status: 204 });
  }),

  // ingestion RUNS
  http.get("*/api/ingestion/runs/", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("page_size")) || 25;
    const targetId = url.searchParams.get("target");
    const status = url.searchParams.get("status");
    let results = [...MOCK_ingestion_RUNS];
    if (targetId) results = results.filter((r) => r.target?.id === Number(targetId));
    if (status) results = results.filter((r) => r.status === status);
    return HttpResponse.json(paginate(results, { page, pageSize }), { status: 200 });
  }),

  http.get("*/api/ingestion/runs/:id/", ({ params }) => {
    const id = params.id; // UUID string
    const run = MOCK_ingestion_RUNS.find((r) => r.id === id);
    if (!run) return HttpResponse.json({ detail: "not found" }, { status: 404 });
    return HttpResponse.json(run, { status: 200 });
  }),

  http.post("*/api/ingestion/runs/", async ({ request }) => {
    const body = await request.json();
    const newRun = {
      id: crypto.randomUUID(),
      ...body,
      status: "queued",
      discovered_count: 0,
      queued_count: 0,
      processed_count: 0,
      new_count: 0,
      changed_count: 0,
      failed_count: 0,
      removed_count: 0,
      error_summary: "",
      artifact_path: "",
      started_at: null,
      finished_at: null,
      created_at: new Date().toISOString(),
    };
    MOCK_ingestion_RUNS.push(newRun);
    return HttpResponse.json(newRun, { status: 201 });
  }),

  http.get("*/api/ingestion/runs/:id/items/", ({ params, request }) => {
    const id = params.id;
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("page_size")) || 25;
    let results = MOCK_ingestion_RUN_ITEMS.filter((i) => i.run?.id === id);
    return HttpResponse.json(paginate(results, { page, pageSize }), { status: 200 });
  }),

  // LISTING SNAPSHOTS
  http.get("*/api/ingestion/listings/:id/snapshots/", ({ params }) => {
    const listingId = Number(params.id);
    const results = MOCK_LISTING_SNAPSHOTS.filter((s) => s.listing?.id === listingId);
    return HttpResponse.json(results, { status: 200 });
  }),

  // TARGET LISTINGS
  http.get("*/api/ingestion/listings/:id/target-listings/", ({ params }) => {
    const listingId = Number(params.id);
    const results = MOCK_TARGET_LISTINGS.filter((t) => t.listing?.id === listingId);
    return HttpResponse.json(results, { status: 200 });
  }),

    //  TRIGGER RUN 
  http.post("*/api/ingestion/targets/:id/trigger/", async ({ params, request }) => {
    const id = Number(params.id);
    const target = MOCK_SCRAPE_TARGETS.find((t) => t.id === id);
    if (!target) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    const body = await request.json();
    const newRun = {
      id: crypto.randomUUID(),
      target: { id: target.id, name: target.name },
      mode: body.mode || "incremental",
      status: "queued",
      discovered_count: 0,
      queued_count: 0,
      processed_count: 0,
      new_count: 0,
      changed_count: 0,
      failed_count: 0,
      removed_count: 0,
      error_summary: "",
      configuration: {},
      note: body.note || "",
      started_at: null,
      finished_at: null,
      created_at: new Date().toISOString(),
    };
    MOCK_ingestion_RUNS.push(newRun);
    return HttpResponse.json(newRun, { status: 201 });
  }),
];
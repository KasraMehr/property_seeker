import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

// ingestion — real pipeline endpoints (mockScraper.js compatible)
// ── ScrapeTargets ──
const getTargets = (params = {}) =>
  api.get(API_ENDPOINTS.INGESTION.TARGETS.LIST.url, { params });

const getTargetById = (id) =>
  api.get(API_ENDPOINTS.INGESTION.TARGETS.DETAIL(id).url);

const createTarget = (data) =>
  api.post(API_ENDPOINTS.INGESTION.TARGETS.CREATE.url, data);

const updateTarget = (id, data) =>
  api.patch(API_ENDPOINTS.INGESTION.TARGETS.UPDATE(id).url, data);

const deleteTarget = (id) =>
  api.delete(API_ENDPOINTS.INGESTION.TARGETS.DELETE(id).url);

// ── ingestionRuns ──
const getRuns = (params = {}) =>
  api.get(API_ENDPOINTS.INGESTION.RUNS.LIST.url, { params });

const getRunById = (id) => api.get(API_ENDPOINTS.INGESTION.RUNS.DETAIL(id).url);

const getRunItems = (runId, params = {}) =>
  api.get(API_ENDPOINTS.INGESTION.RUNS.ITEMS(runId).url, { params });

// ── ListingSnapshots ──
const getSnapshots = (listingId) =>
  api.get(API_ENDPOINTS.INGESTION.SNAPSHOTS.LIST(listingId).url);

// ── TargetListings ──
const getTargetListings = (listingId) =>
  api.get(API_ENDPOINTS.INGESTION.TARGET_LISTINGS.LIST(listingId).url);

const startDivarLogin = (phone) =>
  api.post(API_ENDPOINTS.INGESTION.DIVAR_LOGIN.START.url, { phone });

const getDivarLogin = (attemptId) =>
  api.get(API_ENDPOINTS.INGESTION.DIVAR_LOGIN.DETAIL(attemptId).url);

const confirmDivarLogin = (attemptId, otp) =>
  api.post(API_ENDPOINTS.INGESTION.DIVAR_LOGIN.CONFIRM(attemptId).url, { otp });

const getDivarSession = () =>
  api.get(API_ENDPOINTS.INGESTION.DIVAR_SESSION.STATUS.url);

const checkDivarSession = () =>
  api.post(API_ENDPOINTS.INGESTION.DIVAR_SESSION.CHECK.url);

const getZones = (params = {}) =>
  api.get(API_ENDPOINTS.LOCATIONS.ZONES.LIST.url, { params });

const getDivarNeighborhoods = (params = {}) =>
  api.get(API_ENDPOINTS.LOCATIONS.DIVAR_NEIGHBORHOODS.LIST.url, { params });

const mapDivarNeighborhood = (id, zone) =>
  api.patch(API_ENDPOINTS.LOCATIONS.DIVAR_NEIGHBORHOODS.UPDATE(id).url, {
    zone,
  });

const syncDivarNeighborhoods = (citySlug = "fardis") =>
  api.post(API_ENDPOINTS.LOCATIONS.DIVAR_NEIGHBORHOODS.SYNC.url, {
    city_slug: citySlug,
  });

const triggerRun = (targetId, mode, configuration = {}) => {
  const config =
    configuration &&
    typeof configuration === "object" &&
    !Array.isArray(configuration)
      ? configuration
      : {};

  return api.post(API_ENDPOINTS.INGESTION.TARGETS.TRIGGER_RUN(targetId).url, {
    mode,
    configuration: config,
  });
};
const resumeRun = (uuid) =>
  api.post(API_ENDPOINTS.INGESTION.RUNS.RESUME(uuid).url);

const cancelRun = (uuid) =>
  api.post(API_ENDPOINTS.INGESTION.RUNS.CANCEL(uuid).url);

const deleteRun = (uuid) =>
  api.delete(API_ENDPOINTS.INGESTION.RUNS.DELETE(uuid).url);

// get data from axios
function unwrapList(res) {
  const payload = res?.data ?? res;
  if (Array.isArray(payload)) return payload;
  return payload?.results ?? [];
}

// scraper widget for admin dashboard
const getScraperTodayStatus = async () => {
  const [targetsRes, runsRes] = await Promise.all([
    getTargets({ page_size: 100 }),
    getRuns({ page_size: 50 }), // last runs
  ]);

  const targets = unwrapList(targetsRes);
  const runs = unwrapList(runsRes);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const runsToday = runs.filter((r) => {
    const t = r.started_at || r.created_at;
    return t && new Date(t) >= startOfToday;
  });

  const is_running = runs.some(
    (r) => r.status === "running" || r.status === "queued",
  );

  // total scraped listings today
  const total_scraped_today = runsToday.reduce(
    (sum, r) => sum + (r.new_count || 0),
    0,
  );

  // total errors of today
  const failed_jobs = runsToday.reduce(
    (sum, r) => sum + (r.failed_count || 0),
    0,
  );

  // sources / targets
  const sources = targets.map((t) => ({
  name: t.name || t.source_detail?.name || "منبع",
  status: t.enabled ? "ACTIVE" : "INACTIVE",
}));

  // based on last run
  const sorted = [...runs].sort((a, b) => {
    const ta = new Date(a.started_at || a.created_at || 0).getTime();
    const tb = new Date(b.started_at || b.created_at || 0).getTime();
    return tb - ta;
  });
  const last = sorted[0];
  const last_run = last?.started_at || last?.created_at || null;

  return {
    data: {
      is_running,
      total_scraped_today,
      failed_jobs,
      sources,
      last_run,
      // more and more
      runs_today_count: runsToday.length,
      processed_today: runsToday.reduce(
        (s, r) => s + (r.processed_count || 0),
        0,
      ),
      discovered_today: runsToday.reduce(
        (s, r) => s + (r.discovered_count || 0),
        0,
      ),
    },
  };
};
const scraperService = {
  // ingestion (pipeline)
  getTargets,
  getTargetById,
  createTarget,
  updateTarget,
  deleteTarget,
  getRuns,
  getRunById,
  getRunItems,
  getSnapshots,
  getTargetListings,
  startDivarLogin,
  getDivarLogin,
  confirmDivarLogin,
  getDivarSession,
  checkDivarSession,
  getZones,
  getDivarNeighborhoods,
  mapDivarNeighborhood,
  syncDivarNeighborhoods,
  triggerRun,
  resumeRun,
  cancelRun,
  deleteRun,
  getScraperTodayStatus,
};

export default scraperService;

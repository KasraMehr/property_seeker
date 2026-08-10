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
  api.put(API_ENDPOINTS.INGESTION.TARGETS.UPDATE(id).url, data);

// ── ingestionRuns ──
const getRuns = (params = {}) =>
  api.get(API_ENDPOINTS.INGESTION.RUNS.LIST.url, { params });

const getRunById = (id) =>
  api.get(API_ENDPOINTS.INGESTION.RUNS.DETAIL(id).url);

const getRunItems = (runId, params = {}) =>
  api.get(API_ENDPOINTS.INGESTION.RUNS.ITEMS(runId).url, { params });

// ── ListingSnapshots ──
const getSnapshots = (listingId) =>
  api.get(API_ENDPOINTS.INGESTION.SNAPSHOTS.LIST(listingId).url);

// ── TargetListings ──
const getTargetListings = (listingId) =>
  api.get(API_ENDPOINTS.INGESTION.TARGET_LISTINGS.LIST(listingId).url);

const triggerRun = (targetId, mode, note) =>
  api.post(API_ENDPOINTS.INGESTION.TARGETS.TRIGGER_RUN(targetId).url, { mode, note });

const resumeRun = (uuid) =>
  api.post(API_ENDPOINTS.INGESTION.RUNS.RESUME(uuid).url);

const scraperService = {
  // ingestion (pipeline)
  getTargets,
  getTargetById,
  createTarget,
  updateTarget,
  getRuns,
  getRunById,
  getRunItems,
  getSnapshots,
  getTargetListings,
  triggerRun,
  resumeRun,
};

export default scraperService;
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

// LEGACY — dashboard aggregate (mockScraperStatus compatible)
const getStatus = () => api.get(API_ENDPOINTS.ADMIN.SCRAPER.STATUS.url);
const getLogs = () => api.get(API_ENDPOINTS.ADMIN.SCRAPER.LOGS.url);
const getSources = () => api.get(API_ENDPOINTS.ADMIN.SCRAPER.SOURCES.url);

// INGESTION — real pipeline endpoints (mockScraper.js compatible)
// ── ScrapeTargets ──
const getTargets = (params = {}) =>
  api.get(API_ENDPOINTS.INGESTION.TARGETS.LIST.url, { params });

const getTargetById = (id) =>
  api.get(API_ENDPOINTS.INGESTION.TARGETS.DETAIL(id).url);

const createTarget = (data) =>
  api.post(API_ENDPOINTS.INGESTION.TARGETS.CREATE.url, data);

const updateTarget = (id, data) =>
  api.put(API_ENDPOINTS.INGESTION.TARGETS.UPDATE(id).url, data);

const deleteTarget = (id) =>
  api.delete(API_ENDPOINTS.INGESTION.TARGETS.DELETE(id).url);

// ── IngestionRuns ──
const getRuns = (params = {}) =>
  api.get(API_ENDPOINTS.INGESTION.RUNS.LIST.url, { params });

const getRunById = (id) =>
  api.get(API_ENDPOINTS.INGESTION.RUNS.DETAIL(id).url);

const createRun = (data) =>
  api.post(API_ENDPOINTS.INGESTION.RUNS.CREATE.url, data);

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
const scraperService = {
  // legacy (dashboard)
  getStatus,
  getLogs,
  getSources,
  // ingestion (pipeline)
  getTargets,
  getTargetById,
  createTarget,
  updateTarget,
  deleteTarget,
  getRuns,
  getRunById,
  createRun,
  getRunItems,
  getSnapshots,
  getTargetListings,
  triggerRun,
};

export default scraperService;
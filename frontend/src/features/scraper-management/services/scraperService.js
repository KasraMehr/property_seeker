import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getStatus = () => api.get(API_ENDPOINTS.ADMIN.SCRAPER.STATUS.url);

const getLogs = () => api.get(API_ENDPOINTS.ADMIN.SCRAPER.LOGS.url);

const getSources = () => api.get(API_ENDPOINTS.ADMIN.SCRAPER.SOURCES.url);

const scraperService = {
  getStatus,
  getLogs,
  getSources,
};

export default scraperService;
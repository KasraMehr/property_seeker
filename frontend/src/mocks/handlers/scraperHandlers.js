import { http, HttpResponse } from "msw";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import {
  MOCK_SCRAPER_STATUS,
  MOCK_SCRAPER_LOGS,
} from "@/mocks/data/mockScraperStatus";

export const scraperHandlers = [
  http.get(API_ENDPOINTS.ADMIN.SCRAPER.STATUS.url, () => {
    return HttpResponse.json(MOCK_SCRAPER_STATUS, { status: 200 });
  }),

  http.get(API_ENDPOINTS.ADMIN.SCRAPER.LOGS.url, () => {
    return HttpResponse.json(MOCK_SCRAPER_LOGS, { status: 200 });
  }),

  http.get(API_ENDPOINTS.ADMIN.SCRAPER.SOURCES.url, () => {
    return HttpResponse.json(MOCK_SCRAPER_STATUS.sources, { status: 200 });
  }),
];
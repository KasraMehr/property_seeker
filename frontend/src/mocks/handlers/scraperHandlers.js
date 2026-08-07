import { http, HttpResponse } from "msw";
import {
  MOCK_SCRAPER_STATUS,
  MOCK_SCRAPER_LOGS,
} from "@/mocks/data/mockScraperStatus";

export const scraperHandlers = [
  http.get("*/api/admin/scraper/status/", () => {
    return HttpResponse.json(MOCK_SCRAPER_STATUS, { status: 200 });
  }),

  http.get("*/api/admin/scraper/logs/", () => {
    return HttpResponse.json(MOCK_SCRAPER_LOGS, { status: 200 });
  }),

  http.get("*/api/admin/scraper/sources/", () => {
    return HttpResponse.json(MOCK_SCRAPER_STATUS.sources, { status: 200 });
  }),
];
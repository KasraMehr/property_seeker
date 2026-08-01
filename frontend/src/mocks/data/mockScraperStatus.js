// scraper engine status mock
export const MOCK_SCRAPER_STATUS = {
  is_running: true,
  last_run: "2026-07-28T14:00:00Z",
  total_scraped_today: 142,
  failed_jobs: 2,
  sources: [
    { name: "Divar", status: "ACTIVE", response_time_ms: 320, last_success: "2026-07-28T14:00:00Z", today_scraped: 78 },
    { name: "Sheypoor", status: "ACTIVE", response_time_ms: 450, last_success: "2026-07-28T13:55:00Z", today_scraped: 52 },
    { name: "Bamilo", status: "PAUSED", response_time_ms: 0, last_success: "2026-07-25T10:00:00Z", today_scraped: 0 },
    { name: "Zililo", status: "ACTIVE", response_time_ms: 280, last_success: "2026-07-28T14:02:00Z", today_scraped: 12 },
  ],
  districts_covered: [
    { id: 1, name: "منطقه ۱", last_scraped: "2026-07-28T14:00:00Z", listings_found: 15 },
    { id: 2, name: "منطقه ۲", last_scraped: "2026-07-28T13:50:00Z", listings_found: 12 },
    { id: 3, name: "منطقه ۳", last_scraped: "2026-07-28T13:40:00Z", listings_found: 18 },
    { id: 4, name: "منطقه ۴", last_scraped: "2026-07-28T13:30:00Z", listings_found: 10 },
    { id: 5, name: "منطقه ۵", last_scraped: "2026-07-28T13:20:00Z", listings_found: 8 },
    { id: 6, name: "منطقه ۶", last_scraped: "2026-07-28T13:10:00Z", listings_found: 14 },
    { id: 7, name: "منطقه ۷", last_scraped: "2026-07-28T13:00:00Z", listings_found: 9 },
    { id: 8, name: "منطقه ۸", last_scraped: "2026-07-28T12:50:00Z", listings_found: 7 },
    { id: 9, name: "منطقه ۹", last_scraped: "2026-07-28T12:40:00Z", listings_found: 6 },
    { id: 10, name: "منطقه ۱۰", last_scraped: "2026-07-28T12:30:00Z", listings_found: 11 },
  ],
};

// scraper error logs mock
export const MOCK_SCRAPER_LOGS = [
  {
    id: 1, source: "Divar", level: "ERROR",
    message: "Timeout on page 3 of district 5",
    created_at: "2026-07-28T12:30:00Z",
  },
  {
    id: 2, source: "Sheypoor", level: "WARNING",
    message: "Rate limited, retrying in 60s",
    created_at: "2026-07-28T13:00:00Z",
  },
  {
    id: 3, source: "Zililo", level: "INFO",
    message: "Successfully scraped 12 listings from district 3",
    created_at: "2026-07-28T14:02:00Z",
  },
  {
    id: 4, source: "Divar", level: "WARNING",
    message: "CAPTCHA detected on district 8, switching to proxy",
    created_at: "2026-07-28T12:45:00Z",
  },
  {
    id: 5, source: "Bamilo", level: "ERROR",
    message: "Site structure changed, selector not found",
    created_at: "2026-07-25T10:00:00Z",
  },
  {
    id: 6, source: "Sheypoor", level: "INFO",
    message: "Completed full scan of district 2",
    created_at: "2026-07-28T13:55:00Z",
  },
  {
    id: 7, source: "Divar", level: "ERROR",
    message: "Connection refused on district 9, page 1",
    created_at: "2026-07-28T12:35:00Z",
  },
];
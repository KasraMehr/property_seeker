// scraper engine status mock
export const MOCK_SCRAPER_STATUS = {
  is_running: true,
  last_run: "2026-07-28T14:00:00Z",
  total_scraped_today: 142,
  failed_jobs: 2,
  sources: [
    { name: "Divar", status: "ACTIVE", response_time_ms: 320, last_success: "2026-07-28T14:00:00Z" },
    { name: "Sheypoor", status: "ACTIVE", response_time_ms: 450, last_success: "2026-07-28T13:55:00Z" },
  ],
};

// scraper error logs mock
export const MOCK_SCRAPER_LOGS = [
  {
    id: 1,
    source: "Divar",
    level: "ERROR",
    message: "Timeout on page 3 of district 5",
    created_at: "2026-07-28T12:30:00Z",
  },
  {
    id: 2,
    source: "Sheypoor",
    level: "WARNING",
    message: "Rate limited, retrying in 60s",
    created_at: "2026-07-28T13:00:00Z",
  },
];
// admin dashboard statistics mock
export const MOCK_ADMIN_DASHBOARD = {
  total_leads: 25,
  today_leads: 3,
  converted_properties: 4,
  active_operators: 6,
  conversion_rate: 16.0,
  today_calls: 12,
  pending_followups: 8,
  expired_listings: 2,
  archived_listings: 1,
  flagged_listings: 1,
  total_properties: 18,
  available_properties: 12,
  reserved_properties: 2,
  sold_properties: 1,
  rented_properties: 1,
  total_owners: 12,
  total_agents: 4,
  scraper_status: "running",
  scraper_last_run: "2026-07-28T14:00:00Z",
  scraper_today_scraped: 142,
};

// operator personal dashboard mock
export const MOCK_OPERATOR_DASHBOARD = {
  my_leads: 8,
  my_calls_today: 5,
  my_pending_followups: 4,
  my_conversions: 2,
  leads_by_status: {
    active: 5,
    draft: 1,
    expired: 1,
    converted: 1,
  },
  calls_by_result: {
    interested: 3,
    no_answer: 1,
    follow_up: 2,
    visit_booked: 1,
    not_interested: 1,
  },
  weekly_performance: {
    calls: [12, 8, 15, 10, 14, 5, 3],
    conversions: [1, 0, 2, 1, 1, 0, 0],
  },
};

// supervisor dashboard mock
export const MOCK_SUPERVISOR_DASHBOARD = {
  team_leads: 18,
  team_calls_today: 12,
  team_pending_followups: 8,
  team_conversions: 3,
  operator_performance: [
    { name: "علی رضایی", leads: 8, calls: 5, conversions: 2, followups: 4 },
    { name: "سارا محمدی", leads: 5, calls: 4, conversions: 1, followups: 2 },
    { name: "حسن کریمی", leads: 5, calls: 3, conversions: 0, followups: 2 },
  ],
};
// admin dashboard statistics mock
export const MOCK_ADMIN_DASHBOARD = {
  total_leads: 5,
  today_leads: 2,
  converted_properties: 1,
  active_operators: 2,
  conversion_rate: 20.0,
  today_calls: 4,
  pending_followups: 3,
  expired_listings: 1,
};

// operator personal dashboard mock
export const MOCK_OPERATOR_DASHBOARD = {
  my_leads: 3,
  my_calls_today: 4,
  my_pending_followups: 3,
  my_conversions: 1,
  leads_by_status: {
    active: 2,
    draft: 1,
    expired: 0,
  },
};
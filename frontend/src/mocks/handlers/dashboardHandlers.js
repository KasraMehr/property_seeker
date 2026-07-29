import { http, HttpResponse } from "msw";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import {
  MOCK_ADMIN_DASHBOARD,
  MOCK_OPERATOR_DASHBOARD,
} from "@/mocks/data/mockDashboardStats";

export const dashboardHandlers = [
  http.get(API_ENDPOINTS.ADMIN.DASHBOARD.STATS.url, () => {
    return HttpResponse.json(MOCK_ADMIN_DASHBOARD, { status: 200 });
  }),

  http.get(API_ENDPOINTS.ADMIN.DASHBOARD.OPERATOR_STATS.url, () => {
    return HttpResponse.json(MOCK_OPERATOR_DASHBOARD, { status: 200 });
  }),
];
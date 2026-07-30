import { http, HttpResponse } from "msw";
import {
  MOCK_ADMIN_DASHBOARD,
  MOCK_OPERATOR_DASHBOARD,
} from "@/mocks/data/mockDashboardStats";

export const dashboardHandlers = [
  http.get("*/api/admin/dashboard/stats/", () => {
    return HttpResponse.json(MOCK_ADMIN_DASHBOARD, { status: 200 });
  }),

  http.get("*/api/admin/dashboard/operator/", () => {
    return HttpResponse.json(MOCK_OPERATOR_DASHBOARD, { status: 200 });
  }),
];
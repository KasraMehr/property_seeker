import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAdminStats = () => api.get(API_ENDPOINTS.ADMIN.DASHBOARD.STATS.url);

const getOperatorStats = () => api.get(API_ENDPOINTS.ADMIN.DASHBOARD.OPERATOR_STATS.url);

const dashboardService = {
  getAdminStats,
  getOperatorStats,
};

export default dashboardService;
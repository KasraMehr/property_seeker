import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAdminStats = () => api.get(API_ENDPOINTS.REPORT.DASHBOARD.url);

const dashboardService = {
  getAdminStats,
};

export default dashboardService;
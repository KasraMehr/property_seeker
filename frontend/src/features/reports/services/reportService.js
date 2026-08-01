import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getDaily = () => api.get(API_ENDPOINTS.ADMIN.REPORTS.DAILY.url);

const getWeekly = () => api.get(API_ENDPOINTS.ADMIN.REPORTS.WEEKLY.url);

const getMonthly = () => api.get(API_ENDPOINTS.ADMIN.REPORTS.MONTHLY.url);

const reportService = {
  getDaily,
  getWeekly,
  getMonthly,
};

export default reportService;
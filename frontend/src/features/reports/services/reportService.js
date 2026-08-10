import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

// Agency owner only
const getDashboard = () =>
  api.get(API_ENDPOINTS.REPORT.DASHBOARD.url);

const getStatistics = (params) =>
  api.get(API_ENDPOINTS.REPORT.STATISTICS.url, { params });

const getPropertyReport = (params) =>
  api.get(API_ENDPOINTS.REPORT.PROPERTIES.url, { params });

const getMonthlyDealsChart = (params) =>
  api.get(API_ENDPOINTS.REPORT.CHARTS.MONTHLY_DEALS.url, { params });

const getRevenueChart = (params) =>
  api.get(API_ENDPOINTS.REPORT.CHARTS.REVENUE.url, { params });

const getEmployeesTop = (params) =>
  api.get(API_ENDPOINTS.REPORT.EMPLOYEES_TOP.url, { params });

const getCustomersMonthly = (params) =>
  api.get(API_ENDPOINTS.REPORT.CUSTOMERS_MONTHLY.url, { params });

const getPropertiesMonthly = (params) =>
  api.get(API_ENDPOINTS.REPORT.PROPERTIES_MONTHLY.url, { params });

const getFinancial = (params) =>
  api.get(API_ENDPOINTS.REPORT.FINANCIAL.url, { params });

export default {
  getDashboard,
  getStatistics,
  getPropertyReport,
  getMonthlyDealsChart,
  getRevenueChart,
  getEmployeesTop,
  getCustomersMonthly,
  getPropertiesMonthly,
  getFinancial,
};
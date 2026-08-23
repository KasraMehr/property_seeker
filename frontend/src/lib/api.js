import axios from "axios";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

// Root API URL (without /accounts)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://dilanmelk.ir";

// Read Django CSRF cookie so it can be sent as a header on mutating requests
function getCsrfToken() {
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach CSRF token for state-changing methods
api.interceptors.request.use((config) => {
  const method = (config.method || "").toLowerCase();
  if ("post put patch delete".includes(method)) {
    const token = getCsrfToken();
    if (token) {
      config.headers["X-CSRFToken"] = token;
    }
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (originalRequest.url.includes("/accounts/refresh/")) {
      return Promise.reject(error);
    }

    if (error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    isRefreshing = true;

    try {
      await api.post(
        API_ENDPOINTS.AUTH.REFRESH.url,
        {},
        { withCredentials: true },
      );

      processQueue(null);

      return api(originalRequest);
    } catch (err) {
      processQueue(err);

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;

import axios from "axios";

// Base Configuration - Points to the Django account API root
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/accounts";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
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

    // اگر اصلاً response وجود ندارد
    if (!error.response) {
      return Promise.reject(error);
    }

    // روی خود refresh دوباره refresh نزن
    if (originalRequest.url.includes("/refresh/")) {
      return Promise.reject(error);
    }

    // فقط روی 401
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
      await axios.post(
        `${API_BASE_URL}/refresh/`,
        {},
        { withCredentials: true }
      );

      processQueue(null);

      return api(originalRequest);
    } catch (err) {
      processQueue(err);

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
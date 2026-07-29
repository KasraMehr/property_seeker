import api from "../../../lib/api";

// Total report for dashboard
const getDashboardStats = async () => {
  try {
    const { data } = await api.get("/admin/dashboard/stats/");
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Get Admin Stats Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "خطا در دریافت آمار داشبورد",
      data: null,
    };
  }
};

// All users
const getUsers = async () => {
  try {
    const { data } = await api.get("/admin/users/");
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Get Users Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "خطا در دریافت لیست کارمندان",
      data: [],
    };
  }
};

// New user
const createUser = async (userData) => {
  try {
    const { data } = await api.post("/admin/users/", userData);
    return {
      success: true,
      data,
      message: "کاربر جدید با موفقیت ایجاد شد",
    };
  } catch (error) {
    console.error("Create User Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "خطا در ایجاد کاربر",
    };
  }
};

// Edit / update user
const updateUser = async (id, userData) => {
  try {
    const { data } = await api.patch(`/admin/users/${id}/`, userData);
    return {
      success: true,
      data,
      message: "اطلاعات کاربر بروزرسانی شد",
    };
  } catch (error) {
    console.error("Update User Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "خطا در ویرایش اطلاعات کاربر",
    };
  }
};

// All regions and locations
const getRegions = async () => {
  try {
    const { data } = await api.get("/admin/regions/");
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Get Regions Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "خطا در دریافت لیست مناطق",
      data: null,
    };
  }
};

// Scraper status 
const getScraperStatus = async () => {
  try {
    const { data } = await api.get("/admin/scraper/status/");
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Get Scraper Status Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "خطا در دریافت وضعیت اسکرپر",
      data: null,
    };
  }
};

const adminService = {
  getDashboardStats,
  getUsers,
  createUser,
  updateUser,
  getRegions,
  getScraperStatus,
};

export default adminService;
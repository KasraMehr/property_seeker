import api from "../../../lib/api";

// All calls
const getCalls = async () => {
  try {
    const { data } = await api.get("/calls/");
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Get Calls Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "خطا در دریافت تاریخچه تماس‌ها",
      data: [],
    };
  }
};

// New call log
const createCallLog = async (callData) => {
  try {
    const { data } = await api.post("/calls/", callData);
    return {
      success: true,
      data,
      message: "نتیجه تماس با موفقیت ثبت شد",
    };
  } catch (error) {
    console.error("Create Call Log Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "خطا در ثبت تماس",
    };
  }
};

// All followups
const getFollowups = async () => {
  try {
    const { data } = await api.get("/followups/");
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Get Followups Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "خطا در دریافت لیست پیگیری‌ها",
      data: [],
    };
  }
};

// New followup
const createFollowup = async (followupData) => {
  try {
    const { data } = await api.post("/followups/", followupData);
    return {
      success: true,
      data,
      message: "پیگیری جدید با موفقیت زمان‌بندی شد",
    };
  } catch (error) {
    console.error("Create Followup Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "خطا در ثبت پیگیری",
    };
  }
};

// Update followup status
const completeFollowup = async (id) => {
  try {
    const { data } = await api.patch(`/followups/${id}/complete/`);
    return {
      success: true,
      data,
      message: "پیگیری با موفقیت انجام شد",
    };
  } catch (error) {
    console.error("Complete Followup Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "خطا در بروزرسانی وضعیت پیگیری",
    };
  }
};

const callService = {
  getCalls,
  createCallLog,
  getFollowups,
  createFollowup,
  completeFollowup,
};

export default callService;
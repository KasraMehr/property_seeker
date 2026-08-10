import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const login = async (phone, password) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN.url, {
      phone,
      password,
    });
    return {
      success: true,
      user: response.data.user,
      message: response.data.message,
    };
  } catch (error) {
    const errData = error.response?.data;
    let errorMessage = "شماره تلفن یا رمز عبور اشتباه است";

    return {
      success: false,
      error: errorMessage,
    };
  }
};

const getCurrentUser = async () => {
  try {
    const { data } = await api.get(API_ENDPOINTS.AUTH.VERIFY.url);
    return { authenticated: true, user: data.user };
  } catch (error) {
    return { authenticated: false, user: null };
  }
};

const refreshToken = async () => {
  try {
    const { data } = await api.post(API_ENDPOINTS.AUTH.REFRESH.url);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: "session expired" };
  }
};

const logout = async () => {
  const { data } = await api.post(API_ENDPOINTS.AUTH.LOGOUT.url);
  return data;
};

const authService = { login, getCurrentUser, refreshToken, logout };
export default authService;

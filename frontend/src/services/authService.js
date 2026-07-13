import api from "../lib/api";

// Login with phone/Password
const login = async (phone, password) => {
  try {
    const response = await api.post("/login/", {
      phone,
      password,
    });

    return {
      success: true,
      user: response.data.user,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "شماره موبایل یا رمز عبور اشتباه است.",
    };
  }
};

// Get current user details via token validation
const getCurrentUser = async () => {
  const response = await api.get("/verify/");
  return response.data;
};

// Logout and clean up cookies
const logout = async () => {
  const response = await api.post("/logout/");
  return response.data;
};

// Manual token refresh trigger if needed outside the interceptor
const refreshToken = async () => {
  const response = await api.post("/refresh/");
  return response.data;
};

export default {
  login,
  getCurrentUser,
  logout,
  refreshToken,
};

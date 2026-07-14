import api from "../lib/api";

// Login with phone/password
const login = async (phone, password) => {
  try {
    const response = await api.post("/login/", {
      phone,
      password,
    });

    console.log("LOGIN STATUS:", response.status);
    console.log("LOGIN DATA:", response.data);

    return {
      success: true,
      user: response.data.user,
      message: response.data.message,
    };
  } catch (error) {
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);
    console.log("HEADERS:", error.response?.headers);

    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        "شماره موبایل یا رمز عبور اشتباه است.",
    };
  }
};

// Verify current user
const getCurrentUser = async () => {
  try {
    const { data } = await api.get("/verify/");

    return {
      authenticated: true,
      user: data.user,
    };
  } catch (error) {
    console.error("Verify Error:", error);

    return {
      authenticated: false,
      user: null,
    };
  }
};

// Logout
const logout = async () => {
  try {
    const { data } = await api.post("/logout/");
    return data;
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};

// Refresh Access Token
const refreshToken = async () => {
  try {
    const { data } = await api.post("/refresh/");
    return data;
  } catch (error) {
    console.error("Refresh Error:", error);
    throw error;
  }
};

const authService = {
  login,
  getCurrentUser,
  logout,
  refreshToken,
};

export default authService;
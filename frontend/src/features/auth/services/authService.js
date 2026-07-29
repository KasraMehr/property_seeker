import api from '@/lib/api';

// Login with phone and password
const login = async (phone, password) => {
  try {
    const response = await api.post('/accounts/login/', { phone, password });
    return {
      success: true,
      user: response.data.user,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'خطا در ورود',
    };
  }
};

// Verify current user
const getCurrentUser = async () => {
  try {
    const { data } = await api.get('/accounts/verify/');
    return { authenticated: true, user: data.user };
  } catch (error) {
    return { authenticated: false, user: null };
  }
};

// Refresh token
const refreshToken = async () => {
  try {
    const { data } = await api.post('/accounts/refresh/');
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'انقضای نشست کاری' };
  }
};

// Logout
const logout = async () => {
  const { data } = await api.post('/accounts/logout/');
  return data;
};

const authService = { login, getCurrentUser, refreshToken, logout };
export default authService;
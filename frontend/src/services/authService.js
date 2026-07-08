// Authentication service - handles all auth-related API calls

import api from "../lib/api";

// Send OTP to user's phone number
const sendOTP = async (phone) => {
  const response = await api.post("/auth/send-otp/", { phone });
  return response.data;
};

// Resend OTP to user's phone number
const resendOTP = async (phone) => {  
  const response = await api.post("/auth/send-otp/", { phone });
  return response.data;
};

// Verify OTP code and get JWT tokens
// { access, refresh, user, is_new_user }
const verifyOTP = async (phone, code) => {
  const response = await api.post("/auth/verify-otp/", { phone, code });
  return response.data; 
};

//  Complete user profile (for new users)
// { success, user }
const completeProfile = async (data) => {
  const response = await api.post("/auth/complete-profile/", data);
  return response.data; 
};

// Get current authenticated user
// { id, phone, first_name, last_name, ... }
const getCurrentUser = async () => {
  const response = await api.get("/auth/me/");
  return response.data; 
};

// Logout user (invalidate tokens)
// { success }
const logout = async () => {
  const response = await api.post("/auth/logout/");
  return response.data; 
};

//  Refresh access token (called automatically by interceptor)
// { access }
const refreshToken = async () => {
  const response = await api.post("/auth/token/refresh/");
  return response.data; 
};

//----- Exports
export default {
  sendOTP,
  resendOTP,
  verifyOTP,
  completeProfile,
  getCurrentUser,
  logout,
  refreshToken,
};
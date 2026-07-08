// Authentication context provider - manages user state and auth functions

import React, { createContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";

// Create Context 
export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  // States
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initial check in progress
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check Session (on mount)
  const checkSession = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.warn("Session check failed:", error.message);
      localStorage.removeItem("accessToken");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = useCallback(async (phone, code) => {
    try {
      const response = await authService.verifyOTP(phone, code);
      
      if (response.access) {
        localStorage.setItem("accessToken", response.access);
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, isNewUser: response.is_new_user, user: response.user };
      }
      return { success: false, error: "پاسخ نامعتبر از سرور" };
    } catch (error) {
      console.error("Login failed:", error.message);
      return { success: false, error: error.message };
    }
  }, []);

  // ===== Resend OTP =====
  const resendOTP = useCallback(async (phone) => {
    try {
      const response = await authService.resendOTP(phone);
      return { success: true, message: response.message || "کد مجدداً ارسال شد" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || "خطا در ارسال مجدد کد",
      };
    }
  }, []);

  //Complete Profile (for new users) 
  const completeProfile = useCallback(async (data) => {
    try {
      const response = await authService.completeProfile(data);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      console.error("Profile completion failed:", error.message);
      return { success: false, error: error.message };
    }
  }, []);

  // Logout 
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn("Logout API call failed:", error.message);
    } finally {
      // clear local state
      localStorage.removeItem("accessToken");
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  
  // Check session on mount 
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  //Context Value 
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    completeProfile,
    checkSession,
    resendOTP,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
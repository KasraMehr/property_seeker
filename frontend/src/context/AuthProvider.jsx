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
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      const response = await authService.getCurrentUser();
      if (response.authenticated) {
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("isAuthenticated");
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.warn("Session check failed:", error.message);
      localStorage.removeItem("isAuthenticated");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = useCallback(async (username, password) => {
    try {
      const response = await authService.login(username, password);

      // Flag to stay logged in after refreshing
      localStorage.setItem("isAuthenticated", "true");

      setUser(response.user);
      setIsAuthenticated(true);

      return { success: true, user: response.user };
    } catch (error) {
      console.error("Login failed:", error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || "خطا در ورود",
      };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn("Logout API call failed:", error.message);
    } finally {
      localStorage.removeItem("isAuthenticated");
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
    checkSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

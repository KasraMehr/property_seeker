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
    try {
      const response = await authService.getCurrentUser();

      if (response.authenticated) {
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.warn("Session check failed:", error.message);

      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = useCallback(async (phone, password) => {
    const response = await authService.login(phone, password);

    // Not successfull login
    if (!response.success) {
      return {
        success: false,
        error: response.error,
      };
    }

    // Sucessfull login
    setUser(response.user);
    setIsAuthenticated(true);

    return {
      success: true,
      user: response.user,
    };
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn("Logout API call failed:", error.message);
    } finally {
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

import React, { createContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      console.error("Session check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (phone, password) => {
    try {
      const response = await authService.login(phone, password);

      if (!response.success) {
        return response;
      }

      // بعد از ست شدن Cookie، اطلاعات کاربر را دوباره بگیر
      const current = await authService.getCurrentUser();

      if (current.authenticated) {
        setUser(current.user);
        setIsAuthenticated(true);
      }

      return {
        success: true,
        user: current.user,
      };
    } catch (error) {
      return {
        success: false,
        error: "خطا در ورود",
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
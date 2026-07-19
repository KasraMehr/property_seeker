/**
 * LogoutButton Component - A smart, self-contained authentication action button.
 * Dynamically switches between "Logout" for authenticated users and "Return to Home" for guests.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Home } from "lucide-react";

import useAuth from "../../../hooks/useAuth"; 
import Button from "../../../shared/ui/Button"; 

import { DASHBOARD_STRINGS } from "../constants/dashboardConstants";

export default function LogoutButton() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await logout();
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <Button
      onClick={handleAuthAction}
      variant={isAuthenticated ? "danger" : "ghost"}
      size="sm"
      className={`w-full flex items-center justify-start gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
        isAuthenticated
          ? "text-red-600 hover:bg-red-50"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {isAuthenticated ? <LogOut size={18} /> : <Home size={18} />}
      <span>
        {isAuthenticated
          ? DASHBOARD_STRINGS.actionLogout
          : "بازگشت به صفحه اصلی"}
      </span>
    </Button>
  );
}

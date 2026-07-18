// self-contained logout button

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Home, Loader2 } from "lucide-react";

import useAuth from "../../../hooks/useAuth"; 
import Button from "../../../shared/ui/Button"; 
import { showSuccess } from "../../../lib/toast";

import { DASHBOARD_STRINGS } from "../constants/dashboardConstants";

export default function LogoutButton() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthAction = async () => {
    if (isLoading) return;

    if (isAuthenticated) {
      setIsLoading(true);
      
      try {
        await logout();
        showSuccess("با موفقیت خارج شدید");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <Button
      onClick={handleAuthAction}
      variant={isAuthenticated ? "danger" : "ghost"}
      size="sm"
      disabled={isLoading}
      className={`w-full flex items-center justify-start gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
        isAuthenticated
          ? "text-red-600 hover:bg-red-50"
          : "text-slate-600 hover:bg-slate-100"
      } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : isAuthenticated ? (
        <LogOut size={18} />
      ) : (
        <Home size={18} />
      )}
      <span>
        {isLoading
          ? "در حال خروج..."
          : isAuthenticated
          ? DASHBOARD_STRINGS.actionLogout
          : "بازگشت به صفحه اصلی"}
      </span>
    </Button>
  );
}
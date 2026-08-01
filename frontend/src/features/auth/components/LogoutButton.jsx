// self-contained logout button

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Home, Loader2 } from "lucide-react";

import useAuth from "@/features/auth/hooks/useAuth";
import Button from "@/shared/ui/Button";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import useModal from "@/shared/ui/modal/useModal";
import { showSuccess } from "@/lib/toast";

import { DASHBOARD_STRINGS } from "@/features/dashboard/constants/dashboardConstants";

export default function LogoutButton() {
  const { logout, isAuthenticated } = useAuth();
  const { modal, openModal, closeModal } = useModal();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const doLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      showSuccess("با موفقیت خارج شدید");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  const handleAuthAction = () => {
    if (isLoading) return;

    if (isAuthenticated) {
      // open confirm modal
      openModal("logout", {}, doLogout);
    } else {
      navigate("/", { replace: true });
    }
  };


  return (
    <>
      <Button
        onClick={handleAuthAction}
        variant={isAuthenticated ? "danger" : "ghost"}
        size="sm"
        disabled={isLoading}
        className={`w-full flex items-center justify-start gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
          isAuthenticated
            ? "text-danger hover:bg-danger/10"
            : "text-muted hover:bg-(--role-subtle)/30"
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

      {/* Confirm modal — type logout*/}
      <ConfirmModal
        isOpen={modal.isOpen && modal.type === "logout"}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        type="logout"
        isLoading={isLoading}
      />
    </>
  );
}

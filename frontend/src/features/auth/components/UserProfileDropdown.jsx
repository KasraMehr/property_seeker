import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, User, Settings } from "lucide-react";

import useAuth from "@/features/auth/hooks/useAuth";
import ThemeToggle from "@/shared/ThemeToggle";
import LogoutButton from "./LogoutButton";

import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import useModal from "@/shared/ui/modal/useModal";

import { showSuccess } from "@/lib/toast";

export default function UserProfileDropdown({
  fullWidth = false,
  showInfo = true,
  onCloseDrawer ,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dropdownRef = useRef(null);

  const { modal, openModal, closeModal } = useModal();

  if (!user) return null;

  const avatarLetter = user.full_name?.charAt(0)?.toUpperCase() || "U";

  const roleLabel = user.is_owner
    ? "مدیر سیستم"
    : user.role?.map((r) => r.name).join("، ") || "کارمند";

  const doLogout = async () => {
    setIsLoading(true);

    try {
      await logout();

      showSuccess("با موفقیت خارج شدید");

      closeModal();
      setIsOpen(false);

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutClick = () => {
  setIsOpen(false);

  if (onCloseDrawer) {
    onCloseDrawer();
  }

  setTimeout(() => {
    openModal("logout", {}, doLogout);
  }, 250);
};

  const handleCloseModal = () => {
    closeModal();
    setIsOpen(false);
  };

  return (
    <>
      <div
        ref={dropdownRef}
        className={`relative ${fullWidth ? "w-full" : "w-fit"}`}
      >
        {/* Trigger */}

        <button
          onClick={() => setIsOpen((p) => !p)}
          className={`
    group flex items-center
    ${showInfo ? "justify-between gap-3" : "justify-center gap-2"}
    rounded-2xl border border-transparent
    px-3 py-3
    transition-all duration-200
    hover:bg-(--role-subtle)/10
    ${fullWidth ? "w-full" : "w-fit"}
    ${isOpen ? "border-(--role-border) bg-(--role-subtle)/15" : ""}
  `}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className="
      flex h-12 w-12 shrink-0
      items-center justify-center
      rounded-2xl
      bg-(--role-primary)/10
      text-(--role-primary)
      font-bold
    "
            >
              {avatarLetter}
            </div>

            {showInfo && (
              <div className="min-w-0 text-right">
                <p className="truncate text-sm font-semibold text-foreground">
                  {user.full_name}
                </p>

                <p className="truncate text-xs text-muted">{roleLabel}</p>
              </div>
            )}
          </div>

          <ChevronDown
            size={18}
            className={`shrink-0 transition-transform duration-200 ${
              isOpen ? "" : "rotate-180"
            }`}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            className="
              absolute bottom-full right-0 mb-3
              w-64 overflow-hidden
              rounded-3xl
              border border-border
              bg-surface
              shadow-2xl
              origin-bottom-right
              animate-in fade-in zoom-in-95 duration-150
              z-50
            "
          >
            <div className="p-2">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="
                  flex items-center gap-3
                  rounded-xl
                  px-3 py-2.5
                  transition-colors
                  hover:bg-(--role-subtle)/10
                "
              >
                <User size={18} />
                <span className="text-sm">پروفایل</span>
              </Link>

              <Link
                to="/profile/settings"
                onClick={() => setIsOpen(false)}
                className="
                  flex items-center gap-3
                  rounded-xl
                  px-3 py-2.5
                  transition-colors
                  hover:bg-(--role-subtle)/10
                "
              >
                <Settings size={18} />
                <span className="text-sm">تنظیمات</span>
              </Link>

            </div>

            <div className="border-t border-border p-2">
              <LogoutButton onClick={handleLogoutClick} isLoading={isLoading} />
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={modal.isOpen && modal.type === "logout"}
        onClose={handleCloseModal}
        onConfirm={modal.onConfirm}
        type="logout"
        isLoading={isLoading}
      />
    </>
  );
}

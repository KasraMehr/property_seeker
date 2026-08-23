import +{ useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, User } from "lucide-react";

import useAuth from "@/features/auth/hooks/useAuth";
import ThemeToggle from "@/shared/ThemeToggle";
import LogoutButton from "./LogoutButton";

import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import useModal from "@/shared/ui/modal/useModal";

import { showSuccess } from "@/lib/toast";
import RoleBadge from "../../../shared/ui/badges/RoleBadge";

export default function UserProfileDropdown({
  fullWidth = false,
  showInfo = true,
  onCloseDrawer,
}) {
  const { user, logout } = useAuth();
  const roleName = user?.is_owner
    ? "owner"
    : Array.isArray(user?.role)
      ? user.role[0]?.name || "operator"
      : user?.role?.name || "operator";
  const navigate = useNavigate();

  const location = useLocation();

  const basePath = location.pathname.startsWith("/owner")
    ? "/owner"
    : "/operator";

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dropdownRef = useRef(null);

  const { modal, openModal, closeModal } = useModal();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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

  if (!user) return null;

  const avatarLetter = user.full_name?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      <div
        ref={dropdownRef}
        className={`relative ${fullWidth ? "w-full" : "w-fit"}`}
      >
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`
            group flex items-center
            ${showInfo ? "justify-between gap-3" : "justify-center gap-2"}
            rounded-2xl
            border
            px-3 py-2.5
            cursor-pointer
            transition-all duration-200
            ${
              isOpen
                ? "border-(--role-border) bg-(--role-subtle)/15 shadow-sm"
                : "border-transparent hover:border-border hover:bg-(--role-subtle)/10"
            }
            ${fullWidth ? "w-full" : "w-fit"}
          `}
        >
          {/* Avatar */}
          <div
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-xl
              bg-(--role-subtle)/15
              text-sm font-bold
              text-(--role)
              ring-1 ring-(--role-border)/40
              transition-transform duration-200
              group-hover:scale-105
            "
          >
            {avatarLetter}
          </div>

          {showInfo && (
            <div className="min-w-0 flex-1 text-right">
              <p className="truncate text-sm font-semibold text-foreground">
                {user.full_name}
              </p>

              <RoleBadge role={roleName} />
            </div>
          )}

          <ChevronDown
            size={17}
            className={`
              shrink-0
              text-muted
              transition-transform duration-200
              ${isOpen ? "rotate-180" : ""}
            `}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            className="
              absolute
              bottom-full
              right-0
              mb-3
              w-72
              overflow-hidden
              rounded-2xl
              border border-border
              bg-surface
              shadow-[0_12px_40px_rgba(0,0,0,0.16)]
              ring-1 ring-black/5
              z-50
              animate-in
              fade-in
              slide-in-from-bottom-2
              zoom-in-95
              duration-150
            "
          >
            {/* Profile Header */}
            <div
              className="
                flex items-center gap-3
                border-b border-border
                bg-(--role-subtle)/5
                px-4 py-4
              "
            >
              <div
                className="
                  flex h-11 w-11 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-(--role-subtle)/15
                  text-base font-bold
                  text-(--role)
                  ring-1 ring-(--role-border)/40
                "
              >
                {avatarLetter}
              </div>

              <div className="min-w-0 text-right">
                <p className="truncate text-sm font-semibold text-foreground">
                  {user.full_name}
                </p>

                {/* <p className="mt-1 truncate text-xs text-muted">{roleLabel}</p> */}
                <RoleBadge role={roleName} />
              </div>
            </div>

            {/* Menu */}
            <div className="p-2">
              <Link
                to={`${basePath}/profile`}
                onClick={() => setIsOpen(false)}
                className="
                  group flex items-center gap-3
                  rounded-xl
                  px-3 py-3
                  text-foreground
                  transition-all duration-150
                  hover:bg-(--role-subtle)
                  hover:text-(--role)
                "
              >
                <span
                  className="
                    flex h-9 w-9
                    items-center justify-center
                    rounded-lg
                    bg-(--role-subtle)/10
                    text-muted
                    transition-colors
                    group-hover:bg-(--role-subtle)
                    group-hover:text-(--role)
                  "
                >
                  <User size={18} />
                </span>

                <div className="flex flex-col text-right">
                  <span className="text-sm font-medium">پروفایل</span>

                  <span className="text-[11px] text-muted">
                    مشاهده اطلاعات حساب
                  </span>
                </div>
              </Link>
            </div>

            {/* Logout */}
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

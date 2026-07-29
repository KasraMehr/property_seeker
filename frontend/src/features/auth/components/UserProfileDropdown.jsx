import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Phone,
  CreditCard,
  Calendar,
  Building2,
} from "lucide-react";
import useAuth from "@/features/auth/hooks/useAuth";
import LogoutButton from "./LogoutButton";
import { DASHBOARD_STRINGS } from "../../dashboard/constants/dashboardConstants";

const toPersianDigits = (str) => {
  if (str === null || str === undefined) return "";
  return String(str).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
};

export default function UserProfileDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const avatarLetter = user.full_name ? user.full_name.charAt(0) : "U";

  const formattedDate = user.created_at
    ? toPersianDigits(new Date(user.created_at).toLocaleDateString("fa-IR"))
    : "";

  const getRoleLabel = () => {
    if (user.is_owner) {
      return DASHBOARD_STRINGS.roleOwner || "مالک آژانس";
    }
    if (Array.isArray(user.role) && user.role.length > 0) {
      return user.role.map((r) => r.name).join("، ");
    }
    return "اپراتور / مشاور";
  };

  const userRoleLabel = getRoleLabel();

  return (
    <div className="relative inline-block text-right" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pr-2 rounded-xl 
        cursor-pointer border border-transparent hover:border-border hover:bg-surface-hover transition-all duration-200 group focus:outline-none"
      >
        {/* Avatar */}
        <div className="w-9 h-9 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-foreground font-bold text-xs tracking-wider group-hover:border-primary/40 transition-colors">
          {avatarLetter}
        </div>

        {/* Title info */}
        <div className="hidden sm:flex flex-col items-start text-right">
          <span className="text-xs font-semibold text-foreground tracking-tight leading-none mb-1">
            {user.full_name}
          </span>
          <span className="text-[10px] font-medium text-muted tracking-wide max-w-30 truncate">
            {userRoleLabel}
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180 text-foreground" : ""
          }`}
        />
      </button>

      {/* Dropdown Panel*/}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-85 bg-surface/95 backdrop-blur-md border border-border rounded-2xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          
          {/* Header*/}
          <div className="p-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                {avatarLetter}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground truncate">
                  {user.full_name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-[11px] font-medium text-muted truncate">
                    {userRoleLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info list */}
          <div className="p-2 space-y-0.5">
            {/* Agency */}
            {user.agency?.name && (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-surface-hover/50 transition-colors">
                <div className="flex items-center gap-2 text-muted">
                  <Building2 className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>آژانس</span>
                </div>
                <span className="text-foreground font-medium truncate max-w-40">
                  {user.agency.name}
                </span>
              </div>
            )}

            {/* Phone number */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-surface-hover/50 transition-colors">
              <div className="flex items-center gap-2 text-muted">
                <Phone className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>شماره تماس</span>
              </div>
              <span className="text-foreground font-medium dir-ltr">
                {toPersianDigits(user.phone)}
              </span>
            </div>

            {/* N-id */}
            {user.national_id && (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-surface-hover/50 transition-colors">
                <div className="flex items-center gap-2 text-muted">
                  <CreditCard className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>کد ملی</span>
                </div>
                <span className="text-foreground font-medium dir-ltr">
                  {toPersianDigits(user.national_id)}
                </span>
              </div>
            )}

            {/* Created at */}
            {formattedDate && (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-surface-hover/50 transition-colors">
                <div className="flex items-center gap-2 text-muted">
                  <Calendar className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>تاریخ عضویت</span>
                </div>
                <span className="text-foreground font-medium">
                  {formattedDate}
                </span>
              </div>
            )}
          </div>

          {/* Logout */}
          <div className="p-1.5 border-t border-border/60 bg-surface-subtle/30">
            <LogoutButton />
          </div>

        </div>
      )}
    </div>
  );
}
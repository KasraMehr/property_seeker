import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Phone,
  CreditCard,
  Calendar,
  Building2,
  CircleUserRound,
} from "lucide-react";

import useAuth from "@/features/auth/hooks/useAuth";
import LogoutButton from "./LogoutButton";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import { DASHBOARD_STRINGS } from "../../dashboard/constants/dashboardConstants";

const toPersianDigits = (str) => {
  if (str === null || str === undefined) return "";
  return String(str).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
};

/**
 * UserProfileDropdown — role-aware user menu with glass panel
 */
export default function UserProfileDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  if (!user) return null;

  const avatarLetter = user.full_name ? user.full_name.charAt(0) : "U";

  const formattedDate = user.created_at
    ? toPersianDigits(new Date(user.created_at).toLocaleDateString("fa-IR"))
    : "";

  const getRoleLabel = () => {
    if (user.is_owner) return DASHBOARD_STRINGS.roleOwner || "مالک آژانس";
    if (Array.isArray(user.role) && user.role.length > 0) {
      return user.role.map((r) => r.name).join("، ");
    }
    return "اپراتور / مشاور";
  };

  const userRoleLabel = getRoleLabel();

  // Info row component
  const InfoRow = ({ icon: Icon, label, value, dir = "rtl" }) => (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-(--role-subtle)/20 transition-colors">
      <div className="flex items-center gap-2 text-muted">
        <Icon size={14} strokeWidth={1.5} />
        <span>{label}</span>
      </div>
      <span className={`text-foreground font-medium truncate max-w-40 ${dir === "ltr" ? "dir-ltr" : ""}`}>
        {value}
      </span>
    </div>
  );

  return (
    <div className="relative inline-block text-right" ref={dropdownRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className={`
          flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl
          border transition-all duration-200 ease-in-out cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-(--role-primary)/20
          ${isOpen
            ? "border-(--role-primary)/30 bg-(--role-subtle)/20 shadow-sm"
            : "border-transparent hover:border-(--role-border) hover:bg-(--role-subtle)/10"
          }
        `}
      >
        {/* Avatar */}
        <div className={`
          w-9 h-9 rounded-lg flex items-center justify-center
          text-sm font-bold tracking-wider
          bg-(--role-primary)/10 border border-(--role-primary)/20
          text-(--role-primary)
          transition-colors duration-200
        `}>
          {avatarLetter}
        </div>

        {/* Name + Role */}
        <div className="hidden sm:flex flex-col items-start text-right min-w-0">
          <span className="text-xs font-semibold text-foreground tracking-tight leading-none truncate max-w-28">
            {user.full_name}
          </span>
          <span className="text-[10px] font-medium text-muted tracking-wide truncate max-w-28 mt-0.5">
            {userRoleLabel}
          </span>
        </div>

        <ChevronDown
          size={14}
          className={`
            text-muted transition-transform duration-200 shrink-0
            ${isOpen ? "rotate-180 text-(--role-primary)" : ""}
          `}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="
          absolute left-0 mt-2 w-80
          bg-surface/95 backdrop-blur-xl
          border border-border rounded-2xl shadow-xl shadow-(--role-primary)/5
          z-50 overflow-hidden
          animate-in fade-in slide-in-from-top-1 duration-150
        ">
          {/* Header */}
          <div className="p-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              {/* Large avatar with role ring */}
              <div className="
                w-11 h-11 rounded-xl
                bg-(--role-primary)/10 border-2 border-(--role-primary)/25
                flex items-center justify-center
                text-(--role-primary) font-bold text-sm shrink-0
                shadow-[0_0_12px_-4px_var(--role-primary)]
              ">
                {avatarLetter}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground truncate">
                  {user.full_name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status="active" type="user" variant="dot" size="sm" />
                  <span className="text-[11px] font-medium text-muted truncate">
                    {userRoleLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info list */}
          <div className="p-2 space-y-0.5">
            {user.agency?.name && (
              <InfoRow icon={Building2} label="آژانس" value={user.agency.name} />
            )}
            <InfoRow icon={Phone} label="شماره تماس" value={toPersianDigits(user.phone)} dir="ltr" />
            {user.national_id && (
              <InfoRow icon={CreditCard} label="کد ملی" value={toPersianDigits(user.national_id)} dir="ltr" />
            )}
            {formattedDate && (
              <InfoRow icon={Calendar} label="تاریخ عضویت" value={formattedDate} />
            )}
          </div>

          {/* Logout */}
          <div className="p-1.5 border-t border-border/60 bg-background/30">
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
}
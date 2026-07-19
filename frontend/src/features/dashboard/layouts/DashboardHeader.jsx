/**
 * DashboardHeader Component - Displays the global header with a mobile menu trigger, logo, search space, theme toggle, and user profile information.
 */
import { Menu } from "lucide-react";
import useAuth from "../../../hooks/useAuth";

import Logo from "../../../shared/Logo";
import Button from "../../../shared/ui/Button";
import ThemeToggle from "../../../shared/ThemeToggle";
import IconBox from "../../../shared/ui/IconBox";

import { DASHBOARD_STRINGS } from "../constants/dashboardConstants";

export default function DashboardHeader({ onMenuOpen }) {
  const { user } = useAuth();

  return (
    <header className="flex h-20 items-center justify-between border-b border-border px-6 shrink-0 bg-card/50 backdrop-blur-md">
      
      {/* Right section: Logo and mobile menu toggle */}
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger button - Uses the custom reusable Button component */}
        <Button
          onClick={onMenuOpen}
          className="flex lg:hidden w-11 h-11 p-0 rounded-xl transition-colors"
        >
          <IconBox icon={Menu} boxSize="16" />
        </Button>

        {/* Logo visible only on mobile/tablet screens (below lg breakpoint) */}
        <div className="lg:hidden">
          <Logo labelPosition="left" />
        </div>
      </div>

      {/* 
       TODO: Middle section: Reserved space for global search or controls
      */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        {/* <GlobalSearchBar /> */}
      </div>

      {/* Left section: user identity + theme toggle*/}
      <div className="flex items-center gap-6">
        <div className="flex flex-col text-left items-end">
            {/* TODO: Replace with profile dropdown component */}
          {/* User's full name */}
          <p className="text-sm font-bold text-foreground">
            {user?.full_name || DASHBOARD_STRINGS.guestUser}
          </p>
          
          {/* TODO: Label --> Dynamic role badge */}
          <p className="text-[10px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full mt-1">
            {user?.is_owner ? DASHBOARD_STRINGS.roleOwner : user?.role?.name || "نامشخص"}
          </p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
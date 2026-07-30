import { Menu } from "lucide-react";
import useAuth from "@/features/auth/hooks/useAuth";

import Logo from "../../../shared/Logo";
import Button from "../../../shared/ui/Button";
import UserProfileDropdown from "../../auth/components/UserProfileDropdown";

import { DASHBOARD_STRINGS } from "../constants/dashboardConstants";

export default function DashboardHeader({ onMenuOpen }) {
  const { user } = useAuth();

  return (
    <header className="flex h-20 items-center justify-between border-b border-border px-6 shrink-0 bg-surface/80 backdrop-blur-md">
      
      {/* Left: Menu + Mobile Logo */}
      <div className="flex items-center gap-3">
        <Button
          onClick={onMenuOpen}
          variant="ghost"
          size="icon"
          className="lg:hidden w-10 h-10 rounded-xl border border-border"
        >
          <Menu size={20} className="text-foreground" />
        </Button>

        <div className="lg:hidden">
          <Logo size="sm" labelPosition="left" />
        </div>
      </div>

      {/* Center: Search placeholder */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        {/* Reserved for Global Search */}
      </div>

      {/* Right: User */}
      <div className="flex items-center gap-4">
        <UserProfileDropdown />
      </div>
    </header>
  );
}
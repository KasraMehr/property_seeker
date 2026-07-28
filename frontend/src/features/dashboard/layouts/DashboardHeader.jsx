import { Menu } from "lucide-react";
import useAuth from "../../../hooks/useAuth";

import Logo from "../../../shared/Logo";
import Button from "../../../shared/ui/Button";
import IconBox from "../../../shared/ui/IconBox";
import UserProfileDropdown from "../../auth/components/UserProfileDropdown";

import { DASHBOARD_STRINGS } from "../constants/dashboardConstants";

export default function DashboardHeader({ onMenuOpen }) {
  const { user } = useAuth();

  return (
    <header className="flex h-20 items-center justify-between border-b border-border px-6 shrink-0 bg-surface/80 backdrop-blur-md">
      
      <div className="flex items-center gap-4">
        <Button
          onClick={onMenuOpen}
          className="flex lg:hidden w-11 h-11 p-0 rounded-xl transition-colors"
        >
          <IconBox icon={Menu} boxSize="16" />
        </Button>

        <div className="lg:hidden">
          <Logo labelPosition="left" />
        </div>
      </div>

      <div className="hidden md:flex flex-1 max-w-md mx-8">
        {/* Reserved space for Global Search */}
      </div>

      <div className="flex items-center gap-6">
        <UserProfileDropdown />
      </div>
    </header>
  );
}
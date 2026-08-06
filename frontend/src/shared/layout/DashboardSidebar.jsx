import { Link } from "react-router-dom";

import Logo from "@/shared/Logo";
import ThemeToggle from "@/shared/ThemeToggle"
import NavigationMenu from "@/shared/navigation/NavigationMenu";
import UserProfileDropdown from "@/features/auth/components/UserProfileDropdown";
import Drawer from "@/shared/ui/Drawer";

export default function DashboardSidebar({
  isOpen,
  onClose,
  menuItems = [],
}) {
  const navigation = (
    <div className="flex-1 py-6">
      <NavigationMenu
        items={menuItems}
        onItemClick={onClose}
      />
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className="
          hidden lg:flex
          h-screen w-36
          shrink-0
          border-l border-border
          bg-surface
          justify-center
        "
      >
        <div className="flex h-full flex-col w-full">
          {navigation}

          <div className="mt-auto flex items-center justify-center border-t border-border p-3">
            <ThemeToggle/>
            <UserProfileDropdown fullWidth={false} showInfo={false}/>
          </div>
        </div>
      </aside>

      {/* Mobile */}
      <div className="lg:hidden">
        <Drawer
          isOpen={isOpen}
          onClose={onClose}
          position="right"
          header={
            <Link to="/dashboard">
              <Logo size="md" />
            </Link>
          }
        >
          <div className="flex h-full flex-col">
            {navigation}

            <div className="mt-auto w-full border-t border-border p-3">
              <UserProfileDropdown fullWidth onCloseDrawer={onClose} />
            </div>
          </div>
        </Drawer>
      </div>
    </>
  );
}
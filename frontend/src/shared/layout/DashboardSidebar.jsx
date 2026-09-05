import { Link } from "react-router-dom";

import Logo from "@/shared/Logo";
import ThemeToggle from "@/shared/ThemeToggle";
import NavigationMenu from "@/shared/navigation/NavigationMenu";
import UserProfileDropdown from "@/features/auth/components/UserProfileDropdown";
import Drawer from "@/shared/ui/Drawer";

export default function DashboardSidebar({
  isOpen,
  onClose,
  menuItems = [],
  footerItems = [],
}) {
  const navigation = (
    <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-3">
      <NavigationMenu items={menuItems} onItemClick={onClose} />

      {footerItems.length > 0 && (
        <div className="mt-4 border-t border-border pt-4">
          <NavigationMenu items={footerItems} onItemClick={onClose} />
        </div>
      )}
    </nav>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className="
          hidden lg:flex lg:flex-col
          h-screen w-60 shrink-0
          border-l border-border bg-surface
        "
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center border-b border-border px-4">
          <Link to="/dashboard" className="flex items-center">
            <Logo size="md" />
          </Link>
        </div>

        {navigation}

        {/* Footer */}
        <div className="shrink-0 border-t border-border p-3">
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <UserProfileDropdown fullWidth showInfo />
            </div>
            <ThemeToggle />
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
            <Link to="/dashboard" onClick={onClose}>
              <Logo size="md" />
            </Link>
          }
        >
          <div className="flex h-full flex-col">
            {navigation}

            <div className="shrink-0 border-t border-border p-3">
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <UserProfileDropdown fullWidth onCloseDrawer={onClose} />
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </Drawer>
      </div>
    </>
  );
}

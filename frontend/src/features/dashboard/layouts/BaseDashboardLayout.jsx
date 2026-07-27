import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import NavigationMenu from "../../../shared/navigation/NavigationMenu";
import LogoutButton from "../../auth/components/LogoutButton";

export default function BaseDashboardLayout({
  role,
  menuItems = [],
  footerItems = [],
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  const sidebarFooter = (
    <div className="flex flex-col w-full gap-2">
      <NavigationMenu items={footerItems} onItemClick={closeSidebar} />
      <LogoutButton />
    </div>
  );

  return (
    <div
      data-role={role}
      className="flex h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-300 dir-rtl"
    >
      {/* Sidebar gets background color automatically from --surface */}
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        menuItems={menuItems}
        footer={sidebarFooter}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header styling syncs with --surface */}
        <DashboardHeader onMenuOpen={openSidebar} />

        {/* Main Content uses --background */}
        <main className="flex-1 overflow-y-auto p-6 bg-background text-foreground transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

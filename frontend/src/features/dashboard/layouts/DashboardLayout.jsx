/**
 * DashboardLayout Component - Implements the master dashboard structure, managing sidebar visibility states and layout grids.
 */

import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";

import useAuth from "../../../hooks/useAuth";

import Button from "../../../shared/ui/Button";
import NavigationMenu from "../../../shared/navigation/NavigationMenu";
import LogoutButton from "../components/LogoutButton";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";

import { 
  DASHBOARD_MENU_ITEMS, 
  DASHBOARD_FOOTER_ITEMS, 
  DASHBOARD_STRINGS 
} from "../constants/dashboardConstants";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  
  // Single unified state controlling sidebar visibility on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Filter sidebar menu items based on user privileges
  const filteredMenuItems = DASHBOARD_MENU_ITEMS.filter(
    (item) => !item.ownerOnly || user?.is_owner
  );

  // Unified footer structure containing bottom route links and the logout action
  const sidebarFooter = (
    <div className="flex flex-col w-full gap-2">
      <NavigationMenu items={DASHBOARD_FOOTER_ITEMS} onItemClick={closeSidebar} />
      <LogoutButton/>
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background" >
      
      {/* Unified Sidebar: Managed dynamically on mobile, persistent on desktop */}
      <DashboardSidebar 
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        menuItems={filteredMenuItems}
        footer={sidebarFooter}
      />

      {/* Viewport Content Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Triggering openSidebar updates state to render the sidebar on mobile */}
        <DashboardHeader onMenuOpen={openSidebar} />

        {/* Central application views injected through React Router Outlet */}
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
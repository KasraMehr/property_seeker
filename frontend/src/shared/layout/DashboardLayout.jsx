import { useState } from "react";
import { Outlet } from "react-router-dom";
import Button from "../ui/Button";
import { Menu } from "lucide-react";

import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout({
  role,
  menuItems = [],
  footerItems = [],
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      data-role={role}
      className="flex h-screen overflow-hidden  bg-background text-foreground"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 right-4 z-40 lg:hidden"
      >
        <Menu size={20} />
      </Button>

      <DashboardSidebar
        menuItems={menuItems}
        footerItems={footerItems}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <section className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-auto bg-background px-6 py-5">
          <Outlet />
        </main>
      </section>
    </div>
  );
}

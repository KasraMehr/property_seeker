import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

import Button from "../ui/Button";
import DashboardSidebar from "./DashboardSidebar";
import PageHeader from "@/shared/page/PageHeader";

export default function DashboardLayout({
  role,
  menuItems = [],
  footerItems = [],
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [pageHeader, setPageHeader] = useState(null);

  return (
    <div
      data-role={role}
      className="flex h-screen overflow-hidden bg-background text-foreground"
    >
      <DashboardSidebar
        menuItems={menuItems}
        footerItems={footerItems}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <section className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header
          className="
            sticky top-0 z-30
            flex h-16 shrink-0 items-center gap-3
            border-b border-border
            bg-surface/80 px-4 backdrop-blur
            lg:px-6
          "
        >
          {/* Mobile sidebar button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden"
            aria-label="باز کردن منو"
          >
            <Menu size={20} />
          </Button>

          {/* Page Header */}
          <div
            id="dashboard-topbar"
            className="flex min-w-0 flex-1 items-center"
          >
            {pageHeader && <PageHeader {...pageHeader} compact />}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 py-5 lg:px-6">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet
              context={{
                setPageHeader,
              }}
            />
          </div>
        </main>
      </section>
    </div>
  );
}

/**
 * DashboardSidebar - A unified sidebar that stays open on desktop
 * and behaves as a responsive slide-over drawer on mobile viewports.
 */

import { X } from "lucide-react";
import { Link } from "react-router-dom";

import Logo from "../../../shared/Logo";
import Button from "../../../shared/ui/Button";
import NavigationMenu from "../../../shared/navigation/NavigationMenu";
import ThemeToggle from "../../../shared/ThemeToggle";

export default function DashboardSidebar({
  isOpen,
  onClose,
  menuItems,
  footer,
}) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 right-0 z-50 flex w-72 flex-col border-l border-border bg-surface p-6 transition-transform duration-300 ease-in-out
          lg:static lg:z-0 lg:flex lg:translate-x-0
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Sidebar Header: Logo & Mobile Close Button */}
        <div className="mb-8 flex items-center justify-between shrink-0">
          <Link to="/dashboard" onClick={onClose}>
            <Logo labelPosition="left" />
          </Link>

          {/* Close button - visible only on mobile devices */}
          <Button
            onClick={onClose}
            variant="ghost"
            className="flex lg:hidden w-10 h-10 p-0 rounded-xl"
          >
            <X size={20} />
          </Button>

          <ThemeToggle />
        </div>

        {/* Unified Navigation Menu using the original component */}
        <div className="flex-1 overflow-hidden">
          <NavigationMenu
            items={menuItems}
            footer={footer}
            onItemClick={onClose}
          />
        </div>
      </aside>
    </>
  );
}

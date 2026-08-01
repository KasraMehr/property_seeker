import { X } from "lucide-react";
import { Link } from "react-router-dom";

import Logo from "../../../shared/Logo";
import Button from "../../../shared/ui/Button";
import NavigationMenu from "../../../shared/navigation/NavigationMenu";
import ThemeToggle from "../../../shared/ThemeToggle";

export default function DashboardSidebar({
  isOpen,
  onClose,
  menuItems = [],
  footer,
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 right-0 z-50 flex w-72 flex-col 
          border-l border-border bg-surface p-5
          transition-transform duration-300 ease-in-out
          lg:static lg:z-0 lg:flex lg:translate-x-0
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header: Logo + Close + Theme */}
        <div className="mb-6 flex items-center justify-between shrink-0 gap-3">
          <Link to="/dashboard" onClick={onClose} className="shrink-0">
            <Logo size="sm" labelPosition="left" />
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle size="sm" />

            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="lg:hidden w-9 h-9 rounded-lg"
            >
              <X size={18} />
            </Button>
          </div>
        </div>

        {/* ── Navigation ── */}
        <div className="flex-1 overflow-y-auto -mx-1 px-1">
          <NavigationMenu
            items={menuItems}
            footer={footer}
            onItemClick={onClose}
            className="gap-1"
          />
        </div>
      </aside>
    </>
  );
}
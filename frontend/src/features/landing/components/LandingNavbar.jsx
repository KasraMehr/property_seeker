import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, LayoutDashboard, Menu } from "lucide-react";

import useAuth from "@/features/auth/hooks/useAuth";
import Logo from "../../../shared/Logo";
import Button from "../../../shared/ui/Button";
import ThemeToggle from "../../../shared/ThemeToggle";
import Drawer from "../../../shared/ui/Drawer";
import NavigationMenu from "../../../shared/navigation/NavigationMenu";

import { NAVBAR_STRINGS } from "../constants/landingConstants";

export default function LandingNavbar() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent selection:bg-primary/10">
        <div className="max-w-7xl mx-auto h-24 px-6 flex items-center justify-between">
          
          {/* Mobile */}
          <div className="flex items-center gap-3 md:hidden">
            <Button variant="ghost" size="icon" onClick={openMenu} className="rounded-xl border border-border">
              <Menu size={20} />
            </Button>

            <div className="flex items-center backdrop-blur-sm bg-glass px-4 py-2 rounded-2xl border border-border shadow-sm">
              <Link to="/">
                <Logo size="md" labelPosition="left" />
              </Link>
            </div>
          </div>

          {/* Desktop: Logo */}
          <div className="hidden md:flex items-center backdrop-blur-sm bg-glass px-4 py-2 rounded-2xl border border-border shadow-sm">
            <Link to="/">
              <Logo size="lg" labelPosition="left" />
            </Link>
          </div>

          {/* Desktop: Nav */}
          <nav className="hidden md:flex items-center gap-10 bg-glass backdrop-blur-xl border border-border px-10 py-4 rounded-full shadow-lg shadow-primary/10">
            {NAVBAR_STRINGS.menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className="text-muted hover:text-primary px-4 text-base font-semibold transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-primary rounded-full transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <ThemeToggle size="sm" />

            <div className="hidden md:block">
              {user ? (
                <Button as={Link} to="/dashboard" variant="primary" size="md" className="gap-2">
                  <LayoutDashboard size={16} />
                  <span>{NAVBAR_STRINGS.ctaDashboard}</span>
                </Button>
              ) : (
                <Button as={Link} to="/login" variant="primary" size="md" className="gap-2">
                  <LogIn size={16} />
                  <span>{NAVBAR_STRINGS.ctaLogin}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Drawer */}
      <Drawer isOpen={isMenuOpen} onClose={closeMenu} header={<Logo size="md" labelPosition="left" />}>
        <NavigationMenu items={NAVBAR_STRINGS.menuItems} onItemClick={closeMenu} />
      </Drawer>
    </>
  );
}
import { useState, useCallback } from "react";
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

  // Smooth scroll with header offset
  const scrollToSection = useCallback((href) => {
    if (!href?.startsWith("#")) return false;
    const el = document.querySelector(href);
    if (!el) return false;

    const headerOffset = 112;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: "smooth" });
    return true;
  }, []);

  const handleAnchorClick = useCallback(
    (e, href) => {
      if (scrollToSection(href)) {
        e.preventDefault();
      }
    },
    [scrollToSection],
  );

  // Prepare nav items for NavigationMenu
  const navItems = NAVBAR_STRINGS.menuItems.map((item) => ({
    ...item,
    type: item.href?.startsWith("#") ? "anchor" : "route",
    path: item.href,
    href: item.href,
  }));

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent selection:bg-primary/10">
        <div className="max-w-7xl mx-auto h-24 px-6 flex items-center justify-between">
          {/* Mobile: Menu + Logo */}
          <div className="flex items-center gap-3 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={openMenu}
              className="rounded-xl border border-border"
            >
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

          {/* Desktop: Nav — pure <a> with smooth scroll */}
          <nav className="hidden md:flex items-center gap-8 bg-glass backdrop-blur-xl border border-border px-8 py-3 rounded-full shadow-lg shadow-primary/10">
            {NAVBAR_STRINGS.menuItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleAnchorClick(e, item.href)}
                className="relative text-muted hover:text-foreground px-3 py-1.5 text-sm font-semibold transition-colors duration-200 group"
              >
                {item.label}
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-(--role-primary) rounded-full transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right: Theme + Auth */}
          <div className="flex items-center gap-3">
            <ThemeToggle size="sm" />

            <div className="hidden md:block">
              {user ? (
                <Button
                  as={Link}
                  to="/dashboard"
                  variant="primary"
                  size="md"
                  className="gap-2"
                >
                  <LayoutDashboard size={16} />
                  <span>{NAVBAR_STRINGS.ctaDashboard}</span>
                </Button>
              ) : (
                <Button
                  as={Link}
                  to="/login"
                  variant="primary"
                  size="md"
                  className="gap-2"
                >
                  <LogIn size={16} />
                  <span>{NAVBAR_STRINGS.ctaLogin}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer — NavigationItem with offset */}
      <Drawer
        isOpen={isMenuOpen}
        onClose={closeMenu}
        header={<Logo size="md" labelPosition="left" />}
      >
        <div className="flex h-full flex-col items-center px-6 py-8">
            <NavigationMenu
              items={navItems}
              onItemClick={closeMenu}
            />
        </div>
      </Drawer>
    </>
  );
}

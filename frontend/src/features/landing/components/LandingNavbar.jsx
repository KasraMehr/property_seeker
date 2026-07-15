
import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, LayoutDashboard, Menu } from "lucide-react";

import useAuth from "../../../hooks/useAuth";

import Logo from "../../../shared/Logo";
import Button from "../../../shared/ui/Button";
import ThemeToggle from "../../../shared/ThemeToggle";
import IconBox from "../../../shared/ui/IconBox";
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
          {/* Mobile Logo + Menu Trigger */}
          <div className="flex items-center gap-3 md:hidden">
            <Button
              onClick={openMenu}
              className="flex items-center justify-center w-11 h-11 rounded-xl border border-border transition-colors cursor-pointer"
            >
              <IconBox icon={Menu} boxSize="16" />
            </Button>

            <div className="flex items-center backdrop-blur-sm bg-glass px-4 py-2 rounded-2xl border border-border shadow-sm">
              <Link to="/">
                <Logo labelPosition="left" />
              </Link>
            </div>
          </div>

          {/* Desktop Logo Display */}
          <div className="hidden md:flex items-center backdrop-blur-sm bg-glass px-4 py-2 rounded-2xl border border-border shadow-sm">
            <Link to="/">
              <Logo labelPosition="left" />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-10 bg-glass backdrop-blur-xl border border-border px-10 py-4 rounded-full shadow-lg shadow-primary/10">
            {NAVBAR_STRINGS.menuItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="text-muted hover:text-primary px-4 text-base font-semibold transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-primary rounded-full transition-all duration-200 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* User Auth Action triggers */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <div className="hidden md:block">
              {user ? (
                <Button
                  as={Link}
                  to="/dashboard"
                  className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 shadow-sm px-5 py-2.5 rounded-full text-sm font-bold gap-2"
                >
                  <LayoutDashboard size={16} />
                  <span>{NAVBAR_STRINGS.ctaDashboard}</span>
                </Button>
              ) : (
                <Button
                  as={Link}
                  to="/login"
                  className="bg-primary text-primary hover:bg-primary-hover shadow-md shadow-primary/10 px-6 py-2.5 rounded-full text-sm font-bold gap-2"
                >
                  <LogIn size={16} />
                  <span>{NAVBAR_STRINGS.ctaLogin}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Draw overlay representation */}
      <Drawer
        isOpen={isMenuOpen}
        onClose={closeMenu}
        header={<Logo labelPosition="left" />}
        footer={
          user ? (
            <Button
              as={Link}
              to="/dashboard"
              onClick={closeMenu}
              className="w-full justify-center bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 gap-2"
            >
              <LayoutDashboard size={18} />
              <span>{NAVBAR_STRINGS.ctaDashboard}</span>
            </Button>
          ) : (
            <Button
              as={Link}
              to="/login"
              onClick={closeMenu}
              className="w-full justify-center gap-2"
            >
              <LogIn size={18} />
              <span>{NAVBAR_STRINGS.ctaLogin}</span>
            </Button>
          )
        }
      >
        <NavigationMenu
          items={NAVBAR_STRINGS.menuItems}
          onItemClick={closeMenu}
        />
      </Drawer>
    </>
  );
}

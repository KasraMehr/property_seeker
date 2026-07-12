import { Link } from "react-router-dom";
import { LogIn, LayoutDashboard } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import Logo from "../../../shared/Logo";
import Button from "../../../shared/ui/Button";
import { NAVBAR_STRINGS } from "../constants/landingConstants";
import ThemeToggle from "../../../shared/ThemeToggle";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent selection:bg-primary/10">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        {/* Logo  */}
        <div className="flex items-center backdrop-blur-sm bg-glass px-4 py-2 rounded-2xl border border-border shadow-sm">
          <Link to="/">
            <Logo labelPosition="left" />
          </Link>
        </div>

        {/* Nav Menu  */}
        <nav className="hidden md:flex items-center gap-10 bg-glass backdrop-blur-xl border border-border px-10 py-4 rounded-full shadow-lg shadow-primary/10">
          {NAVBAR_STRINGS.menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="text-muted hover:text-primary px-4 text-base font-semibold transition-colors duration-200 relative group"
            >
              {item.label}

              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full rounded-full"></span>
            </a>
          ))}
        </nav>

        {/* Login Button  */}
        <div className="flex items-center gap-3">
          <ThemeToggle/>

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
    </header>
  );
}
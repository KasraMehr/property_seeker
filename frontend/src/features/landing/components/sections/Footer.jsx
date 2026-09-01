import React from "react";
import { FOOTER_STRINGS } from "../../constants/landingConstants";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-border bg-surface/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
          
          {/* Brand + Disclaimer */}
          <div className="max-w-xl">
            <h3 className="text-xl font-bold text-foreground mb-3">
              دیلان ملک
            </h3>
            <p className="text-sm text-muted leading-7 mb-4">
              بازوی فایلینگ و تبلیغات املاک
            </p>
            <p className="text-xs text-muted/80 leading-6 border-r-2 border-warning/80 pr-3">
              {FOOTER_STRINGS.disclaimer}
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6">
            {FOOTER_STRINGS.links.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="text-sm text-muted hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mb-6" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {FOOTER_STRINGS.copyright}
          </p>
          <p className="text-xs text-muted/70">
            مدیریت متمرکز فایلینگ و تبلیغات املاک
          </p>
        </div>
      </div>
    </footer>
  );
}
import Button from "@/shared/ui/Button";
import { Menu } from "lucide-react";

export default function Header({
  title,
  subtitle,
  actions,
  tabs,
  onMenuOpen,
}) {
  return (
    <header className="sticky top-0 z-20 mb-6 border-b border-border bg-background/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-6">

        <div className="flex items-center gap-3">

          {onMenuOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuOpen}
              className="lg:hidden"
            >
              <Menu size={18} />
            </Button>
          )}

          <div>
            <h1 className="text-xl font-bold">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-1 text-sm text-muted">
                {subtitle}
              </p>
            )}
          </div>

        </div>

        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}

      </div>

      {tabs && (
        <div className="mt-4">
          {tabs}
        </div>
      )}
    </header>
  );
}
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "../Logo";
import Button from "../ui/Button";

export default function PublicPageLayout({ children, backLink = -1 }) {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-background text-foreground font-vazir"
    >
      {/* Background image — spans from below header to bottom, full width/height */}
      <div
        className="pointer-events-none fixed top-20 left-0 right-0 bottom-0 bg-[url('/dilan-logo.webp')] bg-size-[85%_85%] bg-center bg-no-repeat opacity-[0.2]"
        aria-hidden="true"
      />

      {/* Header — sticky glass */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border">
        <div className="w-full h-20 px-6 md:px-10 flex items-center justify-between">
          <Logo size="md" labelPosition="left" />

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(backLink)}
            className="gap-2"
          >
            <span>بازگشت</span>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  );
}

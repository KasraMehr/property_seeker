import React from "react";
import { ArrowLeft, Search, Megaphone, Users, ShieldCheck } from "lucide-react";
import Button from "@/shared/ui/Button";
import { HERO_STRINGS } from "../../constants/landingConstants";
import { MotionHover } from "@/animations/MotionElements";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="min-h-svh pt-24 md:pt-28 flex items-center justify-center
  bg-linear-to-b from-surface/50 to-background px-4 pb-6 md:px-8 md:pb-10"
    >
      <div
        className="w-full min-h-[calc(100svh-8rem)] rounded-3xl bg-surface/30 backdrop-blur-sm
    border border-border relative overflow-hidden shadow-2xl shadow-primary/5"
      >
        {/* Background image constrained within the container */}
        <div
          className="absolute inset-0 z-0 rounded-3xl overflow-hidden opacity-30 md:opacity-100 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-cards.webp')" }}
        />
        {/* Overlay decoration for blending */}
        <div className="absolute inset-0 z-0 bg-linear-to-br from-primary/5 to-transparent rounded-3xl" />

        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-between px-6 py-6 md:px-12 lg:px-16">
          {/* Left side - Text content (Positioned same as before) */}
          <div className="w-full md:w-1/2 flex py-10 md:py-12 items-center justify-center md:justify-start order-1">
            <div className="text-center md:text-right max-w-2xl">
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
                <span className="text-foreground">
                  {HERO_STRINGS.titleFirst}
                </span>
                <br />
                <span className="text-primary">{HERO_STRINGS.titleSecond}</span>
                <br />
                <span className="text-primary">{HERO_STRINGS.titleThird}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-secondary text-base sm:text-lg md:text-xl mx-auto md:mx-0 mb-6 leading-relaxed">
                {HERO_STRINGS.subtitle}
              </p>

              {/* Features - 3 item */}
              <div className="flex flex-wrap gap-4 mb-8 justify-center md:justify-start">
                {HERO_STRINGS.features.map((item, index) => {
                  const icons = [Search, Megaphone, Users];
                  const Icon = icons[index];

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-muted"
                    >
                      <Icon size={16} className="text-primary" />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
                <Button
                  as={Link}
                  to="/contact" // form path
                  className="bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 px-8 py-3.5 rounded-full text-base font-bold gap-2 transition-all hover:scale-105"
                >
                  {HERO_STRINGS.primaryButton}
                  <ArrowLeft size={18} />
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => {
                    const el = document.querySelector("#how-it-works");
                    if (el) {
                      const headerOffset = 112;
                      const top =
                        el.getBoundingClientRect().top +
                        window.scrollY -
                        headerOffset;
                      window.scrollTo({ top, behavior: "smooth" });
                    }
                  }}
                  className="bg-glass backdrop-blur-sm border-3 border-b-warning px-8 py-3.5 rounded-full text-base font-bold gap-2 transition-all hover:scale-105"
                >
                  <ShieldCheck size={18} />
                  {HERO_STRINGS.secondaryButton}
                </Button>
              </div>

              {/* Disclaimer */}
              <div className="pt-3">
                <p className="text-xs text-muted leading-5 max-w-xl mx-auto md:mx-0 border-r-2 border-warning/80 pr-3">
                  {HERO_STRINGS.disclaimer}
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Replaced image with background logic above, now an empty container or a simplified placeholder */}
          <MotionHover className="w-full md:w-1/2 h-1/2 md:h-full flex pt-10 rounded-3xl items-center justify-center order-2 mt-6 md:mt-0">
            {/* The image is now in the parent container's background. 
                We keep this container to maintain layout but remove the actual <img> tag.
                Optionally, you could add subtle interaction or floating elements here. */}
            <div className="relative w-full h-full max-h-[50vh] md:max-h-[75vh] object-contain rounded-3xl">
              {/* Example: A subtle gradient or shadow placeholder */}
              {/* <div className="absolute inset-0 bg-transparent rounded-3xl" /> */}
            </div>
          </MotionHover>
        </div>
      </div>
    </section>
  );
}

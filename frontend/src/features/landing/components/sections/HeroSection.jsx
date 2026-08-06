import React from "react";
import {
  ArrowLeft,
  Search,
  Camera,
  Building2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Button from "@/shared/ui/Button";
import { HERO_STRINGS } from "../../constants/landingConstants";
import { MotionHover } from "@/animations/MotionElements";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="min-h-screen pt-20 flex items-center justify-center 
     bg-linear-to-b from-surface/50 to-background px-4 py-6 md:px-8 md:py-10"
    >
      <div
        className="w-full h-[85vh] rounded-3xl bg-surface/30 backdrop-blur-sm 
        border border-border relative overflow-hidden shadow-2xl shadow-primary/5"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />

        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-16">
          {/* Left side - Text content */}
          <div className="w-full md:w-1/3 flex py-2 items-center justify-center md:justify-start order-1 md:order-1">
            <div className="text-center md:text-right max-w-2xl">
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                <span className="text-foreground">
                  {HERO_STRINGS.titleFirst}
                </span>
                <br />
                <span className="text-primary">{HERO_STRINGS.titleSecond}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-muted text-base sm:text-lg md:text-xl  mx-auto md:mx-0 mb-8 leading-relaxed">
                {HERO_STRINGS.subtitle}
              </p>

              {/* Features - 3 item */}
              <div className="flex flex-wrap gap-4 mb-8 justify-center md:justify-start">
                {HERO_STRINGS.features.map((item, index) => {
                  const icons = [Search, Camera, Building2];

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
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button 
                as={Link}
                to="/login"
                className="bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 px-8 py-3.5 rounded-full text-base font-bold gap-2 transition-all hover:scale-105">
                  {HERO_STRINGS.primaryButton}
                  <ArrowLeft size={18} />
                </Button>

                <Button
                  variant="secondary"
                  className="bg-glass backdrop-blur-sm border-3 border-b-warning hover:bg-white/10 px-8 py-3.5 rounded-full text-base font-bold gap-2 transition-all hover:scale-105"
                >
                  <ShieldCheck size={18} />
                  {HERO_STRINGS.secondaryButton}
                </Button>
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <MotionHover className="w-full md:w-2/3 h-1/2 md:h-full flex items-center justify-center order-2 md:order-2">
            <div className="relative">
              <img
                src="/images/hero-desk-nobg.png"
                alt={HERO_STRINGS.imageAlt}
                className="w-full h-full max-h-[60vh] md:max-h-[80vh] object-contain"
              />
            </div>
          </MotionHover>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { BENEFITS_STRINGS } from "../../constants/landingConstants";
import {
  MotionDiv,
  MotionStagger,
  MotionItem,
  MotionHover,
} from "@/animations/MotionElements";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Button from "@/shared/ui/Button";
import { Link } from "react-router-dom";

export default function Benefits() {
  return (
    <section id="benefits" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <MotionDiv delay={0.1} className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-warning/10 text-warning text-lg font-semibold border border-warning/20 mb-6">
            {BENEFITS_STRINGS.badge}
          </span>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {BENEFITS_STRINGS.title}
          </h2>

          <p className="text-muted text-lg leading-8 max-w-2xl mx-auto">
            {BENEFITS_STRINGS.subtitle}
          </p>
        </MotionDiv>

        {/* Benefits Grid */}
        <MotionStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {BENEFITS_STRINGS.items.map((item, index) => (
            <MotionItem key={index}>
              <MotionHover className="h-full">
                <div className="bg-glass backdrop-blur-xl border border-border rounded-3xl p-6 shadow-lg h-full text-center">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted leading-6">
                    {item.description}
                  </p>
                </div>
              </MotionHover>
            </MotionItem>
          ))}
        </MotionStagger>

        {/* CTA Box */}
        <MotionDiv delay={0.2}>
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 shadow-xl shadow-primary/10">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/hand-shaking-bg.jpg" 
                alt=""
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-background/70" />
              <div className="absolute inset-0 bg-primary/10" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 md:p-12 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {BENEFITS_STRINGS.ctaTitle}
              </h3>

              <p className="text-muted text-base md:text-lg leading-8 mb-8 max-w-2xl mx-auto">
                {BENEFITS_STRINGS.ctaDescription}
              </p>

              <Button
                as={Link}
                to="/contact"
                className="bg-primary hover:bg-primary-hover shadow-lg shadow-primary/25 px-10 py-4 rounded-full text-base font-bold gap-2 transition-all hover:scale-105"
              >
                {BENEFITS_STRINGS.ctaButton}
                <ArrowLeft size={18} />
              </Button>
            </div>
          </div>
        </MotionDiv>
      </div>
    </section>
  );
}

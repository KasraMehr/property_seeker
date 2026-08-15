import React, { useState } from "react";
import { HOW_IT_WORKS_STRINGS } from "../../constants/landingConstants";
import { MotionDiv } from "@/animations/MotionElements";
import {
  ChevronRight,
  ChevronLeft,
  Search,
  PhoneCall,
  Database,
  Megaphone,
  Users,
  Handshake,
} from "lucide-react";

const STEP_ICONS = [Search, PhoneCall, Database, Megaphone, Users, Handshake];

export default function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const steps = HOW_IT_WORKS_STRINGS.steps;

  const goTo = (index) => {
    if (index < 0) index = steps.length - 1;
    if (index >= steps.length) index = 0;
    setActiveIndex(index);
  };

  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28 bg-background overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <MotionDiv delay={0.1} className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-warning/10 text-warning text-lg font-semibold border border-warning/20 mb-6">
            {HOW_IT_WORKS_STRINGS.badge}
          </span>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {HOW_IT_WORKS_STRINGS.title}
          </h2>

          <p className="text-muted text-lg leading-8 max-w-2xl mx-auto">
            {HOW_IT_WORKS_STRINGS.subtitle}
          </p>
        </MotionDiv>

        {/* Carousel */}
        <div className="relative h-100 md:h-115 flex items-center justify-center">
          {steps.map((step, index) => {
            let offset = index - activeIndex;

            if (offset > steps.length / 3) offset -= steps.length;
            if (offset < -steps.length / 3) offset += steps.length;

            const isActive = offset === 0;
            const absOffset = Math.abs(offset);
            const scale = isActive ? 1 : 0.85 - absOffset * 0.06;
            const opacity = isActive ? 1 : 0.7 - absOffset * 0.12;
            const StepIcon = STEP_ICONS[index];

            return (
              <div
                key={index}
                onClick={() => goTo(index)}
                className="absolute transition-all duration-500 ease-out cursor-pointer"
                style={{
                  transform: `translateX(${offset * 260}px) scale(${scale}) rotateY(${offset * -6}deg)`,
                  opacity: Math.max(opacity, 0.35),
                  zIndex: 20 - absOffset,
                  width: isActive ? "360px" : "300px",
                }}
              >
                <div
                  className={`relative bg-glass backdrop-blur-xl border rounded-3xl p-7 h-80 md:h-95 flex flex-col shadow-xl transition-all duration-500 ${
                    isActive
                      ? "border-primary/60 shadow-primary/25"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  {/* Step Number */}
                  <div
                    className={`absolute -top-5 self-center-safe px-20 py-2 rounded-xl font-bold text-lg border transition-all duration-500 ${
                      isActive
                        ? "bg-primary text-white border-primary/30 shadow-lg shadow-primary/30"
                        : "bg-background text-primary border-primary/30"
                    }`}
                  >
                    {step.number}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col items-center text-center pt-8">
                    <h3
                      className={`text-xl font-bold leading-snug mb-4 transition-colors duration-500 ${
                        isActive ? "text-foreground" : "text-foreground/80"
                      }`}
                    >
                      {step.title}
                    </h3>

                    <p
                      className={`text-sm leading-7 transition-colors duration-500 ${
                        isActive ? "text-muted" : "text-muted/80"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>

                  {/* Step Icon */}
                  <div
                    className={`mt-auto self-end transition-all duration-500 ${
                      isActive ? "text-warning scale-110" : "text-warning/60"
                    }`}
                  >
                    <StepIcon size={42} strokeWidth={1.7} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-8 mt-10">
          <button
            onClick={() => goTo(activeIndex - 1)}
            className="w-12 h-12 rounded-full border border-border bg-glass flex items-center justify-center hover:bg-warning/80 hover:text-white hover:border-warning transition-all duration-300"
          >
            <ChevronRight size={22} />
          </button>

          <div className="flex items-center gap-3">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`flex items-center justify-center rounded-full font-medium transition-all duration-300 ${
                  index === activeIndex
                    ? "w-10 h-10 bg-primary text-white text-sm"
                    : "w-9 h-9 bg-surface border border-border text-muted hover:border-primary/50 hover:text-primary text-sm"
                }`}
              >
                {step.number}
              </button>
            ))}
          </div>

          <button
            onClick={() => goTo(activeIndex + 1)}
            className="w-12 h-12 rounded-full border border-border bg-glass flex items-center justify-center hover:bg-warning/80 hover:text-white hover:border-warning transition-all duration-300"
          >
            <ChevronLeft size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}

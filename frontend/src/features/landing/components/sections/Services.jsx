import React from "react";
import { SERVICES_STRINGS } from "../../constants/landingConstants";
import {
  MotionDiv,
  MotionStagger,
  MotionItem,
  MotionHover,
} from "@/animations/MotionElements";

export default function Services() {
  return (
    <section id="services" className="relative py-20 md:py-28 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/serv-section-bg.webp" 
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <MotionDiv delay={0.1} className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-warning/10 text-warning text-lg font-semibold border border-warning/20 mb-6">
            {SERVICES_STRINGS.badge}
          </span>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {SERVICES_STRINGS.title}
          </h2>

          <p className="text-muted text-lg leading-8 max-w-2xl mx-auto">
            {SERVICES_STRINGS.subtitle}
          </p>
        </MotionDiv>

        {/* Services Grid */}
        <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_STRINGS.items.map((service, index) => {
            const Icon = service.icon;

            return (
              <MotionItem key={index}>
                <MotionHover className="h-full">
                  <div className="bg-glass backdrop-blur-xl border border-border rounded-3xl p-6 shadow-lg h-full flex flex-col">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                      <Icon size={24} />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-foreground mb-3">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted leading-7">
                      {service.description}
                    </p>
                  </div>
                </MotionHover>
              </MotionItem>
            );
          })}
        </MotionStagger>
      </div>
    </section>
  );
}

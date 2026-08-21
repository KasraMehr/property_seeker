import React from "react";
import { MotionDiv } from "@/animations/MotionElements";

export default function DashboardPreview() {
  return (
    <section id="dashboard" className="relative overflow-hidden py-24" dir="rtl">
      <div className="container mx-auto px-4">

        {/* Title */}
        <MotionDiv
          delay={0.1}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <span className="mb-6 inline-flex items-center rounded-full border border-warning/20 bg-warning/10 px-4 py-2 text-lg font-semibold text-warning">
           پیش نمایش
          </span>

          <h2 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
            پنل های 
            <span className="text-primary">
             {" "} مدیریتی و کاربری
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-lg leading-8 text-muted">
           داشبوردهای قدرتمند برای کنترل همه جانبه و پیگیری فرصت‌ها
          </p>
        </MotionDiv>


        {/* Image */}
        <MotionDiv
          delay={0.25}
          className="mx-auto max-w-5xl"
        >
          <div className="
            overflow-hidden rounded-3xl
            border border-border/40
            bg-surface/50
            shadow-2xl shadow-primary/10
          ">
            <img
              src="/images/preview2.webp"
              alt="Dashboard preview"
              className="w-full object-cover"
            />
          </div>
        </MotionDiv>

      </div>
    </section>
  );
}
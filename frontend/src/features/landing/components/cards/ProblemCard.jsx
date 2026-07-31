import { motion } from "framer-motion";
import { TriangleAlert } from "lucide-react";
import {
  MotionSlideRight,
  MotionStagger,
  MotionItem,
  MotionHover,
} from "@/animations/MotionElements";

export default function ProblemCard({ title, items }) {
  return (
    <MotionHover className="h-full">
      <div className="bg-glass backdrop-blur-xl border border-border rounded-3xl p-6 shadow-lg h-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-danger/10 text-danger">
            <TriangleAlert size={22} />
          </div>
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
        </div>

        {/* Items با استاگر */}
        <MotionStagger className="bg-surface/60 border border-border rounded-2xl overflow-hidden">
          {items.map((item, index) => (
            <MotionItem key={index}>
              <div className="p-5 border-b border-border last:border-none transition-colors hover:bg-danger/5">
                <div className="flex items-start gap-3">
                  <div className="mt-1 shrink-0 w-6 h-6 rounded-full bg-danger/10 text-danger flex items-center justify-center text-xs font-bold">
                    !
                  </div>
                  <div className="text-right">
                    <h4 className="font-bold text-sm text-foreground mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm leading-6 text-muted">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </MotionItem>
          ))}
        </MotionStagger>
      </div>
    </MotionHover>
  );
}

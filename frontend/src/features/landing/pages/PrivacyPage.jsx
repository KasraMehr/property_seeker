import { motion } from "framer-motion";
import PublicPageLayout from "../../../shared/layout/PublicPageLayout";

export default function PrivacyPage() {
  return (
    <PublicPageLayout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-4">حریم خصوصی</h1>
        <p className="text-muted leading-7 mb-8">
          سیاست‌ها و تعهدات ما در خصوص حفاظت از اطلاعات شما.
        </p>

        {/* Placeholder */}
        <div className="p-8 rounded-2xl border border-border bg-surface/40 backdrop-blur-xl">
          <p className="text-muted text-center">
            در حال آماده‌سازی محتوا...
          </p>
        </div>
      </motion.div>
    </PublicPageLayout>
  );
}

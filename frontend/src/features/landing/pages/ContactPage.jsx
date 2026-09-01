import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import PublicPageLayout from "../../../shared/layout/PublicPageLayout";

export default function ContactPage() {
  return (
    <PublicPageLayout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-4">تماس با ما</h1>
        <p className="text-muted leading-7 mb-8">
          برای ارتباط با ما از اطلاعات زیر استفاده کنید.(به زودی)
        </p>

        {/* Placeholder contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-surface/40 backdrop-blur-xl">
            <Mail className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-semibold mb-2">ایمیل</h3>
            <p className="text-sm text-muted"></p>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-surface/40 backdrop-blur-xl">
            <Phone className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-semibold mb-2">تلفن</h3>
            <p className="text-sm text-muted"></p>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-surface/40 backdrop-blur-xl">
            <MapPin className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-semibold mb-2">آدرس</h3>
            <p className="text-sm text-muted"></p>
          </div>
        </div>
      </motion.div>
    </PublicPageLayout>
  );
}

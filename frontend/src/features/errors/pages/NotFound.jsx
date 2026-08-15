import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowRight, SearchX } from 'lucide-react';
import { BRAND } from '@/config/brand';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <main
            dir="rtl"
            className="min-h-svh flex items-center justify-center px-4
                 bg-linear-to-b from-slate-50 to-slate-100
                 dark:from-slate-950 dark:to-slate-900"
        >
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-full max-w-md text-center"
            >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center
                        rounded-2xl border border-white/40 bg-white/60
                        backdrop-blur-xl shadow-lg
                        dark:border-white/10 dark:bg-white/5">
                    <SearchX className="h-9 w-9 text-blue-600 dark:text-blue-400" />
                </div>

                <p className="text-7xl font-black tracking-tight
                      bg-linear-to-l from-blue-500 to-teal-600
                      bg-clip-text text-transparent">
                    ۴۰۴
                </p>

                <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">
                    این صفحه پیدا نشد
                </h1>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
                    ممکنه آدرس اشتباه باشه یا این صفحه حذف شده باشه.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl
                       bg-blue-600 px-5 py-3 text-sm font-semibold text-white
                       transition hover:bg-blue-700
                       focus-visible:outline-2 focus-visible:outline-offset-2
                       focus-visible:outline-blue-600"
                    >
                        <Home className="h-4 w-4" />
                        بازگشت به {BRAND.name}
                    </Link>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl
                       border border-slate-300 px-5 py-3 text-sm font-semibold
                       text-slate-700 transition hover:bg-white
                       dark:border-slate-700 dark:text-slate-300
                       dark:hover:bg-slate-800"
                    >
                        صفحه قبلی
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </motion.div>
        </main>
    );
}

/**
 * Persian equivalents of the known backend ingestion error strings.
 *
 * Matching is done by exact match first, then substring — backend error
 * texts sometimes carry dynamic suffixes (e.g. "Could not start Chrome
 * or Edge: <details>").
 */

const KNOWN_ERRORS = [
  // ── Divar session (run-level blockers) ──
  {
    match: "Divar session status is unavailable; ingestion is blocked.",
    fa: "وضعیت نشست دیوار قابل خواندن نیست؛ استخراج متوقف شد (احتمالاً سرویس کش/Redis سرور مشکل دارد).",
  },
  {
    match: "Log in to Divar from the scraper dashboard before running ingestion.",
    fa: "نشست دیوار معتبر نیست؛ ابتدا از داشبورد اسکرپر وارد حساب دیوار شوید و بعد اجرا را شروع کنید.",
  },
  {
    match: "Divar login has expired",
    fa: "لاگین دیوار منقضی شده است؛ دوباره وارد حساب دیوار شوید.",
  },
  {
    match: "Divar requested a security puzzle",
    fa: "دیوار هنگام نمایش اطلاعات تماس، سوال امنیتی (کپچا) خواسته؛ دریافت شماره تماس‌ها موقتاً متوقف شده.",
  },

  // ── Divar anti-bot / availability ──
  {
    match: "Divar returned a throttling page",
    fa: "دیوار محدودیت موقت (Rate Limit) اعمال کرده؛ درخواست‌ها زیاد بوده و مکث کرده و دوباره تلاش می‌شود.",
  },
  {
    match: "Divar listing is removed or unavailable",
    fa: "این آگهی در دیوار حذف شده یا در دسترس نیست.",
  },
  {
    match: "Search page did not expose listing links after three attempts",
    fa: "صفحه نتایج جستجو بعد از ۳ تلاش هیچ لینک آگهی‌ای برنگرداند؛ احتمالاً ساختار صفحه تغییر کرده یا دیوار جلوی اسکرپر را گرفته.",
  },
  {
    match: "Listing page did not contain a substantive listing",
    fa: "صفحه آگهی محتوای معتبری نداشت؛ احتمالاً آگهی حذف/رد شده یا صفحه خطا نمایش داده شده.",
  },

  // ── Scraper infrastructure ──
  {
    match: "Could not start Chrome or Edge",
    fa: "مرورگر اسکرپر (Chrome/Edge) روی سرور اجرا نشد؛ نصب مرورگر یا منابع سرور را بررسی کنید.",
  },
  {
    match: "Phone ingestion requires DIVAR_PROFILE_DIR",
    fa: "متغیر محیطی DIVAR_PROFILE_DIR تنظیم نیست؛ وضعیت لاگین دیوار روی سرور ذخیره نمی‌شود.",
  },

  // ── User actions ──
  {
    match: "Cancelled by user (bulk)",
    fa: "به‌صورت گروهی توسط کاربر لغو شد.",
  },
  {
    match: "Cancelled by user",
    fa: "توسط کاربر لغو شد.",
  },
];

/**
 * Translate a raw backend error string.
 * Returns { fa, raw } — fa is null when the text is not recognised;
 * raw always holds the original text for debugging.
 */
export function translateScraperError(raw) {
  if (!raw) return null;
  const text = String(raw).trim();
  if (!text) return null;

  const exact = KNOWN_ERRORS.find((e) => e.match === text);
  if (exact) return { fa: exact.fa, raw: text };

  const partial = KNOWN_ERRORS.find((e) => text.includes(e.match));
  if (partial) return { fa: partial.fa, raw: text };

  return { fa: null, raw: text };
}

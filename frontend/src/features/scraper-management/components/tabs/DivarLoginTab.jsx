import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Loader2,
  Phone,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import Input from "@/shared/ui/Input";
import scraperService from "../../services/scraperService";

const POLLED_STATUSES = new Set([
  "queued",
  "starting",
  "waiting_otp",
  "verifying",
]);

const STATUS_COPY = {
  unknown: ["وضعیت نامشخص", "نشست مرورگر هنوز بررسی نشده است."],
  checking: ["در حال بررسی نشست", "مرورگر اسکرپر در صف بررسی ورود دیوار است."],
  authenticating: ["در حال ورود", "فرآیند ورود روی مرورگر دائمی سرور فعال است."],
  unauthenticated: ["نشست دیوار غیرفعال", "تا زمان ورود موفق، اجرای اسکرپر مسدود است."],
  error: ["خطا در بررسی نشست", "بررسی را دوباره اجرا کنید یا گزارش worker را ببینید."],
  queued: ["در صف اجرا", "درخواست ورود به صف اسکرپر اضافه شد."],
  starting: ["در حال باز کردن دیوار", "مرورگر امن اسکرپر در حال اجرا است."],
  waiting_otp: ["کد تایید ارسال شد", "کدی که دیوار پیامک کرده را وارد کنید."],
  verifying: ["در حال بررسی کد", "کد به دیوار ارسال شد؛ چند لحظه صبر کنید."],
  succeeded: ["ورود موفق", "نشست ورود ذخیره شد و دریافت شماره تماس فعال است."],
  failed: ["ورود ناموفق", "دوباره تلاش کنید یا جزئیات خطا را بررسی کنید."],
  expired: ["درخواست منقضی شد", "برای دریافت کد جدید، ورود را دوباره شروع کنید."],
};

function errorMessage(error, fallback) {
  const data = error?.response?.data;
  if (typeof data?.detail === "string") return data.detail;
  if (Array.isArray(data?.phone)) return data.phone[0];
  if (Array.isArray(data?.otp)) return data.otp[0];
  return fallback;
}

export default function DivarLoginTab({ session, onSessionRefresh }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forceLogin, setForceLogin] = useState(false);

  useEffect(() => {
    if (!attempt?.id || !POLLED_STATUSES.has(attempt.status)) return undefined;

    let cancelled = false;
    const timer = window.setInterval(async () => {
      try {
        const response = await scraperService.getDivarLogin(attempt.id);
        if (!cancelled) setAttempt(response.data);
      } catch (requestError) {
        if (!cancelled) {
          setError(errorMessage(requestError, "دریافت وضعیت ورود ناموفق بود."));
        }
      }
    }, 2000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [attempt?.id, attempt?.status]);

  useEffect(() => {
    if (["succeeded", "failed", "expired"].includes(attempt?.status)) {
      onSessionRefresh?.();
    }
  }, [attempt?.status, onSessionRefresh]);

  const displayStatus = attempt?.status ||
    (session?.authenticated ? "succeeded" : session?.status || "unknown");

  const statusCopy = useMemo(
    () => STATUS_COPY[displayStatus] || ["آماده", "شماره موبایل حساب دیوار را وارد کنید."],
    [displayStatus],
  );

  const startLogin = async (event) => {
    event.preventDefault();
    setError("");
    if (!/^09\d{9}$/.test(phone.trim())) {
      setError("شماره موبایل را به صورت 09xxxxxxxxx وارد کنید.");
      return;
    }
    setLoading(true);
    try {
      const response = await scraperService.startDivarLogin(phone.trim());
      setAttempt(response.data);
      setOtp("");
      onSessionRefresh?.();
    } catch (requestError) {
      if (requestError?.response?.status === 409 && requestError.response.data?.id) {
        setAttempt(requestError.response.data);
      } else {
        setError(errorMessage(requestError, "شروع ورود دیوار ناموفق بود."));
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmOtp = async (event) => {
    event.preventDefault();
    setError("");
    if (!/^\d{4,8}$/.test(otp.trim())) {
      setError("کد تایید باید بین ۴ تا ۸ رقم باشد.");
      return;
    }
    setLoading(true);
    try {
      const response = await scraperService.confirmDivarLogin(
        attempt.id,
        otp.trim(),
      );
      setAttempt(response.data);
      setOtp("");
      onSessionRefresh?.();
    } catch (requestError) {
      setError(errorMessage(requestError, "ارسال کد تایید ناموفق بود."));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setAttempt(null);
    setOtp("");
    setError("");
    setForceLogin(true);
  };

  const checkSession = async () => {
    setLoading(true);
    setError("");
    try {
      await scraperService.checkDivarSession();
      await onSessionRefresh?.();
    } catch (requestError) {
      setError(errorMessage(requestError, "بررسی نشست دیوار ناموفق بود."));
    } finally {
      setLoading(false);
    }
  };

  const isBusy = loading || ["queued", "starting", "verifying", "checking", "authenticating"].includes(displayStatus);
  const isSuccess = displayStatus === "succeeded";
  const isFailure = ["failed", "expired", "unauthenticated", "error"].includes(displayStatus);
  const showPhoneForm = !attempt && (!session?.authenticated || forceLogin);

  return (
    <div className="mx-auto max-w-2xl py-4" dir="rtl">
      <Card
        title="ورود حساب دیوار برای دریافت شماره تماس"
        subtitle="این ورود در پروفایل دائمی اسکرپر ذخیره می‌شود و معمولا فقط یک‌بار به کد تایید نیاز دارد."
        icon={ShieldCheck}
      >
        <div className="space-y-5">
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 ${
              isSuccess
                ? "border-emerald-500/30 bg-emerald-500/5"
                : isFailure
                  ? "border-danger/30 bg-danger/5"
                  : "border-border bg-background/40"
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={20} />
            ) : isFailure ? (
              <AlertCircle className="mt-0.5 shrink-0 text-danger" size={20} />
            ) : isBusy ? (
              <Loader2 className="mt-0.5 shrink-0 animate-spin text-primary" size={20} />
            ) : (
              <ShieldCheck className="mt-0.5 shrink-0 text-primary" size={20} />
            )}
            <div>
              <p className="text-sm font-semibold text-foreground">{statusCopy[0]}</p>
              <p className="mt-1 text-xs leading-6 text-muted">{statusCopy[1]}</p>
              {(attempt?.phone_masked || session?.phone_masked) && (
                <p className="mt-1 text-xs font-mono text-muted" dir="ltr">
                  {attempt?.phone_masked || session?.phone_masked}
                </p>
              )}
            </div>
          </div>

          {showPhoneForm && (
            <form onSubmit={startLogin} className="space-y-2">
              <Input
                label="شماره موبایل حساب دیوار"
                placeholder="09123456789"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                icon={Phone}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                disabled={loading}
              />
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone size={16} />}
                ارسال کد تایید
              </Button>
            </form>
          )}

          {!attempt && !session?.authenticated && (
            <Button
              variant="outline"
              fullWidth
              onClick={checkSession}
              disabled={loading || session?.status === "checking"}
            >
              {session?.status === "checking" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              بررسی وضعیت نشست فعلی
            </Button>
          )}

          {attempt?.status === "waiting_otp" && (
            <form onSubmit={confirmOtp} className="space-y-2">
              <Input
                label="کد تایید دیوار"
                placeholder="کد پیامک‌شده"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                icon={KeyRound}
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
                maxLength={8}
                disabled={loading}
              />
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound size={16} />}
                تایید و ذخیره نشست
              </Button>
            </form>
          )}

          {attempt && (isSuccess || isFailure) && (
            <Button variant="outline" fullWidth onClick={reset}>
              <RefreshCw size={16} />
              شروع ورود جدید
            </Button>
          )}

          {!attempt && session?.authenticated && !forceLogin && (
            <Button variant="outline" fullWidth onClick={() => setForceLogin(true)}>
              <Phone size={16} />
              ورود با شماره دیگر
            </Button>
          )}

          {error && (
            <p className="rounded-xl bg-danger/10 px-4 py-3 text-xs leading-6 text-danger">
              {error}
            </p>
          )}

          {isFailure && attempt?.detail && (
            <p className="rounded-xl border border-border px-4 py-3 text-xs leading-6 text-muted" dir="ltr">
              {attempt.detail}
            </p>
          )}

          <p className="text-xs leading-6 text-muted">
            کد تایید در پایگاه داده ذخیره نمی‌شود و پس از تحویل به مرورگر حذف می‌شود. نشست مرورگر در فضای دائمی سرور باقی می‌ماند تا اجرای بعدی اسکرپر هم به شماره تماس دسترسی داشته باشد.
          </p>
        </div>
      </Card>
    </div>
  );
}

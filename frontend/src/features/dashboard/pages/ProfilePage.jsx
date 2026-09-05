import {
  User,
  Phone,
  CreditCard,
  CalendarDays,
  Building2,
  UserCheck,
  UserCog,
  MapPin,
  ShieldCheck ,
} from "lucide-react";

import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

import useAuth from "@/features/auth/hooks/useAuth";

import Card from "@/shared/ui/Card";
import IconBox from "@/shared/ui/IconBox";
import RoleBadge from "@/shared/ui/badges/RoleBadge";


export default function ProfilePage() {
  const { user, loading } = useAuth();

  const { setPageHeader } = useOutletContext();

  useEffect(() => {
    setPageHeader({
      title: "پروفایل من",
      subtitle: "مشاهده اطلاعات حساب کاربری",
      breadcrumb: [],
    });

    return () => setPageHeader(null);
  }, [setPageHeader]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <div className="animate-pulse space-y-5">
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-2xl bg-surface" />
              </div>

              <div className="mx-auto h-5 w-32 rounded bg-surface" />
              <div className="mx-auto h-4 w-24 rounded bg-surface" />
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-40 rounded bg-surface" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-16 rounded-xl bg-surface" />
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="flex min-h-48 flex-col items-center justify-center text-center">
            <IconBox
              icon={User}
              boxSize="lg"
              variant="ghost"
              className="mb-4"
            />

            <h2 className="text-base font-semibold text-foreground">
              اطلاعات کاربر در دسترس نیست
            </h2>

            <p className="mt-1 text-sm text-muted">
              لطفاً دوباره وارد حساب کاربری خود شوید.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const roleName = user?.is_owner
    ? "owner"
    : Array.isArray(user?.role) && user.role.length > 0
      ? user.role[0]?.name
      : "operator";



  const isActive = user?.is_active ?? true;

  const formatDate = (value) => {
    if (!value) return "—";

    try {
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(value));
    } catch {
      return value;
    }
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "ثبت نشده";
    }

    return value;
  };

  const statusConfig = {
    label: isActive ? "فعال" : "غیرفعال",
    icon: isActive ? UserCheck : UserCog,
    solid: isActive
      ? "bg-success text-white"
      : "bg-danger text-white",
    soft: isActive
      ? "bg-success/10 text-success"
      : "bg-danger/10 text-danger",
    outline: isActive
      ? "border border-success/30 text-success"
      : "border border-danger/30 text-danger",
    dot: isActive ? "bg-success" : "bg-danger",
  };

  const dealTypeLabels = {
    "rent-residential": "اجارهٔ مسکونی",
    "buy-residential": "فروش مسکونی",
    "buy-commercial-property": "فروش اداری و تجاری",
    "rent-commercial-property": "اجارهٔ اداری و تجاری",
  };

  const dealTypeLabel = user?.deal_type_scope
    ? dealTypeLabels[user.deal_type_scope] ?? user.deal_type_scope
    : "ثبت نشده";

  const information = [
    {
      label: "نام و نام خانوادگی",
      value: formatValue(user.full_name),
      icon: User,
    },
    {
      label: "شماره موبایل",
      value: formatValue(user.phone),
      icon: Phone,
      dir: "ltr",
    },
    {
      label: "کد ملی",
      value: formatValue(user.national_id),
      icon: CreditCard,
      dir: "ltr",
    },
    {
      label: "آژانس",
      value: formatValue(
        user.agency?.name || user.agency_name,
      ),
      icon: Building2,
    },
    {
      label: "نوع معامله",
      value: dealTypeLabel,
      icon: ShieldCheck,
    },
    {
      label: "تاریخ عضویت",
      value: formatDate(
        user.created_at || user.date_joined,
      ),
      icon: CalendarDays,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Profile Summary */}
        <Card className="xl:col-span-1">
          <div className="flex flex-col items-center text-center">
            <IconBox
              icon={User}
              boxSize="xl"
              variant="filled"
              className="mb-4"
            />

            <h2 className="text-lg font-bold text-foreground">
              {formatValue(user.full_name)}
            </h2>

            <p
              dir="ltr"
              className="mt-1 text-sm text-muted"
            >
              {formatValue(user.phone)}
            </p>

            {/* Only role badge on the page */}
            <RoleBadge
              role={roleName}
              size="md"
              showIcon
              className="mt-4"
            />

            {/* Status pill */}
            <div
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success"
            >
              <span className="flex h-1.5 w-1.5 rounded-full bg-success" />
              وضعیت حساب: فعال
            </div>
          </div>

          <div className="my-6 h-px bg-border" />

          <div className="space-y-3">
            {user?.is_staff && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted">
                  نوع حساب
                </span>

                <span className="text-sm font-medium text-foreground">
                  کارمند سیستم
                </span>
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted">
                شناسه کاربر
              </span>

              <span
                dir="ltr"
                className="text-sm font-medium text-foreground"
              >
                #{user?.id ?? "—"}
              </span>
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <Card className="xl:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <IconBox
              icon={User}
              boxSize="sm"
              variant="filled"
            />

            <div>
              <h2 className="text-base font-bold text-foreground">
                اطلاعات شخصی
              </h2>

              <p className="mt-0.5 text-xs text-muted">
                اطلاعات ثبت‌شده برای حساب کاربری
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {information.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="
                    flex items-center gap-3 rounded-xl
                    border border-border bg-background/40
                    px-4 py-3.5
                    transition-colors duration-200
                    hover:border-(--role-primary)/25
                    hover:bg-(--role-subtle)/20
                  "
                >
                  <IconBox
                    icon={Icon}
                    boxSize="sm"
                    variant="ghost"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted">
                      {item.label}
                    </p>

                    <p
                      dir={item.dir}
                      className="mt-1 truncate text-sm font-medium text-foreground"
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Service Neighborhoods */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconBox
              icon={MapPin}
              boxSize="md"
              variant="filled"
            />

            <div>
              <h2 className="text-base font-bold text-foreground">
                محله‌های سرویس
              </h2>

              <p className="mt-0.5 text-xs text-muted">
                {user.service_neighborhoods?.length ?? 0} محله
                تحت پوشش شما
              </p>
            </div>
          </div>

          {Array.isArray(user?.service_neighborhoods) &&
          user.service_neighborhoods.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
              {user.service_neighborhoods.length} منطقه
            </span>
          )}
        </div>

        {Array.isArray(user?.service_neighborhoods) &&
        user.service_neighborhoods.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {user.service_neighborhoods.map((n) => (
              <div
                key={n.id ?? n._id}
                className="flex items-center gap-3 rounded-xl border border-border/70 bg-surface/50 px-4 py-3 transition-colors duration-200 hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {n.name}
                  </p>


                  {(n.city_name || n.zone_name) && (
                    <p className="truncate text-xs text-muted mt-0.5">
                      {n.city_name || n.zone_name}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/30 px-4 py-6 text-center">
            <IconBox icon={MapPin} boxSize="md" variant="ghost" className="text-muted" />

            <p className="text-sm text-muted">هنوز محله‌ای برای سرویس ثبت نشده است.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
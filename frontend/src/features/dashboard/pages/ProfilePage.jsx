import {
  User,
  Phone,
  Mail,
  CreditCard,
  ShieldCheck,
  CalendarDays,
  Building2,
  UserCheck,
  UserCog,
} from "lucide-react";

import useAuth from "@/features/auth/hooks/useAuth";

import PageHeader from "@/shared/page/PageHeader";
import Card from "@/shared/ui/Card";
import IconBox from "@/shared/ui/IconBox";
import RoleBadge from "@/shared/ui/badges/RoleBadge";
import StatusBadge from "@/shared/ui/badges/StatusBadge";

import { getRoleConfig } from "@/constants/roleConfig";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="پروفایل من" subtitle="اطلاعات حساب کاربری" />

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
        <PageHeader
          title="پروفایل من"
          subtitle="اطلاعات حساب کاربری"
        />

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

  const roleConfig = getRoleConfig(roleName);

  const roleLabel = user?.is_owner
    ? "مالک آژانس"
    : Array.isArray(user?.role) && user.role.length > 0
      ? user.role.map((role) => role.name).join("، ")
      : "مشاور";

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
      label: "تاریخ عضویت",
      value: formatDate(
        user.created_at || user.date_joined,
      ),
      icon: CalendarDays,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="پروفایل من"
        subtitle="مشاهده اطلاعات حساب کاربری"
      />

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

            <div className="mt-3">
              <StatusBadge
                config={statusConfig}
                variant="soft"
                size="sm"
                showIcon
              />
            </div>
          </div>

          <div className="my-6 h-px bg-border" />

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted">
                وضعیت حساب
              </span>

              <span className="text-sm font-medium text-foreground">
                {isActive ? "فعال" : "غیرفعال"}
              </span>
            </div>

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

      {/* Account Status */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <IconBox
              icon={ShieldCheck}
              boxSize="md"
              variant="filled"
            />

            <div>
              <h2 className="text-base font-bold text-foreground">
                وضعیت حساب
              </h2>

              <p className="mt-0.5 text-xs text-muted">
                وضعیت فعلی حساب کاربری شما
              </p>
            </div>
          </div>

          <StatusBadge
            config={statusConfig}
            variant="soft"
            size="md"
            showIcon
          />
        </div>
      </Card>
    </div>
  );
}
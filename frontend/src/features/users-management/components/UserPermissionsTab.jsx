import { useState, useEffect, useMemo } from "react";
import { Crown, ShieldCheck } from "lucide-react";

import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { getRoleConfig } from "@/constants/roleConfig";
import { PERMISSION_CATEGORIES } from "@/features/users-management/config";

/**
 * UserPermissionsTab — نمایش دسترسی‌های کاربر در تب «دسترسی‌ها»
 * از جزئیات کاربر، گروه‌بندی‌شده بر اساس دسته‌های
 * PERMISSION_CATEGORIES.
 *
 * دسترسی‌های کاربر = دسترسی‌های نقش(های) او (RoleSerializer.codenames)
 * + دسترسی‌های مستقیم (UserSerializer.user_permissions به شکل id،
 * که با کاتالوگ /api/accounts/permissions/ به codename نگاشت می‌شود).
 *
 * برای هر دسته فقط اکشن‌های دارای دسترسی نمایش داده می‌شود
 * (مشاهده / افزودن / ویرایش / حذف / ...).
 */

const ACTION_LABELS = {
  view: "مشاهده",
  add: "افزودن",
  change: "ویرایش",
  delete: "حذف",
  review: "بررسی",
  promote: "ارتقا",
};

const actionLabel = (codename) => {
  const action = codename.split("_")[0];
  return ACTION_LABELS[action] ?? action;
};

export default function UserPermissionsTab({ user }) {
  const [idToCodename, setIdToCodename] = useState(null);

  const rolePalette = useMemo(
    () => getRoleConfig(user?.role?.[0]?.name),
    [user],
  );

  useEffect(() => {
    let cancelled = false;

    const fetchCatalog = async () => {
      try {
        const res = await api.get(
          API_ENDPOINTS.ACCOUNTS.PERMISSIONS.LIST.url,
        );
        const data = res?.data ?? res ?? {};

        const map = {};
        Object.values(data).forEach((perms) => {
          (Array.isArray(perms) ? perms : []).forEach((perm) => {
            if (perm?.codename && perm?.id != null) {
              map[perm.id] = perm.codename;
            }
          });
        });

        if (!cancelled) setIdToCodename(map);
      } catch {
        if (!cancelled) setIdToCodename({});
      }
    };

    fetchCatalog();

    return () => {
      cancelled = true;
    };
  }, []);

  const grantedCodenames = useMemo(() => {
    const set = new Set();

    // دسترسی‌های نقش‌ها (RoleSerializer → codename[])
    (user?.role || []).forEach((role) => {
      (role?.permissions || []).forEach((codename) => set.add(codename));
    });

    // دسترسی‌های مستقیم (user_permissions → id[])
    if (idToCodename) {
      (user?.user_permissions || []).forEach((id) => {
        const codename = idToCodename[id];
        if (codename) set.add(codename);
      });
    }

    return set;
  }, [user, idToCodename]);

  if (user?.is_owner) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
        <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center">
          <Crown className="w-6 h-6 text-violet-500" />
        </div>
        <p className="text-sm font-medium text-foreground">
          مالک آژانس به همه‌ی بخش‌ها دسترسی دارد
        </p>
        <p className="text-xs text-muted-foreground">
          برای مالک آژانس محدودیت دسترسی وجود ندارد.
        </p>
      </div>
    );
  }

  const loading = !idToCodename;

  const categoryCards = PERMISSION_CATEGORIES.map((category) => {
    const granted = category.codenames.filter((codename) =>
      grantedCodenames.has(codename),
    );
    return { ...category, granted };
  }).filter((category) => category.granted.length > 0);

  return (
    <div className="space-y-4" dir="rtl">
      {/* منبع دسترسی‌ها */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        {rolePalette && rolePalette.key !== "default" ? (
          <span>
            دسترسی‌های نقش{" "}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${rolePalette.soft}`}
            >
              {rolePalette.label}
            </span>{" "}
            + دسترسی‌های مستقیم
          </span>
        ) : (
          <span>دسترسی‌های نقش + دسترسی‌های مستقیم</span>
        )}
      </div>

      {loading ? (
        <div className="rounded-xl border border-border bg-surface px-3 py-3 text-sm text-muted">
          در حال بارگذاری دسترسی‌ها...
        </div>
      ) : categoryCards.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <ShieldCheck className="w-8 h-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            هیچ دسترسی‌ای برای این کاربر ثبت نشده است
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categoryCards.map((category) => (
            <div
              key={category.key}
              className="rounded-xl border border-border bg-surface p-3"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm font-medium text-foreground">
                  {category.label}
                </span>
                <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full">
                  {category.granted.length} از {category.codenames.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {category.granted.map((codename) => (
                  <span
                    key={codename}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${rolePalette.soft}`}
                  >
                    {actionLabel(codename)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

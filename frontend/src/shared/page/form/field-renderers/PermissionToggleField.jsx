import { useState, useEffect, useMemo, useCallback } from "react";
import { Controller, useWatch } from "react-hook-form";
import {
  Building2,
  ListChecks,
  Users,
  Megaphone,
  MapPin,
  Map,
  UserCog,
  Shield,
  Building,
  Download,
  History,
  Handshake,
  FileSignature,
  Wallet,
  Check,
} from "lucide-react";

import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { getRoleConfig } from "@/constants/roleConfig";
import { getSpanClass } from "../utils/getSpanClass";

/**
 * PermissionToggleField — انتخاب دسترسی‌ها بر اساس «دسته».
 *
 * مقدار فیلد آرایه‌ای از id پرمیشن‌های جنگو است (همان چیزی که
 * UserCreateSerializer / UserUpdateSerializer انتظار دارد)، پس
 * روشن/خاموش کردن هر دسته، id های پرمیشن‌های آن دسته را به مقدار
 * اضافه یا از آن حذف می‌کند.
 *
 * دسته‌ها و codename هایشان از field.categories می‌آید
 * (پرمیشن‌های واقعی با id از field.asyncSource دریافت می‌شود).
 *
 * رنگ دسته‌های فعال از پالت رول انتخاب‌شده‌ی فرم (فیلد field.roleField،
 * پیش‌فرض "role") گرفته می‌شود — همان رنگی که RoleBadge همان رول دارد.
 *
 * حالت‌های هر دسته:
 *   off     → هیچ‌کدام از پرمیشن‌های دسته انتخاب نشده
 *   partial → بخشی انتخاب شده (حلقه‌ی رنگی)
 *   on      → همه انتخاب شده‌اند
 *
 * کلیک روی دسته: off/partial → on، on → off
 */

const CATEGORY_ICONS = {
  Building2,
  ListChecks,
  Users,
  Megaphone,
  MapPin,
  Map,
  UserCog,
  Shield,
  Building,
  Download,
  History,
  Handshake,
  FileSignature,
  Wallet,
};

export default function PermissionToggleField({
  field,
  control,
  errors,
  isDisabled,
  labelWithStar,
}) {
  const name = field.key;
  const error = errors[name]?.message;
  const spanClass = getSpanClass(field.span);

  // ─── Role color (از رول انتخاب‌شده‌ی فرم) ───
  const roleValue = useWatch({
    control,
    name: field.roleField || "role",
  });

  const [roleNameById, setRoleNameById] = useState({});

  useEffect(() => {
    let cancelled = false;

    const fetchRoles = async () => {
      try {
        const res = await api.get(API_ENDPOINTS.ACCOUNTS.ROLES.LIST.url);
        const data = res?.data ?? res;
        const list = Array.isArray(data) ? data : data?.results || [];

        const map = {};
        list.forEach((role) => {
          if (role?.id != null) map[String(role.id)] = role.name;
        });

        if (!cancelled) setRoleNameById(map);
      } catch {
        if (!cancelled) setRoleNameById({});
      }
    };

    fetchRoles();

    return () => {
      cancelled = true;
    };
  }, []);

  const rolePalette = useMemo(() => {
    const roleName =
      roleNameById[String(roleValue)] ??
      (typeof roleValue === "string" ? roleValue : null);

    return roleName ? getRoleConfig(roleName) : null;
  }, [roleValue, roleNameById]);

  const categories = useMemo(
    () => (field.categories || []).filter((c) => c.codenames?.length),
    [field.categories],
  );

  // ─── Fetch permission catalog (codename → id) ───
  const [idByCodename, setIdByCodename] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchCatalog = async () => {
      if (!field.asyncSource) {
        setIdByCodename({});
        return;
      }

      setLoading(true);
      try {
        const res = await api.get(field.asyncSource);
        const data = res?.data ?? res ?? {};

        const map = {};
        Object.values(data).forEach((perms) => {
          (Array.isArray(perms) ? perms : []).forEach((perm) => {
            if (perm?.codename && perm?.id != null) {
              map[perm.codename] = perm.id;
            }
          });
        });

        if (!cancelled) setIdByCodename(map);
      } catch {
        if (!cancelled) setIdByCodename({});
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCatalog();

    return () => {
      cancelled = true;
    };
  }, [field.asyncSource]);

  // codename های هر دسته → id های پرمیشن‌های واقعی همان دسته
  const categoryIds = useMemo(() => {
    if (!idByCodename) return [];

    return categories
      .map((category) => ({
        ...category,
        ids: category.codenames
          .map((codename) => idByCodename[codename])
          .filter((id) => id != null),
      }))
      .filter((category) => category.ids.length > 0);
  }, [categories, idByCodename]);

  const allIds = useMemo(
    () => categoryIds.flatMap((category) => category.ids),
    [categoryIds],
  );

  const toggleCategory = useCallback(
    (category, currentIds, onChange) => {
      const selected = new Set(currentIds);
      const isFullySelected = category.ids.every((id) => selected.has(id));

      if (isFullySelected) {
        category.ids.forEach((id) => selected.delete(id));
      } else {
        category.ids.forEach((id) => selected.add(id));
      }

      // ترتیب پایدار بر اساس allIds تا مقدار فرم قابل مقایسه بماند
      onChange(allIds.filter((id) => selected.has(id)));
    },
    [allIds],
  );

  const toggleAll = useCallback(
    (currentIds, onChange) => {
      const isEverythingSelected =
        allIds.length > 0 && allIds.every((id) => currentIds.includes(id));

      onChange(isEverythingSelected ? [] : allIds);
    },
    [allIds],
  );

  const getSelectionState = (category, currentIds) => {
    const selectedCount = category.ids.filter((id) =>
      currentIds.includes(id),
    ).length;

    if (selectedCount === 0) return "off";
    if (selectedCount === category.ids.length) return "on";
    return "partial";
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => {
        const currentIds = Array.isArray(value) ? value : [];
        const selectedCategoriesCount = categoryIds.filter(
          (category) => getSelectionState(category, currentIds) !== "off",
        ).length;
        const isEverythingSelected =
          allIds.length > 0 &&
          allIds.every((id) => currentIds.includes(id));

        return (
          <div className={spanClass}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">
                {labelWithStar}
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">
                  {selectedCategoriesCount} از {categoryIds.length} دسته فعال
                </span>
                <button
                  type="button"
                  onClick={() => toggleAll(currentIds, onChange)}
                  disabled={isDisabled || loading || !allIds.length}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                    isEverythingSelected
                      ? "bg-surface text-muted-foreground border border-border hover:bg-background"
                      : rolePalette
                        ? rolePalette.soft
                        : "bg-primary/10 text-primary hover:bg-primary/20"
                  }`}
                >
                  {isEverythingSelected ? "حذف همه" : "انتخاب همه"}
                </button>
              </div>
            </div>

            {loading || !idByCodename ? (
              <div className="rounded-xl border border-border bg-surface px-3 py-3 text-sm text-muted">
                در حال بارگذاری دسترسی‌ها...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categoryIds.map((category) => {
                  const state = getSelectionState(category, currentIds);
                  const Icon = CATEGORY_ICONS[category.icon];

                  // رنگ حالت فعال از پالت رول انتخاب‌شده؛
                  // تا وقتی رولی انتخاب نشده از رنگ primary استفاده می‌شود.
                  const stateClasses =
                    state === "on"
                      ? rolePalette
                        ? `${rolePalette.solid} border-transparent`
                        : "bg-primary text-white border-primary"
                      : state === "partial"
                        ? rolePalette
                          ? `${rolePalette.soft} ring-1 ring-current`
                          : "bg-primary/5 text-primary border-primary"
                        : "bg-surface text-foreground border-border";

                  return (
                    <button
                      key={category.key}
                      type="button"
                      disabled={isDisabled}
                      onClick={() =>
                        toggleCategory(category, currentIds, onChange)
                      }
                      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm text-right transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${stateClasses}`}
                    >
                      {Icon && (
                        <Icon className="w-4 h-4 shrink-0 opacity-80" />
                      )}

                      <span className="flex-1">{category.label}</span>

                      {state === "on" && (
                        <Check className="w-4 h-4 shrink-0" />
                      )}
                      {state === "partial" && (
                        <span className="h-1.5 w-1.5 rounded-full bg-current shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {error && (
              <p className="text-xs text-danger mt-1.5">{error}</p>
            )}
          </div>
        );
      }}
    />
  );
}

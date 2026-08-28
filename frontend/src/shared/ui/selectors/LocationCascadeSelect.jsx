import { useCallback, useEffect, useMemo, useState } from "react";
import Select from "@/shared/ui/selectors/Select";
import SearchSelect from "@/shared/ui/selectors/SearchSelect";
import locationService from "@/features/location-management/services/locationService";
import { LOCATION_LIST_URL , LOCATION_CASCADE_FIELDS } from "@/constants/locationCascade";

/**
 * LocationCascadeSelect
 * ─────────────────────
 * Controlled cascade: Province → City → District → Neighborhood [→ Address]
 *
 * value shape:
 *   {
 *     province?: number | null,
 *     city?: number | null,
 *     district?: number | null,
 *     neighborhood?: number | null,
 *     address?: number | null,   // only when includeAddress
 *   }
 *
 * onChange(nextValue) — always full object; lower levels cleared when parent changes.
 *
 * Props:
 *   value, onChange
 *   levels?: string[]          default ['province','city','district','neighborhood']
 *   includeAddress?: boolean   append address search_select (default false)
 *   size?: 'sm' | 'md' | 'lg'
 *   disabled?: boolean
 *   className?: string
 *   labels?: partial override
 *   clearable?: boolean        default true
 *   required?: boolean         visual only (star on first required level)
 *   layout?: 'grid' | 'stack'  default 'grid' (2 cols on md+)
 */


const EMPTY = {
  province: null,
  city: null,
  district: null,
  neighborhood: null,
  address: null,
};

function toOptions(list) {
  return (list || []).map((item) => ({
    value: item.id,
    label: item.name || item.full_text || String(item.id),
  }));
}

export default function LocationCascadeSelect({
  value = {},
  onChange,
  levels = ["province", "city", "district", "neighborhood"],
  includeAddress = false,
  size = "sm",
  disabled = false,
  className = "",
  clearable = true,
  layout = "grid",
}) {
  const activeLevels = useMemo(() => {
    const base = levels.filter((l) =>
      ["province", "city", "district", "neighborhood"].includes(l),
    );
    if (includeAddress && !base.includes("address")) base.push("address");
    return base;
  }, [levels, includeAddress]);

  const [lists, setLists] = useState({
    provinces: [],
    cities: [],
    districts: [],
    neighborhoods: [],
  });
  const [loading, setLoading] = useState(true);

  // Load all lists once (backend has no parent filter yet → client cascade)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [p, c, d, n] = await Promise.all([
          locationService.getProvinces(),
          locationService.getCities(),
          locationService.getDistricts(),
          locationService.getNeighborhoods(),
        ]);
        if (cancelled) return;
        setLists({
          provinces: locationService.unwrapList(p),
          cities: locationService.unwrapList(c),
          districts: locationService.unwrapList(d),
          neighborhoods: locationService.unwrapList(n),
        });
      } catch {
        if (!cancelled) {
          setLists({
            provinces: [],
            cities: [],
            districts: [],
            neighborhoods: [],
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const current = useMemo(
    () => ({
      ...EMPTY,
      ...value,
    }),
    [value],
  );

  const emit = useCallback(
    (patch) => {
      const next = { ...current, ...patch };
      onChange?.(next);
    },
    [current, onChange],
  );

  // Filtered options per level
  const provinceOptions = useMemo(
    () => toOptions(lists.provinces),
    [lists.provinces],
  );

  const cityOptions = useMemo(() => {
    if (!activeLevels.includes("city")) return [];
    const filtered = locationService.filterCitiesByProvince(
      lists.cities,
      current.province,
    );
    // Fallback: if province filter yields nothing but province is set,
    // city serializer may only expose province as name — show all cities
    // only when no province selected; when selected and empty, keep empty
    // unless cities lack numeric province entirely (then show all).
    if (
      current.province &&
      filtered.length === 0 &&
      lists.cities.length > 0 &&
      !lists.cities.some((c) => c.province != null || c.province_id != null)
    ) {
      return toOptions(lists.cities);
    }
    return toOptions(filtered);
  }, [lists.cities, current.province, activeLevels]);

  const districtOptions = useMemo(() => {
    if (!activeLevels.includes("district")) return [];
    return toOptions(
      locationService.filterDistrictsByCity(lists.districts, current.city),
    );
  }, [lists.districts, current.city, activeLevels]);

  const neighborhoodOptions = useMemo(() => {
    if (!activeLevels.includes("neighborhood")) return [];
    return toOptions(
      locationService.filterNeighborhoodsByDistrict(
        lists.neighborhoods,
        current.district,
      ),
    );
  }, [lists.neighborhoods, current.district, activeLevels]);

  const handleProvince = (v) => {
    const id = v === "" || v == null ? null : Number(v);
    emit({
      province: id,
      city: null,
      district: null,
      neighborhood: null,
      address: null,
    });
  };

  const handleCity = (v) => {
    const id = v === "" || v == null ? null : Number(v);
    emit({
      city: id,
      district: null,
      neighborhood: null,
      address: null,
    });
  };

  const handleDistrict = (v) => {
    const id = v === "" || v == null ? null : Number(v);
    emit({
      district: id,
      neighborhood: null,
      address: null,
    });
  };

  const handleNeighborhood = (v) => {
    const id = v === "" || v == null ? null : Number(v);
    emit({
      neighborhood: id,
      address: null,
    });
  };

  const handleAddress = (v) => {
    const id = v === "" || v == null ? null : Number(v);
    emit({ address: id });
  };

  const gridClass =
    layout === "stack"
      ? "flex flex-col gap-3"
      : "grid grid-cols-1 sm:grid-cols-2 gap-3";

  const selectDisabled = disabled || loading;

  return (
    <div className={`${gridClass} ${className}`}>
      {activeLevels.includes("province") && (
        <Select
          label={LOCATION_CASCADE_FIELDS.province.label}
          options={provinceOptions}
          value={current.province ?? ""}
          onChange={handleProvince}
          placeholder={LOCATION_CASCADE_FIELDS.province.label}
          clearable={clearable}
          disabled={selectDisabled}
          size={size}
          searchable
        />
      )}
{/* 
     TODO: make sure that cascade address is ok between back-front
      {activeLevels.includes("city") && (
        <Select
          label={LOCATION_CASCADE_FIELDS.city.label}
          options={cityOptions}
          value={current.city ?? ""}
          onChange={handleCity}
          placeholder={
            current.province ? LOCATION_CASCADE_FIELDS.city.label : " "
          }
          clearable={clearable}
          disabled={selectDisabled || !current.province}
          size={size}
          searchable
        />
      )}

      {activeLevels.includes("district") && (
        <Select
          label={LOCATION_CASCADE_FIELDS.district.label}
          options={districtOptions}
          value={current.district ?? ""}
          onChange={handleDistrict}
          placeholder={
            current.city ? LOCATION_CASCADE_FIELDS.district.label : " "
          }
          clearable={clearable}
          disabled={selectDisabled || !current.city}
          size={size}
          searchable
        />
      )}

      {activeLevels.includes("neighborhood") && (
        <Select
          label={LOCATION_CASCADE_FIELDS.neighborhood.label}
          options={neighborhoodOptions}
          value={current.neighborhood ?? ""}
          onChange={handleNeighborhood}
          placeholder={
            current.district
              ? LOCATION_CASCADE_FIELDS.neighborhood.label
              : " "
          }
          clearable={clearable}
          disabled={selectDisabled || !current.district}
          size={size}
          searchable
        />
      )} */}

      {activeLevels.includes("address") && (
        <div className="sm:col-span-2">
          <SearchSelect
            label={LOCATION_CASCADE_FIELDS.address.label}
            value={current.address ?? null}
            onChange={handleAddress}
            endpoint={LOCATION_LIST_URL.addresses}
            optionLabel="full_text"
            optionValue="id"
            placeholder={
              current.neighborhood
                ? "جستجوی آدرس..."
                : "اختیاری — جستجوی آدرس ثبت‌شده"
            }
            clearable={clearable}
            disabled={selectDisabled}
            size={size}
          />
        </div>
      )}
    </div>
  );
}

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { PROPERTY_FORM } from "@/features/properties/config";
import propertyService from "@/features/properties/services/propertyService";
import OwnerFormModal from "@/features/owners/components/OwnerFormModal";
import useAuth from "@/features/auth/hooks/useAuth";
import { toastService } from "@/lib/toast";
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { findDivarNeighborhood } from "@/utils/locationMapping";

/**
 * Resolve DivarNeighborhood from CRM Neighborhood + City.
 * Fetches active DivarNeighborhoods, then delegates to findDivarNeighborhood.
 */
async function resolveDivarNeighborhood(cityId, neighborhoodName) {
  if (!cityId || !neighborhoodName) return null;

  const res = await api.get(
    API_ENDPOINTS.LOCATIONS.DIVAR_NEIGHBORHOODS.LIST.url,
  );
  const data = res?.data;
  const list = Array.isArray(data) ? data : (data?.results ?? []);

  return findDivarNeighborhood(list, cityId, neighborhoodName);
}

export default function PropertyFormModal({
  isOpen,
  onClose,
  property = null,
  onSuccess,
}) {
  const isEdit = !!property?.id;
  const { user } = useAuth();
  const isOperator = !user?.is_owner;
  const [loading, setLoading] = useState(false);
  const [showOwnerForm, setShowOwnerForm] = useState(false);
  const [ownerFormKey, setOwnerFormKey] = useState(0);
  const [propertyFeatures, setPropertyFeatures] = useState([]);
  const [editReady, setEditReady] = useState(!isEdit);
  const [originalAddress, setOriginalAddress] = useState(null);

  // ─── Mapping: deal_type_scope → default deal_type برای فرم Create/Edit ───
  const DEAL_TYPE_SCOPE_MAP = {
    "rent-residential": "rent-residential",
    "buy-residential": "buy-residential",
    "buy-commercial-property": "buy-commercial-property",
    "rent-commercial-property": "rent-commercial-property",
  };

  // default deal_type بر اساس scope کاربر (برای حالت create)
  const defaultDealType = user?.deal_type_scope
    ? (DEAL_TYPE_SCOPE_MAP[user.deal_type_scope] ?? "buy-residential")
    : "buy-residential";

  // For create mode, always ready. For edit, wait for data.
  useEffect(() => {
    if (!isEdit) {
      setEditReady(true);
      setPropertyFeatures([]);
      return;
    }

    setEditReady(false);
    let cancelled = false;

    const loadEditData = async () => {
      try {
        const features = await propertyService
          .getPropertyFeatures(property.id)
          .catch(() => []);
        if (cancelled) return;
        setPropertyFeatures(Array.isArray(features) ? features : []);
        // Capture original address for edit mode comparison
        if (property?.address) {
          setOriginalAddress({
            id: property.address.id,
            neighborhood: property.address.neighborhood,
            street: property.address.street || "",
            alley: property.address.alley || "",
            plaque: property.address.plaque || "",
            unit: property.address.unit || "",
            postal_code: property.address.postal_code || "",
            full_text: property.address.full_text || "",
          });
        }
        setEditReady(true);
      } catch {
        if (!cancelled) setEditReady(true);
      }
    };

    loadEditData();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, property?.id]);

  // ─── Price auto-calc: sale_price = area × price_per_meter ───
  // Only triggers when area or price_per_meter changes; manual sale_price edits are preserved.
  const formApiRef = useRef(null);
  const prevCalcRef = useRef({ area: null, price_per_meter: null });
  const didInitCalcRef = useRef(false);

  const handleCalcValuesChange = useCallback((values) => {
    if (!formApiRef.current) return;
    const { setValue, getValues } = formApiRef.current;

    // Skip first call to avoid overwriting initial/default values
    if (!didInitCalcRef.current) {
      didInitCalcRef.current = true;
      prevCalcRef.current = {
        area: values.area,
        price_per_meter: values.price_per_meter,
      };
      return;
    }

    const prevArea = prevCalcRef.current.area;
    const prevPpm = prevCalcRef.current.price_per_meter;
    const curArea = values.area;
    const curPpm = values.price_per_meter;

    // Update tracked values for next comparison
    prevCalcRef.current = { area: curArea, price_per_meter: curPpm };

    // Only compute for sale deals
    if (!values.deal_type?.includes("buy")) return;

    // Only compute if area or price_per_meter actually changed
    if (curArea === prevArea && curPpm === prevPpm) return;

    // Only compute when both values are valid positive numbers
    const areaNum = Number(curArea);
    const ppmNum = Number(curPpm);
    if (!areaNum || areaNum <= 0 || !ppmNum || ppmNum <= 0) return;

    const newSalePrice = Math.round(areaNum * ppmNum);
    const currentSalePrice = getValues("sale_price");
    if (newSalePrice !== currentSalePrice) {
      setValue("sale_price", newSalePrice, { shouldValidate: false });
    }
  }, []);

  const formConfig = useMemo(() => {
    if (!PROPERTY_FORM) return PROPERTY_FORM;
    const ownerName = isEdit
      ? typeof property?.owner === "object"
        ? property.owner.full_name
        : property?.owner || "—"
      : undefined;
    const agentName = isEdit
      ? typeof property?.agent === "object"
        ? property.agent.full_name
        : property?.agent || "—"
      : undefined;
    return {
      ...PROPERTY_FORM,
      tabs: (PROPERTY_FORM.tabs || []).map((tab) => ({
        ...tab,
        fields: (tab.fields || []).map((f) => {
          if (f.key === "owner") {
            if (isEdit) {
              return {
                ...f,
                type: "text",
                readOnly: true,
                defaultValue: ownerName,
                addAction: undefined,
              };
            }
            return {
              ...f,
              addAction: () => setShowOwnerForm(true),
              addActionLabel: "مالک جدید",
            };
          }
          if (f.key === "agent") {
            if (isEdit) {
              return {
                ...f,
                type: "text",
                readOnly: true,
                defaultValue: agentName,
              };
            }
            if (isOperator) {
              return {
                ...f,
                type: "text",
                readOnly: true,
                defaultValue: user?.full_name || "",
              };
            }
          }
          if (f.key === "property_type" && isEdit) {
            return {
              ...f,
              type: "text",
              readOnly: true,
              defaultValue: property?.property_type || "—",
            };
          }
          if (f.key === "deal_type") {
            // deal_type بر اساس scope کاربر تنظیم می‌شود و disabled است
            // نکته: disabled باعث حذف فیلد از payload نمیشود - but verify FormRenderer behavior
            // If FormRenderer strips disabled fields, use readOnly instead: fieldProps: { readOnly: true }
            return {
              ...f,
              type: "select",
              readOnly: true,
              disabled: true,
              defaultValue: defaultDealType,
            };
          }
          return f;
        }),
      })),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, property?.owner, property?.agent, property?.deal_type]);

  const defaultValues = useMemo(() => {
    if (!isEdit) {
      // For create mode, default deal_type from user's scope mapping
      return {
        deal_type: defaultDealType,
      };
    }
    // Flatten agent to string if it's an object
    const agentName =
      typeof property?.agent === "object"
        ? property.agent.full_name
        : property?.agent || "";
    return {
      // Basic info
      property_code: property?.property_code || "",
      title: property?.title || "",
      deal_type: property?.deal_type || defaultDealType,
      status: property?.status || "available",
      property_type: property?.property_type || "",
      owner:
        typeof property?.owner === "object"
          ? property.owner.full_name
          : property?.owner || "",
      agent: agentName,
      description: property?.description || "",
      // Location — resolve cascade from property's address
      location: property?.address
        ? {
            province: property.address.province || null,
            city: property.address.city || null,
            district: property.address.district || null,
            neighborhood: property.address.neighborhood || null,
          }
        : {},
      address_text: property?.address?.full_text || "",
      street: property?.address?.street || "",
      alley: property?.address?.alley || "",
      plaque: property?.address?.plaque || "",
      unit: property?.address?.unit || "",
      postal_code: property?.address?.postal_code || "",
      // Specs
      area: property?.area ?? null,
      age: property?.age ?? null,
      bedrooms: property?.bedrooms ?? null,
      bathrooms: property?.bathrooms ?? null,
      floor: property?.floor ?? null,
      total_floors: property?.total_floors ?? null,
      parking_count: property?.parking_count ?? null,
      storage_count: property?.storage_count ?? null,
      orientation: property?.orientation || "",
      condition: property?.condition || "",
      // Price
      sale_price: property?.sale_price ?? null,
      deposit_amount: property?.deposit_amount ?? null,
      mortgage_amount: property?.mortgage_amount ?? null,
      monthly_rent: property?.monthly_rent ?? null,
      price_per_meter: property?.price_per_meter ?? null,
      // Features — ensure all are numbers for multi_select matching
      features: Array.isArray(propertyFeatures)
        ? [
            ...new Set(
              propertyFeatures.map((f) => Number(f.feature_id)).filter(Boolean),
            ),
          ]
        : [],
    };
  }, [isEdit, property, propertyFeatures, defaultDealType]);

  const handleOwnerCreated = () => {
    setShowOwnerForm(false);
    setOwnerFormKey((k) => k + 1);
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data };

      // For operators, auto-set agent to current user
      if (isOperator && !isEdit) {
        payload.agent = user?.id;
      }

      // In edit mode, remove read-only fields that are strings (not FK IDs)
      if (isEdit) {
        delete payload.owner;
        delete payload.agent;
        delete payload.property_code;
      }

      // ─── Location cascade → Address + DivarNeighborhood ───
      const locationData =
        payload.location && typeof payload.location === "object"
          ? payload.location
          : {};
      const addressText = payload.address_text || "";
      // Capture address detail fields BEFORE deleting from payload
      const addrStreet = payload.street || "";
      const addrAlley = payload.alley || "";
      const addrPlaque = payload.plaque || "";
      const addrUnit = payload.unit || "";
      const addrPostalCode = payload.postal_code || "";
      delete payload.location;
      delete payload.address_text;
      delete payload.street;
      delete payload.alley;
      delete payload.plaque;
      delete payload.unit;
      delete payload.postal_code;
      delete payload.city;
      delete payload.zone;
      delete payload.divar_neighborhood;

      const neighborhoodId = locationData.neighborhood || null;
      const cityId = locationData.city || null;

      // 1) Address handling
      let addressId = null;
      if (neighborhoodId) {
        // In edit mode, check if address fields changed
        if (isEdit && originalAddress) {
          const addrChanged =
            Number(originalAddress.neighborhood) !== Number(neighborhoodId) ||
            (originalAddress.street || "") !== addrStreet ||
            (originalAddress.alley || "") !== addrAlley ||
            (originalAddress.plaque || "") !== addrPlaque ||
            (originalAddress.unit || "") !== addrUnit ||
            (originalAddress.postal_code || "") !== addrPostalCode;
          if (!addrChanged) {
            // Address unchanged, reuse existing
            addressId = originalAddress.id;
          }
        }
        // Only create new address if we don't have one yet
        if (!addressId) {
          try {
            const addrRes = await api.post(
              API_ENDPOINTS.LOCATIONS.ADDRESSES.CREATE.url,
              {
                neighborhood: neighborhoodId,
                street: addrStreet,
                alley: addrAlley,
                plaque: addrPlaque,
                unit: addrUnit,
                postal_code: addrPostalCode,
                full_text: addressText,
              },
            );
            // Response: { message, address: { id, ... } }
            const addrData = addrRes?.data ?? addrRes;
            addressId = addrData?.address?.id ?? addrData?.id ?? null;
          } catch (addrErr) {
            // If address already exists (duplicate), try to find it
            // Backend AddressCreateSerializer.validate checks all fields:
            //   neighborhood + street + alley + plaque + unit + postal_code + full_text
            const existingMsg = addrErr?.response?.data?.detail || "";
            if (
              typeof existingMsg === "string" &&
              existingMsg.includes("قبلاً ثبت شده")
            ) {
              const searchRes = await api.get(
                API_ENDPOINTS.LOCATIONS.ADDRESSES.LIST.url,
              );
              const addrList = Array.isArray(searchRes?.data)
                ? searchRes.data
                : (searchRes?.data?.results ?? []);
              const match = addrList.find(
                (a) =>
                  Number(a.neighborhood) === Number(neighborhoodId) &&
                  (a.street || "") === (addrStreet || "") &&
                  (a.alley || "") === addrAlley &&
                  (a.plaque || "") === addrPlaque &&
                  (a.unit || "") === addrUnit &&
                  (a.postal_code || "") === addrPostalCode &&
                  (a.full_text || "") === addressText,
              );
              if (match) {
                addressId = match.id;
              } else {
                throw addrErr;
              }
            } else {
              throw addrErr;
            }
          }
        } // close if (!addressId)
      }
      payload.address = addressId;

      // 2) Resolve CRM Neighborhood → DivarNeighborhood
      // LocationCascadeSelect doesn't expose names, so we fetch the CRM
      // neighborhood list to get the name, then match against DivarNeighborhoods.
      let divarNeighborhoodId = null;
      if (neighborhoodId && cityId) {
        try {
          const nRes = await api.get(
            API_ENDPOINTS.LOCATIONS.NEIGHBORHOODS.LIST.url,
          );
          const nList = Array.isArray(nRes?.data)
            ? nRes.data
            : (nRes?.data?.results ?? []);
          const nObj = nList.find(
            (n) => Number(n.id) === Number(neighborhoodId),
          );
          if (nObj) {
            const resolved = await resolveDivarNeighborhood(cityId, nObj.name);
            divarNeighborhoodId = resolved?.id ?? null;
          }
        } catch (resolveErr) {
          toastService.error(
            resolveErr.message || "خطا در resolve محله دیوار.",
          );
          setLoading(false);
          return;
        }
      }
      payload.divar_neighborhood = divarNeighborhoodId;

      // ─── Feature ids ───
      const featureIds = payload.features || [];
      delete payload.features;

      // ─── Price fields: nullable on backend (allow_null=True) ───
      const priceFields = [
        "sale_price",
        "deposit_amount",
        "mortgage_amount",
        "monthly_rent",
        "price_per_meter",
      ];
      for (const key of priceFields) {
        if (
          payload[key] !== null &&
          payload[key] !== undefined &&
          payload[key] !== ""
        ) {
          payload[key] = parseInt(payload[key], 10) || null;
        } else {
          payload[key] = null;
        }
      }

      // ─── Required numeric: area (no default, no null) ───
      if (
        payload.area !== null &&
        payload.area !== undefined &&
        payload.area !== ""
      ) {
        payload.area = parseInt(payload.area, 10) || 0;
      } else {
        payload.area = 0;
      }

      // ─── Nullable numeric: floor, total_floors (null=True on model) ───
      for (const key of ["floor", "total_floors"]) {
        if (
          payload[key] !== null &&
          payload[key] !== undefined &&
          payload[key] !== ""
        ) {
          payload[key] = parseInt(payload[key], 10) || null;
        } else {
          payload[key] = null;
        }
      }

      // ─── Default-0 numeric: age, bedrooms, bathrooms, parking_count, storage_count
      // Backend has default=0 but no null=True. Sending null causes validation error.
      // If empty/null, DELETE from payload so backend uses its default value. ───
      const defaultZeroFields = [
        "age",
        "bedrooms",
        "bathrooms",
        "parking_count",
        "storage_count",
      ];
      for (const key of defaultZeroFields) {
        if (
          payload[key] !== null &&
          payload[key] !== undefined &&
          payload[key] !== ""
        ) {
          payload[key] = parseInt(payload[key], 10) || 0;
        } else {
          delete payload[key];
        }
      }

      let propertyId;
      if (isEdit) {
        await propertyService.update(property.id, payload);
        propertyId = property.id;
        toastService.success("ملک با موفقیت ویرایش شد.");
      } else {
        const res = await propertyService.create(payload);
        propertyId = res?.data?.id ?? res?.id;
        toastService.success("ملک جدید با موفقیت ثبت شد.");
      }

      // Sync property features if we have a property id
      if (propertyId && featureIds.length >= 0) {
        try {
          const existing =
            await propertyService.getPropertyFeatures(propertyId);
          const existingFeatureIds = existing.map((pf) =>
            Number(pf.feature_id),
          );
          const newFeatureIds = featureIds.map(Number);

          // Remove features that were deselected
          const toRemove = existing
            .filter((pf) => !newFeatureIds.includes(Number(pf.feature_id)))
            .map((pf) => pf.id);
          if (toRemove.length > 0) {
            await propertyService.removePropertyFeatures(toRemove);
          }

          // Add newly selected features
          const toAdd = newFeatureIds.filter(
            (fid) => !existingFeatureIds.includes(fid),
          );
          for (const fid of toAdd) {
            await propertyService.addPropertyFeature(propertyId, fid);
          }
        } catch (featErr) {
          console.error("Feature sync error:", featErr);
        }
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      const errData = error?.response?.data;
      let msg = "خطا در ذخیره ملک.";

      const FIELD_LABELS = {
        owner: "مالک",
        agent: "مشاور",
        address: "آدرس",
        deal_type: "نوع معامله",
        title: "عنوان ملک",
        area: "متراژ",
        status: "وضعیت",
        neighborhood: "محله",
        street: "خیابان",
        alley: "کوچه",
        plaque: "پلاک",
        unit: "واحد",
        postal_code: "کد پستی",
        sale_price: "قیمت فروش",
        deposit_amount: "ودیعه",
        mortgage_amount: "مبلغ رهن",
        monthly_rent: "اجاره ماهانه",
        price_per_meter: "قیمت هر متر",
      };

      const collectErrors = (obj, prefix) => {
        const messages = [];
        for (const [key, val] of Object.entries(obj || {})) {
          const label = FIELD_LABELS[key] || prefix || key;
          if (typeof val === "string") {
            messages.push(val);
          } else if (Array.isArray(val) && val.length > 0) {
            messages.push(label + ": " + val[0]);
          } else if (typeof val === "object" && val !== null) {
            messages.push(...collectErrors(val, label));
          }
        }
        return messages;
      };

      if (errData?.detail) {
        if (typeof errData.detail === "string") {
          msg = errData.detail;
        } else if (typeof errData.detail === "object") {
          const details = collectErrors(errData.detail, null);
          msg = details.length > 0 ? details.join("\n\n") : "خطا در ذخیره ملک.";
        }
      } else if (errData) {
        const allErrors = collectErrors(errData, null);

        if (allErrors.length > 0) {
          msg =
            allErrors.length === 1
              ? allErrors[0]
              : "\n\n" + allErrors.join("\n\n");
        }
      } else if (error?.message) {
        msg = error.message;
      }

      toastService.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        title={isEdit ? "ویرایش ملک" : "ثبت ملک جدید"}
      >
        {editReady ? (
          <FormRenderer
            key={`${ownerFormKey}-${property?.id || "new"}`}
            config={formConfig}
            defaultValues={defaultValues}
            mode={isEdit ? "edit" : "create"}
            onSubmit={handleSubmit}
            onCancel={onClose}
            loading={loading}
            onValidationError={(errs) => {
              const LABELS = {
                title: "عنوان ملک",
                deal_type: "نوع معامله",
                area: "متراژ",
                owner: "مالک",
                location: "موقعیت مکانی",
                status: "وضعیت",
              };
              const msgs = Object.entries(errs)
                .map(([k, e]) => {
                  const label = LABELS[k] || k;
                  const msg = e?.message || "الزامی است";
                  return `${label}: ${msg}`;
                })
                .filter(Boolean);
              if (msgs.length > 0) {
                toastService.error(msgs.join("\n"));
              }
            }}
            onFormApi={(api) => {
              formApiRef.current = api;
            }}
            onValuesChange={handleCalcValuesChange}
          />
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-(--role-primary)" />
          </div>
        )}
      </Modal>

      <OwnerFormModal
        isOpen={showOwnerForm}
        onClose={() => setShowOwnerForm(false)}
        onSuccess={handleOwnerCreated}
      />
    </>
  );
}

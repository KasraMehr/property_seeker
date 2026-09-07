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

  const res = await api.get(API_ENDPOINTS.LOCATIONS.DIVAR_NEIGHBORHOODS.LIST.url);
  const data = res?.data;
  const list = Array.isArray(data) ? data : data?.results ?? [];

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
        const features = await propertyService.getPropertyFeatures(property.id).catch(() => []);
        if (cancelled) return;
        setPropertyFeatures(Array.isArray(features) ? features : []);
        setEditReady(true);
      } catch {
        if (!cancelled) setEditReady(true);
      }
    };

    loadEditData();
    return () => { cancelled = true; };
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
    if (values.deal_type !== "sale") return;

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
      ? (typeof property?.owner === "object" ? property.owner.full_name : (property?.owner || "—"))
      : undefined;
    const agentName = isEdit
      ? (typeof property?.agent === "object" ? property.agent.full_name : (property?.agent || "—"))
      : undefined;
    return {
      ...PROPERTY_FORM,
      tabs: (PROPERTY_FORM.tabs || []).map((tab) => ({
        ...tab,
        fields: (tab.fields || []).map((f) => {
          if (f.key === "owner") {
            if (isEdit) {
              return { ...f, type: "text", readOnly: true, defaultValue: ownerName, addAction: undefined };
            }
            return { ...f, addAction: () => setShowOwnerForm(true), addActionLabel: "مالک جدید" };
          }
          if (f.key === "agent") {
            if (isEdit) {
              return { ...f, type: "text", readOnly: true, defaultValue: agentName };
            }
            if (isOperator) {
              return { ...f, type: "text", readOnly: true, defaultValue: user?.full_name || "" };
            }
          }
          if (f.key === "property_type" && isEdit) {
            return { ...f, type: "text", readOnly: true, defaultValue: property?.property_type || "—" };
          }
          return f;
        }),
      })),
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, property?.owner, property?.agent, property?.deal_type]);

  const defaultValues = useMemo(() => {
    if (!isEdit) return {};
    // Flatten agent to string if it's an object
    const agentName = typeof property?.agent === "object"
      ? property.agent.full_name
      : (property?.agent || "");
    return {
      // Basic info
      property_code: property?.property_code || "",
      title: property?.title || "",
      deal_type: property?.deal_type || "sale",
      status: property?.status || "available",
      property_type: property?.property_type || "",
      owner: typeof property?.owner === "object" ? property.owner.full_name : (property?.owner || ""),
      agent: agentName,
      description: property?.description || "",
      // Location — resolve cascade from property's address
      location: property?.address ? {
        province: property.address.province || null,
        city: property.address.city || null,
        district: property.address.district || null,
        neighborhood: property.address.neighborhood || null,
      } : {},
      address_text: property?.address?.full_text || property?.address?.street || "",
      // Specs
      area: property?.area || "",
      age: property?.age ?? "",
      bedrooms: property?.bedrooms ?? "",
      bathrooms: property?.bathrooms ?? "",
      floor: property?.floor ?? "",
      total_floors: property?.total_floors ?? "",
      parking_count: property?.parking_count ?? "",
      storage_count: property?.storage_count ?? "",
      orientation: property?.orientation || "",
      condition: property?.condition || "",
      // Price
      sale_price: property?.sale_price || "",
      deposit_amount: property?.deposit_amount || "",
      mortgage_amount: property?.mortgage_amount || "",
      monthly_rent: property?.monthly_rent || "",
      price_per_meter: property?.price_per_meter || "",
      // Features — ensure all are numbers for multi_select matching
      features: Array.isArray(propertyFeatures)
        ? [...new Set(propertyFeatures.map((f) => Number(f.feature_id)).filter(Boolean))]
        : [],
    };
  }, [isEdit, property, propertyFeatures]);

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
      const locationData = payload.location && typeof payload.location === "object"
        ? payload.location
        : {};
      const addressText = payload.address_text || "";
      delete payload.location;
      delete payload.address_text;
      delete payload.city;
      delete payload.zone;
      delete payload.divar_neighborhood;

      const neighborhoodId = locationData.neighborhood || null;
      const cityId = locationData.city || null;

      // 1) Create Address if neighborhood is selected
      let addressId = null;
      if (neighborhoodId) {
        try {
          const addrRes = await api.post(API_ENDPOINTS.LOCATIONS.ADDRESSES.CREATE.url, {
            neighborhood: neighborhoodId,
            full_text: addressText,
            street: addressText,
          });
          // Response: { message, address: { id, ... } }
          const addrData = addrRes?.data ?? addrRes;
          addressId = addrData?.address?.id ?? addrData?.id ?? null;
        } catch (addrErr) {
          // If address already exists (duplicate), try to find it
          // Backend AddressCreateSerializer.validate checks:
          //   neighborhood + street + alley + plaque + unit
          // We only send neighborhood, street, full_text — so alley/plaque/unit
          // default to "". Match exactly on those 5 fields.
          const existingMsg = addrErr?.response?.data?.detail || "";
          if (typeof existingMsg === "string" && existingMsg.includes("قبلاً ثبت شده")) {
            const searchRes = await api.get(API_ENDPOINTS.LOCATIONS.ADDRESSES.LIST.url);
            const addrList = Array.isArray(searchRes?.data) ? searchRes.data : searchRes?.data?.results ?? [];
            const match = addrList.find(
              (a) =>
                Number(a.neighborhood) === Number(neighborhoodId) &&
                (a.street || "") === addressText &&
                (a.alley || "") === "" &&
                (a.plaque || "") === "" &&
                (a.unit || "") === "",
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
      }
      payload.address = addressId;

      // 2) Resolve CRM Neighborhood → DivarNeighborhood
      // LocationCascadeSelect doesn't expose names, so we fetch the CRM
      // neighborhood list to get the name, then match against DivarNeighborhoods.
      let divarNeighborhoodId = null;
      if (neighborhoodId && cityId) {
        try {
          const nRes = await api.get(API_ENDPOINTS.LOCATIONS.NEIGHBORHOODS.LIST.url);
          const nList = Array.isArray(nRes?.data) ? nRes.data : nRes?.data?.results ?? [];
          const nObj = nList.find((n) => Number(n.id) === Number(neighborhoodId));
          if (nObj) {
            const resolved = await resolveDivarNeighborhood(cityId, nObj.name);
            divarNeighborhoodId = resolved?.id ?? null;
          }
        } catch (resolveErr) {
          toastService.error(resolveErr.message || "خطا در resolve محله دیوار.");
          setLoading(false);
          return;
        }
      }
      payload.divar_neighborhood = divarNeighborhoodId;

      // ─── Feature ids ───
      const featureIds = payload.features || [];
      delete payload.features;

      // Convert numeric fields to integers (form sends strings from price inputs)
      const intFields = ["sale_price", "deposit_amount", "mortgage_amount", "monthly_rent", "price_per_meter"];
      for (const key of intFields) {
        if (payload[key] !== null && payload[key] !== undefined && payload[key] !== "") {
          payload[key] = parseInt(payload[key], 10) || null;
        } else {
          payload[key] = null;
        }
      }

      // Convert area and other numeric fields
      const numFields = ["area", "age", "bedrooms", "bathrooms", "floor", "total_floors", "parking_count", "storage_count"];
      for (const key of numFields) {
        if (payload[key] !== null && payload[key] !== undefined && payload[key] !== "") {
          payload[key] = parseInt(payload[key], 10) || 0;
        }
      }

      // Nullable numeric fields: keep NULL when left blank, never send ""
      for (const key of ["floor", "total_floors"]) {
        if (payload[key] === "") payload[key] = null;
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
          const existing = await propertyService.getPropertyFeatures(propertyId);
          const existingFeatureIds = existing.map((pf) => Number(pf.feature_id));
          const newFeatureIds = featureIds.map(Number);

          // Remove features that were deselected
          const toRemove = existing
            .filter((pf) => !newFeatureIds.includes(Number(pf.feature_id)))
            .map((pf) => pf.id);
          if (toRemove.length > 0) {
            await propertyService.removePropertyFeatures(toRemove);
          }

          // Add newly selected features
          const toAdd = newFeatureIds.filter((fid) => !existingFeatureIds.includes(fid));
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
      if (errData?.detail) {
        msg = typeof errData.detail === "string" ? errData.detail : JSON.stringify(errData.detail);
      } else if (errData) {
        // Extract first validation error from object { field: [messages] }
        const firstKey = Object.keys(errData)[0];
        if (firstKey && Array.isArray(errData[firstKey])) {
          msg = errData[firstKey][0];
        } else if (firstKey) {
          msg = String(errData[firstKey]);
        }
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
            onFormApi={(api) => { formApiRef.current = api; }}
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

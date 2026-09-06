import { useState, useMemo, useEffect } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { PROPERTY_FORM } from "@/features/properties/config";
import propertyService from "@/features/properties/services/propertyService";
import OwnerFormModal from "@/features/owners/components/OwnerFormModal";
import locationService from "@/features/location-management/services/locationService";
import { toastService } from "@/lib/toast";



export default function PropertyFormModal({
  isOpen,
  onClose,
  property = null,
  onSuccess,
}) {
  const isEdit = !!property?.id;
  const [loading, setLoading] = useState(false);
  const [showOwnerForm, setShowOwnerForm] = useState(false);
  const [ownerFormKey, setOwnerFormKey] = useState(0);
  const [propertyFeatures, setPropertyFeatures] = useState([]);
  const [resolvedLocation, setResolvedLocation] = useState({});
  const [editReady, setEditReady] = useState(!isEdit);

  // For create mode, always ready. For edit, wait for data.
  useEffect(() => {
    if (!isEdit) {
      setEditReady(true);
      setPropertyFeatures([]);
      setResolvedLocation({});
      return;
    }

    setEditReady(false);
    let cancelled = false;

    const loadEditData = async () => {
      try {
        const [features, location] = await Promise.all([
          propertyService.getPropertyFeatures(property.id).catch(() => []),
          property?.address && typeof property.address === "object"
            ? locationService.resolveLocationFromAddress(property.address).catch(() => ({}))
            : Promise.resolve({}),
        ]);
        if (cancelled) return;
        setPropertyFeatures(Array.isArray(features) ? features : []);
        setResolvedLocation(location || {});
        setEditReady(true);
      } catch {
        if (!cancelled) setEditReady(true);
      }
    };

    loadEditData();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, property?.id]);

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
          if (f.key === "agent" && isEdit) {
            return { ...f, type: "text", readOnly: true, defaultValue: agentName };
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
      // Location
      location: resolvedLocation || {},
      city:
        property?.divar_neighborhood?.city || resolvedLocation?.city || null,
      zone: property?.divar_neighborhood?.zone || null,
      divar_neighborhood: property?.divar_neighborhood?.id || null,
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
  }, [isEdit, property, propertyFeatures, resolvedLocation]);

  const handleOwnerCreated = () => {
    setShowOwnerForm(false);
    setOwnerFormKey((k) => k + 1);
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data };

      // Map location cascade to address FK
      if (payload.location && typeof payload.location === "object") {
        payload.address = payload.location.address ?? null;
        delete payload.location;
      }
      delete payload.city;
      delete payload.zone;

      // In edit mode, remove read-only fields that are strings (not FK IDs)
      if (isEdit) {
        delete payload.owner;
        delete payload.agent;
        delete payload.property_code;
      }

      // Extract feature ids before sending to backend
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

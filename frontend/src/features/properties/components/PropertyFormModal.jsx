import { useState, useMemo, useEffect } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { PROPERTY_FORM } from "@/features/properties/config";
import propertyService from "@/features/properties/services/propertyService";
import OwnerFormModal from "@/features/owners/components/OwnerFormModal";
import { toastService } from "@/lib/toast";

export default function PropertyFormModal({
  isOpen,
  onClose,
  property = null,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [showOwnerForm, setShowOwnerForm] = useState(false);
  const [ownerFormKey, setOwnerFormKey] = useState(0);
  const [propertyFeatures, setPropertyFeatures] = useState([]);
  const isEdit = !!property?.id;

  // Fetch property features for auto-fill in edit mode
  useEffect(() => {
    if (isEdit && property?.id) {
      propertyService.getPropertyFeatures(property.id)
        .then((features) => setPropertyFeatures(features))
        .catch(() => setPropertyFeatures([]));
    }
  }, [isEdit, property?.id]);

  const formConfig = useMemo(() => {
    if (!PROPERTY_FORM) return PROPERTY_FORM;
    return {
      ...PROPERTY_FORM,
      tabs: (PROPERTY_FORM.tabs || []).map((tab) => ({
        ...tab,
        fields: (tab.fields || []).map((f) => {
          if (f.key === "owner") {
            return {
              ...f,
              readOnly: isEdit,
              addAction: isEdit ? undefined : () => setShowOwnerForm(true),
              addActionLabel: "مالک جدید",
            };
          }
          return f;
        }),
      })),
    };
  }, [isEdit]);

  const handleOwnerCreated = () => {
    setShowOwnerForm(false);
    setOwnerFormKey((k) => k + 1);
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data };
      if (payload.location && typeof payload.location === "object") {
        payload.address = payload.location.address ?? null;
        delete payload.location;
      }
      // Extract feature ids before sending to backend
      const featureIds = payload.features || [];
      delete payload.features;

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
      toastService.error(error?.response?.data?.detail || "خطا در ذخیره ملک.");
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
        <FormRenderer
          key={ownerFormKey}
          config={formConfig}
          defaultValues={
            isEdit
              ? { ...property, features: Array.isArray(propertyFeatures) ? propertyFeatures.map((f) => Number(f.feature_id)).filter(Boolean) : [] }
              : {}
          }
          mode={isEdit ? "edit" : "create"}
          onSubmit={handleSubmit}
          onCancel={onClose}
          loading={loading}
        />
      </Modal>

      <OwnerFormModal
        isOpen={showOwnerForm}
        onClose={() => setShowOwnerForm(false)}
        onSuccess={handleOwnerCreated}
      />
    </>
  );
}

import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { CUSTOMER_PREFERENCE_FORM } from "@/features/customers/config/customerPreferenceForms.config";
import customerPreferenceService from "@/features/customers/services/customerPreferenceService";
import { toastService } from "@/lib/toast";

export default function CustomerPreferenceFormModal({
  isOpen,
  onClose,
  preference = null,
  customerId = null,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!preference?.id;

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        customer: Number(values.customer || customerId),
        deal_type: values.deal_type,
        property_type: values.property_type || "",
        budget_min: values.budget_min ? Number(values.budget_min) : null,
        budget_max: values.budget_max ? Number(values.budget_max) : null,
        area_min: values.area_min ? Number(values.area_min) : null,
        area_max: values.area_max ? Number(values.area_max) : null,
        bedrooms: values.bedrooms ? Number(values.bedrooms) : null,
        neighborhoods: values.neighborhoods
          ? values.neighborhoods.map(Number)
          : [],
        notes: values.notes || "",
      };

      if (isEdit) {
        await customerPreferenceService.update(preference.id, payload);
        toastService.success("ترجیحات با موفقیت ویرایش شد.");
      } else {
        await customerPreferenceService.create(payload);
        toastService.success("ترجیحات با موفقیت ثبت شد.");
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      const msg = error?.response?.data?.detail || error?.response?.data?.message;
      toastService.error(typeof msg === "string" ? msg : "خطا در ذخیره ترجیحات.");
    } finally {
      setLoading(false);
    }
  };

  const defaultValues = preference
    ? {
        ...preference,
        customer: preference.customer?.id ?? preference.customer,
        neighborhoods:
          preference.neighborhoods?.map((n) => n.id ?? n) || [],
      }
    : {
        customer: customerId,
        deal_type: "sale",
      };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={isEdit ? "ویرایش ترجیحات ملک" : "ثبت ترجیحات ملک"}
    >
      <FormRenderer
        config={CUSTOMER_PREFERENCE_FORM}
        defaultValues={defaultValues}
        mode={isEdit ? "edit" : "create"}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}

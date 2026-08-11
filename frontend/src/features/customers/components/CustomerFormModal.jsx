import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { CUSTOMER_FORM } from "@/features/customers/config";
import customerService from "@/features/customers/services/customerService";

export default function CustomerFormModal({
  isOpen,
  onClose,
  customer = null,
  onSuccess,
  extraData = {},
}) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!customer?.id;

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const payload = {
        full_name: values.full_name,
        phone: values.phone,
        email: values.email || null,
        customer_type: values.customer_type,
        status: values.status || "new",
        assigned_agent: values.assigned_agent
          ? Number(values.assigned_agent)
          : null,
        source: values.source || "",
        notes: values.notes || "",
        tags: values.tags ? values.tags.map(Number) : [],
      };

      if (isEdit) {
        await customerService.update(customer.id, payload);
      } else {
        await customerService.create(payload);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Customer form submit error:", error);
      // اگر toast داری اینجا نمایش بده
    } finally {
      setLoading(false);
    }
  };

  // Normalize برای حالت Edit
  const defaultValues = customer
    ? {
        ...customer,
        assigned_agent:
          customer.assigned_agent?.id ?? customer.assigned_agent ?? null,
        tags: customer.tags?.map((t) => t.id ?? t) || [],
      }
    : {
        status: "new",
        customer_type: "buyer",
      };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={isEdit ? "ویرایش مشتری" : "ثبت مشتری جدید"}
    >
      <FormRenderer
        config={CUSTOMER_FORM}
        defaultValues={defaultValues}
        mode={isEdit ? "edit" : "create"}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
        extraData={extraData}
      />
    </Modal>
  );
}
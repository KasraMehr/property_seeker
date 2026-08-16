import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { LOCATION_LEVELS } from "../config";
import { LOCATION_ADAPTERS } from "../services/locationAdapters";
import { toastService } from "@/lib/toast";

export default function LocationFormModal({
  isOpen,
  onClose,
  levelKey,
  record = null,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const level = LOCATION_LEVELS[levelKey];
  const adapter = LOCATION_ADAPTERS[levelKey];
  const isEdit = !!record?.id;

  if (!level || !adapter) return null;

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      // drop UI-only cascade helpers if any
      const payload = { ...data };
      if (levelKey === "city") {
        // only name + province id
        await (isEdit
          ? adapter.update(record.id, {
              name: payload.name,
              province: payload.province,
            })
          : adapter.create({ name: payload.name, province: payload.province }));
      } else if (levelKey === "district") {
        await (isEdit
          ? adapter.update(record.id, {
              name: payload.name,
              city: payload.city,
            })
          : adapter.create({ name: payload.name, city: payload.city }));
      } else if (levelKey === "neighborhood") {
        await (isEdit
          ? adapter.update(record.id, {
              name: payload.name,
              district: payload.district,
            })
          : adapter.create({ name: payload.name, district: payload.district }));
      } else {
        await (isEdit
          ? adapter.update(record.id, { name: payload.name })
          : adapter.create({ name: payload.name }));
      }
      toastService.success(
        isEdit
          ? `${level.label} با موفقیت ویرایش شد`
          : `${level.label} با موفقیت ثبت شد`,
      );
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        (isEdit
          ? `ویرایش ${level.label} ناموفق بود`
          : `ثبت ${level.label} ناموفق بود`);
      toastService.error(typeof msg === "string" ? msg : "خطا در ذخیره");
    } finally {
      setLoading(false);
    }
  };

  // City list shows province as name — for edit, FormRenderer select needs id.
  // If record.province is a string name, leave empty or map later.
  const defaultValues = record
    ? {
        ...record,
        province:
          typeof record.province === "number"
            ? record.province
            : record.province_id,
        city: record.city,
        district: record.district,
      }
    : {};

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={isEdit ? `ویرایش ${level.label}` : `ثبت ${level.label} جدید`}
    >
      <FormRenderer
        config={level.form}
        defaultValues={defaultValues}
        mode={isEdit ? "edit" : "create"}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { FOLLOWUP_FORM } from "@/features/followups/config";
import followupService from "@/features/followups/services/followupService";
import useAuth from "@/features/auth/hooks/useAuth";
import api from "@/lib/api";
import { toastService } from "@/lib/toast";

export default function FollowupFormModal({
  isOpen,
  onClose,
  followup = null,
  onSuccess,
  extraData = {},
}) {
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();
  const isEdit = !!followup?.id;
  const isOperator = !currentUser?.is_owner;

  const [linkState, setLinkState] = useState({
    customerId: null,
    propertyId: null,
    relatedProperties: null,
    relatedCustomers: null,
    loadingCustomer: false,
    loadingProperty: false,
  });

  const linkStateRef = useRef(linkState);
  linkStateRef.current = linkState;

  const fetchPropertiesForCustomer = useCallback(async (customerId) => {
    if (!customerId) {
      setLinkState((s) => ({ ...s, relatedProperties: null, propertyId: null }));
      return;
    }
    setLinkState((s) => ({ ...s, loadingCustomer: true, relatedProperties: null }));
    try {
      const res = await api.get("/api/calls/", { params: { customer: customerId } });
      const calls = Array.isArray(res.data) ? res.data : [];
      const propertyIds = [...new Set(calls.filter((c) => c.property).map((c) => c.property))];
      const properties = await Promise.all(
        propertyIds.map(async (id) => {
          try {
            const r = await api.get(`/api/property/detail/${id}/`);
            return { id: r.data.id, label: r.data.title || r.data.property_code };
          } catch {
            return { id, label: `ملک #${id}` };
          }
        })
      );
      setLinkState((s) => ({
        ...s,
        relatedProperties: properties,
        loadingCustomer: false,
        propertyId: properties.length === 1 ? properties[0].id : null,
      }));
    } catch {
      setLinkState((s) => ({ ...s, relatedProperties: [], loadingCustomer: false }));
    }
  }, []);

  const fetchCustomersForProperty = useCallback(async (propertyId) => {
    if (!propertyId) {
      setLinkState((s) => ({ ...s, relatedCustomers: null, customerId: null }));
      return;
    }
    setLinkState((s) => ({ ...s, loadingProperty: true, relatedCustomers: null }));
    try {
      const res = await api.get("/api/calls/", { params: { property: propertyId } });
      const calls = Array.isArray(res.data) ? res.data : [];
      const customerIds = [...new Set(calls.filter((c) => c.customer).map((c) => c.customer))];
      const customers = await Promise.all(
        customerIds.map(async (id) => {
          try {
            const r = await api.get(`/api/customers/${id}/`);
            return { id: r.data.id, label: r.data.full_name || r.data.phone };
          } catch {
            return { id, label: `مشتری #${id}` };
          }
        })
      );
      setLinkState((s) => ({
        ...s,
        relatedCustomers: customers,
        loadingProperty: false,
        customerId: customers.length === 1 ? customers[0].id : null,
      }));
    } catch {
      setLinkState((s) => ({ ...s, relatedCustomers: [], loadingProperty: false }));
    }
  }, []);

  useEffect(() => {
    if (isOpen && !isEdit) {
      setLinkState({
        customerId: null,
        propertyId: null,
        relatedProperties: null,
        relatedCustomers: null,
        loadingCustomer: false,
        loadingProperty: false,
      });
    }
  }, [isOpen, isEdit]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const finalCustomerId = linkState.customerId ?? values.customer;
      const finalPropertyId = linkState.propertyId ?? values.property;

      const payload = {
        title: values.title,
        type: values.type,
        status: values.status || "pending",
        user: values.user ? Number(values.user) : undefined,
        ...(finalCustomerId ? { customer: Number(finalCustomerId) } : {}),
        ...(finalPropertyId ? { property: Number(finalPropertyId) } : {}),
        description: values.description || "",
        due_at: values.due_at || undefined,
        ...(values.status === "done"
          ? { completed_at: values.completed_at || new Date().toISOString() }
          : {}),
      };

      if (isEdit) {
        await followupService.update(followup.id, payload);
        toastService.success("پیگیری با موفقیت ویرایش شد.");
      } else {
        await followupService.create(payload);
        toastService.success("پیگیری جدید با موفقیت ثبت شد.");
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      const msg = error?.response?.data?.detail || error?.response?.data?.message;
      toastService.error(typeof msg === "string" ? msg : "خطا در ذخیره پیگیری.");
    } finally {
      setLoading(false);
    }
  };

  const formConfig = useMemo(() => {
    const baseConfig = isOperator
      ? {
          ...FOLLOWUP_FORM,
          tabs: FOLLOWUP_FORM.tabs.map((tab) => ({
            ...tab,
            fields: tab.fields.map((f) =>
              f.key === "user"
                ? {
                    key: "user",
                    label: "مسئول پیگیری",
                    type: "select",
                    required: true,
                    readOnly: true,
                    options: [{ value: currentUser.id, label: currentUser.full_name }],
                    defaultValue: currentUser.id,
                    span: 6,
                  }
                : f
            ),
          })),
        }
      : FOLLOWUP_FORM;

    if (isEdit) return baseConfig;

    return {
      ...baseConfig,
      tabs: baseConfig.tabs.map((tab) => ({
        ...tab,
        fields: tab.fields.map((f) => {
          // ─── Customer field ───
          if (f.key === "customer") {
            if (linkState.propertyId && !linkState.customerId) {
              if (linkState.loadingProperty) {
                return { ...f, label: "مشتری مرتبط", type: "select", readOnly: true, options: [{ value: "", label: "در حال جستجو..." }], defaultValue: "" };
              }
              const customers = linkState.relatedCustomers ?? [];
              if (customers.length === 0) {
                return { ...f, label: "مشتری مرتبط", type: "select", readOnly: true, options: [{ value: "", label: "مشتری مرتبطی ندارد" }], defaultValue: "" };
              }
              if (customers.length === 1) {
                return { ...f, label: "مشتری مرتبط", type: "select", readOnly: true, options: [{ value: customers[0].id, label: customers[0].label }], defaultValue: customers[0].id };
              }
              return { ...f, label: "مشتری مرتبط", type: "select", required: true, options: customers.map((c) => ({ value: c.id, label: c.label })) };
            }
            return f;
          }

          // ─── Property field ───
          if (f.key === "property") {
            if (linkState.customerId && !linkState.propertyId) {
              if (linkState.loadingCustomer) {
                return { ...f, label: "ملک مرتبط", type: "select", readOnly: true, options: [{ value: "", label: "در حال جستجو..." }], defaultValue: "" };
              }
              const properties = linkState.relatedProperties ?? [];
              if (properties.length === 0) {
                return { ...f, label: "ملک مرتبط", type: "select", readOnly: true, options: [{ value: "", label: "ملک مرتبطی ندارد" }], defaultValue: "" };
              }
              if (properties.length === 1) {
                return { ...f, label: "ملک مرتبط", type: "select", readOnly: true, options: [{ value: properties[0].id, label: properties[0].label }], defaultValue: properties[0].id };
              }
              return { ...f, label: "ملک مرتبط", type: "select", required: true, options: properties.map((p) => ({ value: p.id, label: p.label })) };
            }
            return f;
          }

          return f;
        }),
      })),
    };
  }, [isOperator, currentUser, linkState, fetchPropertiesForCustomer, fetchCustomersForProperty]);

  const defaultValues = useMemo(() => {
    if (followup) {
      return {
        ...followup,
        user: followup.user?.id ?? followup.user,
        customer: followup.customer?.id ?? followup.customer,
        property: followup.property?.id ?? followup.property,
        due_at: followup.due_at || "",
        completed_at: followup.completed_at || "",
      };
    }
    return { type: "follow_up", status: "pending", user: currentUser?.id || null };
  }, [followup, currentUser]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title={isEdit ? "ویرایش پیگیری" : "ثبت پیگیری جدید"}>
      <FormRenderer
        config={formConfig}
        defaultValues={defaultValues}
        mode={isEdit ? "edit" : "create"}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
        extraData={extraData}
        onValuesChange={(vals) => {
          if (isEdit) return;
          if (vals.customer && vals.customer !== linkStateRef.current.customerId) {
            setLinkState((s) => ({ ...s, customerId: vals.customer }));
            fetchPropertiesForCustomer(vals.customer);
          }
          if (vals.property && vals.property !== linkStateRef.current.propertyId) {
            setLinkState((s) => ({ ...s, propertyId: vals.property }));
            fetchCustomersForProperty(vals.property);
          }
        }}
      />
    </Modal>
  );
}

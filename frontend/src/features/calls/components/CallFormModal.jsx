import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { CALL_FORM } from "@/features/calls/config";
import callService from "@/features/calls/services/callService";
import useAuthStore from "@/store/useAuthStore";
import { toastService } from "@/lib/toast";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import api from "@/lib/api";
import { User, Home, TriangleAlert } from "lucide-react";
import CustomerFormModal from "@/features/customers/components/CustomerFormModal";
import OwnerFormModal from "@/features/owners/components/OwnerFormModal";

export default function CallFormModal({
  isOpen,
  onClose,
  call = null,
  onSuccess,
  extraData = {},
}) {
  const [loading, setLoading] = useState(false);
  const [personMode, setPersonMode] = useState("customer");
  const [customerCreateOpen, setCustomerCreateOpen] = useState(false);
  const [ownerCreateOpen, setOwnerCreateOpen] = useState(false);
  const pendingSelectObjRef = useRef(null);
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [relatedListings, setRelatedListings] = useState([]);
  const user = useAuthStore((s) => s.user);
  const isEdit = !!call?.id;

  /* ─── Form config: remove property/listing fields, switch source by mode ─── */
  const formConfig = useMemo(() => {
    const config = JSON.parse(JSON.stringify(CALL_FORM));

    if (config.tabs?.[0]?.fields) {
      const customerIdx = config.tabs[0].fields.findIndex(
        (f) => f.key === "customer",
      );
      if (customerIdx !== -1) {
        const f = config.tabs[0].fields[customerIdx];
        config.tabs[0].fields[customerIdx] = {
          ...f,
          asyncSource:
            personMode === "owner"
              ? API_ENDPOINTS.OWNERS.LIST.url
              : API_ENDPOINTS.CUSTOMERS.LIST.url,
          placeholder:
            personMode === "owner" ? "جستجوی مالک..." : "جستجوی مشتری...",
          label: personMode === "owner" ? "مالک" : "مشتری / تماس‌گیرنده",
        };
      }
    }
    return config;
  }, [personMode]);

  /* Add addAction (functions can't survive JSON.parse) */
  const formConfigWithActions = useMemo(() => {
    const cfg = { ...formConfig };
    if (cfg.tabs?.[0]?.fields) {
      cfg.tabs[0].fields = cfg.tabs[0].fields.map((f) =>
        f.key === "customer"
          ? {
              ...f,
              addAction: () =>
                personMode === "owner"
                  ? setOwnerCreateOpen(true)
                  : setCustomerCreateOpen(true),
              addActionLabel:
                personMode === "owner" ? "مالک جدید" : "مشتری جدید",
            }
          : f,
      );
    }
    return cfg;
  }, [formConfig, personMode]);

  /* ─── Track selected person for related properties ─── */
  const lastFetchedPersonId = useRef(null);
  const lastFetchedPropertyId = useRef(null);
  const lastFetchedListingId = useRef(null);
  const propertyOwnerIdRef = useRef(null);
  const listingPropertyIdRef = useRef(null);
  const formSetValueRef = useRef(null);
  const formValuesRef = useRef(null);
  const [ownerMismatch, setOwnerMismatch] = useState(false);
  const [listingNoProperty, setListingNoProperty] = useState(false);
  const [propertyListingMismatch, setPropertyListingMismatch] = useState(false);

  const handleFormApi = useCallback((api) => {
    formSetValueRef.current = api.setValue;
  }, []);

  // Auto-select newly created person (with name) when form modal closes
  useEffect(() => {
    if (pendingSelectObjRef.current != null && formSetValueRef.current) {
      const obj = pendingSelectObjRef.current;
      pendingSelectObjRef.current = null;
      formSetValueRef.current("customer", obj, { shouldValidate: false });
    }
  });

  // Extract numeric ID from a value that could be an object {id,...} or a plain ID
  const extractId = useCallback((val) => {
    if (val == null) return null;
    if (typeof val === "object") return val.id ?? null;
    return Number(val) || null;
  }, []);

  // Fetch listings for a given property and auto-fill if only one
  const fetchAndAutoFillListings = useCallback(
    (propId) => {
      if (!propId) {
        setRelatedListings([]);
        return;
      }
      api
        .get(API_ENDPOINTS.LISTINGS.LIST.url, {
          params: { property: propId },
        })
        .then((res) => {
          const listings = res.data?.results || res.data || [];
          setRelatedListings(listings);
          // Auto-fill listing if only one and field is empty (object so the name shows in the select)
          if (listings.length === 1 && !formValuesRef.current?.listing) {
            formSetValueRef.current?.(
              "listing",
              { id: listings[0].id, title: listings[0].title },
              { shouldValidate: false },
            );
          }
        })
        .catch(() => setRelatedListings([]));
    },
    [],
  );

  const handleValuesChange = useCallback(
    (values) => {
      formValuesRef.current = values;
      const personId = extractId(values?.customer);

      // ── 1. OWNER changes → auto-fill property + listing ──
      if (personMode === "owner" && personId) {
        if (lastFetchedPersonId.current !== personId) {
          lastFetchedPersonId.current = personId;
          api
            .get(API_ENDPOINTS.OWNERS.DETAIL(personId).url)
            .then((res) => {
              const properties = res.data.properties || [];
              setRelatedProperties(properties);

              // Auto-fill property if owner has exactly one and field is empty
              if (properties.length === 1 && !extractId(values?.property)) {
                formSetValueRef.current?.(
                  "property",
                  {
                    id: properties[0].id,
                    title: properties[0].title || properties[0].property_code,
                  },
                  { shouldValidate: false },
                );
              }

              // Always fetch listings for the active property
              const propId = extractId(values?.property) || (properties.length === 1 ? properties[0].id : null);
              if (propId) {
                fetchAndAutoFillListings(propId);
              } else {
                setRelatedListings([]);
              }
            })
            .catch(() => {
              setRelatedProperties([]);
              setRelatedListings([]);
            });
        }
      } else if (!personId && lastFetchedPersonId.current !== null) {
        // Owner cleared → clear everything downstream
        lastFetchedPersonId.current = null;
        setRelatedProperties([]);
        formSetValueRef.current?.("property", null, { shouldValidate: false });
        lastFetchedPropertyId.current = null;
        propertyOwnerIdRef.current = null;
        formSetValueRef.current?.("listing", null, { shouldValidate: false });
        lastFetchedListingId.current = null;
        listingPropertyIdRef.current = null;
        setRelatedListings([]);
        setOwnerMismatch(false);
        setListingNoProperty(false);
        setPropertyListingMismatch(false);
      }

      // ── 2. PROPERTY changes → auto-fill owner + listing ──
      const propertyId = extractId(values?.property);
      const prevPropertyId = lastFetchedPropertyId.current;
      if (propertyId !== prevPropertyId) {
        lastFetchedPropertyId.current = propertyId;

        if (propertyId) {
          // Fetch property detail → get owner → auto-select owner
          api
            .get(API_ENDPOINTS.PROPERTIES.DETAIL(propertyId).url)
            .then((res) => {
              const prop = res.data;
              const ownerObj = prop.owner;
              // Track the property's owner for mismatch detection
              propertyOwnerIdRef.current = ownerObj?.id || null;
              // Re-check mismatch after updating property owner
              const currentOwnerId = extractId(values?.customer);
              setOwnerMismatch(
                !!(currentOwnerId && propertyOwnerIdRef.current && currentOwnerId !== propertyOwnerIdRef.current),
              );
              // Auto-fill owner if field is empty
              if (
                ownerObj &&
                ownerObj.id &&
                !extractId(values?.customer)
              ) {
                formSetValueRef.current?.(
                  "customer",
                  { id: ownerObj.id, full_name: ownerObj.full_name || ownerObj.name || "" },
                  { shouldValidate: false },
                );
                setPersonMode("owner");
              }
            })
            .catch(() => {});

          // Fetch listings for this property → auto-fill listing
          fetchAndAutoFillListings(propertyId);

          // Clear listing if it doesn't belong to this property
          const currentListingId = extractId(values?.listing);
          if (currentListingId && listingPropertyIdRef.current) {
            if (listingPropertyIdRef.current !== propertyId) {
              formSetValueRef.current?.("listing", null, { shouldValidate: false });
              lastFetchedListingId.current = null;
              listingPropertyIdRef.current = null;
            }
          }
        } else {
          // Property cleared → clear listing downstream
          propertyOwnerIdRef.current = null;
          formSetValueRef.current?.("listing", null, { shouldValidate: false });
          lastFetchedListingId.current = null;
          listingPropertyIdRef.current = null;
          setRelatedListings([]);
          setOwnerMismatch(false);
          setListingNoProperty(false);
          setPropertyListingMismatch(false);
        }
      }

      // ── 3. LISTING changes → auto-fill property + owner ──
      const listingId = extractId(values?.listing);
      if (listingId && lastFetchedListingId.current !== listingId) {
        lastFetchedListingId.current = listingId;

        api
          .get(API_ENDPOINTS.LISTINGS.DETAIL(listingId).url)
          .then((res) => {
            const listingData = res.data;
            const propId = listingData.property;
            // Track listing's property immediately for mismatch detection
            listingPropertyIdRef.current = propId || null;

            if (propId) {
              setListingNoProperty(false);
              // Check if listing's property matches the currently selected property
              const currentPropertyId = extractId(values?.property);
              if (currentPropertyId && currentPropertyId !== propId) {
                // Mismatch — listing belongs to a different property
                setPropertyListingMismatch(true);
              }
              // Always fetch property detail and auto-fill
              api
                .get(API_ENDPOINTS.PROPERTIES.DETAIL(propId).url)
                .then((propRes) => {
                  const prop = propRes.data;
                  // Auto-fill property field
                  formSetValueRef.current?.(
                    "property",
                    { id: prop.id, title: prop.title || prop.property_code },
                    { shouldValidate: false },
                  );
                  lastFetchedPropertyId.current = prop.id;
                  listingPropertyIdRef.current = prop.id;

                  // Track the property's owner for mismatch detection
                  const ownerObj = prop.owner;
                  propertyOwnerIdRef.current = ownerObj?.id || null;

                  // Auto-fill owner from property if field is empty
                  if (
                    ownerObj &&
                    ownerObj.id &&
                    !extractId(values?.customer)
                  ) {
                    formSetValueRef.current?.(
                      "customer",
                      { id: ownerObj.id, full_name: ownerObj.full_name || ownerObj.name || "" },
                      { shouldValidate: false },
                    );
                    setPersonMode("owner");
                  }

                  // Fetch listings for this property
                  fetchAndAutoFillListings(prop.id);
                })
                .catch(() => {});
            } else {
              // Listing has no property — clear the property field
              formSetValueRef.current?.("property", null, { shouldValidate: false });
              lastFetchedPropertyId.current = null;
              propertyOwnerIdRef.current = null;
              setListingNoProperty(true);
              setPropertyListingMismatch(false);
            }
          })
          .catch(() => {});
      } else if (!listingId && lastFetchedListingId.current !== null) {
        // Listing cleared → clear property downstream
        lastFetchedListingId.current = null;
        listingPropertyIdRef.current = null;
        formSetValueRef.current?.("property", null, { shouldValidate: false });
        lastFetchedPropertyId.current = null;
        propertyOwnerIdRef.current = null;
        setRelatedListings([]);
        setListingNoProperty(false);
        setPropertyListingMismatch(false);
        setOwnerMismatch(false);
      }

      // ── 4. Consistency checks ──
      // Owner ↔ Property
      if (personMode === "owner" && personId && propertyOwnerIdRef.current) {
        setOwnerMismatch(personId !== propertyOwnerIdRef.current);
      } else {
        setOwnerMismatch(false);
      }
      // Listing ↔ Property
      if (propertyId && listingPropertyIdRef.current && listingId) {
        setPropertyListingMismatch(propertyId !== listingPropertyIdRef.current);
      } else {
        setPropertyListingMismatch(false);
      }
    },
    [personMode, fetchAndAutoFillListings, extractId],
  );

  /* ─── Reset on modal open ─── */
  const [formKey, setFormKey] = useState(0);
  useEffect(() => {
    if (isOpen) {
      setFormKey((k) => k + 1);
      setPersonMode("customer");
      setRelatedProperties([]);
      setRelatedListings([]);
      lastFetchedPersonId.current = null;
      lastFetchedPropertyId.current = null;
      lastFetchedListingId.current = null;
      propertyOwnerIdRef.current = null;
      listingPropertyIdRef.current = null;
      setOwnerMismatch(false);
      setListingNoProperty(false);
      setPropertyListingMismatch(false);
    }
  }, [isOpen]);

  /* ─── Submit ─── */
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const personId = extractId(values.customer);
      if (!personId) {
        toastService.error("لطفاً یک شخص انتخاب کنید.");
        setLoading(false);
        return;
      }

      const payload = {
        ...(personMode === "owner"
          ? { owner: personId }
          : { customer: personId }),
        call_type: values.call_type,
        result: values.result,
        note: values.note || "",
        called_at: values.called_at || new Date().toISOString(),
        call_duration: values.call_duration ? Number(values.call_duration) : 0,
        property: extractId(values.property),
        listing: extractId(values.listing),
      };

      if (!isEdit && user?.id != null) payload.handled_by = user.id;

      if (isEdit) {
        await callService.update(call.id, payload);
        toastService.success("تماس با موفقیت ویرایش شد.");
      } else {
        await callService.create(payload);
        toastService.success("تماس با موفقیت ثبت شد.");
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Call form submit error:", error);
      toastService.error(
        error?.response?.data?.detail || "خطا در ثبت اطلاعات تماس.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ─── Existing recording name (edit mode) ─── */
  const currentRecordingName = useMemo(() => {
    const url = call?.record_file;
    if (!url || typeof url !== "string") return null;
    return url.split(/[?#]/)[0].split("/").pop() || url;
  }, [call]);

  /* ─── Default values ─── */
  const defaultValues = useMemo(() => {
    if (call) {
      return {
        customer: call.customer?.id ?? call.customer,
        call_type: call.call_type || "outgoing",
        result: call.result || "answered",
        note: call.note || "",
        called_at: call.called_at || "",
        call_duration: call.call_duration || 0,
        property: call.property || null,
        listing: call.listing || null,
      };
    }
    return {
      customer: extraData?.customer || null,
      property: extraData?.property || null,
      listing: extraData?.listing || null,
      call_type: "outgoing",
      result: "answered",
      note: "",
      called_at: "",
      call_duration: 0,
    };
  }, [call, extraData]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        title={isEdit ? "ویرایش تماس" : "ثبت تماس جدید"}
      >
        <div className="flex flex-col flex-1 min-h-0 gap-3">
          {/* Toggle + related properties — always visible */}
          <div className="shrink-0 flex items-center justify-between gap-4">
            {!isEdit && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  نوع تماس با:
                </span>
                <div className="flex rounded-xl border border-border overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setPersonMode("customer");
                      formSetValueRef.current?.("customer", null, { shouldValidate: false });
                      setRelatedProperties([]);
                      setOwnerMismatch(false);
                      setListingNoProperty(false);
                      setPropertyListingMismatch(false);
                      lastFetchedPersonId.current = null;
                      propertyOwnerIdRef.current = null;
                      listingPropertyIdRef.current = null;
                    }}
                    disabled={loading}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      personMode === "customer"
                        ? "bg-(--role-primary)/30 text-(--role-primary)"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    <User size={14} className="inline" /> مشتری
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPersonMode("owner");
                      formSetValueRef.current?.("customer", null, { shouldValidate: false });
                      setRelatedProperties([]);
                      setOwnerMismatch(false);
                      setListingNoProperty(false);
                      setPropertyListingMismatch(false);
                      lastFetchedPersonId.current = null;
                      propertyOwnerIdRef.current = null;
                      listingPropertyIdRef.current = null;
                    }}
                    disabled={loading}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors border-r border-border cursor-pointer ${
                      personMode === "owner"
                        ? "bg-(--role-primary)/30 text-(--role-primary)"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    <Home size={14} className="inline" /> مالک
                  </button>
                </div>
              </div>
            )}

            {ownerMismatch && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-warning/10 text-warning text-xs font-medium">
                <TriangleAlert size={13} />
                <span>مالک انتخاب‌شده با مالک ملک مطابقت ندارد</span>
              </div>
            )}

            {propertyListingMismatch && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-warning/10 text-warning text-xs font-medium">
                <TriangleAlert size={13} />
                <span>آگهی انتخاب‌شده متعلق به ملک دیگری است</span>
              </div>
            )}

            {listingNoProperty && !propertyListingMismatch && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-warning/10 text-warning text-xs font-medium">
                <TriangleAlert size={13} />
                <span>آگهی هنوز به ملک تبدیل نشده</span>
              </div>
            )}

            {personMode === "owner" && relatedProperties.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Home size={14} className="text-muted" />
                <span>
                  {relatedProperties[0].title ||
                    relatedProperties[0].property_code}
                </span>
                {relatedProperties.length > 1 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    +{relatedProperties.length - 1}
                  </span>
                )}
              </div>
            )}
          </div>

          {currentRecordingName && (
            <p className="shrink-0 text-xs text-muted">
              فایل صوتی فعلی:{" "}
              <span dir="ltr" className="font-medium text-foreground">
                {currentRecordingName}
              </span>
              {" "}— اگر فایل جدیدی انتخاب نکنید، فایل قبلی حفظ می‌شود.
            </p>
          )}

          {/* Form — takes remaining space, scrollable inside Tabs */}
          <div className="flex-1 min-h-0">
            <FormRenderer
              key={formKey}
              config={formConfigWithActions}
              defaultValues={defaultValues}
              mode={isEdit ? "edit" : "create"}
              onSubmit={handleSubmit}
              onCancel={onClose}
              loading={loading}
              extraData={extraData}
              onValuesChange={handleValuesChange}
              onFormApi={handleFormApi}
            />
          </div>
        </div>
      </Modal>

      {customerCreateOpen && (
        <CustomerFormModal
          isOpen={customerCreateOpen}
          onClose={() => setCustomerCreateOpen(false)}
          onSuccess={(createdObj) => {
            setCustomerCreateOpen(false);
            if (createdObj) pendingSelectObjRef.current = createdObj;
          }}
        />
      )}
      {ownerCreateOpen && (
        <OwnerFormModal
          isOpen={ownerCreateOpen}
          onClose={() => setOwnerCreateOpen(false)}
          onSuccess={(createdObj) => {
            setOwnerCreateOpen(false);
            if (createdObj) pendingSelectObjRef.current = createdObj;
          }}
        />
      )}
    </>
  );
}

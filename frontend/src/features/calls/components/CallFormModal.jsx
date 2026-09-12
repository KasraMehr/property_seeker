import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import Modal from "@/shared/ui/modal/Modal";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
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
  // Edit mode: restore the person kind recorded on the call
  const [personMode, setPersonMode] = useState(
    call?.owner ? "owner" : "customer",
  );
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
  // Resolved names/titles for confirmation & success messages
  const personNameRef = useRef(null);
  const propertyTitleRef = useRef(null);
  const listingTitleRef = useRef(null);
  const propertyOwnerRef = useRef(null); // {id, full_name} — the property's real owner
  const listingPropertyRef = useRef(null); // {id, title} — the listing's real property
  const [ownerMismatch, setOwnerMismatch] = useState(false);
  const [listingNoProperty, setListingNoProperty] = useState(false);
  const [propertyListingMismatch, setPropertyListingMismatch] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);

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

      // ── 1. PERSON changes → resolve name, auto-fill property + listing ──
      if (personId) {
        if (lastFetchedPersonId.current !== personId) {
          const isPersonChange = lastFetchedPersonId.current !== null;
          lastFetchedPersonId.current = personId;

          if (personMode === "owner" && isPersonChange) {
            // New owner → previous property/listing belong to the old owner
            formSetValueRef.current?.("property", null, { shouldValidate: false });
            formSetValueRef.current?.("listing", null, { shouldValidate: false });
            lastFetchedPropertyId.current = null;
            lastFetchedListingId.current = null;
            propertyOwnerIdRef.current = null;
            listingPropertyIdRef.current = null;
            setRelatedListings([]);
          }

          // Resolve the person's name (owner detail also carries properties)
          if (personMode === "owner") {
            api
              .get(API_ENDPOINTS.OWNERS.DETAIL(personId).url)
              .then((res) => {
                personNameRef.current = res.data.full_name || null;
                const properties = res.data.properties || [];
                setRelatedProperties(properties);

                // Show the person's name even when the value arrived as a bare id (edit mode)
                const currentPerson = formValuesRef.current?.customer;
                if (typeof currentPerson !== "object" || !currentPerson?.id) {
                  formSetValueRef.current?.(
                    "customer",
                    { id: personId, full_name: res.data.full_name || "" },
                    { shouldValidate: false },
                  );
                }

                // Auto-fill property if owner has exactly one and field is empty
                if (properties.length === 1 && !extractId(formValuesRef.current?.property)) {
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
                const propId =
                  extractId(formValuesRef.current?.property) ||
                  (properties.length === 1 ? properties[0].id : null);
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
          } else {
            // Customer mode — resolve name for the success message
            api
              .get(API_ENDPOINTS.CUSTOMERS.DETAIL(personId).url)
              .then((res) => {
                personNameRef.current = res.data?.full_name || null;
              })
              .catch(() => {});
          }
        }
      } else if (!personId && lastFetchedPersonId.current !== null) {
        // Person cleared → clear everything downstream
        lastFetchedPersonId.current = null;
        personNameRef.current = null;
        setRelatedProperties([]);
        formSetValueRef.current?.("property", null, { shouldValidate: false });
        lastFetchedPropertyId.current = null;
        propertyOwnerIdRef.current = null;
        propertyOwnerRef.current = null;
        propertyTitleRef.current = null;
        formSetValueRef.current?.("listing", null, { shouldValidate: false });
        lastFetchedListingId.current = null;
        listingPropertyIdRef.current = null;
        listingPropertyRef.current = null;
        listingTitleRef.current = null;
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
          // Show the property's name even when the value arrived as a bare id (edit mode)
          const currentProperty = formValuesRef.current?.property;
          if (typeof currentProperty !== "object" || !currentProperty?.id) {
            api
              .get(API_ENDPOINTS.PROPERTIES.DETAIL(propertyId).url)
              .then((res) => {
                formSetValueRef.current?.(
                  "property",
                  { id: res.data.id, title: res.data.title || res.data.property_code },
                  { shouldValidate: false },
                );
              })
              .catch(() => {});
          }

          // Fetch property detail → get owner → auto-select owner
          api
            .get(API_ENDPOINTS.PROPERTIES.DETAIL(propertyId).url)
            .then((res) => {
              const prop = res.data;
              const ownerObj = prop.owner;
              // Track the property's owner + title for mismatch/success messages
              propertyOwnerIdRef.current = ownerObj?.id || null;
              propertyOwnerRef.current = ownerObj?.id
                ? { id: ownerObj.id, full_name: ownerObj.full_name || ownerObj.name || "" }
                : null;
              propertyTitleRef.current = prop.title || prop.property_code || null;
              // Re-check mismatch after updating property owner
              const currentOwnerId = extractId(formValuesRef.current?.customer);
              setOwnerMismatch(
                !!(currentOwnerId && propertyOwnerIdRef.current && currentOwnerId !== propertyOwnerIdRef.current),
              );
              // Auto-fill owner if field is empty
              if (
                ownerObj &&
                ownerObj.id &&
                !extractId(formValuesRef.current?.customer)
              ) {
                formSetValueRef.current?.(
                  "customer",
                  { id: ownerObj.id, full_name: ownerObj.full_name || ownerObj.name || "" },
                  { shouldValidate: false },
                );
                personNameRef.current = ownerObj.full_name || ownerObj.name || null;
                setPersonMode("owner");
              }
            })
            .catch(() => {});

          // Fetch listings for this property → auto-fill listing
          fetchAndAutoFillListings(propertyId);

          // Clear listing if it doesn't belong to this property
          const currentListingId = extractId(formValuesRef.current?.listing);
          if (currentListingId && listingPropertyIdRef.current) {
            if (listingPropertyIdRef.current !== propertyId) {
              formSetValueRef.current?.("listing", null, { shouldValidate: false });
              lastFetchedListingId.current = null;
              listingPropertyIdRef.current = null;
              listingPropertyRef.current = null;
              listingTitleRef.current = null;
            }
          }
        } else {
          // Property cleared → clear listing downstream; in owner mode the
          // person was tied to the property, so clear it too
          propertyOwnerIdRef.current = null;
          propertyOwnerRef.current = null;
          propertyTitleRef.current = null;
          formSetValueRef.current?.("listing", null, { shouldValidate: false });
          lastFetchedListingId.current = null;
          listingPropertyIdRef.current = null;
          listingPropertyRef.current = null;
          listingTitleRef.current = null;
          setRelatedListings([]);
          if (personMode === "owner") {
            formSetValueRef.current?.("customer", null, { shouldValidate: false });
            lastFetchedPersonId.current = null;
            personNameRef.current = null;
            setRelatedProperties([]);
          }
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
            listingTitleRef.current = listingData.title || null;

            // Show the listing's name even when the value arrived as a bare id (edit mode)
            const currentListing = formValuesRef.current?.listing;
            if (typeof currentListing !== "object" || !currentListing?.id) {
              formSetValueRef.current?.(
                "listing",
                { id: listingData.id, title: listingData.title },
                { shouldValidate: false },
              );
            }

            if (propId) {
              setListingNoProperty(false);
              // Check if listing's property matches the currently selected property
              const currentPropertyId = extractId(formValuesRef.current?.property);
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
                  listingPropertyRef.current = {
                    id: prop.id,
                    title: prop.title || prop.property_code,
                  };
                  propertyTitleRef.current = prop.title || prop.property_code || null;

                  // Track the property's owner for mismatch detection
                  const ownerObj = prop.owner;
                  propertyOwnerIdRef.current = ownerObj?.id || null;
                  propertyOwnerRef.current = ownerObj?.id
                    ? { id: ownerObj.id, full_name: ownerObj.full_name || ownerObj.name || "" }
                    : null;

                  // Auto-fill owner from property if field is empty
                  if (
                    ownerObj &&
                    ownerObj.id &&
                    !extractId(formValuesRef.current?.customer)
                  ) {
                    formSetValueRef.current?.(
                      "customer",
                      { id: ownerObj.id, full_name: ownerObj.full_name || ownerObj.name || "" },
                      { shouldValidate: false },
                    );
                    personNameRef.current = ownerObj.full_name || ownerObj.name || null;
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
              propertyOwnerRef.current = null;
              propertyTitleRef.current = null;
              listingPropertyRef.current = null;
              setListingNoProperty(true);
              setPropertyListingMismatch(false);
            }
          })
          .catch(() => {});
      } else if (!listingId && lastFetchedListingId.current !== null) {
        // Listing cleared → clear property downstream; in owner mode the
        // person was tied to the property, so clear it too
        lastFetchedListingId.current = null;
        listingPropertyIdRef.current = null;
        listingPropertyRef.current = null;
        listingTitleRef.current = null;
        formSetValueRef.current?.("property", null, { shouldValidate: false });
        lastFetchedPropertyId.current = null;
        propertyOwnerIdRef.current = null;
        propertyOwnerRef.current = null;
        propertyTitleRef.current = null;
        setRelatedListings([]);
        if (personMode === "owner") {
          formSetValueRef.current?.("customer", null, { shouldValidate: false });
          lastFetchedPersonId.current = null;
          personNameRef.current = null;
          setRelatedProperties([]);
        }
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
      // Edit mode: restore the person kind recorded on the call
      setPersonMode(call?.owner ? "owner" : "customer");
      setRelatedProperties([]);
      setRelatedListings([]);
      lastFetchedPersonId.current = null;
      lastFetchedPropertyId.current = null;
      lastFetchedListingId.current = null;
      propertyOwnerIdRef.current = null;
      listingPropertyIdRef.current = null;
      personNameRef.current = null;
      propertyTitleRef.current = null;
      listingTitleRef.current = null;
      propertyOwnerRef.current = null;
      listingPropertyRef.current = null;
      setOwnerMismatch(false);
      setListingNoProperty(false);
      setPropertyListingMismatch(false);
    }
  }, [isOpen, call]);

  /* ─── Submit ─── */
  const FIELD_ERROR_LABELS = {
    owner: "مالک",
    customer: "مشتری",
    property: "ملک",
    listing: "آگهی",
    call_type: "نوع تماس",
    called_at: "زمان تماس",
    call_duration: "مدت تماس",
    result: "نتیجه تماس",
    note: "یادداشت",
  };

  const buildErrorMessage = (error) => {
    const data = error?.response?.data;
    if (data?.detail) return data.detail;
    if (data && typeof data === "object") {
      const parts = Object.entries(data)
        .filter(([key]) => FIELD_ERROR_LABELS[key])
        .map(([key, value]) => {
          const msg = Array.isArray(value) ? value.join("، ") : String(value);
          return `${FIELD_ERROR_LABELS[key]}: ${msg}`;
        });
      if (parts.length > 0) return parts.join(" | ");
    }
    return null;
  };

  // Human-readable explanation of every conflict for the confirm modal
  const buildMismatchMessage = () => {
    const parts = [];
    const personName = personNameRef.current;
    const propertyTitle = propertyTitleRef.current;
    const listingTitle = listingTitleRef.current;

    if (ownerMismatch && propertyOwnerRef.current) {
      parts.push(
        `مالک انتخاب‌شده${personName ? ` «${personName}»` : ""} مالکِ ملک${propertyTitle ? ` «${propertyTitle}»` : ""} نیست — مالک درست این ملک «${propertyOwnerRef.current.full_name}» است.`,
      );
    }
    if (propertyListingMismatch && listingPropertyRef.current) {
      parts.push(
        `ملک انتخاب‌شده${propertyTitle ? ` «${propertyTitle}»` : ""} با ملکِ آگهی مطابقت ندارد — آگهی${listingTitle ? ` «${listingTitle}»` : ""} متعلق به ملک «${listingPropertyRef.current.title}» است.`,
      );
    }
    parts.push(
      "با ثبت این تماس، لینک‌دهی بین مالک، ملک و اگهی به‌هم می‌ریزد و ممکن است در گزارش‌ها و پیگیری‌ها اطلاعات نادرست نمایش داده شود.",
    );
    return parts.join(" ");
  };

  const doSubmit = async (values) => {
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
      } else {
        await callService.create(payload);
      }

      // Success info modal (instead of a plain toast)
      const personLabel = personNameRef.current
        ? `برای «${personNameRef.current}»`
        : "";
      const details = [
        propertyTitleRef.current ? `ملک مرتبط: «${propertyTitleRef.current}»` : null,
        listingTitleRef.current ? `آگهی مرتبط: «${listingTitleRef.current}»` : null,
      ]
        .filter(Boolean)
        .join(" — ");
      setSuccessInfo({
        title: isEdit ? "تماس ویرایش شد" : "تماس ثبت شد",
        message: `تماس ${personLabel} با موفقیت ${isEdit ? "ویرایش" : "ثبت"} شد.${details ? ` ${details}.` : ""}`,
      });
      onClose();
    } catch (error) {
      console.error("Call form submit error:", error);
      toastService.error(
        buildErrorMessage(error) || "خطا در ثبت اطلاعات تماس.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (values) => {
    // Conflicting owner/property/listing → show an explicit confirmation first
    if (ownerMismatch || propertyListingMismatch) {
      setPendingConfirm({ values, message: buildMismatchMessage() });
      return;
    }
    doSubmit(values);
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
        // Edit: owner-calls prefill the person from `owner`, customer-calls from `customer`
        customer: call.owner ?? call.customer ?? null,
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

      {/* ─── Conflict confirmation before submit ─── */}
      <ConfirmModal
        isOpen={pendingConfirm !== null}
        onClose={() => setPendingConfirm(null)}
        onConfirm={() => {
          const values = pendingConfirm?.values;
          setPendingConfirm(null);
          doSubmit(values);
        }}
        title="تداخل در رکوردهای انتخاب‌شده"
        message={pendingConfirm?.message || ""}
        confirmText="بله، با این شرایط ثبت کن"
        cancelText="انصراف و اصلاح"
        variant="warning"
        isLoading={loading}
      />

      {/* ─── Success info ─── */}
      <ConfirmModal
        isOpen={successInfo !== null}
        onClose={() => {
          setSuccessInfo(null);
          onSuccess?.();
        }}
        onConfirm={() => {
          setSuccessInfo(null);
          onSuccess?.();
        }}
        title={successInfo?.title || ""}
        message={successInfo?.message || ""}
        confirmText="باشه"
        cancelText="بستن"
        variant="success"
      />
    </>
  );
}

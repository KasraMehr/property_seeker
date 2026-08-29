import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const buildQueryString = (params = {}) => {
  const sp = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      if (value.length > 0) {
        sp.append(key, value.join(","));
      }
      return;
    }

    sp.append(key, value);
  });

  return sp.toString();
};

const getAll = (params = {}) => {
  const qs = buildQueryString(params);

  const url = qs
    ? `${API_ENDPOINTS.PROPERTIES.LIST.url}?${qs}`
    : API_ENDPOINTS.PROPERTIES.LIST.url;

  return api.get(url);
};

const getById = (id) =>
  api.get(API_ENDPOINTS.PROPERTIES.DETAIL(id).url);

const create = (data) =>
  api.post(API_ENDPOINTS.PROPERTIES.CREATE.url, data);

const update = (id, data) =>
  api.patch(API_ENDPOINTS.PROPERTIES.UPDATE(id).url, data);

/**
 * Backend does NOT have single delete.
 * It expects:
 * DELETE /api/property/bulk-delete/
 * body: { ids: [...] }
 */
const bulkDelete = (ids) =>
  api.delete(API_ENDPOINTS.PROPERTIES.BULK_DELETE.url, {
    data: { ids },
  });

/** Fetch all status history, filter client-side by property id */
const getStatusHistory = async (propertyId, propertyCode) => {
  const res = await api.get(API_ENDPOINTS.PROPERTY_STATUS_HISTORY.LIST.url);
  const data = res?.data ?? res;
  const list = Array.isArray(data) ? data : data?.results ?? [];
  if (propertyCode) {
    return list.filter((h) => h.property_code === propertyCode);
  }
  return list.filter((h) => String(h.property) === String(propertyId));
};

/** Fetch all property features, filter client-side by property code */
const getFeatures = async (propertyId, propertyCode) => {
  const res = await api.get(API_ENDPOINTS.PROPERTY_FEATURES.LIST.url);
  const data = res?.data ?? res;
  const list = Array.isArray(data) ? data : data?.results ?? [];
  if (propertyCode) {
    return list.filter((f) => f.property_code === propertyCode);
  }
  return list.filter((f) => String(f.property) === String(propertyId));
};

/** Fetch all media, filter client-side by property id */
const getMedia = async (propertyId) => {
  const res = await api.get(API_ENDPOINTS.MEDIA.LIST.url);
  const data = res?.data ?? res;
  const list = Array.isArray(data) ? data : data?.results ?? [];
  return list.filter((m) => String(m.property) === String(propertyId));
};

/** Fetch all available features */
const getAllFeatures = async () => {
  const res = await api.get(API_ENDPOINTS.FEATURES.LIST.url);
  const data = res?.data ?? res;
  return Array.isArray(data) ? data : data?.results ?? [];
};

/** Fetch property features (links), filter by property id */
const getPropertyFeatures = async (propertyId) => {
  try {
    const res = await api.get(API_ENDPOINTS.PROPERTY_FEATURES.LIST.url);
    const data = res?.data ?? res;
    const list = Array.isArray(data) ? data : data?.results ?? [];
    return list.filter((f) => String(f.property) === String(propertyId) || String(f.property_code) === String(propertyId));
  } catch (e) {
    console.error("getPropertyFeatures error:", e);
    return [];
  }
};

/** Add a feature to a property */
const addPropertyFeature = async (propertyId, featureId) => {
  return api.post(API_ENDPOINTS.PROPERTY_FEATURES.CREATE.url, {
    property: propertyId,
    feature: featureId,
  });
};

/** Remove features from a property */
const removePropertyFeatures = async (ids) => {
  return api.delete(API_ENDPOINTS.PROPERTY_FEATURES.DELETE().url, {
    data: { ids },
  });
};

const propertyService = {
  getAll,
  getById,
  create,
  update,
  bulkDelete,
  getStatusHistory,
  getFeatures,
  getMedia,
  getAllFeatures,
  getPropertyFeatures,
  addPropertyFeature,
  removePropertyFeatures,
};

export default propertyService;
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

// Define query strings for filters
const buildQueryString = (params) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      sp.append(key, value.join(","));
    } else if (value !== null && value !== undefined && value !== "") {
      sp.append(key, value);
    }
  });
  return sp.toString();
};

const getAll = (params = {}) => {
  const qs = buildQueryString(params);
  const url = qs
    ? `${API_ENDPOINTS.LISTINGS.LIST.url}?${qs}`
    : API_ENDPOINTS.LISTINGS.LIST.url;
  return api.get(url);
};

const getById = (id) => api.get(API_ENDPOINTS.LISTINGS.DETAIL(id).url);
const create = (data) => api.post(API_ENDPOINTS.LISTINGS.CREATE.url, data);
const update = (id, data) =>
  api.put(API_ENDPOINTS.LISTINGS.UPDATE(id).url, data);
const remove = (id) => api.delete(API_ENDPOINTS.LISTINGS.DELETE(id).url);
const assign = (id, userId) =>
  api.put(API_ENDPOINTS.LISTINGS.ASSIGN(id).url, { assigned_to: userId });
const convertToOwner = (id, ownerData) =>
  api.post(API_ENDPOINTS.LISTINGS.CONVERT_TO_OWNER(id).url, {
    owner_data: ownerData,
  });
const convertToProperty = (id, propertyData) =>
  api.post(API_ENDPOINTS.LISTINGS.CONVERT_TO_PROPERTY(id).url, {
    property_data: propertyData,
  });

  const bulkChangeReviewStatus = (ids, reviewStatus, note) =>
  api.put(API_ENDPOINTS.LISTINGS.bulkChangeReviewStatus, { ids, review_status: reviewStatus, note });

const listingService = {
  getAll,
  getById,
  create,
  update,
  remove,
  assign,
  convertToOwner,
  convertToProperty,
  bulkChangeReviewStatus,
};

export default listingService;

import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = (params = {}) => api.get(API_ENDPOINTS.LISTINGS.LIST.url, { params });

const getById = (id) => api.get(API_ENDPOINTS.LISTINGS.DETAIL(id).url);

const create = (data) => api.post(API_ENDPOINTS.LISTINGS.CREATE.url, data);

const update = (id, data) => api.put(API_ENDPOINTS.LISTINGS.UPDATE(id).url, data);

const remove = (id) => api.delete(API_ENDPOINTS.LISTINGS.DELETE(id).url);

const assign = (id, userId) => api.put(API_ENDPOINTS.LISTINGS.ASSIGN(id).url, { assigned_to: userId });

const convertToOwner = (id, ownerData) => api.post(API_ENDPOINTS.LISTINGS.CONVERT_TO_OWNER(id).url, { owner_data: ownerData });

const convertToProperty = (id, propertyData) => api.post(API_ENDPOINTS.LISTINGS.CONVERT_TO_PROPERTY(id).url, { property_data: propertyData });

const listingService = {
  getAll,
  getById,
  create,
  update,
  remove,
  assign,
  convertToOwner,
  convertToProperty,
};

export default listingService;
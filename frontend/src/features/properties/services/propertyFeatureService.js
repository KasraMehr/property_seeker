import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = (params = {}) => api.get(API_ENDPOINTS.PROPERTY_FEATURES.LIST.url, { params });

const create = (data) => api.post(API_ENDPOINTS.PROPERTY_FEATURES.CREATE.url, data);

const getById = (id) => api.get(API_ENDPOINTS.PROPERTY_FEATURES.DETAIL(id).url);

const update = (id, data) => api.put(API_ENDPOINTS.PROPERTY_FEATURES.UPDATE(id).url, data);

const remove = (id) => api.delete(API_ENDPOINTS.PROPERTY_FEATURES.DELETE(id).url);

const propertyFeatureService = {
  getAll,
  create,
  getById,
  update,
  remove,
};

export default propertyFeatureService;
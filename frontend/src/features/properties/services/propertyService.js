import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = () => api.get(API_ENDPOINTS.PROPERTIES.LIST.url);

const getById = (id) => api.get(API_ENDPOINTS.PROPERTIES.DETAIL(id).url);

const create = (data) => api.post(API_ENDPOINTS.PROPERTIES.CREATE.url, data);

const update = (id, data) => api.put(API_ENDPOINTS.PROPERTIES.UPDATE(id).url, data);

const remove = (id) => api.delete(API_ENDPOINTS.PROPERTIES.DELETE(id).url);

const search = (query) => api.get(API_ENDPOINTS.PROPERTIES.SEARCH.url, { params: { q: query } });

const getByOwner = (ownerId) => api.get(API_ENDPOINTS.PROPERTIES.BY_OWNER(ownerId).url);

const getByAgent = (agentId) => api.get(API_ENDPOINTS.PROPERTIES.BY_AGENT(agentId).url);

const getByStatus = (status) => api.get(API_ENDPOINTS.PROPERTIES.BY_STATUS(status).url);

const propertyService = {
  getAll,
  getById,
  create,
  update,
  remove,
  search,
  getByOwner,
  getByAgent,
  getByStatus,
};

export default propertyService;
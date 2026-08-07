import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = () => api.get(API_ENDPOINTS.PROPERTIES.LIST.url);

const getById = (id) => api.get(API_ENDPOINTS.PROPERTIES.DETAIL(id).url);

const create = (data) => api.post(API_ENDPOINTS.PROPERTIES.CREATE.url, data);

const update = (id, data) => api.put(API_ENDPOINTS.PROPERTIES.UPDATE(id).url, data);

const remove = (id) => api.delete(API_ENDPOINTS.PROPERTIES.DELETE(id).url);

// on the LIST endpoint (?search=, ?owner=, ?agent=, ?status=) — check backend support
const getAllWithParams = (params = {}) =>
  api.get(API_ENDPOINTS.PROPERTIES.LIST.url, { params });

const bulkChangeStatus = (ids, status, note) =>
  api.put(API_ENDPOINTS.PROPERTIES.BULK_CHANGE_STATUS.url, { ids, status, note });

const bulkAssignAgent = (ids, agentId, note) =>
  api.put(API_ENDPOINTS.PROPERTIES.BULK_ASSIGN_AGENT.url, { ids, agent_id: agentId, note });

const propertyService = {
  getAll,
  getById,
  create,
  update,
  remove,
  getAllWithParams,
  bulkAssignAgent,
  bulkChangeStatus,
};

export default propertyService;
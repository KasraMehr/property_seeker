import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = (params = {}) =>
  api.get(API_ENDPOINTS.AUDIT.ACTIVITY.LIST.url, { params });

const getById = (id) =>
  api.get(API_ENDPOINTS.AUDIT.ACTIVITY.DETAIL(id).url);

// Filters — check with backend if these query params are actually supported
const getByAction = (action, params = {}) =>
  getAll({ ...params, action });

const getByEntity = (entityType, entityId, params = {}) =>
  getAll({ ...params, entity_type: entityType, entity_id: entityId });

const getByRequestId = (requestId, params = {}) =>
  getAll({ ...params, request_id: requestId });

const activityLogService = {
  getAll,
  getById,
  getByAction,
  getByEntity,
  getByRequestId,
};

export default activityLogService;
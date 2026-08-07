import api from "@/lib/api";
// TODO: add to apiEndpoints
const BASE = "/api/activity";

const getAll = (params = {}) =>
  api.get(`${BASE}/list/`, { params });

const getById = (id) =>
  api.get(`${BASE}/detail/${id}/`);

// Filters matching ActivitySelector
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
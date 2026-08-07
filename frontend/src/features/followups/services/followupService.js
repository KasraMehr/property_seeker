import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = (params = {}) =>
  api.get(API_ENDPOINTS.CRM.REMINDERS.LIST.url, { params });

const getById = (id) => api.get(API_ENDPOINTS.CRM.REMINDERS.DETAIL?.(id).url);

const create = (data) => api.post(API_ENDPOINTS.CRM.REMINDERS.CREATE.url, data);

const complete = (id) => api.put(API_ENDPOINTS.CRM.REMINDERS.COMPLETE(id).url);

const update = (id, data) => api.put(API_ENDPOINTS.CRM.REMINDERS.UPDATE?.(id).url, data);

const cancel = (id) => api.put(API_ENDPOINTS.CRM.REMINDERS.CANCEL(id).url);

const remove = (id) => api.delete(API_ENDPOINTS.CRM.REMINDERS.DELETE?.(id).url);

const followupService = {
  getAll,
  getById,
  create,
  update,
  complete,
  cancel,
  remove,
};

export default followupService;

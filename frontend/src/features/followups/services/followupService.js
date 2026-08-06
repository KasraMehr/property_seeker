import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = (params = {}) =>
  api.get(API_ENDPOINTS.CRM.REMINDERS.LIST.url, { params });

const create = (data) =>
  api.post(API_ENDPOINTS.CRM.REMINDERS.CREATE.url, data);

const complete = (id) =>
  api.put(API_ENDPOINTS.CRM.REMINDERS.COMPLETE(id).url);

const cancel = (id) =>
  api.put(API_ENDPOINTS.CRM.REMINDERS.CANCEL(id).url);

const followupService = {
  getAll,
  create,
  complete,
  cancel,
};

export default followupService;
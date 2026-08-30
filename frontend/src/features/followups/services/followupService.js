import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = (params = {}) =>
  api.get(API_ENDPOINTS.CRM.REMINDERS.LIST.url, { params });

const getById = (id) => api.get(API_ENDPOINTS.CRM.REMINDERS.DETAIL(id).url);

const create = (data) => api.post(API_ENDPOINTS.CRM.REMINDERS.CREATE.url, data);

const update = (id, data) =>
  api.put(API_ENDPOINTS.CRM.REMINDERS.UPDATE(id).url, data);

const remove = (id) =>
  api.delete(API_ENDPOINTS.CRM.REMINDERS.BULK_DELETE.url, {
    data: { ids: [id] },
  });

const bulkDelete = (ids) =>
  api.delete(API_ENDPOINTS.CRM.REMINDERS.BULK_DELETE.url, {
    data: { ids },
  });

const complete = (id) => update(id, { status: "done" });
const cancel = (id) => update(id, { status: "canceled" });

const followupService = {
  getAll,
  getById,
  create,
  update,
  complete,
  cancel,
  remove,
  bulkDelete,
};

export default followupService;

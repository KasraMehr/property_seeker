import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = (params = {}) =>
  api.get(API_ENDPOINTS.CRM.CALLS.LIST.url, { params });

const getById = (id) =>
  api.get(API_ENDPOINTS.CRM.CALLS.DETAIL.url.replace(":id", id));

const create = (data) =>
  api.post(API_ENDPOINTS.CRM.CALLS.CREATE.url, data);

const update = (id, data) =>
  api.patch(API_ENDPOINTS.CRM.CALLS.UPDATE.url.replace(":id", id), data);

const remove = (id) =>
  api.delete(API_ENDPOINTS.CRM.CALLS.DELETE.url.replace(":id", id));

const callService = {
  getAll,
  getById,
  create,
  update,
  remove,
};

export default callService;
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = (params = {}) =>
  api.get(API_ENDPOINTS.CRM.CALLS.LIST.url, { params });

const create = (data) =>
  api.post(API_ENDPOINTS.CRM.CALLS.CREATE.url, data);

const getById = (id) =>
  api.get(API_ENDPOINTS.CRM.CALLS.DETAIL(id).url);

const update = (id, data) =>
  api.patch(API_ENDPOINTS.CRM.CALLS.UPDATE(id).url, data);

const bulkRemove = (ids) =>
  api.delete(API_ENDPOINTS.CRM.CALLS.BULK_DELETE.url, {
    data: { ids },
  });

const remove = (id) => bulkRemove([id]);

const callService = {
  getAll,
  create,
  getById,
  update,
  remove,
  bulkRemove,
};

export default callService;
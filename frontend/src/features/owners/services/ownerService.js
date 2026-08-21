import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = (params = {}) => api.get(API_ENDPOINTS.OWNERS.LIST.url , {params});

const getById = (id) => api.get(API_ENDPOINTS.OWNERS.DETAIL(id).url);

const create = (data) => api.post(API_ENDPOINTS.OWNERS.CREATE.url, data);

const update = (id, data) => api.put(API_ENDPOINTS.OWNERS.UPDATE(id).url, data);

const remove = (id) =>
  api.delete(API_ENDPOINTS.OWNERS.BULK_DELETE.url, {
    data: { ids: [id] },
  });

const bulkDelete = (ids) =>
  api.delete(API_ENDPOINTS.OWNERS.BULK_DELETE.url, {
    data: { ids },
  });

const ownerService = {
  getAll,
  getById,
  create,
  update,
  remove,
  bulkDelete,
};

export default ownerService;
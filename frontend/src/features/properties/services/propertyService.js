import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const buildQueryString = (params = {}) => {
  const sp = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      if (value.length > 0) {
        sp.append(key, value.join(","));
      }
      return;
    }

    sp.append(key, value);
  });

  return sp.toString();
};

const getAll = (params = {}) => {
  const qs = buildQueryString(params);

  const url = qs
    ? `${API_ENDPOINTS.PROPERTIES.LIST.url}?${qs}`
    : API_ENDPOINTS.PROPERTIES.LIST.url;

  return api.get(url);
};

const getById = (id) =>
  api.get(API_ENDPOINTS.PROPERTIES.DETAIL(id).url);

const create = (data) =>
  api.post(API_ENDPOINTS.PROPERTIES.CREATE.url, data);

const update = (id, data) =>
  api.patch(API_ENDPOINTS.PROPERTIES.UPDATE(id).url, data);

/**
 * Backend does NOT have single delete.
 * It expects:
 * DELETE /api/property/bulk-delete/
 * body: { ids: [...] }
 */
const bulkDelete = (ids) =>
  api.delete(API_ENDPOINTS.PROPERTIES.BULK_DELETE.url, {
    data: { ids },
  });

const propertyService = {
  getAll,
  getById,
  create,
  update,
  bulkDelete,
};

export default propertyService;
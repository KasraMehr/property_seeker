import locationService from "./locationService";

/**
 * RegionService — adapter over locationService
 * Treats "districts" as the manageable "regions"
 */

const getAll = (params = {}) => locationService.getDistricts(params);

const getById = async (id) => {
  const res = await locationService.getDistricts();
  // Handle both paginated { results } and plain array
  const list = res.data?.results || res.data || [];
  const district = list.find((d) => d.id === Number(id));
  return { data: district };
};

const create = (data) => api.post(API_ENDPOINTS.LOCATIONS.DISTRICTS.url, data);

const update = (id, data) => api.put(`${API_BASE}/locations/districts/${id}/`, data);

const remove = (id) => api.delete(`${API_BASE}/locations/districts/${id}/`);

const regionService = {
  getAll,
  getById,
};

export default regionService;
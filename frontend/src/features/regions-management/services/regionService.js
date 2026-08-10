import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import locationService from "./locationService";

/**
 * RegionService — adapter over locationService
 * Treats "districts" as the manageable "regions"
 */

const getAll = (params = {}) => locationService.getDistricts(params);

const getById = (id) =>
  api.get(API_ENDPOINTS.LOCATIONS.DISTRICTS.DETAIL(id).url);

const create = (data) =>
  api.post(API_ENDPOINTS.LOCATIONS.DISTRICTS.CREATE.url, data);

const update = (id, data) =>
  api.put(API_ENDPOINTS.LOCATIONS.DISTRICTS.UPDATE(id).url, data);

const remove = (id) =>
  api.delete(API_ENDPOINTS.LOCATIONS.DISTRICTS.DELETE(id).url);

const regionService = {
  getAll,
  getById,
  create,
  update,
  remove,
};

export default regionService;

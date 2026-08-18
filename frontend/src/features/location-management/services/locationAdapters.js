import locationService from "./locationService";

/**
 * Adapters so useResource / useLocationLevel get a uniform
 * { getAll, getById, create, update, remove } surface per level.
 * remove accepts id | id[]
 */

function asRemove(bulkFn) {
  return (idOrIds) => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    return bulkFn(ids);
  };
}

export const provinceAdapter = {
  getAll: (params) => locationService.getProvinces(params),
  getById: (id) => locationService.getProvinceById(id),
  create: (data) => locationService.createProvince(data),
  update: (id, data) => locationService.updateProvince(id, data),
  remove: asRemove(locationService.bulkDeleteProvinces),
};

export const cityAdapter = {
  getAll: (params) => locationService.getCities(params),
  getById: (id) => locationService.getCityById(id),
  create: (data) => locationService.createCity(data),
  update: (id, data) => locationService.updateCity(id, data),
  remove: asRemove(locationService.bulkDeleteCities),
};

export const districtAdapter = {
  getAll: (params) => locationService.getDistricts(params),
  getById: (id) => locationService.getDistrictById(id),
  create: (data) => locationService.createDistrict(data),
  update: (id, data) => locationService.updateDistrict(id, data),
  remove: asRemove(locationService.bulkDeleteDistricts),
};

export const neighborhoodAdapter = {
  getAll: (params) => locationService.getNeighborhoods(params),
  getById: (id) => locationService.getNeighborhoodById(id),
  create: (data) => locationService.createNeighborhood(data),
  update: (id, data) => locationService.updateNeighborhood(id, data),
  remove: asRemove(locationService.bulkDeleteNeighborhoods),
};

export const LOCATION_ADAPTERS = {
  province: provinceAdapter,
  city: cityAdapter,
  district: districtAdapter,
  neighborhood: neighborhoodAdapter,
};
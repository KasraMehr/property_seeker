import locationService from "./locationService";

/**
 * RegionService — thin adapter over District (منطقه) for legacy "region" naming.
 * Prefer locationService directly for multi-level hierarchy work.
 *
 * Shape expected by useResource:
 *   getAll / getById / create / update / remove
 */

const getAll = (params = {}) => locationService.getDistricts(params);

const getById = (id) => locationService.getDistrictById(id);

const create = (data) => locationService.createDistrict(data);

const update = (id, data) => locationService.updateDistrict(id, data);

/** Single or bulk — accepts id or ids[] */
const remove = (idOrIds) => {
  const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
  return locationService.bulkDeleteDistricts(ids);
};

const bulkRemove = (ids) => locationService.bulkDeleteDistricts(ids);

const regionService = {
  getAll,
  getById,
  create,
  update,
  remove,
  bulkRemove,
};

export default regionService;

import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const getAll = (params = {}) =>
  api.get(API_ENDPOINTS.CRM.CALLS.LIST.url, { params });

const create = (data) => api.post(API_ENDPOINTS.CRM.CALLS.CREATE.url, data); 

const getById = (id) => api.get(API_ENDPOINTS.CRM.CALLS.DETAIL(id).url);

const update = (id, data) =>  
  api.put(API_ENDPOINTS.CRM.CALLS.UPDATE(id).url, data);

const remove = (id) =>  
  api.delete(API_ENDPOINTS.CRM.CALLS.DELETE(id).url);

const callService = {
  getAll,
  create,
  getById,
  update,  
  remove,   
};

export default callService;
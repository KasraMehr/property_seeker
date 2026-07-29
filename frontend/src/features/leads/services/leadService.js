import api from "@/lib/api";

// All leads
const getLeads = async (params = {}) => {
  try {
    const { data } = await api.get('/listings/', { params });
    return { success: true, data };
  } catch (error) {
    console.error('Get Leads Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'خطا در دریافت لیست آگهی‌ها',
      data: [],
    };
  }
};

// Single lead details
const getLeadById = async (id) => {
  try {
    const { data } = await api.get(`/listings/${id}/`);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'آگهی یافت نشد',
      data: null,
    };
  }
};

// Edit/ Update lead status
const updateLeadStatus = async (id, status) => {
  try {
    const { data } = await api.patch(`/listings/${id}/status/`, { status });
    return { success: true, data, message: 'وضعیت آگهی با موفقیت بروزرسانی شد' };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'خطا در تغییر وضعیت آگهی',
    };
  }
};

// Assign lead to operator
const assignLead = async (id, operatorId) => {
  try {
    const { data } = await api.patch(`/listings/${id}/assign/`, { operator_id: operatorId });
    return { success: true, data, message: 'آگهی با موفقیت تخصیص داده شد' };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'خطا در تخصیص آگهی',
    };
  }
};

const leadService = {
  getLeads,
  getLeadById,
  updateLeadStatus,
  assignLead,
};

export default leadService;
import api from "../../../lib/api";

// All owners
const getOwners = async () => {
  try {
    const { data } = await api.get('/owners/');
    return { success: true, data };
  } catch (error) {
    return { success: false, data: [] };
  }
};

// New owner
const createOwner = async (ownerData) => {
  try {
    const { data } = await api.post("/owners/", ownerData);
    return {
      success: true,
      data,
      message: "اطلاعات مالک با موفقیت ثبت شد",
    };
  } catch (error) {
    console.error("Create Owner Error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "خطا در ثبت اطلاعات مالک",
    };
  }
};

// All property files
const getProperties = async () => {
  try {
    const { data } = await api.get('/properties/', { params });
    return { success: true, data };
  } catch (error) {
    console.error('Get Properties Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'خطا در دریافت لیست فایل‌ها',
      data: [],
    };
  }
};

// Property details
const getPropertyById = async (id) => {
  try {
    const { data } = await api.get(`/properties/${id}/`);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'فایل ملک یافت نشد',
      data: null,
    };
  }
};

// Update property details
const updateProperty = async (id, propertyData) => {
  try {
    const { data } = await api.patch(`/properties/${id}/`, propertyData);
    return { success: true, data, message: 'اطلاعات فایل ملکی بروزرسانی شد' };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'خطا در بروزرسانی فایل ملکی',
    };
  }
};

// ----------- Core : convert lead to property
const convertLeadToProperty = async (conversionData) => {
  try {
    const { data } = await api.post('/properties/', conversionData);
    return { success: true, data, message: 'آگهی با موفقیت به فایل تبدیل شد' };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'خطا در تبدیل آگهی به فایل',
    };
  }
};

// Features of property (parking , ... )
const getFeatures = async () => {
  try {
    const { data } = await api.get('/features/');
    return { success: true, data };
  } catch (error) {
    return { success: false, data: [] };
  }
};

const propertyService = {
  getOwners,
  createOwner,
  getProperties,
  getPropertyById,
  convertLeadToProperty,
  getFeatures,
};

export default propertyService;
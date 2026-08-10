import propertyService from "@/features/properties/services/propertyService";
import customerService from "@/features/customers/services/customerService";
import followupService from "@/features/followups/services/followupService";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import api from "@/lib/api"

const getAdminStats = async () => {
  try {
    const [propertiesRes, customersRes, remindersRes] =
      await Promise.allSettled([
        propertyService.getAll(),
        customerService.getAll(),
        followupService.getAll(),
      ]);

    const properties =
      propertiesRes.status === "fulfilled"
        ? propertiesRes.value?.data?.results || propertiesRes.value?.data || []
        : [];
    const customers =
      customersRes.status === "fulfilled"
        ? customersRes.value?.data?.results || customersRes.value?.data || []
        : [];
    const reminders =
      remindersRes.status === "fulfilled"
        ? remindersRes.value?.data?.results || remindersRes.value?.data || []
        : [];

    return {
      data: {
        total_properties: properties.length,
        total_customers: customers.length,
        pending_followups: reminders.filter((r) => r.status === "pending")
          .length,
        active_listings: properties.filter(
          (p) => p.status === "active" || p.status === "published",
        ).length,
      },
    };
  } catch (error) {
    console.error("Failed to aggregate admin dashboard stats:", error);
    return {
      data: {
        total_properties: 0,
        total_customers: 0,
        pending_followups: 0,
        active_listings: 0,
      },
    };
  }
};

const getOperatorStats = async () => {
  try {
    const [propertiesRes, remindersRes] = await Promise.allSettled([
      propertyService.getAll(),
      followupService.getAll(),
    ]);

    const properties =
      propertiesRes.status === "fulfilled"
        ? propertiesRes.value?.data?.results || propertiesRes.value?.data || []
        : [];
    const reminders =
      remindersRes.status === "fulfilled"
        ? remindersRes.value?.data?.results || remindersRes.value?.data || []
        : [];

    return {
      data: {
        my_properties: properties.length,
        my_pending_followups: reminders.filter((r) => r.status === "pending")
          .length,
      },
    };
  } catch (error) {
    console.error("Failed to aggregate operator dashboard stats:", error);
    return {
      data: {
        my_properties: 0,
        my_pending_followups: 0,
      },
    };
  }
};

const updateProfile = (userId, data) =>
  api.put(API_ENDPOINTS.ACCOUNTS.USERS.UPDATE(userId).url, data);

const dashboardService = {
  getAdminStats,
  getOperatorStats,
  updateProfile,
};

export default dashboardService;

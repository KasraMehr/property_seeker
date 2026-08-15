/**
 * API Endpoints - MVP only
 *
 * [OK]   = backend ready (view + url + serializer)
 * [PEND] = backend model exists, views/serializers/urls pending
 * [MOCK] = proposed for MVP, backend not started yet
 *
 * - All updates use PUT (backend does not support PATCH)
 * - Django trailing slashes: LOCATIONS have them, PROPERTIES do NOT, OWNERS mixed
 * - Listing = Lead (same entity, backend app name: "listing")
 */

const API_BASE = "/api";

export const API_ENDPOINTS = {
  // 1. AUTH
  AUTH: {
    LOGIN: {
      url: `${API_BASE}/accounts/login/`,
      method: "POST",
      status: "[OK]",
    },
    LOGOUT: {
      url: `${API_BASE}/accounts/logout/`,
      method: "POST",
      status: "[OK]",
    },
    REFRESH: {
      url: `${API_BASE}/accounts/refresh/`,
      method: "POST",
      status: "[OK]",
    },
    VERIFY: {
      url: `${API_BASE}/accounts/verify/`,
      method: "GET",
      status: "[OK]",
    },
  },

  // 2. ACCOUNTS (users, agencies, roles)
  ACCOUNTS: {
    USERS: {
      LIST: {
        url: `${API_BASE}/accounts/users/`,
        method: "GET",
        status: "[OK]",
      },
      DETAIL: (id) => ({
        url: `${API_BASE}/accounts/users/${id}/`,
        method: "GET",
        status: "[OK]",
      }),
      CREATE: {
        url: `${API_BASE}/accounts/users/`,
        method: "POST",
        status: "[OK]",
      },
      UPDATE: (id) => ({
        url: `${API_BASE}/accounts/users/${id}/`,
        method: "PUT",
        status: "[OK]",
      }),
      DELETE: (id) => ({
        url: `${API_BASE}/accounts/users/${id}/`,
        method: "DELETE",
        status: "[OK]",
      }),
      BULK_CHANGE_ROLE: {
        url: `${API_BASE}/accounts/users/bulk-change-role/`,
        method: "PUT",
        status: "[PEND]",
      },
      BULK_TOGGLE_ACTIVE: {
        url: `${API_BASE}/accounts/users/bulk-toggle-active/`,
        method: "PUT",
        status: "[PEND]",
      },
    },
    AGENCIES: {
      LIST: {
        url: `${API_BASE}/accounts/agencies/`,
        method: "GET",
        status: "[OK]",
      },
      DETAIL: (id) => ({
        url: `${API_BASE}/accounts/agencies/${id}/`,
        method: "GET",
        status: "[OK]",
      }),
      CREATE: {
        url: `${API_BASE}/accounts/agencies/`,
        method: "POST",
        status: "[OK]",
      },
      UPDATE: (id) => ({
        url: `${API_BASE}/accounts/agencies/${id}/`,
        method: "PUT",
        status: "[OK]",
      }),
    },
    ROLES: {
      LIST: {
        url: `${API_BASE}/accounts/roles/`,
        method: "GET",
        status: "[OK]",
      },
      DETAIL: (id) => ({
        url: `${API_BASE}/accounts/roles/${id}/`,
        method: "GET",
        status: "[OK]",
      }),
      CREATE: {
        url: `${API_BASE}/accounts/roles/`,
        method: "POST",
        status: "[OK]",
      },
      UPDATE: (id) => ({
        url: `${API_BASE}/accounts/roles/${id}/`,
        method: "PUT",
        status: "[OK]",
      }),
    },
    PERMISSIONS: {
      LIST: {
        url: `${API_BASE}/accounts/permissions/`,
        method: "GET",
        status: "[OK]",
      },
    },
  },

  // 3. LOCATIONS — matched to actual backend urls.py
  LOCATIONS: {
    PROVINCES: {
      LIST: { url: `${API_BASE}/province/list/`, method: "GET" },
      CREATE: { url: `${API_BASE}/province/create/`, method: "POST" },
      DETAIL: (id) => ({ url: `${API_BASE}/province/${id}/`, method: "GET" }),
      UPDATE: (id) => ({
        url: `${API_BASE}/province/update/${id}/`,
        method: "PUT",
      }),
      DELETE: { url: `${API_BASE}/province/delete/`, method: "POST" },
    },
    CITIES: {
      LIST: { url: `${API_BASE}/city/list/`, method: "GET" },
      CREATE: { url: `${API_BASE}/city/create/`, method: "POST" },
      DETAIL: (id) => ({ url: `${API_BASE}/city/${id}/`, method: "GET" }),
      UPDATE: (id) => ({
        url: `${API_BASE}/city/${id}/update/`,
        method: "PUT",
      }),
      DELETE: (id) => ({
        url: `${API_BASE}/city/${id}/delete/`,
        method: "POST",
      }),
    },
    DISTRICTS: {
      LIST: { url: `${API_BASE}/district/`, method: "GET" },
      CREATE: { url: `${API_BASE}/district/`, method: "POST" },
      DETAIL: (id) => ({ url: `${API_BASE}/district/${id}/`, method: "GET" }),
      DELETE: { url: `${API_BASE}/district/delete`, method: "POST" },
    },
    NEIGHBORHOODS: {
      LIST: { url: `${API_BASE}/neighborhoods/`, method: "GET" },
      CREATE: { url: `${API_BASE}/neighborhoods/`, method: "POST" },
      DETAIL: (id) => ({
        url: `${API_BASE}/neighborhoods/${id}/`,
        method: "GET",
      }),
      DELETE: { url: `${API_BASE}/neighborhoods/delete/`, method: "POST" },
    },
    ADDRESSES: {
      LIST: { url: `${API_BASE}/addresses/`, method: "GET" },
      CREATE: { url: `${API_BASE}/addresses/`, method: "POST" },
      DETAIL: (id) => ({ url: `${API_BASE}/addresses/${id}/`, method: "GET" }),
      DELETE: { url: `${API_BASE}/address/delete/`, method: "POST" },
    },
  },

  // 4. OWNERS — mixed trailing slashes as per backend
  OWNERS: {
    LIST: { url: `${API_BASE}/owner/list/`, method: "GET", status: "[OK]" },
    DETAIL: (id) => ({
      url: `${API_BASE}/owner/detail/${id}`,
      method: "GET",
      status: "[OK]",
    }),
    CREATE: {
      url: `${API_BASE}/owner/create/`,
      method: "POST",
      status: "[OK]",
    },
    UPDATE: (id) => ({
      url: `${API_BASE}/owner/update/${id}`,
      method: "PUT",
      status: "[OK]",
    }),
    DELETE: (id) => ({
      url: `${API_BASE}/owner/delete/${id}`,
      method: "DELETE",
      status: "[OK]",
    }),
  },

  // 5. PROPERTIES — require trailing slashes
  PROPERTIES: {
    LIST: {
      url: `${API_BASE}/property/list/`,
      method: "GET",
      status: "[OK]",
    },

    DETAIL: (id) => ({
      url: `${API_BASE}/property/detail/${id}/`,
      method: "GET",
      status: "[OK]",
    }),

    CREATE: {
      url: `${API_BASE}/property/create/`,
      method: "POST",
      status: "[OK]",
    },

    UPDATE: (id) => ({
      url: `${API_BASE}/property/update/${id}/`,
      method: "PATCH",
      status: "[OK]",
    }),

    BULK_DELETE: {
      url: `${API_BASE}/property/bulk-delete/`,
      method: "DELETE",
      status: "[OK]",
    },
  },

  // 6. LISTINGS (backend: listing app)
  LISTINGS: {
    LIST: {
      url: `${API_BASE}/listing/list/`,
      method: "GET",
      status: "[OK]",
    },
    DETAIL: (id) => ({
      url: `${API_BASE}/listing/detail/${id}/`,
      method: "GET",
      status: "[OK]",
    }),
    REVIEW: (id) => ({
      url: `${API_BASE}/listing/${id}/review/`,
      method: "PUT",
      status: "[OK]",
    }),
    BULK_REVIEW: {
      url: `${API_BASE}/listing/bulk/review-change-status/`,
      method: "PUT",
      status: "[OK]",
    },
    PROMOTE: (id) => ({
      url: `${API_BASE}/listing/${id}/promote/`,
      method: "POST",
      status: "[OK]",
    }),
  },

  // 7. CRM
  CRM: {
    // Calls: combined list+create on same URL, read-only detail
    CALLS: {
      LIST: { url: `${API_BASE}/calls/`, method: "GET", status: "[OK]" },
      DETAIL: (id) => ({
        url: `${API_BASE}/calls/${id}/`,
        method: "GET",
        status: "[OK]",
      }),
      CREATE: { url: `${API_BASE}/calls/`, method: "POST", status: "[OK]" },
      UPDATE: (id) => ({
        url: `${API_BASE}/calls/${id}/update/`,
        method: "PATCH",
        status: "[OK]",
      }),
      DELETE: (id) => ({
        url: `${API_BASE}/calls/${id}/delete/`,
        method: "DELETE",
        status: "[OK]",
      }),
    },
    // Reminders: separate paths for create/update/delete
    REMINDERS: {
      LIST: { url: `${API_BASE}/reminders/`, method: "GET", status: "[OK]" },
      CREATE: {
        url: `${API_BASE}/reminders/create/`,
        method: "POST",
        status: "[OK]",
      },
      DETAIL: (id) => ({
        url: `${API_BASE}/reminders/${id}/`,
        method: "GET",
        status: "[OK]",
      }),
      UPDATE: (id) => ({
        url: `${API_BASE}/reminders/update/${id}/`,
        method: "PUT",
        status: "[OK]",
      }),
      DELETE: (id) => ({
        url: `${API_BASE}/reminders/delete/${id}/`,
        method: "DELETE",
        status: "[OK]",
      }),
    },
  },

  // 8. CUSTOMERS & CUSTOMER PREFERENCES
  CUSTOMERS: {
    LIST: { url: `${API_BASE}/customers/`, method: "GET", status: "[OK]" },
    CREATE: { url: `${API_BASE}/customers/`, method: "POST", status: "[OK]" },
    DETAIL: (id) => ({
      url: `${API_BASE}/customers/${id}/`,
      method: "GET",
      status: "[OK]",
    }),
    UPDATE: (id) => ({
      url: `${API_BASE}/customers/${id}/`,
      method: "PUT",
      status: "[OK]",
    }),
    DELETE: (id) => ({
      url: `${API_BASE}/customers/${id}/`,
      method: "DELETE",
      status: "[OK]",
    }),
  },
  CUSTOMER_PREFERENCES: {
    LIST: {
      url: `${API_BASE}/customer-preferences/`,
      method: "GET",
      status: "[OK]",
    },
    CREATE: {
      url: `${API_BASE}/customer-preferences/`,
      method: "POST",
      status: "[OK]",
    },
    DETAIL: (id) => ({
      url: `${API_BASE}/customer-preferences/${id}/`,
      method: "GET",
      status: "[OK]",
    }),
  },

  // 9. VISITS (PropertyVisit)
  VISITS: {
    LIST: { url: `${API_BASE}/visits/`, method: "GET", status: "[OK]" },
    CREATE: {
      url: `${API_BASE}/visits/create/`,
      method: "POST",
      status: "[OK]",
    },
    DETAIL: (id) => ({
      url: `${API_BASE}/visits/${id}/`,
      method: "GET",
      status: "[OK]",
    }),
    UPDATE: (id) => ({
      url: `${API_BASE}/visits/update/${id}/`,
      method: "PUT",
      status: "[OK]",
    }),
  },

  // 10. TAGS
  TAGS: {
    LIST: { url: `${API_BASE}/tags/`, method: "GET", status: "[OK]" },
    CREATE: { url: `${API_BASE}/tags/`, method: "POST", status: "[OK]" },
    DETAIL: (id) => ({
      url: `${API_BASE}/tags/${id}/`,
      method: "GET",
      status: "[OK]",
    }),
    UPDATE: (id) => ({
      url: `${API_BASE}/tags/${id}/`,
      method: "PUT",
      status: "[OK]",
    }),
    DELETE: (id) => ({
      url: `${API_BASE}/tags/${id}/`,
      method: "DELETE",
      status: "[OK]",
    }),
  },

  // 11. MEDIA (note: backend typo "medai" on update — keep exact)
  MEDIA: {
    LIST: { url: `${API_BASE}/media/list/`, method: "GET", status: "[OK]" },
    CREATE: {
      url: `${API_BASE}/media/create/`,
      method: "POST",
      status: "[OK]",
    },
    DETAIL: (id) => ({
      url: `${API_BASE}/media/detail/${id}/`,
      method: "GET",
      status: "[OK]",
    }),
    UPDATE: (id) => ({
      url: `${API_BASE}/media/update/${id}/`,
      method: "PUT",
      status: "[OK]",
    }),
    DELETE: (id) => ({
      url: `${API_BASE}/media/delete/${id}/`,
      method: "DELETE",
      status: "[OK]",
    }),
  },

  // 12. FEATURES & PROPERTY_FEATURES
  FEATURES: {
    LIST: { url: `${API_BASE}/features/list/`, method: "GET", status: "[OK]" },
    CREATE: {
      url: `${API_BASE}/features/create/`,
      method: "POST",
      status: "[OK]",
    },
    DETAIL: (id) => ({
      url: `${API_BASE}/features/detail/${id}/`,
      method: "GET",
      status: "[OK]",
    }),
    UPDATE: (id) => ({
      url: `${API_BASE}/features/update/${id}/`,
      method: "PUT",
      status: "[OK]",
    }),
    DELETE: (id) => ({
      url: `${API_BASE}/features/delete/${id}/`,
      method: "DELETE",
      status: "[OK]",
    }),
  },
  PROPERTY_FEATURES: {
    LIST: {
      url: `${API_BASE}/property-features/list/`,
      method: "GET",
      status: "[OK]",
    },
    CREATE: {
      url: `${API_BASE}/property-features/create/`,
      method: "POST",
      status: "[OK]",
    },
    DETAIL: (id) => ({
      url: `${API_BASE}/property-features/detail/${id}/`,
      method: "GET",
      status: "[OK]",
    }),
    UPDATE: (id) => ({
      url: `${API_BASE}/property-features/update/${id}/`,
      method: "PUT",
      status: "[OK]",
    }),
    DELETE: (id) => ({
      url: `${API_BASE}/property-features/delete/${id}/`,
      method: "DELETE",
      status: "[OK]",
    }),
  },

  // 13. PROPERTY STATUS HISTORY (read-only)
  PROPERTY_STATUS_HISTORY: {
    LIST: {
      url: `${API_BASE}/property-status-history/`,
      method: "GET",
      status: "[OK]",
    },
    DETAIL: (id) => ({
      url: `${API_BASE}/property-status-history/${id}/`,
      method: "GET",
      status: "[OK]",
    }),
  },

  // 14. AUDIT / ACTIVITY LOG
  AUDIT: {
    ACTIVITY: {
      LIST: {
        url: `${API_BASE}/audit/activity/list/`,
        method: "GET",
        status: "[OK]",
      },
      DETAIL: (id) => ({
        url: `${API_BASE}/audit/activity/detail/${id}/`,
        method: "GET",
        status: "[OK]",
      }),
    },
  },

  // 15. ADMIN / DASHBOARD (proposed for MVP)
  ADMIN: {
    DASHBOARD: {
      STATS: {
        url: `${API_BASE}/admin/dashboard/stats/`,
        method: "GET",
        status: "[MOCK]",
      },
      OPERATOR_STATS: {
        url: `${API_BASE}/admin/dashboard/operator/`,
        method: "GET",
        status: "[MOCK]",
      },
    },
    SCRAPER: {
      STATUS: {
        url: `${API_BASE}/admin/scraper/status/`,
        method: "GET",
        status: "[MOCK]",
      },
      LOGS: {
        url: `${API_BASE}/admin/scraper/logs/`,
        method: "GET",
        status: "[MOCK]",
      },
      SOURCES: {
        url: `${API_BASE}/admin/scraper/sources/`,
        method: "GET",
        status: "[MOCK]",
      },
    },
    REPORTS: {
      DAILY: {
        url: `${API_BASE}/admin/reports/daily/`,
        method: "GET",
        status: "[MOCK]",
      },
      WEEKLY: {
        url: `${API_BASE}/admin/reports/weekly/`,
        method: "GET",
        status: "[MOCK]",
      },
      MONTHLY: {
        url: `${API_BASE}/admin/reports/monthly/`,
        method: "GET",
        status: "[MOCK]",
      },
    },
  },

  REPORT: {
    DASHBOARD: {
      url: `${API_BASE}/dashboard/`,
      method: "GET",
      status: "[OK]", // فقط agency owner
    },
    STATISTICS: {
      url: `${API_BASE}/statistics/`,
      method: "GET",
      status: "[OK]",
    },
    PROPERTIES: {
      url: `${API_BASE}/report/properties/`,
      method: "GET",
      status: "[OK]",
    },
    CHARTS: {
      MONTHLY_DEALS: {
        url: `${API_BASE}/charts/monthly-deals/`,
        method: "GET",
      },
      REVENUE: { url: `${API_BASE}/charts/revenue/`, method: "GET" },
    },
    EMPLOYEES_TOP: { url: `${API_BASE}/employees/top/`, method: "GET" },
    CUSTOMERS_MONTHLY: { url: `${API_BASE}/customers/monthly/`, method: "GET" },
    PROPERTIES_MONTHLY: {
      url: `${API_BASE}/properties/monthly/`,
      method: "GET",
    },
    FINANCIAL: { url: `${API_BASE}/financial/`, method: "GET" },
  },

  // 16. INGESTION (scraper pipeline - backend model exists, views pending)
  INGESTION: {
    TARGETS: {
      LIST: {
        url: `${API_BASE}/ingestion/targets/`,
        method: "GET",
        status: "[PEND]",
      },
      DETAIL: (id) => ({
        url: `${API_BASE}/ingestion/targets/${id}/`,
        method: "GET",
        status: "[PEND]",
      }),
      CREATE: {
        url: `${API_BASE}/ingestion/targets/`,
        method: "POST",
        status: "[PEND]",
      },
      UPDATE: (id) => ({
        url: `${API_BASE}/ingestion/targets/${id}/`,
        method: "PATCH",
        status: "[PEND]",
      }),
      DELETE: (id) => ({
        url: `${API_BASE}/ingestion/targets/${id}/`,
        method: "DELETE",
        status: "[PEND]",
      }),
      TRIGGER_RUN: (id) => ({
        url: `${API_BASE}/ingestion/targets/${id}/trigger/`,
        method: "POST",
        status: "[PEND]",
      }),
    },
    RUNS: {
      LIST: {
        url: `${API_BASE}/ingestion/runs/`,
        method: "GET",
        status: "[PEND]",
      },
      DETAIL: (id) => ({
        url: `${API_BASE}/ingestion/runs/${id}/`,
        method: "GET",
        status: "[PEND]",
      }),
      CREATE: {
        url: `${API_BASE}/ingestion/runs/`,
        method: "POST",
        status: "[PEND]",
      },
      ITEMS: (id) => ({
        url: `${API_BASE}/ingestion/runs/${id}/items/`,
        method: "GET",
        status: "[PEND]",
      }),
      RESUME: (id) => ({
        url: `${API_BASE}/ingestion/runs/${id}/resume/`,
        method: "POST",
        status: "[PEND]",
      }),
    },
    SNAPSHOTS: {
      LIST: (listingId) => ({
        url: `${API_BASE}/ingestion/listings/${listingId}/snapshots/`,
        method: "GET",
        status: "[PEND]",
      }),
    },
    TARGET_LISTINGS: {
      LIST: (listingId) => ({
        url: `${API_BASE}/ingestion/listings/${listingId}/target-listings/`,
        method: "GET",
        status: "[PEND]",
      }),
    },
  },
};

// --------- Helper utilities

// Resolve endpoint URL (static or dynamic)
export const getUrl = (endpoint, id = null) => {
  if (typeof endpoint.url === "function") {
    return endpoint.url(id);
  }
  return endpoint.url;
};

// Get full endpoint config with resolved URL
export const getEndpoint = (endpoint, id = null) => ({
  url: getUrl(endpoint, id),
  method: endpoint.method,
  status: endpoint.status,
});

// Check if backend is ready for this endpoint
export const isReady = (endpoint) => endpoint.status === "[OK]";

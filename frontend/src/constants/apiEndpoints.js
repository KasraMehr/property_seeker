/**
 * API Endpoints - MVP only
 *
 * [OK]   = backend ready (view + url + serializer)
 * [PEND] = backend model exists, views/serializers/urls pending
 * [MOCK] = proposed for MVP, backend not started yet
 *
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

  // 3. LOCATIONS — matched to backend/locations/location_urls/*
  // Hierarchy: Province → City → District → Neighborhood → Address
  // List endpoints currently return full sets (no server-side parent filter).
  // Cascading selects must filter client-side until backend adds query filters.
  // Bulk delete body: { ids: number[] } — HTTP method is DELETE (not POST).
  // City bulk-delete URL requires a pk path segment (unused by view); pass any id from the set.
  LOCATIONS: {
    PROVINCES: {
      LIST: {
        url: `${API_BASE}/province/list/`,
        method: "GET",
        status: "[OK]",
      },
      CREATE: {
        url: `${API_BASE}/province/create/`,
        method: "POST",
        status: "[OK]",
      },
      DETAIL: (id) => ({
        url: `${API_BASE}/province/${id}/`,
        method: "GET",
        status: "[OK]",
      }),
      UPDATE: (id) => ({
        url: `${API_BASE}/province/update/${id}/`,
        method: "PUT",
        status: "[OK]",
      }),
      /** DELETE body: { ids: number[] } */
      BULK_DELETE: {
        url: `${API_BASE}/province/delete/`,
        method: "DELETE",
        status: "[OK]",
      },
    },
    CITIES: {
      LIST: {
        url: `${API_BASE}/city/list/`,
        method: "GET",
        status: "[OK]",
      },
      CREATE: {
        url: `${API_BASE}/city/create/`,
        method: "POST",
        status: "[OK]",
      },
      DETAIL: (id) => ({
        url: `${API_BASE}/city/${id}/`,
        method: "GET",
        status: "[OK]",
      }),
      UPDATE: (id) => ({
        url: `${API_BASE}/city/${id}/update/`,
        method: "PUT",
        status: "[OK]",
      }),
      /**
       * Backend path is city/<pk>/delete/ but view only reads body.ids.
       * Use BULK_DELETE(ids[0]) or any selected id as path pk.
       * DELETE body: { ids: number[] }
       */
      BULK_DELETE: (pathId) => ({
        url: `${API_BASE}/city/${pathId}/delete/`,
        method: "DELETE",
        status: "[OK]",
      }),
    },
    DISTRICTS: {
      // List + Create share same URL
      LIST: {
        url: `${API_BASE}/district/`,
        method: "GET",
        status: "[OK]",
      },
      CREATE: {
        url: `${API_BASE}/district/`,
        method: "POST",
        status: "[OK]",
      },
      DETAIL: (id) => ({
        url: `${API_BASE}/district/${id}/`,
        method: "GET",
        status: "[OK]",
      }),
      // Update is on the detail URL (PUT/PATCH)
      UPDATE: (id) => ({
        url: `${API_BASE}/district/${id}/`,
        method: "PUT",
        status: "[OK]",
      }),
      /** No trailing slash (backend path: district/delete). DELETE body: { ids: number[] } */
      BULK_DELETE: {
        url: `${API_BASE}/district/delete`,
        method: "DELETE",
        status: "[OK]",
      },
    },
    NEIGHBORHOODS: {
      // List + Create share same URL
      LIST: {
        url: `${API_BASE}/neighborhoods/`,
        method: "GET",
        status: "[OK]",
      },
      CREATE: {
        url: `${API_BASE}/neighborhoods/`,
        method: "POST",
        status: "[OK]",
      },
      DETAIL: (id) => ({
        url: `${API_BASE}/neighborhoods/${id}/`,
        method: "GET",
        status: "[OK]",
      }),
      // Update is on the detail URL (PUT/PATCH)
      UPDATE: (id) => ({
        url: `${API_BASE}/neighborhoods/${id}/`,
        method: "PUT",
        status: "[OK]",
      }),
      /** DELETE body: { ids: number[] } */
      BULK_DELETE: {
        url: `${API_BASE}/neighborhoods/delete/`,
        method: "DELETE",
        status: "[OK]",
      },
    },
    ADDRESSES: {
      // List + Create share same URL
      LIST: {
        url: `${API_BASE}/addresses/`,
        method: "GET",
        status: "[OK]",
      },
      CREATE: {
        url: `${API_BASE}/addresses/`,
        method: "POST",
        status: "[OK]",
      },
      DETAIL: (id) => ({
        url: `${API_BASE}/addresses/${id}/`,
        method: "GET",
        status: "[OK]",
      }),
      // Update is on the detail URL (PUT/PATCH)
      UPDATE: (id) => ({
        url: `${API_BASE}/addresses/${id}/`,
        method: "PUT",
        status: "[OK]",
      }),
      /** Note path is address/delete/ (singular). DELETE body: { ids: number[] } */
      BULK_DELETE: {
        url: `${API_BASE}/address/delete/`,
        method: "DELETE",
        status: "[OK]",
      },
    },
  },

  // 4. OWNERS — mixed trailing slashes as per backend
  OWNERS: {
    LIST: { url: `${API_BASE}/owner/list/`, method: "GET", status: "[OK]" },
    DETAIL: (id) => ({
      url: `${API_BASE}/owner/detail/${id}/`,
      method: "GET",
      status: "[OK]",
    }),
    CREATE: {
      url: `${API_BASE}/owner/create/`,
      method: "POST",
      status: "[OK]",
    },
    UPDATE: (id) => ({
      url: `${API_BASE}/owner/update/${id}/`,
      method: "PUT",
      status: "[OK]",
    }),
    BULK_DELETE: {
      url: `${API_BASE}/owner/bulk-delete/`,
      method: "DELETE",
      status: "[OK]",
    },
    DELETE: (id) => ({
      url: `${API_BASE}/owner/bulk-delete/`,
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
  // 6. LISTINGS
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
    CALLS: {
      LIST: { url: `${API_BASE}/calls/`, method: "GET", status: "[OK]" },
      CREATE: { url: `${API_BASE}/calls/`, method: "POST", status: "[OK]" },
      DETAIL: (id) => ({
        url: `${API_BASE}/calls/${id}/`,
        method: "GET",
        status: "[OK]",
      }),
      UPDATE: (id) => ({
        url: `${API_BASE}/calls/${id}/`,
        method: "PATCH",
        status: "[OK]",
      }),
      BULK_DELETE: {
        url: `${API_BASE}/calls/delete/`,
        method: "DELETE",
        status: "[OK]",
      },
      DELETE: (id) => ({
        url: `${API_BASE}/calls/delete/`,
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
      BULK_DELETE: {
        url: `${API_BASE}/reminders/delete/`,
        method: "DELETE",
        status: "[OK]",
      },
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
    BULK_DELETE: {
      url: `${API_BASE}/customer/delete`,
      method: "DELETE",
      status: "[OK]",
    },
    DELETE: (id) => ({
      url: `${API_BASE}/customer/delete`,
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
    UPDATE: (id) => ({
      url: `${API_BASE}/customer-preferences/${id}/`,
      method: "PATCH",
      status: "[OK]",
    }),
    BULK_DELETE: {
      url: `${API_BASE}/customer-preferences/delete/`,
      method: "DELETE",
      status: "[OK]",
    },
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
    // No single-feature delete endpoint in backend.
    // Backend only supports: DELETE /api/feature/bulk-delete/ with { ids: [...] }
    DELETE: (id) => ({
      url: `${API_BASE}/feature/bulk-delete/`,
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
    // No single property-feature delete endpoint in backend.
    // Backend only supports: DELETE /api/property-features/bulk-delete/ with { ids: [...] }
    DELETE: (id) => ({
      url: `${API_BASE}/property-features/bulk-delete/`,
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
        url: `${API_BASE}/dashboard/`,
        method: "GET",
        status: "[OK]",
      },
      OPERATOR_STATS: {
        url: `${API_BASE}/operator/statistics/`,
        method: "GET",
        status: "[OK]",
      },
    },
    SCRAPER: {
      STATUS: {
        url: `${API_BASE}/ingestion/targets/`,
        method: "GET",
        status: "[OK]",
      },
      LOGS: {
        url: `${API_BASE}/ingestion/runs/`,
        method: "GET",
        status: "[OK]",
      },
      SOURCES: {
        url: `${API_BASE}/ingestion/targets/`,
        method: "GET",
        status: "[OK]",
      },
    },
    REPORTS: {
      DAILY: {
        url: `${API_BASE}/report/properties/`,
        method: "GET",
        status: "[OK]",
      },
      WEEKLY: {
        url: `${API_BASE}/charts/monthly-deals/`,
        method: "GET",
        status: "[OK]",
      },
      MONTHLY: {
        url: `${API_BASE}/statistics/`,
        method: "GET",
        status: "[OK]",
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
    DIVAR_SESSION: {
      STATUS: {
        url: `${API_BASE}/ingestion/divar-session/`,
        method: "GET",
        status: "[OK]",
      },
      CHECK: {
        url: `${API_BASE}/ingestion/divar-session/check/`,
        method: "POST",
        status: "[OK]",
      },
    },
    DIVAR_LOGIN: {
      START: {
        url: `${API_BASE}/ingestion/divar-login/`,
        method: "POST",
        status: "[OK]",
      },
      DETAIL: (id) => ({
        url: `${API_BASE}/ingestion/divar-login/${id}/`,
        method: "GET",
        status: "[OK]",
      }),
      CONFIRM: (id) => ({
        url: `${API_BASE}/ingestion/divar-login/${id}/confirm/`,
        method: "POST",
        status: "[OK]",
      }),
    },
    TARGETS: {
      LIST: {
        url: `${API_BASE}/ingestion/targets/`,
        method: "GET",
        status: "[OK]",
      },
      DETAIL: (id) => ({
        url: `${API_BASE}/ingestion/targets/${id}/`,
        method: "GET",
        status: "[OK]",
      }),
      CREATE: {
        url: `${API_BASE}/ingestion/targets/`,
        method: "POST",
        status: "[OK]",
      },
      UPDATE: (id) => ({
        url: `${API_BASE}/ingestion/targets/${id}/`,
        method: "PATCH",
        status: "[OK]",
      }),
      DELETE: (id) => ({
        url: `${API_BASE}/ingestion/targets/${id}/`,
        method: "DELETE",
        status: "[OK]",
      }),
      TRIGGER_RUN: (id) => ({
        url: `${API_BASE}/ingestion/targets/${id}/trigger/`,
        method: "POST",
        status: "[OK]",
      }),
    },
    RUNS: {
      LIST: {
        url: `${API_BASE}/ingestion/runs/`,
        method: "GET",
        status: "[OK]",
      },
      DETAIL: (id) => ({
        url: `${API_BASE}/ingestion/runs/${id}/`,
        method: "GET",
        status: "[OK]",
      }),
      ITEMS: (id) => ({
        url: `${API_BASE}/ingestion/runs/${id}/items/`,
        method: "GET",
        status: "[OK]",
      }),
      RESUME: (id) => ({
        url: `${API_BASE}/ingestion/runs/${id}/resume/`,
        method: "POST",
        status: "[OK]",
      }),
    },
    SNAPSHOTS: {
      LIST: (listingId) => ({
        url: `${API_BASE}/ingestion/listings/${listingId}/snapshots/`,
        method: "GET",
        status: "[OK]",
      }),
    },
    TARGET_LISTINGS: {
      LIST: (listingId) => ({
        // path("listings/<int:id>/target/", ...)
        url: `${API_BASE}/ingestion/listings/${listingId}/target/`,
        method: "GET",
        status: "[OK]",
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

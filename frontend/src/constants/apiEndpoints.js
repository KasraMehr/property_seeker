/**
 * API Endpoints - MVP only
 *
 * [OK]   = backend ready (view + url + serializer)
 * [PEND] = backend model exists, views/serializers/urls pending
 * [MOCK] = proposed for MVP, backend not started yet
 *
 * - All updates use PUT (backend does not support PATCH)
 * - Django trailing slashes included on all URLs
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

  // 3. LOCATIONS (province -> city -> district -> neighborhood)
  LOCATIONS: {
    LIST: { url: `${API_BASE}/locations/`, method: "GET", status: "[PEND]" },
    PROVINCES: {
      url: `${API_BASE}/locations/provinces/`,
      method: "GET",
      status: "[PEND]",
    },
    CITIES: {
      url: `${API_BASE}/locations/cities/`,
      method: "GET",
      status: "[PEND]",
    },
    DISTRICTS: {
      url: `${API_BASE}/locations/districts/`,
      method: "GET",
      status: "[PEND]",
    },
    NEIGHBORHOODS: {
      url: `${API_BASE}/locations/neighborhoods/`,
      method: "GET",
      status: "[PEND]",
    },
  },

  // 4. OWNERS
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
    DELETE: (id) => ({
      url: `${API_BASE}/owner/delete/${id}/`,
      method: "DELETE",
      status: "[OK]",
    }),
  },

  // 5. PROPERTIES
  PROPERTIES: {
    LIST: { url: `${API_BASE}/property/list/`, method: "GET", status: "[OK]" },
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
      method: "PUT",
      status: "[OK]",
    }),
    DELETE: (id) => ({
      url: `${API_BASE}/property/delete/${id}/`,
      method: "DELETE",
      status: "[OK]",
    }),
    SEARCH: {
      url: `${API_BASE}/property/search/`,
      method: "GET",
      status: "[OK]",
    },
    BY_OWNER: (ownerId) => ({
      url: `${API_BASE}/property/owner/${ownerId}/`,
      method: "GET",
      status: "[OK]",
    }),
    BY_AGENT: (agentId) => ({
      url: `${API_BASE}/property/agent/${agentId}/`,
      method: "GET",
      status: "[OK]",
    }),
    BY_STATUS: (status) => ({
      url: `${API_BASE}/property/status/${status}/`,
      method: "GET",
      status: "[OK]",
    }),
  },

  // 6. LISTINGS = LEADS (backend model exists, views pending)
  LISTINGS: {
    LIST: { url: `${API_BASE}/listing/list/`, method: "GET", status: "[PEND]" },
    DETAIL: (id) => ({
      url: `${API_BASE}/listing/detail/${id}/`,
      method: "GET",
      status: "[PEND]",
    }),
    CREATE: {
      url: `${API_BASE}/listing/create/`,
      method: "POST",
      status: "[PEND]",
    },
    UPDATE: (id) => ({
      url: `${API_BASE}/listing/update/${id}/`,
      method: "PUT",
      status: "[PEND]",
    }),
    DELETE: (id) => ({
      url: `${API_BASE}/listing/delete/${id}/`,
      method: "DELETE",
      status: "[PEND]",
    }),
    ASSIGN: (id) => ({
      url: `${API_BASE}/listing/assign/${id}/`,
      method: "PUT",
      status: "[PEND]",
    }),
    CONVERT_TO_OWNER: (id) => ({
      url: `${API_BASE}/listing/convert-to-owner/${id}/`,
      method: "POST",
      status: "[PEND]",
    }),
    CONVERT_TO_PROPERTY: (id) => ({
      url: `${API_BASE}/listing/convert-to-property/${id}/`,
      method: "POST",
      status: "[PEND]",
    }),
  },

  // 7. CRM (call logs, reminders / follow-ups)
  CRM: {
    CALLS: {
      LIST: { url: `${API_BASE}/crm/calls/`, method: "GET", status: "[PEND]" },
      DETAIL: (id) => ({
        url: `${API_BASE}/crm/calls/${id}/`,
        method: "GET",
        status: "[PEND]",
      }),
      CREATE: {
        url: `${API_BASE}/crm/calls/create/`,
        method: "POST",
        status: "[PEND]",
      },
      UPDATE: (id) => ({
        url: `${API_BASE}/crm/calls/${id}/`,
        method: "PUT",
        status: "[PEND]",
      }),
      DELETE: (id) => ({
        url: `${API_BASE}/crm/calls/${id}/`,
        method: "DELETE",
        status: "[PEND]",
      }),
    },
    REMINDERS: {
      LIST: {
        url: `${API_BASE}/crm/reminders/`,
        method: "GET",
        status: "[PEND]",
      },
      CREATE: {
        url: `${API_BASE}/crm/reminders/create/`,
        method: "POST",
        status: "[PEND]",
      },
      COMPLETE: (id) => ({
        url: `${API_BASE}/crm/reminders/${id}/complete/`,
        method: "PUT",
        status: "[PEND]",
      }),
      CANCEL: (id) => ({
        url: `${API_BASE}/crm/reminders/${id}/cancel/`,
        method: "PUT",
        status: "[PEND]",
      }),
    },
  },

  // 8. ADMIN / DASHBOARD (proposed for MVP)
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
  // 9. INGESTION (scraper pipeline - backend model exists, views pending)
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
        method: "PUT",
        status: "[PEND]",
      }),
      DELETE: (id) => ({
        url: `${API_BASE}/ingestion/targets/${id}/`,
        method: "DELETE",
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

//Check if backend is ready for this endpoint
export const isReady = (endpoint) => endpoint.status === "[OK]";

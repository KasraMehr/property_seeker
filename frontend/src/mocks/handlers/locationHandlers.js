import { http, HttpResponse } from "msw";
import {
  MOCK_PROVINCES,
  MOCK_CITIES,
  MOCK_DISTRICTS,
  MOCK_NEIGHBORHOODS,
  MOCK_ADDRESSES,
} from "@/mocks/data/mockLocations";
import { MOCK_USERS } from "@/mocks/data/mockUsers";

/* ─── Paginate helper ─── */
function paginate(array, { page = 1, pageSize = 25 }) {
  const count = array.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    count,
    next: end < count ? `?page=${page + 1}&page_size=${pageSize}` : null,
    previous: page > 1 ? `?page=${page - 1}&page_size=${pageSize}` : null,
    results: array.slice(start, end),
  };
}

export const locationHandlers = [
  /* ─── Provinces ─── */
  http.get("*/api/locations/provinces/", () => {
    return HttpResponse.json(MOCK_PROVINCES, { status: 200 });
  }),

  /* ─── Cities ─── */
  http.get("*/api/locations/cities/", ({ request }) => {
    const url = new URL(request.url);
    const provinceId = url.searchParams.get("province");
    let results = [...MOCK_CITIES];
    if (provinceId) {
      results = results.filter((c) => c.province === Number(provinceId));
    }
    return HttpResponse.json(results, { status: 200 });
  }),

  /* ─── Districts (enriched + paginated) ─── */
  http.get("*/api/locations/districts/", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("page_size")) || 25;
    const cityId = url.searchParams.get("city");
    const search = url.searchParams.get("search");

    let results = MOCK_DISTRICTS.map((district) => {
      const city = MOCK_CITIES.find((c) => c.id === district.city);
      const province = city
        ? MOCK_PROVINCES.find((p) => p.id === city.province)
        : null;
      const neighborhoods = MOCK_NEIGHBORHOODS.filter(
        (n) => n.district === district.id,
      );
      const neighborhoodIds = neighborhoods.map((n) => n.id);
      const addresses = MOCK_ADDRESSES.filter((a) =>
        neighborhoodIds.includes(a.neighborhood),
      );

      /* Active agents serving this district's neighborhoods */
      const agents = MOCK_USERS.filter(
        (u) =>
          u.is_active &&
          !u.is_owner &&
          u.service_neighborhoods?.some((sn) =>
            neighborhoodIds.includes(sn.id),
          ),
      );

      /* Mock stats */
      const listings_count = Math.floor(Math.random() * 40) + 5;
      const properties_count = Math.floor(listings_count * 0.6);
      const calls_count = Math.floor(Math.random() * 25);
      const followups_count = Math.floor(Math.random() * 15);

      return {
        ...district,
        city: city
          ? {
              id: city.id,
              name: city.name,
              province: province
                ? { id: province.id, name: province.name }
                : null,
            }
          : null,
        neighborhoods,
        neighborhoods_count: neighborhoods.length,
        addresses_count: addresses.length,
        listings_count,
        properties_count,
        calls_count,
        followups_count,
        agents_count: agents.length,
        top_neighborhoods: neighborhoods.slice(0, 4),
        _agents: agents.map((a) => ({
          id: a.id,
          full_name: a.full_name,
          phone: a.phone,
          role: a.role,
          service_neighborhoods: a.service_neighborhoods,
        })),
      };
    });

    if (cityId) {
      results = results.filter((d) => d.city?.id === Number(cityId));
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (d) =>
          d.name?.toLowerCase().includes(q) ||
          d.city?.name?.toLowerCase().includes(q) ||
          d.top_neighborhoods?.some((n) => n.name?.toLowerCase().includes(q)),
      );
    }

    /* ─── FIXED: return paginated format ─── */
    return HttpResponse.json(paginate(results, { page, pageSize }), {
      status: 200,
    });
  }),

  /* ─── Neighborhoods ─── */
  http.get("*/api/locations/neighborhoods/", ({ request }) => {
    const url = new URL(request.url);
    const districtId = url.searchParams.get("district");
    let results = [...MOCK_NEIGHBORHOODS];
    if (districtId) {
      results = results.filter((n) => n.district === Number(districtId));
    }
    return HttpResponse.json(results, { status: 200 });
  }),

  /* ─── District Detail ─── */
  http.get("*/api/locations/districts/:id/", ({ params }) => {
    const id = Number(params.id);
    const district = MOCK_DISTRICTS.find((d) => d.id === id);
    if (!district) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    const city = MOCK_CITIES.find((c) => c.id === district.city);
    const province = city
      ? MOCK_PROVINCES.find((p) => p.id === city.province)
      : null;
    return HttpResponse.json(
      {
        ...district,
        city: city
          ? {
              id: city.id,
              name: city.name,
              province: province
                ? { id: province.id, name: province.name }
                : null,
            }
          : null,
      },
      { status: 200 },
    );
  }),

  /* ─── District Create ─── */
  http.post("*/api/locations/districts/", async ({ request }) => {
    const body = await request.json();
    const newDistrict = {
      id: Math.max(...MOCK_DISTRICTS.map((d) => d.id), 0) + 1,
      ...body,
    };
    MOCK_DISTRICTS.push(newDistrict);
    return HttpResponse.json(newDistrict, { status: 201 });
  }),

  /* ─── District Update ─── */
  http.put("*/api/locations/districts/:id/", async ({ params, request }) => {
    const id = Number(params.id);
    const index = MOCK_DISTRICTS.findIndex((d) => d.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    const body = await request.json();
    MOCK_DISTRICTS[index] = { ...MOCK_DISTRICTS[index], ...body };
    return HttpResponse.json(MOCK_DISTRICTS[index], { status: 200 });
  }),

  /* ─── District Delete ─── */
  http.delete("*/api/locations/districts/:id/", ({ params }) => {
    const id = Number(params.id);
    const index = MOCK_DISTRICTS.findIndex((d) => d.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    MOCK_DISTRICTS.splice(index, 1);
    return HttpResponse.json({ detail: "deleted" }, { status: 204 });
  }),
];

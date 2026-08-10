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
  http.get("*/api/province/list/", () => {
    return HttpResponse.json(MOCK_PROVINCES, { status: 200 });
  }),

  http.post("*/api/province/create/", async ({ request }) => {
    const body = await request.json();
    const newProvince = {
      id: Math.max(...MOCK_PROVINCES.map((p) => p.id), 0) + 1,
      ...body,
      created_at: new Date().toISOString(),
    };
    MOCK_PROVINCES.push(newProvince);
    return HttpResponse.json(newProvince, { status: 201 });
  }),

  http.get("*/api/province/:id/", ({ params }) => {
    const id = Number(params.id);
    const province = MOCK_PROVINCES.find((p) => p.id === id);
    if (!province) return HttpResponse.json({ detail: "not found" }, { status: 404 });
    return HttpResponse.json(province, { status: 200 });
  }),

  http.put("*/api/province/:id/update/", async ({ params, request }) => {
    const id = Number(params.id);
    const index = MOCK_PROVINCES.findIndex((p) => p.id === id);
    if (index === -1) return HttpResponse.json({ detail: "not found" }, { status: 404 });
    const body = await request.json();
    MOCK_PROVINCES[index] = { ...MOCK_PROVINCES[index], ...body };
    return HttpResponse.json(MOCK_PROVINCES[index], { status: 200 });
  }),

  http.delete("*/api/province/:id/delete/", ({ params }) => {
    const id = Number(params.id);
    const index = MOCK_PROVINCES.findIndex((p) => p.id === id);
    if (index === -1) return HttpResponse.json({ detail: "not found" }, { status: 404 });
    MOCK_PROVINCES.splice(index, 1);
    return HttpResponse.json({ detail: "deleted" }, { status: 204 });
  }),

  /* ─── Cities ─── */
  http.get("*/api/city/list/", ({ request }) => {
    const url = new URL(request.url);
    const provinceId = url.searchParams.get("province");
    let results = [...MOCK_CITIES];
    if (provinceId) {
      results = results.filter((c) => c.province === Number(provinceId) || c.province?.id === Number(provinceId));
    }
    return HttpResponse.json(results, { status: 200 });
  }),

  http.post("*/api/city/create/", async ({ request }) => {
    const body = await request.json();
    const newCity = {
      id: Math.max(...MOCK_CITIES.map((c) => c.id), 0) + 1,
      ...body,
    };
    MOCK_CITIES.push(newCity);
    return HttpResponse.json(newCity, { status: 201 });
  }),

  http.get("*/api/city/:id/", ({ params }) => {
    const id = Number(params.id);
    const city = MOCK_CITIES.find((c) => c.id === id);
    if (!city) return HttpResponse.json({ detail: "not found" }, { status: 404 });
    return HttpResponse.json(city, { status: 200 });
  }),

  http.put("*/api/city/:id/update/", async ({ params, request }) => {
    const id = Number(params.id);
    const index = MOCK_CITIES.findIndex((c) => c.id === id);
    if (index === -1) return HttpResponse.json({ detail: "not found" }, { status: 404 });
    const body = await request.json();
    MOCK_CITIES[index] = { ...MOCK_CITIES[index], ...body };
    return HttpResponse.json(MOCK_CITIES[index], { status: 200 });
  }),

  http.delete("*/api/city/:id/delete/", ({ params }) => {
    const id = Number(params.id);
    const index = MOCK_CITIES.findIndex((c) => c.id === id);
    if (index === -1) return HttpResponse.json({ detail: "not found" }, { status: 404 });
    MOCK_CITIES.splice(index, 1);
    return HttpResponse.json({ detail: "deleted" }, { status: 204 });
  }),

  /* ─── Districts (REST pure: GET/POST same URL) ─── */
  http.get("*/api/district/", ({ request }) => {
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

      const agents = MOCK_USERS.filter(
        (u) =>
          u.is_active &&
          !u.is_owner &&
          u.service_neighborhoods?.some((sn) =>
            neighborhoodIds.includes(sn.id),
          ),
      );

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

    return HttpResponse.json(paginate(results, { page, pageSize }), { status: 200 });
  }),

  http.post("*/api/district/", async ({ request }) => {
    const body = await request.json();
    const newDistrict = {
      id: Math.max(...MOCK_DISTRICTS.map((d) => d.id), 0) + 1,
      ...body,
    };
    MOCK_DISTRICTS.push(newDistrict);
    return HttpResponse.json(newDistrict, { status: 201 });
  }),

  http.get("*/api/district/:id/", ({ params }) => {
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

  http.put("*/api/district/:id/", async ({ params, request }) => {
    const id = Number(params.id);
    const index = MOCK_DISTRICTS.findIndex((d) => d.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    const body = await request.json();
    MOCK_DISTRICTS[index] = { ...MOCK_DISTRICTS[index], ...body };
    return HttpResponse.json(MOCK_DISTRICTS[index], { status: 200 });
  }),

  http.delete("*/api/district/:id/", ({ params }) => {
    const id = Number(params.id);
    const index = MOCK_DISTRICTS.findIndex((d) => d.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    MOCK_DISTRICTS.splice(index, 1);
    return HttpResponse.json({ detail: "deleted" }, { status: 204 });
  }),

  /* ─── Neighborhoods (REST pure) ─── */
  http.get("*/api/neighborhoods/", ({ request }) => {
    const url = new URL(request.url);
    const districtId = url.searchParams.get("district");
    let results = [...MOCK_NEIGHBORHOODS];
    if (districtId) {
      results = results.filter((n) => n.district === Number(districtId));
    }
    return HttpResponse.json(results, { status: 200 });
  }),

  http.post("*/api/neighborhoods/", async ({ request }) => {
    const body = await request.json();
    const newNeighborhood = {
      id: Math.max(...MOCK_NEIGHBORHOODS.map((n) => n.id), 0) + 1,
      ...body,
    };
    MOCK_NEIGHBORHOODS.push(newNeighborhood);
    return HttpResponse.json(newNeighborhood, { status: 201 });
  }),

  http.get("*/api/neighborhoods/:id/", ({ params }) => {
    const id = Number(params.id);
    const neighborhood = MOCK_NEIGHBORHOODS.find((n) => n.id === id);
    if (!neighborhood) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    return HttpResponse.json(neighborhood, { status: 200 });
  }),

  http.put("*/api/neighborhoods/:id/", async ({ params, request }) => {
    const id = Number(params.id);
    const index = MOCK_NEIGHBORHOODS.findIndex((n) => n.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    const body = await request.json();
    MOCK_NEIGHBORHOODS[index] = { ...MOCK_NEIGHBORHOODS[index], ...body };
    return HttpResponse.json(MOCK_NEIGHBORHOODS[index], { status: 200 });
  }),

  http.delete("*/api/neighborhoods/:id/", ({ params }) => {
    const id = Number(params.id);
    const index = MOCK_NEIGHBORHOODS.findIndex((n) => n.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    MOCK_NEIGHBORHOODS.splice(index, 1);
    return HttpResponse.json({ detail: "deleted" }, { status: 204 });
  }),

  /* ─── Addresses (REST pure) ─── */
  http.get("*/api/addresses/", ({ request }) => {
    const url = new URL(request.url);
    const neighborhoodId = url.searchParams.get("neighborhood");
    let results = [...MOCK_ADDRESSES];
    if (neighborhoodId) {
      results = results.filter((a) => a.neighborhood === Number(neighborhoodId));
    }
    return HttpResponse.json(results, { status: 200 });
  }),

  http.post("*/api/addresses/", async ({ request }) => {
    const body = await request.json();
    const newAddress = {
      id: Math.max(...MOCK_ADDRESSES.map((a) => a.id), 0) + 1,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_ADDRESSES.push(newAddress);
    return HttpResponse.json(newAddress, { status: 201 });
  }),

  http.get("*/api/addresses/:id/", ({ params }) => {
    const id = Number(params.id);
    const address = MOCK_ADDRESSES.find((a) => a.id === id);
    if (!address) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    return HttpResponse.json(address, { status: 200 });
  }),

  http.put("*/api/addresses/:id/", async ({ params, request }) => {
    const id = Number(params.id);
    const index = MOCK_ADDRESSES.findIndex((a) => a.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    const body = await request.json();
    MOCK_ADDRESSES[index] = { ...MOCK_ADDRESSES[index], ...body, updated_at: new Date().toISOString() };
    return HttpResponse.json(MOCK_ADDRESSES[index], { status: 200 });
  }),

  http.delete("*/api/addresses/:id/", ({ params }) => {
    const id = Number(params.id);
    const index = MOCK_ADDRESSES.findIndex((a) => a.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    MOCK_ADDRESSES.splice(index, 1);
    return HttpResponse.json({ detail: "deleted" }, { status: 204 });
  }),
];
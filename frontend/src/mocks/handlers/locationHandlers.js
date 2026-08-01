import { http, HttpResponse } from "msw";
import {
  MOCK_PROVINCES,
  MOCK_CITIES,
  MOCK_DISTRICTS,
  MOCK_NEIGHBORHOODS,
} from "@/mocks/data/mockLocations";

export const locationHandlers = [
  http.get("*/api/locations/provinces/", () => {
    return HttpResponse.json(MOCK_PROVINCES, { status: 200 });
  }),

  http.get("*/api/locations/cities/", ({ request }) => {
    const url = new URL(request.url);
    const provinceId = url.searchParams.get("province");
    let results = [...MOCK_CITIES];
    if (provinceId) {
      results = results.filter((c) => c.province === Number(provinceId));
    }
    return HttpResponse.json(results, { status: 200 });
  }),

  http.get("*/api/locations/districts/", ({ request }) => {
    const url = new URL(request.url);
    const cityId = url.searchParams.get("city");
    let results = [...MOCK_DISTRICTS];
    if (cityId) {
      results = results.filter((d) => d.city === Number(cityId));
    }
    return HttpResponse.json(results, { status: 200 });
  }),

  http.get("*/api/locations/neighborhoods/", ({ request }) => {
    const url = new URL(request.url);
    const districtId = url.searchParams.get("district");
    let results = [...MOCK_NEIGHBORHOODS];
    if (districtId) {
      results = results.filter((n) => n.district === Number(districtId));
    }
    return HttpResponse.json(results, { status: 200 });
  }),
];
import { http, HttpResponse } from "msw";
import { MOCK_LISTINGS } from "@/mocks/data/mockListings";
import { MOCK_OWNERS } from "@/mocks/data/mockOwners";
import { MOCK_PROPERTIES } from "@/mocks/data/mockProperties";

function paginateAndOrder(array, { page = 1, pageSize = 25, ordering = "-created_at" }) {
  let sorted = [...array];
  const desc = ordering.startsWith("-");
  const key = desc ? ordering.slice(1) : ordering;

  sorted.sort((a, b) => {
    let av = a[key];
    let bv = b[key];
    if (key.includes(".")) {
      const parts = key.split(".");
      av = parts.reduce((obj, k) => obj?.[k], a);
      bv = parts.reduce((obj, k) => obj?.[k], b);
    }
    av = av ?? "";
    bv = bv ?? "";
    if (typeof av === "string") av = av.toLowerCase();
    if (typeof bv === "string") bv = bv.toLowerCase();
    if (av < bv) return desc ? 1 : -1;
    if (av > bv) return desc ? -1 : 1;
    return 0;
  });

  const count = sorted.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    count,
    next: end < count ? `?page=${page + 1}&page_size=${pageSize}` : null,
    previous: page > 1 ? `?page=${page - 1}&page_size=${pageSize}` : null,
    results: sorted.slice(start, end),
  };
}

export const listingHandlers = [
  // ─── LIST (GET /api/listing/list/) ───
  http.get("*/api/listing/list/", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("page_size")) || 25;
    const ordering = url.searchParams.get("ordering") || "-created_at";

    const search = url.searchParams.get("search");
    const status = url.searchParams.get("status");
    const source = url.searchParams.get("source");
    const listedAreaMin = url.searchParams.get("listed_area_min");
    const listedAreaMax = url.searchParams.get("listed_area_max");
    const createdBy = url.searchParams.get("created_by");

    let results = [...MOCK_LISTINGS];

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (l) =>
          l.title?.toLowerCase().includes(q) ||
          l.external_id?.toLowerCase().includes(q) ||
          l.description?.toLowerCase().includes(q)
      );
    }

    if (status) {
      const statuses = status.split(",");
      results = results.filter((l) => statuses.includes(l.status));
    }

    if (source) {
      results = results.filter((l) => {
        const s = typeof l.source === "string" ? l.source : l.source?.name;
        return s === source;
      });
    }

    if (listedAreaMin) {
      results = results.filter((l) => l.listed_area >= Number(listedAreaMin));
    }
    if (listedAreaMax) {
      results = results.filter((l) => l.listed_area <= Number(listedAreaMax));
    }

    if (createdBy) {
      results = results.filter((l) => String(l.created_by?.id) === createdBy);
    }

    return HttpResponse.json(paginateAndOrder(results, { page, pageSize, ordering }), { status: 200 });
  }),

  // ─── DETAIL (GET /api/listing/detail/:id/) ───
  http.get("*/api/listing/detail/:id/", ({ params }) => {
    const id = Number(params.id);
    const listing = MOCK_LISTINGS.find((l) => l.id === id);
    if (!listing) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    return HttpResponse.json(listing, { status: 200 });
  }),

  // ─── CREATE (POST /api/listing/create/) ───
  http.post("*/api/listing/create/", async ({ request }) => {
    const body = await request.json();
    const newListing = {
      id: MOCK_LISTINGS.length + 1,
      ...body,
      property: null,
      media_count: body.media_count ?? 0,
      views_count: body.views_count ?? 0,
      leads_count: body.leads_count ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_LISTINGS.push(newListing);
    return HttpResponse.json(newListing, { status: 201 });
  }),

  // ─── UPDATE (PUT /api/listing/update/:id/) ───
  http.put("*/api/listing/update/:id/", async ({ params, request }) => {
    const id = Number(params.id);
    const index = MOCK_LISTINGS.findIndex((l) => l.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    const body = await request.json();
    MOCK_LISTINGS[index] = {
      ...MOCK_LISTINGS[index],
      ...body,
      updated_at: new Date().toISOString(),
    };
    return HttpResponse.json(MOCK_LISTINGS[index], { status: 200 });
  }),

  // ─── DELETE (DELETE /api/listing/delete/:id/) ───
  http.delete("*/api/listing/delete/:id/", ({ params }) => {
    const id = Number(params.id);
    const index = MOCK_LISTINGS.findIndex((l) => l.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    MOCK_LISTINGS.splice(index, 1);
    return HttpResponse.json({ detail: "deleted" }, { status: 204 });
  }),

  // ─── ASSIGN (PUT /api/listing/assign/:id/) ───
  http.put("*/api/listing/assign/:id/", async ({ params, request }) => {
    const id = Number(params.id);
    const index = MOCK_LISTINGS.findIndex((l) => l.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    const body = await request.json();
    // Note: assigned_to is NOT in backend Listing model — kept for frontend compatibility
    MOCK_LISTINGS[index] = {
      ...MOCK_LISTINGS[index],
      ...body,
      updated_at: new Date().toISOString(),
    };
    return HttpResponse.json(MOCK_LISTINGS[index], { status: 200 });
  }),

  // ─── CONVERT TO OWNER (POST /api/listing/convert-to-owner/:id/) ───
  http.post("*/api/listing/convert-to-owner/:id/", async ({ params, request }) => {
    const id = Number(params.id);
    const index = MOCK_LISTINGS.findIndex((l) => l.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    const body = await request.json();
    const newOwner = {
      id: MOCK_OWNERS.length + 1,
      ...body.owner_data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_OWNERS.push(newOwner);
    MOCK_LISTINGS[index].updated_at = new Date().toISOString();
    return HttpResponse.json({ owner: newOwner }, { status: 200 });
  }),

  // ─── CONVERT TO PROPERTY (POST /api/listing/convert-to-property/:id/) ───
  http.post("*/api/listing/convert-to-property/:id/", async ({ params, request }) => {
    const id = Number(params.id);
    const index = MOCK_LISTINGS.findIndex((l) => l.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    const body = await request.json();
    const year = new Date().getFullYear();
    const newId = MOCK_PROPERTIES.length + 1;
    const newProperty = {
      id: newId,
      property_code: `PR-${year}-${String(newId).padStart(6, "0")}`,
      ...body.property_data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_PROPERTIES.push(newProperty);
    MOCK_LISTINGS[index].property = newProperty;
    MOCK_LISTINGS[index].updated_at = new Date().toISOString();
    return HttpResponse.json({ property: newProperty }, { status: 200 });
  }),
];
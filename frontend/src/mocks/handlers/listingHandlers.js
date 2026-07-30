import { http, HttpResponse } from "msw";
import { MOCK_LISTINGS } from "@/mocks/data/mockListings";
import { MOCK_OWNERS } from "@/mocks/data/mockOwners";
import { MOCK_PROPERTIES } from "@/mocks/data/mockProperties";

export const listingHandlers = [
  http.get("*/api/listing/list/", ({ request }) => {
    const url = new URL(request.url);

    // Parse all query params
    const search = url.searchParams.get("search");
    const status = url.searchParams.get("status");
    const source = url.searchParams.get("source");
    const district = url.searchParams.get("district");
    const rooms = url.searchParams.get("rooms");
    const priceMin = url.searchParams.get("price_min");
    const priceMax = url.searchParams.get("price_max");
    const areaMin = url.searchParams.get("area_min");
    const areaMax = url.searchParams.get("area_max");
    const scoreMin = url.searchParams.get("score_min");
    const scoreMax = url.searchParams.get("score_max");
    const hasPicture = url.searchParams.get("has_picture");
    const assignedTo = url.searchParams.get("assigned_to");

    let results = [...MOCK_LISTINGS];

    // Search: title, phone, description
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (l) =>
          l.title?.toLowerCase().includes(q) ||
          l.phone?.includes(q) ||
          l.description?.toLowerCase().includes(q)
      );
    }

    // Status (single or comma-separated)
    if (status) {
      const statuses = status.split(",");
      results = results.filter((l) => statuses.includes(l.status));
    }

    // Source
    if (source) {
      results = results.filter((l) => l.source === source);
    }

    // District (by id)
    if (district) {
      results = results.filter((l) => String(l.district?.id) === district);
    }

    // Rooms
    if (rooms) {
      results = results.filter((l) => String(l.room_count) === rooms);
    }

    // Price range (listed_sale_price or listed_rent_amount)
    if (priceMin) {
      const min = Number(priceMin);
      results = results.filter(
        (l) =>
          (l.listed_sale_price && l.listed_sale_price >= min) ||
          (l.listed_rent_amount && l.listed_rent_amount >= min)
      );
    }
    if (priceMax) {
      const max = Number(priceMax);
      results = results.filter(
        (l) =>
          (l.listed_sale_price && l.listed_sale_price <= max) ||
          (l.listed_rent_amount && l.listed_rent_amount <= max)
      );
    }

    // Area range (listed_area)
    if (areaMin) {
      results = results.filter((l) => l.listed_area >= Number(areaMin));
    }
    if (areaMax) {
      results = results.filter((l) => l.listed_area <= Number(areaMax));
    }

    // Score range
    if (scoreMin) {
      results = results.filter((l) => l.score >= Number(scoreMin));
    }
    if (scoreMax) {
      results = results.filter((l) => l.score <= Number(scoreMax));
    }

    // Has picture
    if (hasPicture === "true") {
      results = results.filter((l) => !!l.hs_picture);
    }

    // Assigned to
    if (assignedTo) {
      results = results.filter((l) => l.assigned_to?.id === Number(assignedTo));
    }

    return HttpResponse.json(results, { status: 200 });
  }),

  http.get("*/api/listing/detail/:id/", ({ params }) => {
    const id = Number(params.id);
    const listing = MOCK_LISTINGS.find((l) => l.id === id);
    if (!listing) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    return HttpResponse.json(listing, { status: 200 });
  }),

  http.post("*/api/listing/create/", async ({ request }) => {
    const body = await request.json();
    const newListing = {
      id: MOCK_LISTINGS.length + 1,
      ...body,
      build_year: body.build_year || null,
      room_count: body.room_count || null,
      price_per_meter_toman: body.price_per_meter_toman || null,
      deposit_toman: body.deposit_toman || null,
      floor_number: body.floor_number || null,
      hs_picture: body.hs_picture || null,
      call_count: 0,
      last_call_at: null,
      converted_to: null,
      converted_id: null,
      property: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_LISTINGS.push(newListing);
    return HttpResponse.json(
      { message: "listing created", listing: newListing },
      { status: 201 }
    );
  }),

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
    return HttpResponse.json(
      { message: "listing updated", listing: MOCK_LISTINGS[index] },
      { status: 200 }
    );
  }),

  http.delete("*/api/listing/delete/:id/", ({ params }) => {
    const id = Number(params.id);
    const index = MOCK_LISTINGS.findIndex((l) => l.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    MOCK_LISTINGS.splice(index, 1);
    return HttpResponse.json(
      { message: "listing deleted" },
      { status: 204 }
    );
  }),

  http.put("*/api/listing/assign/:id/", async ({ params, request }) => {
    const id = Number(params.id);
    const index = MOCK_LISTINGS.findIndex((l) => l.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    const body = await request.json();
    MOCK_LISTINGS[index].assigned_to = body.assigned_to;
    MOCK_LISTINGS[index].updated_at = new Date().toISOString();
    return HttpResponse.json(
      { message: "listing assigned", listing: MOCK_LISTINGS[index] },
      { status: 200 }
    );
  }),

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
    MOCK_LISTINGS[index].converted_to = "owner";
    MOCK_LISTINGS[index].converted_id = newOwner.id;
    MOCK_LISTINGS[index].updated_at = new Date().toISOString();
    return HttpResponse.json(
      { message: "converted to owner", owner: newOwner },
      { status: 200 }
    );
  }),

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
    MOCK_LISTINGS[index].converted_to = "property";
    MOCK_LISTINGS[index].converted_id = newProperty.id;
    MOCK_LISTINGS[index].property = newProperty;
    MOCK_LISTINGS[index].updated_at = new Date().toISOString();
    return HttpResponse.json(
      { message: "converted to property", property: newProperty },
      { status: 200 }
    );
  }),
];
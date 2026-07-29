import { http, HttpResponse } from "msw";
import { MOCK_OWNERS } from "../data/mockOwners";
import { MOCK_PROPERTIES, MOCK_FEATURES } from "../data/mockProperties";
import { MOCK_LEADS } from "../data/mockLeads";

export const propertyHandlers = [
  // Owners List
  http.get("*/api/owners/", () => {
    return HttpResponse.json(MOCK_OWNERS, { status: 200 });
  }),

  // New owner
  http.post("*/api/owners/", async ({ request }) => {
    const body = await request.json();
    const newOwner = {
      id: MOCK_OWNERS.length + 1,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_OWNERS.push(newOwner);
    return HttpResponse.json(newOwner, { status: 201 });
  }),

  // Properties List
  http.get("*/api/properties/", ({ request }) => {
    const url = new URL(request.url);
    const createdBy = url.searchParams.get("created_by");
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search")?.toLowerCase();

    let result = [...MOCK_PROPERTIES];

    if (createdBy) {
      result = result.filter((p) => Number(p.created_by) === Number(createdBy));
    }
    if (status) {
      result = result.filter((p) => p.status === status);
    }
    if (search) {
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(search) ||
          p.property_code?.toLowerCase().includes(search),
      );
    }

    return HttpResponse.json(result, { status: 200 });
  }),

  // Property details
  http.get('*/api/properties/:id/', ({ params }) => {
    const property = MOCK_PROPERTIES.find(p => p.id === Number(params.id));
    if (property) return HttpResponse.json(property, { status: 200 });
    return HttpResponse.json({ message: 'فایل ملک یافت نشد.' }, { status: 404 });
  }),

  // Edit / update property details 
  http.patch('*/api/properties/:id/', async ({ params, request }) => {
    const body = await request.json();
    const property = MOCK_PROPERTIES.find(p => p.id === Number(params.id));

    if (property) {
      Object.assign(property, body, { updated_at: new Date().toISOString() });
      return HttpResponse.json(property, { status: 200 });
    }
    return HttpResponse.json({ message: 'فایل ملک یافت نشد.' }, { status: 404 });
  }),

  // Convert Lead to Property (Core Feature)
  http.post('*/api/properties/', async ({ request }) => {
    const body = await request.json();
    const newProperty = {
      id: MOCK_PROPERTIES.length + 1,
      property_code: `MJ-${1000 + MOCK_PROPERTIES.length + 1}`,
      status: 'AVAILABLE',
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    MOCK_PROPERTIES.push(newProperty);

    if (body.lead_id) {
      const lead = MOCK_LEADS.find(l => l.id === body.lead_id);
      if (lead) {
        lead.status = 'CONVERTED';
        lead.property = newProperty.id;
      }
    }

    return HttpResponse.json(newProperty, { status: 201 });
  }),

  // Features of property (parking , ... )
  http.get("*/api/features/", () => {
    return HttpResponse.json(MOCK_FEATURES, { status: 200 });
  }),
];

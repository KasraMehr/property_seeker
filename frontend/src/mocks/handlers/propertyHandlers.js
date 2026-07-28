import { http, HttpResponse } from 'msw';
import { MOCK_OWNERS } from '../data/mockOwners';
import { MOCK_PROPERTIES, MOCK_FEATURES } from '../data/mockProperties';
import { MOCK_LEADS } from '../data/mockLeads';

export const propertyHandlers = [
  // Owners List & Create
  http.get('*/api/owners/', () => {
    return HttpResponse.json(MOCK_OWNERS, { status: 200 });
  }),

  http.post('*/api/owners/', async ({ request }) => {
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

  // Properties List & Details
  http.get('*/api/properties/', () => {
    return HttpResponse.json(MOCK_PROPERTIES, { status: 200 });
  }),

  http.get('*/api/properties/:id/', ({ params }) => {
    const { id } = params;
    const property = MOCK_PROPERTIES.find(p => p.id === Number(id));

    if (property) {
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

    // If converted from a lead, link it and update lead status
    if (body.lead_id) {
      const lead = MOCK_LEADS.find(l => l.id === body.lead_id);
      if (lead) {
        lead.status = 'CONVERTED';
        lead.property = newProperty.id;
      }
    }

    return HttpResponse.json(newProperty, { status: 201 });
  }),

  // Features list
  http.get('*/api/features/', () => {
    return HttpResponse.json(MOCK_FEATURES, { status: 200 });
  }),
];
import { http, HttpResponse } from 'msw';
import { MOCK_LEADS } from '../data/mockLeads';

export const leadHandlers = [
  // Get all leads with optional filter simulation
  http.get('*/api/listings/', ({ request }) => {
    const url = new URL(request.url);
    const statusFilter = url.searchParams.get('status');
    const assignedToFilter = url.searchParams.get('assigned_to');

    let filteredLeads = [...MOCK_LEADS];

    if (statusFilter) {
      filteredLeads = filteredLeads.filter(l => l.status === statusFilter);
    }
    if (assignedToFilter) {
      filteredLeads = filteredLeads.filter(l => l.created_by === Number(assignedToFilter));
    }

    return HttpResponse.json(filteredLeads, { status: 200 });
  }),

  // Get single lead details
  http.get('*/api/listings/:id/', ({ params }) => {
    const { id } = params;
    const lead = MOCK_LEADS.find(l => l.id === Number(id));

    if (lead) {
      return HttpResponse.json(lead, { status: 200 });
    }
    return HttpResponse.json({ message: 'آگهی یافت نشد.' }, { status: 404 });
  }),

  // Update lead status
  http.patch('*/api/listings/:id/status/', async ({ params, request }) => {
    const { id } = params;
    const { status } = await request.json();
    const leadIndex = MOCK_LEADS.findIndex(l => l.id === Number(id));

    if (leadIndex !== -1) {
      MOCK_LEADS[leadIndex].status = status;
      MOCK_LEADS[leadIndex].updated_at = new Date().toISOString();
      return HttpResponse.json(MOCK_LEADS[leadIndex], { status: 200 });
    }
    return HttpResponse.json({ message: 'آگهی یافت نشد.' }, { status: 404 });
  }),
];
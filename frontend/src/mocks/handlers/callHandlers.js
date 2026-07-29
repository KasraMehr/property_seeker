import { http, HttpResponse } from 'msw';
import { MOCK_CALL_LOGS, MOCK_FOLLOWUPS, MOCK_LEADS } from '../data/mockLeads';

export const callHandlers = [
  // Get call history
  http.get('*/api/calls/', () => {
    return HttpResponse.json(MOCK_CALL_LOGS, { status: 200 });
  }),

  // Create call result log
  http.post('*/api/calls/', async ({ request }) => {
    const body = await request.json();
    const newCallLog = {
      id: MOCK_CALL_LOGS.length + 1,
      listing: body.listing_id,
      changed_by: body.operator_id || 2,
      old_status: body.old_status || 'NEW',
      new_status: body.new_status || 'CONTACTED',
      reason: body.reason || body.notes,
      created_at: new Date().toISOString(),
    };

    MOCK_CALL_LOGS.push(newCallLog);

    // Automatically update lead status
    const lead = MOCK_LEADS.find(l => l.id === body.listing_id);
    if (lead) {
      lead.status = body.new_status;
    }

    return HttpResponse.json(newCallLog, { status: 201 });
  }),

  // Get followups list
  http.get('*/api/followups/', () => {
    return HttpResponse.json(MOCK_FOLLOWUPS, { status: 200 });
  }),

  // Create new followup task
  http.post('*/api/followups/', async ({ request }) => {
    const body = await request.json();
    const newFollowup = {
      id: MOCK_FOLLOWUPS.length + 1,
      ...body,
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };

    MOCK_FOLLOWUPS.push(newFollowup);
    return HttpResponse.json(newFollowup, { status: 201 });
  }),

  // Update followup status (e.g. mark as COMPLETED)
  http.patch('*/api/followups/:id/complete/', ({ params }) => {
    const { id } = params;
    const followup = MOCK_FOLLOWUPS.find(f => f.id === Number(id));

    if (followup) {
      followup.status = 'COMPLETED';
      return HttpResponse.json(followup, { status: 200 });
    }
    return HttpResponse.json({ message: 'پیگیری یافت نشد.' }, { status: 404 });
  }),
];
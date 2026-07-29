import { http, HttpResponse } from "msw";
import { MOCK_LEADS } from "../data/mockLeads";

export const leadHandlers = [
  // Get all leads with optional filter simulation
  http.get("*/api/listings/", ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const assignedTo = url.searchParams.get("assigned_to");
    const search = url.searchParams.get("search")?.toLowerCase();

    let result = [...MOCK_LEADS];

    if (status) {
      result = result.filter((item) => item.status === status);
    }
    if (assignedTo) {
      result = result.filter(
        (item) => Number(item.assigned_to) === Number(assignedTo),
      );
    }
    if (search) {
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(search) ||
          item.phone?.includes(search),
      );
    }

    return HttpResponse.json(result, { status: 200 });
  }),

  // Get single lead details
  http.get("*/api/listings/:id/", ({ params }) => {
    const lead = MOCK_LEADS.find((l) => l.id === Number(params.id));
    if (lead) return HttpResponse.json(lead, { status: 200 });
    return HttpResponse.json({ message: "آگهی یافت نشد." }, { status: 404 });
  }),

  // Update lead status
  http.patch("*/api/listings/:id/status/", async ({ params, request }) => {
    const { status } = await request.json();
    const lead = MOCK_LEADS.find((l) => l.id === Number(params.id));

    if (lead) {
      lead.status = status;
      lead.updated_at = new Date().toISOString();
      return HttpResponse.json(lead, { status: 200 });
    }
    return HttpResponse.json({ message: "آگهی یافت نشد." }, { status: 404 });
  }),

  // Assign lead to operator
  http.patch("*/api/listings/:id/assign/", async ({ params, request }) => {
    const { operator_id } = await request.json();
    const lead = MOCK_LEADS.find((l) => l.id === Number(params.id));

    if (lead) {
      lead.assigned_to = Number(operator_id);
      lead.updated_at = new Date().toISOString();
      return HttpResponse.json(lead, { status: 200 });
    }
    return HttpResponse.json({ message: "آگهی یافت نشد." }, { status: 404 });
  }),
];

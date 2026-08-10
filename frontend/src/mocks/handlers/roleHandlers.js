import { http, HttpResponse } from "msw";
import { MOCK_ROLES } from "@/mocks/data/mockRoles";

const rolesArray = Object.values(MOCK_ROLES);

export const roleHandlers = [
  // ─── LIST (GET /api/accounts/roles/) ───
  http.get("*/api/accounts/roles/", () => {
    return HttpResponse.json(rolesArray, { status: 200 });
  }),

  // ─── DETAIL (GET /api/accounts/roles/:id/) ───
  http.get("*/api/accounts/roles/:id/", ({ params }) => {
    const id = Number(params.id);
    const role = rolesArray.find((r) => r.id === id);
    if (!role) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    return HttpResponse.json(role, { status: 200 });
  }),

  // ─── CREATE (POST /api/accounts/roles/) ───
  http.post("*/api/accounts/roles/", async ({ request }) => {
    const body = await request.json();
    const newRole = {
      id: rolesArray.length + 1,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    rolesArray.push(newRole);
    return HttpResponse.json(newRole, { status: 201 });
  }),

  // ─── UPDATE (PUT /api/accounts/roles/:id/) ───
  http.put("*/api/accounts/roles/:id/", async ({ params, request }) => {
    const id = Number(params.id);
    const index = rolesArray.findIndex((r) => r.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    const body = await request.json();
    rolesArray[index] = {
      ...rolesArray[index],
      ...body,
      updated_at: new Date().toISOString(),
    };
    return HttpResponse.json(rolesArray[index], { status: 200 });
  }),

  // ─── DELETE (DELETE /api/accounts/roles/:id/) ───
  http.delete("*/api/accounts/roles/:id/", ({ params }) => {
    const id = Number(params.id);
    const index = rolesArray.findIndex((r) => r.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    rolesArray.splice(index, 1);
    return HttpResponse.json({ detail: "deleted" }, { status: 204 });
  }),

   // ─── PERMISSIONS (GET /api/accounts/permissions/) ───
  http.get("*/api/accounts/permissions/", () => {
    return HttpResponse.json(
      [
        // properties
        { codename: "add_property", name: "افزودن فایل ملکی" },
        { codename: "change_property", name: "ویرایش فایل ملکی" },
        { codename: "delete_property", name: "حذف فایل ملکی" },
        { codename: "view_property", name: "مشاهده فایل ملکی" },
        // owners
        { codename: "add_owner", name: "افزودن مالک" },
        { codename: "change_owner", name: "ویرایش مالک" },
        { codename: "delete_owner", name: "حذف مالک" },
        { codename: "view_owner", name: "مشاهده مالک" },
        // features
        { codename: "add_feature", name: "افزودن امکانات" },
        { codename: "change_feature", name: "ویرایش امکانات" },
        { codename: "delete_feature", name: "حذف امکانات" },
        { codename: "view_feature", name: "مشاهده امکانات" },
        // property features
        { codename: "add_property_feature", name: "افزودن امکانات به ملک" },
        { codename: "change_property_feature", name: "ویرایش امکانات ملک" },
        { codename: "delete_property_feature", name: "حذف امکانات ملک" },
        { codename: "view_property_feature", name: "مشاهده امکانات ملک" },
        // property status history
        { codename: "view_property_status_history", name: "مشاهده تاریخچه وضعیت" },
        // crm
        { codename: "create_customer", name: "افزودن مشتری" },
        { codename: "view_customer", name: "مشاهده مشتری" },
        { codename: "create_customer_preference", name: "افزودن اولویت مشتری" },
        { codename: "view_customer_preference", name: "مشاهده اولویت مشتری" },
        // locations
        { codename: "add_province", name: "افزودن استان" },
        { codename: "view_province", name: "مشاهده استان" },
        { codename: "change_province", name: "ویرایش استان" },
        { codename: "delete_province", name: "حذف استان" },
        { codename: "list_province", name: "لیست استان‌ها" },
        { codename: "add_city", name: "افزودن شهر" },
        { codename: "view_city", name: "مشاهده شهر" },
      ],
      { status: 200 }
    );
  }),
];
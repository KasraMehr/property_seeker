import BaseDashboardLayout from "./BaseDashboardLayout";
import { ADMIN_NAV_ITEMS } from "../constants/dashboardConstants";

export default function AdminLayout() {
  return (
    <BaseDashboardLayout
      role="admin"
      menuItems={ADMIN_NAV_ITEMS}
      // footerItems={ADMIN_CONSTANTS.footerItems}
    />
  );
}
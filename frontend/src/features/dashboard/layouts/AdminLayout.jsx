import DashboardLayout from "../../../shared/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "../constants/dashboardConstants";

export default function AdminLayout() {
  return (
    <DashboardLayout
      role="admin"
      menuItems={ADMIN_NAV_ITEMS}
    />
  );
}
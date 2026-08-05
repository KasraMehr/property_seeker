import DashboardLayout from "../../../shared/layout/DashboardLayout";
import { OPERATOR_NAV_ITEMS } from "../constants/dashboardConstants";

export default function OperatorLayout() {
  return (
    <DashboardLayout
      role="operator"
      menuItems={OPERATOR_NAV_ITEMS}
    />
  );
}
import BaseDashboardLayout from "./BaseDashboardLayout";
import { OPERATOR_NAV_ITEMS } from "../constants/dashboardConstants";

export default function OperatorLayout() {
  return (
    <BaseDashboardLayout
      role="operator"
      menuItems={OPERATOR_NAV_ITEMS}
      // footerItems={OPERATOR_CONSTANTS.footerItems}
    />
  );
}
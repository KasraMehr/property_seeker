import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import useCustomer from "../hooks/useCustomer";
import { CUSTOMER_TABLE_COLUMNS, CUSTOMER_QUICK_FILTERS } from "../config";
import customerService from "../services/customerService";

export default function CustomersPage() {
  const resource = useCustomer();

  return (
    <ResourceTemplate
      title="مدیریت مشتریان"
      subtitle="مدیریت و پیگیری خریداران، فروشندگان و مستاجرین"
      resource={resource}
      service={customerService}
      columns={CUSTOMER_TABLE_COLUMNS}
      filterSchema={CUSTOMER_QUICK_FILTERS}
      entityName="مشتری"
      permissionPrefix="customer"
    />
  );
}
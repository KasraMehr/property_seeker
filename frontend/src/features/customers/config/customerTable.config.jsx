import { CUSTOMER_TYPE_CONFIG, CUSTOMER_STATUS_CONFIG } from "./customerStatus.config";

export const CUSTOMER_TABLE_COLUMNS = [
  {
    key: "full_name",
    label: "نام مشتری",
    sortable: true,
  },
  {
    key: "phone",
    label: "شماره تماس",
    sortable: true,
  },
  {
    key: "customer_type",
    label: "نوع مشتری",
    render: (val) => CUSTOMER_TYPE_CONFIG[val]?.label || val || "—",
  },
  {
    key: "status",
    label: "وضعیت",
    render: (val) => CUSTOMER_STATUS_CONFIG[val]?.label || val || "—",
  },
  {
    key: "assigned_agent_name",
    label: "کارشناس مسئول",
    render: (val) => val || "—",
  },
  {
    key: "source",
    label: "منبع",
    render: (val) => val || "—",
  },
];
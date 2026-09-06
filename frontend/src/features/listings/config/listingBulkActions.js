import { ClipboardCheck } from "lucide-react";

/**
 * Listing Bulk Actions
 * Backend: POST /api/listing/bulk/review-change-status/
 */
export const LISTING_BULK_ACTIONS = [
  {
    key: "change_review_status",
    label: "تغییر وضعیت بررسی",
    icon: ClipboardCheck,
    variant: "outline",
    type: "bulk",
    permission: null,
    handler: "change_review_status",
  },
];

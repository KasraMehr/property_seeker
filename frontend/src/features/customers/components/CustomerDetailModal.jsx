import { useState, useEffect } from "react";
import { User, Phone, Tag, Calendar, FileText } from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import {
  CUSTOMER_TYPE_CONFIG,
  CUSTOMER_STATUS_CONFIG,
  CUSTUMER_DETAIL_FIELDS,
} from "@/features/customers/config";
import { DetailFieldGrid } from "@/shared/page/DetailContentRenderer";


export default function CustomerDetailModal({ isOpen, onClose, customer }) {
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    if (isOpen) setActiveTab("info");
  }, [isOpen, customer?.id]);

  if (!customer) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="جزئیات مشتری"
      className="h-[75vh]"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 mb-4 pb-4 border-b border-border">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground">
            {customer.full_name || "نامشخص"}
          </h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs text-muted-foreground font-mono dir-ltr">
              {customer.phone}
            </span>
            {customer.customer_type && (
              <StatusBadge
                status={customer.customer_type}
                config={CUSTOMER_TYPE_CONFIG}
                size="sm"
                variant="soft"
              />
            )}
            {customer.status && (
              <StatusBadge
                status={customer.status}
                config={CUSTOMER_STATUS_CONFIG}
                size="sm"
                variant="soft"
              />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4">
        <DetailFieldGrid data={customer} sections={CUSTOMER_DETAIL_FIELDS} />
      </div>

      {/* Footer */}
      <div className="shrink-0 flex justify-end gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={onClose}>
          بستن
        </Button>
      </div>
    </Modal>
  );
}
import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { ASSIGN_AGENT_FORM } from "@/features/properties/config";
import propertyService from "@/features/properties/services/propertyService";

export default function AssignAgentModal({ isOpen, onClose, properties = [], onSuccess }) {
  const [loading, setLoading] = useState(false);
  const isBulk = properties.length > 1;

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const ids = properties.map((p) => p.id);
      await propertyService.bulkAssignAgent(ids, data.agent, data.note);
      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={isBulk ? `تخصیص مشاور (${properties.length})` : "تخصیص مشاور"}>
      <FormRenderer
        config={ASSIGN_AGENT_FORM}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}
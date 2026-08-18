import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import { LOCATION_LEVELS } from "../config";

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-foreground text-left">{value || "—"}</span>
    </div>
  );
}

export default function LocationDetailModal({ isOpen, onClose, levelKey, record }) {
  const level = LOCATION_LEVELS[levelKey];
  if (!isOpen || !record || !level) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={`جزئیات ${level.label}`}>
      <div className="space-y-1 px-1">
        <Row label="شناسه" value={`#${record.id}`} />
        <Row label="نام" value={record.name} />
        {levelKey === "city" && <Row label="استان" value={record.province} />}
        {levelKey === "district" && <Row label="شهر" value={record.city_name} />}
        {levelKey === "neighborhood" && (
          <>
            <Row label="منطقه" value={record.district_name} />
            <Row label="شهر" value={record.city_name} />
          </>
        )}
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="ghost" onClick={onClose}>
          بستن
        </Button>
      </div>
    </Modal>
  );
}
import { useState, useMemo } from "react";
import { User, Calendar, ShieldCheck } from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import RoleBadge from "@/shared/ui/badges/RoleBadge";
import Can from "@/shared/access/Can";
import { PERMISSIONS } from "@/constants/permissions";
import {
  USER_DETAIL_TABS,
  USER_PROFILE_FIELDS,
  USER_ACTIVITY_COLUMNS,
} from "@/features/users-management/config";
import { DetailFieldGrid, DetailListTable } from "@/shared/components/DetailContentRenderer";

export default function UserDetailModal({ isOpen, onClose, user }) {
  const [activeTab, setActiveTab] = useState("profile");

  if (!user) return null;

  useMemo(() => {
    if (isOpen) setActiveTab("profile");
  }, [isOpen, user?.id]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="جزئیات کاربر" className="h-[80vh]">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 mb-4 pb-4 border-b border-border">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground">{user.full_name}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs text-muted-foreground font-mono ltr">{user.phone}</span>
            {user.is_owner && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <ShieldCheck className="w-3 h-3" /> مالک آژانس
              </span>
            )}
            <div className="flex gap-1">
              {(user.role || []).map((r) => (
                <RoleBadge key={r.id} role={r.name} size="sm" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline" className="flex-1 min-h-0 flex flex-col">
        <Tabs.List className="mb-2 shrink-0">
          {USER_DETAIL_TABS.map((tab) => (
            <Can key={tab.key} permission={tab.permission}>
              <Tabs.Trigger value={tab.key} icon={tab.icon}>{tab.label}</Tabs.Trigger>
            </Can>
          ))}
        </Tabs.List>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          <Tabs.Content value="profile">
            <DetailFieldGrid data={user} sections={USER_PROFILE_FIELDS} />
          </Tabs.Content>

          <Tabs.Content value="activity">
            <DetailListTable
              data={user.activity_logs || []}
              columns={USER_ACTIVITY_COLUMNS}
              emptyText="فعالیتی ثبت نشده"
            />
          </Tabs.Content>
        </div>
      </Tabs>

      {/* Footer */}
      <div className="shrink-0 flex justify-end gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={onClose}>بستن</Button>
      </div>
    </Modal>
  );
}
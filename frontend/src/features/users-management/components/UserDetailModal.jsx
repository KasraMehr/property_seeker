import { useState, useEffect } from "react";
import { User, ShieldCheck, MapPin, CalendarClock } from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import RoleBadge from "@/shared/ui/badges/RoleBadge";
import DealTypeBadge from "@/shared/ui/badges/DealTypeBadge";
import UserPermissionsTab from "@/features/users-management/components/UserPermissionsTab";
import {
  USER_DETAIL_TABS,
  USER_PROFILE_FIELDS,
  USER_ACTIVITY_COLUMNS,
} from "@/features/users-management/config";
import { DetailFieldGrid, DetailListTable } from "@/shared/page/DetailContentRenderer";

export default function UserDetailModal({ isOpen, onClose, user }) {
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (isOpen) setActiveTab("profile");
  }, [isOpen, user?.id]);

  if (!user) return null;

  const neighborhoods = Array.isArray(user.service_neighborhoods)
    ? user.service_neighborhoods
    : [];

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
        <div className="shrink-0">
          <DealTypeBadge value={user.deal_type_scope} isOwner={user.is_owner} />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline" className="flex-1 min-h-0 flex flex-col">
        <Tabs.List className="mb-2 shrink-0">
          {USER_DETAIL_TABS.map((tab) => (
            <Tabs.Trigger key={tab.key} value={tab.key} icon={tab.icon}>{tab.label}</Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          <Tabs.Content value="profile">
            <DetailFieldGrid data={user} sections={USER_PROFILE_FIELDS} />
          </Tabs.Content>

          <Tabs.Content value="neighborhoods">
            {neighborhoods.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" dir="rtl">
                {neighborhoods.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin className="w-4 h-4 shrink-0 text-primary" />
                      <span className="text-sm text-foreground truncate">{n.name}</span>
                    </div>
                    {n.city_name && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        {n.city_name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <MapPin className="w-8 h-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  هنوز محله‌ی خدمتی برای این کاربر انتخاب نشده است
                </p>
              </div>
            )}
          </Tabs.Content>

          <Tabs.Content value="permissions">
            <UserPermissionsTab user={user} />
          </Tabs.Content>

          <Tabs.Content value="activity">
            {/* Tab 4: Activity History — به زودی */}
            {tabActivityHasData(user) ? (
              <DetailListTable
                data={user.activity_logs || []}
                columns={USER_ACTIVITY_COLUMNS}
                emptyText="فعالیتی ثبت نشده"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CalendarClock className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  تاریخچه فعالیت به زودی
                </p>
                <p className="text-xs text-muted-foreground">
                  این بخش در نسخه‌های بعدی اضافه می‌شود.
                </p>
              </div>
            )}
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

function tabActivityHasData(user) {
  return Array.isArray(user?.activity_logs) && user.activity_logs.length > 0;
}

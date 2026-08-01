import { useState, useEffect, useMemo } from "react";
import { Users, Search, Check, X } from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import SearchBox from "@/shared/ui/SearchBox";
import userService from "@/features/users-management/services/userService";

export default function AssignOperatorModal({
  isOpen,
  onClose,
  listingId,
  onAssign,
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch users on open
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await userService.getAll();
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.results || [];
        if (!cancelled) setUsers(list);
      } catch {
        if (!cancelled) setUsers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchUsers();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      setSelectedUserId(null);
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.trim().toLowerCase();
    return users.filter(
      (u) =>
        (u.full_name || "").toLowerCase().includes(q) ||
        (u.phone || "").includes(q) ||
        (u.email || "").toLowerCase().includes(q),
    );
  }, [users, search]);

  const handleAssign = async () => {
    if (!selectedUserId || !listingId) return;
    setSubmitting(true);
    try {
      await onAssign(listingId, selectedUserId);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="تخصیص به کارشناس">
      <div className="space-y-4" dir="rtl">
        {/* Search */}
        <SearchBox
          label="جستجوی کارشناس"
          placeholder="نام، شماره یا ایمیل..."
          value={search}
          onChange={setSearch}
          debounce={0}
          size="sm"
        />

        {/* Users list */}
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-sm text-muted">
                در حال بارگذاری...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted">
                کارشناسی یافت نشد
              </div>
            ) : (
              filtered.map((user) => {
                const isSelected = selectedUserId === user.id;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedUserId(user.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-right transition-colors border-b border-border last:border-b-0 hover:bg-(--role-subtle)/20 ${
                      isSelected ? "bg-(--role-primary)/10" : ""
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "border-(--role-primary) bg-(--role-primary)"
                          : "border-border"
                      }`}
                    >
                      {isSelected && <Check size={12} className="text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.full_name || user.phone || `کاربر ${user.id}`}
                      </p>
                      <p className="text-xs text-muted">
                        {user.phone || user.email || ""}
                      </p>
                    </div>
                    {user.role && (
                      <span className="...">
                        {user.role?.map?.((r) => r.name || r).join("، ") || ""}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={submitting}
          >
            انصراف
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAssign}
            disabled={!selectedUserId || submitting}
          >
            {submitting ? "در حال تخصیص..." : "تخصیص"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

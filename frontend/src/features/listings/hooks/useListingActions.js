import { useState, useCallback } from "react";
import listingService from "@/features/listings/services/listingService";

/**
 * useListingActions — API actions with modal-ready confirmation state
 *
 * Render your ConfirmModal in the page using:
 *   <ConfirmModal
 *     isOpen={actions.pendingDeleteId != null}
 *     onConfirm={actions.confirmDelete}
 *     onCancel={actions.cancelDelete}
 *     ...
 *   />
 */
export default function useListingActions(onRefresh) {
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  // Delete: open modal
  const remove = useCallback((id) => {
    setPendingDeleteId(id);
  }, []);

  // Delete: confirmed from modal
  const confirmDelete = useCallback(async () => {
    if (pendingDeleteId == null) return;
    try {
      await listingService.remove(pendingDeleteId);
      toast.success("آگهی حذف شد");
      onRefresh?.();
    } catch {
      toast.error("خطا در حذف آگهی");
    } finally {
      setPendingDeleteId(null);
    }
  }, [pendingDeleteId, onRefresh]);

  // Delete: cancelled from modal
  const cancelDelete = useCallback(() => {
    setPendingDeleteId(null);
  }, []);

  // Assign 
  const assign = useCallback(
    async (listingId, userId) => {
      try {
        await listingService.assign(listingId, userId);
        toast.success("آگهی با موفقیت تخصیص یافت");
        onRefresh?.();
      } catch {
        toast.error("خطا در تخصیص آگهی");
        throw new Error("assign failed");
      }
    },
    [onRefresh]
  );

  return {
    remove,          // (id) => opens delete confirm modal
    assign,          // (listingId, userId) => direct API call
    pendingDeleteId, // number | null  → pass to your ConfirmModal isOpen
    confirmDelete,   // () => execute delete
    cancelDelete,    // () => close modal
  };
}
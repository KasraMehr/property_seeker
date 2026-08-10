import useAuthStore from "@/store/useAuthStore";

/**
 * When you need to check boolean situations for permissions(enable/disable)
 * 
 *   const canDelete = usePermission(PERMISSIONS.PROPERTY.DELETE);
 *   return <button disabled={!canDelete}>حذف</button>;
 */
export function usePermission(code) {
  return useAuthStore((s) => s.hasPermission(code));
}

// check many permissions at the same time
export function usePermissions(codes = [], mode = "any") {
  const store = useAuthStore();
  if (mode === "all") return store.hasAllPermissions(codes);
  return store.hasAnyPermission(codes);
}
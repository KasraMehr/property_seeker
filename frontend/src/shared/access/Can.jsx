import useAuthStore from "@/store/useAuthStore";

/**
 * UI Gate component to check if user has the premission to see the children
 * 
 *   <Can permission={PERMISSIONS.PROPERTY.DELETE}>
 *     <DeleteButton />
 *   </Can>
 * 
 *   <Can anyOf={[PERMISSIONS.PROPERTY.CHANGE, PERMISSIONS.PROPERTY.DELETE]}>
 *     <BulkActions />
 *   </Can>
 * 
 *   <Can allOf={[PERMISSIONS.PROPERTY.VIEW, PERMISSIONS.PROPERTY.CHANGE]}>
 *     <EditDetail />
 *   </Can>
 * 
 *   <Can permission={PERMISSIONS.PROPERTY.DELETE} fallback={<span>—</span>}>
 *     <DeleteButton />
 *   </Can>
 */
export default function Can({ permission, anyOf, allOf, fallback = null, children }) {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const hasAnyPermission = useAuthStore((s) => s.hasAnyPermission);
  const hasAllPermissions = useAuthStore((s) => s.hasAllPermissions);

  let allowed = true;

  if (permission) {
    allowed = hasPermission(permission);
  } else if (anyOf && Array.isArray(anyOf)) {
    allowed = hasAnyPermission(anyOf);
  } else if (allOf && Array.isArray(allOf)) {
    allowed = hasAllPermissions(allOf);
  }

  return allowed ? children : fallback;
}
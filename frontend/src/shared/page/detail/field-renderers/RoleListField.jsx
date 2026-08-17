import RoleBadge from "@/shared/ui/badges/RoleBadge";

export default function RoleListField({ value }) {
  const roles = Array.isArray(value) ? value : [value];
  return (
    <div className="flex flex-wrap gap-1">
      {roles.map((r, i) => (
        <RoleBadge key={i} role={r?.name || r} size="sm" />
      ))}
    </div>
  );
}
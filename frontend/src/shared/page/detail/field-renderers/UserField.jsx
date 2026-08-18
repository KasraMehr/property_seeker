import { User } from "lucide-react";

export default function UserField({ value }) {
  const userName = value?.full_name || value?.name || "—";
  return (
    <span className="inline-flex items-center gap-1.5">
      <User className="w-3.5 h-3.5 text-muted-foreground" />
      {userName}
    </span>
  );
}
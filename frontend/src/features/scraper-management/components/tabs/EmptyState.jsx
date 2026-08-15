import { Inbox } from "lucide-react";

export default function EmptyState({ message }) {
  return (
    <div className="py-12 text-center space-y-3">
      <Inbox size={48} className="mx-auto text-muted/40" />
      <p className="text-sm font-medium text-foreground">{message}</p>
    </div>
  );
}
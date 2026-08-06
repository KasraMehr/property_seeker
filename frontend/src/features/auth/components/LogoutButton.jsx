import { LogOut, Loader2 } from "lucide-react";
import Button from "@/shared/ui/Button";

export default function LogoutButton({
  onClick,
  isLoading = false,
}) {
  return (
    <Button
      onClick={onClick}
      variant="danger"
      size="sm"
      disabled={isLoading}
      className="
        w-full
        justify-start
        gap-3
        rounded-xl
        px-3
        py-2.5
        text-sm
        font-semibold
        hover:bg-danger/10
      "
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <LogOut size={18} />
      )}

      <span>
        {isLoading ? "در حال خروج..." : "خروج از حساب"}
      </span>
    </Button>
  );
}
export default function Checkbox({
  checked = false,
  onChange,
  disabled = false,
  indeterminate = false,
  className = "",
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label="انتخاب"
      disabled={disabled}
      onClick={onChange}
      className={`
        relative
        flex items-center justify-center
        w-4 h-4
        rounded-md
        border
        transition-all duration-150
        shrink-0
        ${
          checked || indeterminate
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-surface hover:border-primary/60 hover:bg-muted/40"
        }
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }
        ${className}
      `}
    >
      {indeterminate ? (
        <span className="w-2 h-0.5 rounded-full bg-current" />
      ) : checked ? (
        <svg
          viewBox="0 0 12 12"
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.5 6.2 5 8.5 9.5 3.5" />
        </svg>
      ) : null}
    </button>
  );
}
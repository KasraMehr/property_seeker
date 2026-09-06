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
        w-[18px] h-[18px]
        rounded-lg
        border-[1.5px]
        transition-all duration-200 ease-out
        shrink-0
        ${
          checked || indeterminate
            ? "border-(--role-primary) bg-(--role-primary) text-white shadow-sm shadow-(--role-primary)/25"
            : "border-border/60 bg-surface hover:border-(--role-primary)/50 hover:bg-(--role-subtle)/40"
        }
        ${
          disabled
            ? "opacity-40 cursor-not-allowed"
            : "cursor-pointer active:scale-90"
        }
        ${className}
      `}
    >
      {indeterminate ? (
        <span className="w-2.5 h-[2px] rounded-full bg-current" />
      ) : checked ? (
        <svg
          viewBox="0 0 12 12"
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.5 6.2 5 8.5 9.5 3.5" />
        </svg>
      ) : null}
    </button>
  );
}
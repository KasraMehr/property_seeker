import { forwardRef, useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X, Search } from "lucide-react";

/**
 * Select — custom dropdown, role-aware, searchable optional
 */
const Select = forwardRef(({
  label,
  options = [],
  value,
  onChange,
  placeholder = " ",
  searchable = false,
  clearable = false,
  disabled = false,
  error,
  size = "md",
  className = "",
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const selected = options.find((o) => o.value === value);
  const isError = !!error;

  useEffect(() => {
    const handle = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const toggle = () => !disabled && setIsOpen((p) => !p);
  const handleSelect = (v) => {
    onChange?.(v);
    setIsOpen(false);
    setSearch("");
  };
  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.("");
  };

  const filtered = searchable
    ? options.filter((o) => o.label.includes(search))
    : options;

  const sizeMap = {
    sm: { wrap: "py-1.5 px-3 text-xs", panel: "max-h-48", item: "px-3 py-1.5 text-xs" },
    md: { wrap: "py-2.5 px-4 text-sm", panel: "max-h-56", item: "px-4 py-2 text-sm" },
    lg: { wrap: "py-3 px-4 text-base", panel: "max-h-64", item: "px-4 py-2.5 text-base" },
  };
  const s = sizeMap[size] || sizeMap.md;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`} {...props}>
      {/* Trigger */}
      <button
        type="button"
        ref={ref}
        onClick={toggle}
        disabled={disabled}
        className={`
          group relative w-full flex items-center gap-2 rounded-xl border bg-surface backdrop-blur-sm
          transition-all duration-200 ease-in-out
          ${isError
            ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/20"
            : "border-border hover:border-(--role-primary)/40 focus:border-(--role-primary) focus:ring-2 focus:ring-(--role-primary)/15"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${s.wrap}
        `}
      >
        <span className={`flex-1 text-right truncate ${selected ? "text-foreground" : "text-muted"}`}>
          {selected ? selected.label : placeholder}
        </span>

        {clearable && selected && !disabled && (
          <span
            onClick={handleClear}
            className="p-0.5 rounded-md hover:bg-danger/10 text-muted hover:text-danger transition-colors"
          >
            <X size={14} />
          </span>
        )}

        <ChevronDown
          size={16}
          className={`
            text-muted transition-transform duration-200 shrink-0
            ${isOpen ? "rotate-180 text-(--role-primary)" : "group-hover:text-foreground"}
          `}
        />

        {label && (
          <span
            className={`
              absolute right-3 pointer-events-none rounded-md px-1 text-xs
              transition-all duration-200 ease-in-out
              ${selected || isOpen
                ? "-top-2 text-[10px] bg-surface text-(--role-primary)"
                : "top-1/2 -translate-y-1/2 text-muted"
              }
              ${isError ? "text-danger" : ""}
            `}
          >
            {label}
          </span>
        )}
      </button>

      {isError && (
        <p className="mt-1 text-xs text-danger font-medium animate-fadeIn">{error}</p>
      )}

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className={`
            absolute z-50 w-full mt-1.5 rounded-xl border border-border bg-surface/95 backdrop-blur-md shadow-lg
            overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150
          `}
        >
          {searchable && (
            <div className="p-2 border-b border-border/60">
              <div className="relative">
                <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجو..."
                  className="w-full pr-9 pl-3 py-1.5 text-sm rounded-lg bg-background border border-border text-foreground placeholder:text-muted focus:outline-none focus:border-(--role-primary) focus:ring-1 focus:ring-(--role-primary)/20"
                />
              </div>
            </div>
          )}

          <ul className={`overflow-y-auto ${s.panel}`}>
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-muted text-center">موردی یافت نشد</li>
            ) : (
              filtered.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <li
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`
                      flex items-center gap-2 cursor-pointer transition-colors duration-150
                      ${s.item}
                      ${isSelected
                        ? "bg-(--role-primary)/8 text-(--role-primary) font-medium"
                        : "text-foreground hover:bg-(--role-subtle)/30"
                      }
                    `}
                  >
                    {opt.icon && <opt.icon size={16} className="shrink-0 opacity-70" />}
                    <span className="flex-1 text-right truncate">{opt.label}</span>
                    {isSelected && <Check size={14} className="shrink-0" />}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
});

Select.displayName = "Select";
export default Select;
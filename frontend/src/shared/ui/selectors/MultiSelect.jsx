import { forwardRef, useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X, Search } from "lucide-react";

/**
 * MultiSelect — chip-based multiple selection dropdown
 *"Select all" + "Clear all" actions
 */
const MultiSelect = forwardRef(({
  label,
  options = [],
  value = [],
  onChange,
  placeholder = " ",
  searchable = false,
  maxDisplay = 2,
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

  const selectedOptions = options.filter((o) => value.some((v) => String(v) === String(o.value)));
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

  const toggleOption = (v) => {
    const sv = String(v);
    const next = value.some((x) => String(x) === sv)
      ? value.filter((x) => String(x) !== sv)
      : [...value, v];
    onChange?.(next);
  };

  const selectAll = (e) => { e?.stopPropagation(); onChange?.(options.map((o) => o.value)); };
  const clearAll = (e) => { e?.stopPropagation(); onChange?.([]); };
  const removeChip = (v, e) => {
    e.stopPropagation();
    const sv = String(v);
    onChange?.(value.filter((x) => String(x) !== sv));
  };

  const filtered = searchable
    ? options.filter((o) => o.label.includes(search))
    : options;

  const sizeMap = {
    sm: { wrap: "py-4 px-3 text-xs min-h-[36px]", panel: "max-h-48", item: "px-3 py-1.5 text-xs" },
    md: { wrap: "py-2 px-4 text-sm min-h-[44px]", panel: "max-h-56", item: "px-4 py-2 text-sm" },
    lg: { wrap: "py-2.5 px-4 text-base min-h-[52px]", panel: "max-h-64", item: "px-4 py-2.5 text-base" },
  };
  const s = sizeMap[size] || sizeMap.md;

  const displayChips = selectedOptions.slice(0, maxDisplay);
  const hiddenCount = selectedOptions.length - maxDisplay;

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
        <div className="flex-1 flex items-center gap-1.5 flex-wrap text-right overflow-hidden">
          {selectedOptions.length === 0 ? (
            <span className="text-muted truncate">{placeholder}</span>
          ) : (
            <>
              {displayChips.map((opt) => (
                <span
                  key={opt.value}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-(--role-primary)/10 text-(--role-primary) border border-(--role-primary)/20"
                >
                  {opt.icon && <opt.icon size={12} />}
                  <span className="truncate max-w-20">{opt.label}</span>
                  <span
                    onClick={(e) => removeChip(opt.value, e)}
                    className="cursor-pointer p-0.5 rounded hover:bg-(--role-primary)/20 transition-colors"
                  >
                    <X size={12} />
                  </span>
                </span>
              ))}
              {hiddenCount > 0 && (
                <span className="text-xs text-muted font-medium">+{hiddenCount}</span>
              )}
            </>
          )}
        </div>

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
              ${selectedOptions.length > 0 || isOpen
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

          {/* Actions bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-background/30">
            <button
              type="button"
              onClick={selectAll}
              className="text-[11px] font-medium text-(--role-primary) hover:text-(--role-primary-hover) transition-colors"
            >
              انتخاب همه
            </button>
            {value.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-[11px] font-medium text-muted hover:text-danger transition-colors"
              >
                پاک کردن
              </button>
            )}
          </div>

          {/* Options */}
          <ul className={`overflow-y-auto ${s.panel}`}>
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-muted text-center">موردی یافت نشد</li>
            ) : (
              filtered.map((opt) => {
                const isSelected = value.includes(opt.value);
                return (
                  <li
                    key={opt.value}
                    onClick={() => toggleOption(opt.value)}
                    className={`
                      flex items-center gap-3 cursor-pointer transition-colors duration-150
                      ${s.item}
                      ${isSelected
                        ? "bg-(--role-primary)/8 text-(--role-primary)"
                        : "text-foreground hover:bg-(--role-subtle)/30"
                      }
                    `}
                  >
                    <span
                      className={`
                        w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors
                        ${isSelected
                          ? "bg-(--role-primary) border-(--role-primary) text-white"
                          : "border-border bg-background"
                        }
                      `}
                    >
                      {isSelected && <Check size={10} strokeWidth={3} />}
                    </span>

                    {opt.icon && <opt.icon size={16} className="shrink-0 opacity-70" />}
                    <span className="flex-1 text-right truncate">{opt.label}</span>
                  </li>
                );
              })
            )}
          </ul>

          {value.length > 0 && (
            <div className="px-4 py-2 border-t border-border/60 bg-background/30 text-[11px] text-muted text-center">
              {value.length} مورد انتخاب شده
            </div>
          )}
        </div>
      )}
    </div>
  );
});

MultiSelect.displayName = "MultiSelect";
export default MultiSelect;
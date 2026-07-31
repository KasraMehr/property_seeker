import { forwardRef, useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import useDebounce from "@/shared/useDebounce";

const SearchBox = forwardRef(({
  value: controlledValue,
  onChange,
  onSearch,
  label,
  placeholder = "جستجو...",
  debounce = 300,
  size = "md",
  autoFocus = false,
  disabled = false,
  className = "",
  ...props
}, ref) => {
  const isControlled = controlledValue !== undefined;
  const [internal, setInternal] = useState(isControlled ? controlledValue : "");
  const displayValue = isControlled ? controlledValue : internal;
  const debouncedValue = useDebounce(displayValue, debounce);

  // Use ref to avoid infinite loop when onSearch is not wrapped in useCallback
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  useEffect(() => {
    onSearchRef.current?.(debouncedValue);
  }, [debouncedValue]);

  const handleChange = (e) => {
    const v = e.target.value;
    if (!isControlled) setInternal(v);
    onChange?.(v);
  };

  const handleClear = () => {
    if (!isControlled) setInternal("");
    onChange?.("");
    onSearch?.("");
  };

  const floatingLabel = label || placeholder;

  const sizeMap = {
    sm: "h-10 text-xs",
    md: "h-12 text-sm",
    lg: "h-14 text-base",
  };

  const iconSize = size === "sm" ? 16 : size === "lg" ? 20 : 18;

  return (
    <div className={`w-full relative ${className}`}>
      <div className="relative">
        <input
          ref={ref}
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder=" "
          autoFocus={autoFocus}
          disabled={disabled}
          dir="rtl"
          className={`
            peer w-full px-4 pt-5 pb-2 rounded-full border bg-surface backdrop-blur-sm
            transition-all duration-200 ease-in-out text-foreground focus:outline-none focus:ring-2
            border-border focus:border-(--role-primary) focus:ring-(--role-primary)/15
            disabled:opacity-50 disabled:cursor-not-allowed
            pr-10 ${displayValue ? "pl-10" : "pl-4"}
            ${sizeMap[size]}
          `}
          {...props}
        />
        <label
          className="
            absolute right-3 transition-all duration-200 ease-in-out pointer-events-none rounded-2xl
            text-sm top-4 text-muted ps-5
            peer-focus:text-[11px] peer-focus:-top-2.5 peer-focus:px-1.5 peer-focus:bg-surface
            peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:px-1.5 peer-not-placeholder-shown:bg-surface
            peer-focus:text-(--role-primary)
          "
        >
          {floatingLabel}
        </label>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
          <Search size={iconSize} />
        </div>
        {displayValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted hover:text-foreground hover:bg-(--role-subtle)/30 transition-colors focus:outline-none"
          >
            <X size={iconSize - 2} />
          </button>
        )}
      </div>
    </div>
  );
});

SearchBox.displayName = "SearchBox";
export default SearchBox;
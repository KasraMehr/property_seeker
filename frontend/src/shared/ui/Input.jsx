// Fully RTL/LTR-aware input with floating label
import { useState , useEffect } from "react";

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  name, // key to save in local storage
  onChange,
  error,
  dir = "", // "auto" | "ltr" | "rtl"
  className = "",
  labelClassName = "",
  errorClassName = "",
  isValid = false,
  showValidation = false,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;

  // refactor saved values in storage
  useEffect(() => {
    if (name && !value) {
      const savedValue = localStorage.getItem(`input_${name}`);
      if (savedValue && onChange) {
        onChange({ target: { value: savedValue } });
      }
    }
  }, [name , value , onChange]);

  // save the changes in local storage
  const handleChange = (e) => {
    if (name) {
      localStorage.setItem(`input_${name}`, e.target.value);
    }
    onChange(e);
  };

  // ===== Direction Logic =====
  const getInputDir = () => {
    if (dir !== "auto" || "") return dir;
    if (type === "tel" || type === "number" || type === "email") {
      return "ltr"; 
    }
    return "rtl"; 
  };

  const inputDir = getInputDir();

  const isError = !!error;
  const isValidState = isValid && showValidation && !isError;
  const borderColor = isError ? "border-red-500" : 
                      isValidState ? "border-green-500" : "border-gray-200";

  return (
    <div className="w-full relative">
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          name={name}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          dir={inputDir}
          className={`
            w-full px-4 pt-6 pb-2 rounded-xl border transition-all duration-200
            ${borderColor}
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${className}
          `}
          {...props}
        />
        
        {label && (
          <label
            className={`
              absolute right-3 transition-all duration-200 pointer-events-none
              ${isFocused || hasValue ? "text-xs top-1" : "text-sm top-3.5"}
              ${isFocused ? "text-blue-600" : ""}
              ${isError ? "text-red-500" : ""}
              ${isValidState ? "text-green-500" : ""}
              ${!isFocused && !hasValue && !isError && !isValidState ? "text-gray-500" : ""}
              ${labelClassName}
            `}
          >
            {label}
          </label>
        )}
      </div>
      
      {isError && (
        <p className={`text-red-500 text-sm mt-1 ${errorClassName || "text-right"}`}>
          {error}
        </p>
      )}
    </div>
  );
}
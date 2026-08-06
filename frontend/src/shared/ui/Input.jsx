import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(({
  label,
  type = "text",
  placeholder,
  error,
  dir = "",
  className = "",
  icon: Icon,
  onFocus,
  ...props
}, ref) => {
  const [localShowPassword, setLocalShowPassword] = useState(false);

  // Set automatic text direction (LTR for phones/passwords, RTL for persian text)
  const inputDir = dir || (type === "tel" || type === "password" || type === "email" ? "ltr" : "rtl");
  const isError = !!error;

  // Toggle dynamic input type for password visibility
  const isPassword = type === "password";
  const inputType = isPassword && localShowPassword ? "text" : type;

  return (
    <div className="w-full relative">
      <div className="relative">
        {/* Native HTML input field */}
        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder || " "}
          dir={inputDir}
          onFocus={onFocus}
          className={`
            peer w-full px-4 pt-5 pb-2 rounded-full border bg-surface backdrop-blur-sm
            transition-all duration-200 ease-in-out text-foreground focus:outline-none focus:ring-2
            ${
              isError
                ? "border-danger focus:border-danger focus:ring-danger/15"
                : "border-border focus:border-primary focus:ring-primary/15"
            }
            ${Icon || isPassword ? "pl-10" : ""}
            ${className}
          `}
          {...props}
        />

        {/* Pure CSS floating label based on peer selectors */}
        {label && (
          <label
            className={`
              absolute right-3 transition-all duration-200 ease-in-out pointer-events-none rounded-2xl
              text-sm top-4 text-muted
              peer-focus:text-[11px] peer-focus:-top-2.5 peer-focus:px-1.5 peer-focus:bg-surface
              peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:px-1.5 peer-not-placeholder-shown:bg-surface
              ${isError ? "peer-focus:text-danger" : "peer-focus:text-primary"}
            `}
          >
            {label}
          </label>
        )}

        {/* Dynamic standard icon on the left side */}
        {Icon && !isPassword && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            <Icon size={18} />
          </div>
        )}

        {/* Password visibility controller button */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setLocalShowPassword(!localShowPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted hover:text-foreground focus:outline-none"
          >
            {localShowPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* Field validation error rendering wrapper */}
      <div className="h-5 mt-1 relative">
        {isError && (
          <p className="absolute right-0 top-0 text-danger text-xs font-medium animate-fadeIn">
            {error}
          </p>
        )}
      </div>
    </div>
  );
});

Input.displayName = "Input";
export default Input;
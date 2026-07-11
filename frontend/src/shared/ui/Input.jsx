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
            peer w-full px-4 pt-5 pb-2 rounded-full border bg-white backdrop-blur-sm border-white/15
            transition-all duration-200 ease-in-out text-gray-900 focus:outline-none focus:ring-2
            ${isError 
              ? "border-red-400 focus:border-red-500 focus:ring-red-100" 
              : "border-white/15 focus:border-blue-400 focus:ring-blue-100"
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
              text-sm top-4 text-gray-400
              peer-focus:text-[11px] peer-focus:-top-2.5 peer-focus:text-blue-500 peer-focus:px-1.5 peer-focus:bg-white 
              peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:px-1.5 peer-not-placeholder-shown:bg-white
              ${isError ? "peer-focus:text-red-500" : ""}
            `}
          >
            {label}
          </label>
        )}

        {/* Dynamic standard icon on the left side */}
        {Icon && !isPassword && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}

        {/* Password visibility controller button */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setLocalShowPassword(!localShowPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {localShowPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* Field validation error rendering wrapper */}
      <div className="h-5 mt-1 relative"> 
        {isError && (
          <p className="absolute right-0 top-0 text-red-500 text-xs font-medium animate-fadeIn">
            {error}
          </p>
        )}
      </div>
    </div>
  );
});

Input.displayName = "Input";
export default Input;
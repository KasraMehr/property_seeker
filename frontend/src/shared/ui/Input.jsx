import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      placeholder,
      error,
      dir = "",
      className = "",
      icon: Icon,
      onFocus,
      ...props
    },
    ref
  ) => {
    const [localShowPassword, setLocalShowPassword] = useState(false);

    // Automatic direction
    const inputDir =
      dir ||
      (type === "tel" || type === "password" || type === "email"
        ? "ltr"
        : "rtl");

    const isError = !!error;

    // Password visibility
    const isPassword = type === "password";
    const inputType =
      isPassword && localShowPassword ? "text" : type;

    return (
      <div className="w-full">
        {/* Input wrapper */}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            placeholder={placeholder || " "}
            dir={inputDir}
            onFocus={onFocus}
            className={`
              peer
              w-full
              px-4
              pt-5
              pb-2
              rounded-full
              border
              bg-surface
              backdrop-blur-sm
              transition-all
              duration-200
              ease-in-out
              text-foreground
              focus:outline-none
              focus:ring-2

              /* Hide placeholder normally */
              placeholder:text-transparent

              /* Show placeholder only when focused */
              focus:placeholder:text-muted

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

          {/* Floating label */}
          {label && (
            <label
              className={`
                absolute
                right-3
                top-4
                pointer-events-none
                rounded-2xl
                px-0
                text-sm
                text-muted
                transition-all
                duration-200
                ease-in-out

                /* Focused */
                peer-focus:-top-2.5
                peer-focus:px-1.5
                peer-focus:bg-surface
                peer-focus:text-[11px]

                /* Has value */
                peer-not-placeholder-shown:-top-2.5
                peer-not-placeholder-shown:px-1.5
                peer-not-placeholder-shown:bg-surface
                peer-not-placeholder-shown:text-[11px]

                ${
                  isError
                    ? "peer-focus:text-danger"
                    : "peer-focus:text-primary"
                }
              `}
            >
              {label}
            </label>
          )}

          {/* Left icon */}
          {Icon && !isPassword && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              <Icon size={18} />
            </div>
          )}

          {/* Password visibility */}
          {isPassword && (
            <button
              type="button"
              onClick={() =>
                setLocalShowPassword(!localShowPassword)
              }
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                cursor-pointer
                text-muted
                hover:text-foreground
                focus:outline-none
              "
            >
              {localShowPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          )}
        </div>

        {/* Validation error */}
        <div className="relative mt-1 h-5">
          {isError && (
            <p className="absolute right-0 top-0 text-xs font-medium text-danger animate-fadeIn">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

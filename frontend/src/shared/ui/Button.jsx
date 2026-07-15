// Reusable button with variants, sizes, and full-width option
export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  className = "",
  as: Component = "button",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium cursor-pointer transition-all duration-200 rounded-xl disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-hover disabled:opacity-60",

    secondary:
      "bg-surface text-foreground border border-border hover:bg-background",

    outline:
      "border border-border bg-transparent text-foreground hover:bg-surface",

    ghost:
      "text-foreground hover:bg-surface",
    
    danger:
      "text-danger hover:bg-danger/10 disabled:opacity-60"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <Component
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
}
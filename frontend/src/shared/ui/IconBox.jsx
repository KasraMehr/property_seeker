// Reusable icon container with optional label outside the box
export default function IconBox({ 
  icon: Icon, 
  label, 
  iconSize = 28, 
  boxSize = "w-14 h-14",
  bgColor = "bg-blue-600", 
  textColor = "text-white",
  shadowColor = "shadow-blue-200",
  rounded = "rounded-2xl",
  labelPosition = "bottom", // "bottom" | "top" | "left" | "right"
  className = "",
}) {
  const box = (
    <div className={`${boxSize} ${bgColor} ${rounded} flex items-center justify-center ${shadowColor} shadow-lg`}>
      <Icon className={textColor} size={iconSize} />
    </div>
  );

  if (!label) return <div className={`flex justify-center ${className}`}>{box}</div>;

  return (
    <div className={`flex ${labelPosition === "bottom" ? "flex-col items-center" : 
      labelPosition === "top" ? "flex-col-reverse items-center" :
      labelPosition === "left" ? "flex-row items-center gap-3" : 
      "flex-row-reverse items-center gap-3"} ${className}`}
    >
      {labelPosition === "top" && <span className="text-sm text-gray-600">{label}</span>}
      {box}
      {labelPosition === "bottom" && <span className="text-l font-bold pt-3 text-gray-600 mt-2">{label}</span>}
      {(labelPosition === "left" || labelPosition === "right") && <span className="text-lg text-gray-600">{label}</span>}
    </div>
  );
}
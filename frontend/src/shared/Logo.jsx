import IconBox from "./ui/IconBox";
import { House } from "lucide-react";

export default function Logo({
  labelPosition,
  labelColor = "text-foreground",
  textColor = "text-white",
  className = "",
}) {
  return (
    <div>
      <IconBox
        icon={House}
        iconSize={15}
        boxSize="w-7 h-7"
        label={"ملک جو"}
        textColor={textColor}
        labelColor={labelColor}
        labelPosition={labelPosition}
        className={className}
      />
    </div>
  );
}
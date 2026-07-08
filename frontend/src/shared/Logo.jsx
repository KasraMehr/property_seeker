import React from "react";
import IconBox from "./ui/IconBox";
import { House } from "lucide-react";

export default function Logo({labelPosition , className = ""}) {
  return (
    <div>
      <IconBox
        icon={House}
        iconSize={15}
        boxSize="w-7 h-7"
        label={"ملک جو"}
        labelPosition={labelPosition}
        className={className}
      />
    </div>
  );
}

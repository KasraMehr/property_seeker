// Right column: logo icon, title, and step indicator

// Components
import Stepper from "../stepper/Stepper";
import IconBox from "../../../../shared/ui/IconBox";
import { LOGIN_STEPS, LOGIN_DIALOGS } from "../../constants/loginCard";

// Icons
import { House, Shield } from "lucide-react";

export default function RightSection( {currentStep = 0 }) {
  return (
    <div>
      
      {/* Security logo */}
      <IconBox 
      icon={Shield} 
      iconSize={30}
      boxSize="w-15 h-15"
      label={LOGIN_DIALOGS.secure_entry} 
      labelPosition="bottom"
      className="pb-7"
      />


      {/* Stepper */}
      <Stepper steps={LOGIN_STEPS} currentStep={currentStep} />
    </div>
  );
}
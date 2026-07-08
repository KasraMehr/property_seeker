// Two-column card wrapper: right side (stepper) + left side (form)
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import Logo from "../../../../shared/Logo";

// Hooks
import useLoginSteps from "../../hooks/useLoginSteps";
import useAuth from "../../../../hooks/useAuth";

//Icons
import { House } from "lucide-react";

export default function LoginCard() {
  const { currentStep, next, back, goTo } = useLoginSteps(0);
  const [phone, setPhone] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleDone = () => {
    // console.log("redirecting to dashboard...");
    navigate("/app");
  };

  // Override next to capture isNewUser from OTP step
  const handleNext = () => {
    // isNewUser will be set by OtpStep via onDone callback
    next();
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
      {/* IconBox */}
      <div className="absolute top-4 left-4 z-10">
        <Logo labelPosition="right" />
      </div>

      {/* Right Section - Stepper */}
      <div className="w-full md:w-1/2 p-8 md:p-10 bg-gray-50/50 order-1 md:order-1">
        <RightSection currentStep={currentStep} />
      </div>

      {/* Separator */}
      <div className="hidden md:block w-px bg-gray-200 order-2" />

      {/* Left Section - Form */}
      <div className="w-full md:w-1/2 p-8 md:p-10 order-3 md:order-3">
        <LeftSection
          currentStep={currentStep}
          onNext={handleNext}
          onBack={back}
          onDone={handleDone}
          phone={phone}
          setPhone={setPhone}
          isNewUser={isNewUser}
          setIsNewUser={setIsNewUser}
        />
      </div>
    </div>
  );
}

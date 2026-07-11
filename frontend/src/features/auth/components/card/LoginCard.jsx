// Login card container - simple glass centered card

import LoginForm from "../form/LoginForm";
import Logo from "../../../../shared/Logo";

export default function LoginCard() {
  return (
    <div className="w-full max-w-95 h-120 relative bg-white/8 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl flex flex-col justify-between pt-16">
      {/* Header */}
      <div className="absolute -top-px left-1/2 -translate-x-1/2 w-32 h-11 bg-white/80 rounded-b-2xl flex items-center justify-center border-x border-b border-white/30 shadow-inner">
        <Logo
          labelPosition={"left"}
          textColor={"text-white"}
        />
      </div>

      {/* Inner form */}
      <LoginForm />
    </div>
  );
}

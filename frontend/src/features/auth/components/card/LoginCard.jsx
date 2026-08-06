// Login card container - simple glass centered card

import LoginForm from "../form/LoginForm";
import Logo from "../../../../shared/Logo";

export default function LoginCard() {
  return (
    <div className="relative flex h-130 w-full max-w-95 flex-col justify-between rounded-2xl border border-border bg-card p-8 pt-16 shadow-2xl backdrop-blur-xl">
      
      {/* Header */}
      <div className="absolute -top-px left-1/2 flex h-11 w-32 -translate-x-1/2 items-center justify-center rounded-b-2xl border-x border-b border-border bg-glass shadow-inner">
        <Logo labelPosition="left" />
      </div>

      {/* Inner form */}
      <LoginForm />
    </div>
  );
}

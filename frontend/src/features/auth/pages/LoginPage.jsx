// Login page container with background images and centered card

import LoginCard from "../components/card/LoginCard";
import IconBox from "../../../shared/ui/IconBox";

import { House } from "lucide-react";

export default function LoginPage() {
  return (
    // Set background photo
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center
        bg-[url('/images/bg-loginpage-mob.png')] 
        md:bg-[url('/images/login-bg.png')]"
    >
      <LoginCard />
    </div>
  );
}

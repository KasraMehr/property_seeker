// Login page container with background images and centered card

import LoginCard from "../components/card/LoginCard";

export default function LoginPage() {
  return (
    // Set background photo
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center
        bg-[url('/images/bg-loginpage-mob.webp')] 
        md:bg-[url('/images/login-bg.webp')]"
    >
      <LoginCard />
    </div>
  );
}

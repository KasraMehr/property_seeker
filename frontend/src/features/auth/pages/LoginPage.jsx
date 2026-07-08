// Login page container with gradient background and centered card

import LoginCard from "../components/card/LoginCard";
import IconBox from "../../../shared/ui/IconBox";

import { House } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 to-blue-400 flex items-center justify-center p-4">
      <LoginCard />
    </div>
  );
}

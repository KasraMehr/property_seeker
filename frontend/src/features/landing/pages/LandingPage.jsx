import LandingNavbar from "../components/LandingNavbar";
import HeroSection from "../components/sections/HeroSection";
import ProblemSolution from "../components/sections/ProblemSolution"
import DashboardPreview from "../components/sections/DashboardPreview"
import Features from "../components/sections/Features"
import Footer from "../components/sections/Footer"
import PageHeader from "../../../shared/ui/PageHeader";


export default function LandingPage() {
  return (
    <div className="bg-background text-foreground min-h-screen font-vazir">
      <LandingNavbar/>

      <HeroSection/>

      <ProblemSolution/>

      <DashboardPreview/>

      <Features/>

      <Footer/>

    </div>
  );
}
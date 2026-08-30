import LandingNavbar from "../components/LandingNavbar";
import HeroSection from "../components/sections/HeroSection";
import ProblemSolution from "../components/sections/ProblemSolution"
import DashboardPreview from "../components/sections/DashboardPreview"
import Features from "../components/sections/Features"
import Footer from "../components/sections/Footer"
import HowItWorks from "../components/sections/HowItWorks";
import Services from "../components/sections/Services";
import Benefits from "../components/sections/Benefits";
import ImageDivider from "../components/ImageDivider";


export default function LandingPage() {
  return (
    <div className="bg-background text-foreground min-h-screen font-vazir">
      <LandingNavbar/>

      <HeroSection/>

      <ProblemSolution/>

      {/* <HowItWorks/> */}

      {/* <Services/> */}

      <Benefits/>

      <ImageDivider src = {"/images/s-section-bg.webp"}/>

      {/* <DashboardPreview/> */}

      {/* <Features/> */}

      <Footer/>

    </div>
  );
}
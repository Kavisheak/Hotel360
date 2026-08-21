import LandingHero from "@/components/landing/home/LandingHero";
import AboutSection from "@/components/landing/home/AboutSection";
import FacilitiesSection from "@/components/landing/home/FacilitiesSection";
import EventsWeHostSection from "@/components/landing/home/EventsWeHostSection";
import PlanEventSection from "@/components/landing/home/PlanEventSection";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import Footer from "@/components/landing/shared/Footer";

export default function Home() {
 return (
 <div className="flex flex-col min-h-screen bg-white transition-colors duration-300">
 <MainNavbar />
 <LandingHero />
 <AboutSection />
 <FacilitiesSection />
 <EventsWeHostSection />
 <PlanEventSection />
 <Footer />
 </div>
 );
}


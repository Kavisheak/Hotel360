import LandingHero from "@/components/Landing/home/LandingHero";
import PackagesSection from "@/components/Landing/home/PackagesSection";
import AmenitiesSection from "@/components/Landing/home/AmenitiesSection";
import EstimateSection from "@/components/Landing/home/EstimateSection";
import TheHallSection from "@/components/Landing/home/TheHallSection";
import FAQSection from "@/components/Landing/home/FAQSection";
import CTASection from "@/components/Landing/home/CTASection";
import MainNavbar from "@/components/Landing/shared/MainNavbar";
import Footer from "@/components/Landing/shared/Footer";

export default function Home() {
 return (
 <div className="flex flex-col min-h-screen bg-white transition-colors duration-300">
 <MainNavbar />
 <LandingHero />
 <PackagesSection />
 <AmenitiesSection />
 <EstimateSection />
 <TheHallSection />
 <FAQSection />
 <CTASection />
 <Footer />
 </div>
 );
}


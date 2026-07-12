import LandingHero from "@/components/landing/home/LandingHero";
import PackagesSection from "@/components/landing/home/PackagesSection";
import AmenitiesSection from "@/components/landing/home/AmenitiesSection";
import EstimateSection from "@/components/landing/home/EstimateSection";
import TheHallSection from "@/components/landing/home/TheHallSection";
import FAQSection from "@/components/landing/home/FAQSection";
import CTASection from "@/components/landing/home/CTASection";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import Footer from "@/components/landing/shared/Footer";

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


import LandingHero from "@/components/landing/LandingHero";
import TheHallSection from "@/components/landing/TheHallSection";
import AmenitiesSection from "@/components/landing/AmenitiesSection";
import VirtualTourSection from "@/components/landing/VirtualTourSection";
import PackagesSection from "@/components/landing/PackagesSection";
import ReviewsSection from "@/components/landing/ReviewsSection";
import FooterSection from "@/components/landing/FooterSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHero />
      <TheHallSection />
      <AmenitiesSection />
      <VirtualTourSection />
      <PackagesSection />
      <ReviewsSection />
      <FooterSection />
    </div>
  );
}


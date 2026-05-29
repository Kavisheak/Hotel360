import LandingHero from "@/components/landing/home/LandingHero";
import TheHallSection from "@/components/landing/home/TheHallSection";
import AmenitiesSection from "@/components/landing/home/AmenitiesSection";
import VirtualTourSection from "@/components/landing/home/VirtualTourSection";
import PackagesSection from "@/components/landing/home/PackagesSection";
import ReviewsSection from "@/components/landing/home/ReviewsSection";
import FooterSection from "@/components/landing/home/FooterSection";

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


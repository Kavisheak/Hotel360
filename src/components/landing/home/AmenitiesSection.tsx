import React from 'react';
import { Building2, Sparkles, ChefHat, Lightbulb, DoorOpen, Key } from 'lucide-react';

const AmenitiesSection = () => {
  const amenities = [
  {
  id: '01',
 icon: <Building2 className="w-8 h-8 stroke-[1.5]" />,
 title: 'Vaulted Ballroom',
 description: '12m ceilings and pillarless design to accommodate grand celebrations.',
 },
 {
 id: '02',
 icon: <Sparkles className="w-8 h-8 stroke-[1.5]" />,
 title: 'Bridal Suites',
 description: 'Two private suites with dedicated styling stations and concierge.',
 },
 {
 id: '03',
 icon: <ChefHat className="w-8 h-8 stroke-[1.5]" />,
 title: 'Culinary Atelier',
 description: 'On-site kitchens led by Executive Chef Anjana Perera.',
 },
 {
 id: '04',
 icon: <Lightbulb className="w-8 h-8 stroke-[1.5]" />,
 title: 'Smart Lighting',
 description: 'Custom programmable LED systems and Bohemian crystal chandeliers.',
 },
 {
 id: '05',
 icon: <DoorOpen className="w-8 h-8 stroke-[1.5]" />,
 title: 'Arrival Courtyard',
 description: 'A grand entrance designed specifically for VIP arrivals and red carpets.',
 },
 {
 id: '06',
 icon: <Key className="w-8 h-8 stroke-[1.5]" />,
 title: 'Valet Service',
 description: 'Seamless parking coordination for up to 250 vehicles.',
 },
 ];

 return (
 <section className="w-full bg-white dark:bg-[#0A0A0A] py-24 md:py-32 px-6 md:px-12 lg:px-20 flex justify-center section-reveal transition-colors duration-300">
 <div className="max-w-6xl w-full flex flex-col">
 
 {/* Header Row */}
 <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20 relative z-10">
 <div className="flex flex-col">
 <div className="flex items-center gap-4 mb-6">
 <div className="w-12 h-[1px] bg-[#C69C6D]/60 "></div>
 <p className="text-[#A6955C] text-[10px] tracking-[0.3em] uppercase font-bold text-reveal stagger-1">
 The Anatomy of Elegance
 </p>
 </div>
 <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-[#2C1E14] dark:text-white max-w-xl text-reveal stagger-2">
 Composed with <span className="italic text-[#C69C6D] font-light">unwavering precision</span>
 </h2>
 </div>
 
 <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed max-w-md font-light text-reveal stagger-3 lg:pb-2">
 EASCC isn't just an empty ballroom. We provide an integrated ecosystem of luxury amenities, ensuring every facet of your event is executed flawlessly.
 </p>
 </div>

 {/* 3x2 Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 relative z-10">
 {amenities.map((amenity, index) => (
 <div 
 key={amenity.id} 
 className={`flex flex-col border-t border-[#E8DFC9] dark:border-[#C69C6D]/30 pt-6 hover-glow transition-all cursor-default card-entrance stagger-${index + 1}`}
 >
 <div className="text-[#C69C6D] mb-6">
 {amenity.icon}
 </div>
 <h3 className="text-xl md:text-2xl font-serif text-[#2C1E14] dark:text-white mb-3">
 {amenity.title}
 </h3>
 <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-light">
 {amenity.description}
 </p>
 </div>
 ))}
 </div>

 </div>
 </section>
 );
};

export default AmenitiesSection;

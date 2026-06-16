import React from 'react';
import Image from 'next/image';
import { Users, ArrowRight } from 'lucide-react';

const PackagesSection = () => {
  const packages = [
    {
      id: 'silver',
      name: 'Silver Package',
      price: 'LKR 1.8M',
      guests: 'Up to 250 guests',
      description: 'An intimate ceremony of refined essentials.',
      image: '/silver_package.png',
      isMostLoved: false,
    },
    {
      id: 'gold',
      name: 'Gold Package',
      price: 'LKR 3.4M',
      guests: 'Up to 380 guests',
      description: 'Our most chosen — celebrated for its balance.',
      image: '/gold_package.png',
      isMostLoved: true,
    },
    {
      id: 'diamond',
      name: 'Diamond Package',
      price: 'LKR 5.9M',
      guests: 'Up to 480 guests',
      description: 'A no-restraint affair — the venue, entirely yours.',
      image: '/diamond_package.png',
      isMostLoved: false,
    },
  ];

  return (
    <section className="w-full bg-[#0A0A0A] py-24 md:py-32 px-6 md:px-12 lg:px-20 flex flex-col items-center section-reveal relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent"></div>
      
      {/* Header Section */}
      <div className="text-center mb-20 space-y-4 relative z-10">
        <p className="text-[#C9A84C] text-[10px] tracking-[0.3em] uppercase font-bold text-reveal stagger-1">
          Bespoke Offerings
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight text-reveal stagger-2">
          Three suites of <span className="italic text-[#C9A84C] font-light">celebration.</span>
        </h2>
        <p className="text-gray-400 text-sm md:text-base font-light max-w-xl mx-auto pt-2 text-reveal stagger-3">
          Each tier is thoughtfully composed to balance grand vision with precise execution. Compare our signature collections below.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full items-center relative z-10">
        {packages.map((pkg, index) => (
          <div 
            key={pkg.id}
            className={`flex flex-col bg-[#111111] overflow-hidden transition-all duration-500 relative card-entrance stagger-${index + 1} ${
              pkg.isMostLoved 
                ? 'border border-[#C9A84C] shadow-[0_0_30px_rgba(201,168,76,0.15)] md:-translate-y-4 md:scale-105 z-20 py-10 px-8' 
                : 'border border-[#C9A84C]/30 hover:border-[#C9A84C]/60 z-10 py-8 px-6'
            }`}
          >
            {/* Top Badge for Most Loved */}
            {pkg.isMostLoved && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#C9A84C] text-[#0A0A0A] text-[9px] uppercase tracking-[0.2em] px-4 py-1.5 font-bold rounded-b-sm">
                Most Loved
              </div>
            )}

            {/* Card Content */}
            <div className="flex flex-col flex-grow text-center">
              <h3 className="text-[#C9A84C] font-serif text-2xl mb-1 mt-2">
                {pkg.name}
              </h3>
              
              <div className="my-6">
                <h4 className="text-4xl md:text-5xl font-serif text-white mb-2 tracking-tight">
                  {pkg.price}
                </h4>
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <Users size={12} className="text-[#C9A84C]" />
                  <span className="text-[10px] uppercase tracking-widest">{pkg.guests}</span>
                </div>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed font-light mb-8 pb-8 border-b border-white/10">
                {pkg.description}
              </p>

              <div className="flex flex-col gap-4 text-left mb-8 flex-grow">
                {['Dedicated Wedding Planner', 'Exclusive Ballroom Access', 'Complimentary Tasting Menu', 'Valet Parking for Guests'].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-1.5 h-1.5 rotate-45 bg-[#C9A84C]/60 flex-shrink-0"></div>
                    <span className="text-gray-300 text-xs md:text-sm font-light">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <a 
                href="/customer/packages"
                className={`w-full py-3.5 flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase font-bold transition-all duration-300 ${
                  pkg.isMostLoved 
                    ? 'bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : 'border border-[#C9A84C]/50 text-[#C9A84C] hover:bg-[#C9A84C]/10'
                }`}
              >
                Select Package
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default PackagesSection;

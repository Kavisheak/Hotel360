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
    <section className="w-full bg-[#fcfaf7] py-24 md:py-32 px-6 md:px-12 lg:px-24 flex flex-col items-center">
      
      {/* Header Section */}
      <div className="text-center mb-16 space-y-4">
        <p className="text-[#c69c6d] text-xs tracking-[0.2em] uppercase font-semibold">
          Signature Packages
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 leading-tight">
          Three frameworks.<br />
          <span className="italic text-[#c69c6d]">Infinite expression.</span>
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">
        {packages.map((pkg) => (
          <div 
            key={pkg.id}
            className={`flex flex-col bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 relative ${
              pkg.isMostLoved ? 'border border-[#c69c6d]' : 'border border-gray-100'
            }`}
          >
            {/* Image Container */}
            <div className="relative w-full aspect-[4/5] bg-gray-100">
              <Image
                src={pkg.image}
                alt={pkg.name}
                fill
                className="object-cover"
              />
              {/* Most Loved Tag */}
              {pkg.isMostLoved && (
                <div className="absolute top-4 right-4 bg-[#c69c6d] text-white text-[10px] uppercase tracking-widest px-3 py-1 font-semibold z-10">
                  Most Loved
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="p-8 flex flex-col flex-grow">
              
              <div className="mb-6">
                <p className="text-[#c69c6d] text-[10px] tracking-[0.2em] uppercase font-semibold mb-2">
                  {pkg.name}
                </p>
                <h3 className="text-3xl font-serif text-gray-900 mb-4">
                  {pkg.price}
                </h3>
                
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <Users size={14} />
                  <span className="text-xs font-medium">{pkg.guests}</span>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              {/* Spacer to push button to bottom if descriptions vary in height */}
              <div className="mt-auto pt-4">
                <button className="flex items-center gap-2 text-[#c69c6d] text-[10px] tracking-[0.2em] uppercase font-semibold hover:text-[#b0885a] transition-colors group">
                  Explore
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default PackagesSection;

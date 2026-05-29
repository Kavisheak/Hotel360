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
    <section className="w-full bg-[#fcfaf7] py-16 md:py-20 px-6 md:px-12 lg:px-20 flex flex-col items-center">
      
      {/* Header Section */}
      <div className="text-center mb-10 space-y-3">
        <p className="text-[#c69c6d] text-[10px] tracking-[0.2em] uppercase font-semibold">
          Signature Packages
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 leading-tight">
          Three frameworks.<br />
          <span className="italic text-[#c69c6d]">Infinite expression.</span>
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {packages.map((pkg) => (
          <div 
            key={pkg.id}
            className={`flex flex-col bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 relative ${
              pkg.isMostLoved ? 'border border-[#c69c6d]' : 'border border-gray-100'
            }`}
          >
            {/* Image Container */}
            <div className="relative w-full aspect-[4/3] bg-gray-100">
              <Image
                src={pkg.image}
                alt={pkg.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
              {pkg.isMostLoved && (
                <div className="absolute top-3 right-3 bg-[#c69c6d] text-white text-[9px] uppercase tracking-widest px-2.5 py-0.5 font-semibold z-10">
                  Most Loved
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="p-6 flex flex-col flex-grow">
              <div className="mb-4">
                <p className="text-[#c69c6d] text-[9px] tracking-[0.2em] uppercase font-semibold mb-1.5">
                  {pkg.name}
                </p>
                <h3 className="text-2xl font-serif text-gray-900 mb-2">
                  {pkg.price}
                </h3>
                
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Users size={12} />
                  <span className="text-[11px] font-medium">{pkg.guests}</span>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              <div className="mt-auto pt-2">
                <a href="/packages" className="flex items-center gap-2 text-[#c69c6d] text-[9px] tracking-[0.2em] uppercase font-semibold hover:text-[#b0885a] transition-colors group">
                  Explore
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default PackagesSection;

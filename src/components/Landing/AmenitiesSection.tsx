import React from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

const AmenitiesSection = () => {
  const amenities = [
    {
      title: 'Vaulted Ballroom',
      description: '12 m hand-painted ceiling, Bohemian crystal chandeliers',
    },
    {
      title: 'Bridal Suites',
      description: 'Two private suites with hair, makeup and concierge',
    },
    {
      title: 'Rooftop Terrace',
      description: 'Skyline cocktail garden overlooking the Indian Ocean',
    },
    {
      title: 'Culinary Atelier',
      description: 'On-site kitchen led by Chef Anjana Perera',
    },
  ];

  return (
    <section className="w-full bg-[#fcfaf7] py-16 md:py-24 px-8 md:px-16 lg:px-24 flex justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left Column - Image */}
        <div className="relative w-full aspect-[4/5] lg:aspect-square overflow-hidden shadow-md">
          <Image
            src="/crystal_chandelier.png"
            alt="Bohemian crystal chandelier"
            fill
            className="object-cover object-center"
          />
        </div>

        {/* Right Column - Content */}
        <div className="flex flex-col">
          <p className="text-[#c69c6d] text-xs tracking-[0.2em] uppercase font-semibold mb-6">
            Amenities
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-gray-900 mb-12">
            Every detail, considered.
          </h2>

          <div className="flex flex-col w-full">
            {amenities.map((amenity, index) => (
              <div 
                key={index} 
                className="flex items-start gap-6 py-6 border-b border-gray-200 last:border-b"
              >
                <div className="mt-1 flex-shrink-0 text-[#c69c6d]">
                  <Sparkles size={20} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl md:text-2xl font-serif text-gray-900">
                    {amenity.title}
                  </h3>
                  <p className="text-gray-500 text-sm md:text-base">
                    {amenity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AmenitiesSection;

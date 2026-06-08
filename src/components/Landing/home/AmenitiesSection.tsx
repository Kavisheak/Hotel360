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
    <section className="w-full bg-[#F0E6D0] py-12 md:py-16 px-6 md:px-12 lg:px-20 flex justify-center section-reveal">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        {/* Left Column - Image */}
        <div className="relative w-full aspect-[4/5] max-h-[500px] overflow-hidden shadow-md hover-scale">
          <Image
            src="/crystal_chandelier.png"
            alt="Bohemian crystal chandelier"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>

        {/* Right Column - Content */}
        <div className="flex flex-col">
          <p className="text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase font-semibold mb-4">
            Amenities
          </p>
          <h2 className="text-3xl md:text-4xl font-serif leading-tight text-gray-900 mb-8">
            Every detail, considered.
          </h2>

          <div className="flex flex-col w-full">
            {amenities.map((amenity, index) => (
              <div 
                key={index} 
                className="flex items-start gap-4 py-4 border-b border-[#D4C9A8] last:border-b hover-glow rounded-sm px-2 -mx-2 transition-all cursor-default"
              >
                <div className="mt-1 flex-shrink-0 text-[#C9A84C]">
                  <Sparkles size={16} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-lg font-serif text-gray-900">
                    {amenity.title}
                  </h3>
                  <p className="text-gray-500 text-sm">
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

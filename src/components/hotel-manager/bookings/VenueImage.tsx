import React from 'react';
import Image from 'next/image';

const VenueImage = ({ booking }: { booking: any }) => (
  <div className="relative w-full h-56 lg:h-80 rounded-xl overflow-hidden mb-6 shadow-sm">
    <Image
      src="/crystal_pavilion_venue.png"
      alt="The Crystal Pavilion Venue"
      fill
      priority
      sizes="(max-width: 1024px) 100vw, 70vw"
      className="object-cover"
    />
    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    {/* Venue name overlay */}
    <div className="absolute bottom-4 left-5">
      <p className="text-white font-serif font-semibold text-lg leading-tight drop-shadow">
        The Crystal Pavilion
      </p>
      <p className="text-[#F9DD76] text-[10px] font-bold uppercase tracking-widest">
        Premium Waterfront Venue
      </p>
    </div>
  </div>
);

export default VenueImage;

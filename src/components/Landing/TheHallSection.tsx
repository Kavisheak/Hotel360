import React from 'react';

const TheHallSection = () => {
  return (
    <section className="w-full bg-[#fcfaf7] py-24 md:py-32 px-8 md:px-16 lg:px-24 flex justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        
        {/* Left Column */}
        <div className="flex flex-col justify-center">
          <p className="text-[#c69c6d] text-xs tracking-[0.2em] uppercase font-semibold mb-8">
            The Hall
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.1] text-gray-900">
            One ballroom.<br />
            <span className="italic text-[#c69c6d]">One wedding.</span><br />
            One evening,<br />
            perfected.
          </h2>
        </div>

        {/* Right Column */}
        <div className="flex flex-col justify-center space-y-16">
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-xl">
            We host one wedding per day. The entire venue — its arrival courtyard, the petal-strewn aisle, the ballroom and the rooftop terrace — belongs to you alone. Our maître d', florist and culinary director report to a single conductor: your evening.
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-8">
            <div className="flex flex-col space-y-3">
              <span className="text-[#c69c6d] text-5xl md:text-6xl font-serif">62</span>
              <span className="text-gray-500 text-[10px] md:text-xs tracking-[0.2em] uppercase font-semibold">Years of Craft</span>
            </div>
            <div className="flex flex-col space-y-3">
              <span className="text-[#c69c6d] text-5xl md:text-6xl font-serif">1</span>
              <span className="text-gray-500 text-[10px] md:text-xs tracking-[0.2em] uppercase font-semibold">Wedding Per Day</span>
            </div>
            <div className="flex flex-col space-y-3">
              <span className="text-[#c69c6d] text-5xl md:text-6xl font-serif">100%</span>
              <span className="text-gray-500 text-[10px] md:text-xs tracking-[0.2em] uppercase font-semibold">Bespoke Service</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TheHallSection;

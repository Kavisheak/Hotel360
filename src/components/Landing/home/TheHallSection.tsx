import React from 'react';

const TheHallSection = () => {
  return (
    <section className="w-full bg-[#F0E6D0] py-16 md:py-20 px-6 md:px-12 lg:px-20 flex justify-center section-reveal">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Left Column */}
        <div className="flex flex-col justify-center">
          <p className="text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase font-semibold mb-6">
            The Hall
          </p>
          <h2 className="text-4xl md:text-5xl font-serif leading-[1.1] text-gray-900">
            One ballroom.<br />
            <span className="italic text-[#C9A84C]">One wedding.</span><br />
            One evening,<br />
            perfected.
          </h2>
        </div>

        {/* Right Column */}
        <div className="flex flex-col justify-center space-y-10">
          <p className="text-gray-600 text-base leading-relaxed max-w-lg">
            We host one wedding per day. The entire venue — its arrival courtyard, the petal-strewn aisle, the ballroom and the rooftop terrace — belongs to you alone. Our maître d&apos;, florist and culinary director report to a single conductor: your evening.
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col space-y-2 hover-scale">
              <span className="text-[#C9A84C] text-4xl md:text-5xl font-serif">62</span>
              <span className="text-gray-500 text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-semibold">Years of Craft</span>
            </div>
            <div className="flex flex-col space-y-2 hover-scale">
              <span className="text-[#C9A84C] text-4xl md:text-5xl font-serif">1</span>
              <span className="text-gray-500 text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-semibold">Wedding Per Day</span>
            </div>
            <div className="flex flex-col space-y-2 hover-scale">
              <span className="text-[#C9A84C] text-4xl md:text-5xl font-serif">100%</span>
              <span className="text-gray-500 text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-semibold">Bespoke Service</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TheHallSection;

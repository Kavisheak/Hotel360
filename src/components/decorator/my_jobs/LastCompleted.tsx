import React from 'react';

const LastCompleted = () => {
  return (
    <div className="bg-[#EBE5D9] p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/5 z-0"></div>
      <div className="relative z-10">
        <div className="aspect-[16/9] w-full bg-gray-900 mb-4 overflow-hidden shadow-sm">
          {/* Placeholder for the completed image */}
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop')] bg-cover bg-center grayscale contrast-125"></div>
        </div>
        <div>
          <h4 className="text-[10px] font-bold tracking-[0.15em] text-[#7C6A2E] uppercase mb-1">LAST COMPLETED: KHAN NIKKAH</h4>
          <p className="text-xs font-serif italic text-gray-600">"Exquisite attention to detail on the floral work." - Client Review</p>
        </div>
      </div>
    </div>
  );
};

export default LastCompleted;

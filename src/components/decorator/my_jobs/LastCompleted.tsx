import React from 'react';

const LastCompleted = ({ booking }: { booking: any }) => {
  const photoUrl = booking.vendors?.decorator?.completionPhotos?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop';
  
  return (
    <div className="bg-[#EBE5D9] p-4 relative overflow-hidden group">
      <div className="absolute inset-0 bg-black/5 z-0"></div>
      <div className="relative z-10">
        <div className="aspect-[16/9] w-full bg-gray-900 mb-4 overflow-hidden shadow-sm">
          <div
            className="w-full h-full bg-cover bg-center transition-all duration-500 ease-in-out grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-105"
            style={{
              backgroundImage:
                `url('${photoUrl}')`,
            }}
          />
        </div>
        <div>
          <h4 className="text-[10px] font-bold tracking-[0.15em] text-[#7C6A2E] uppercase mb-1">
            LAST COMPLETED: {booking.clientName} {booking.eventType}
          </h4>
          <p className="text-xs font-serif italic text-gray-600">
            "Exquisite attention to detail on the floral work." - Client Review
          </p>
        </div>
      </div>
    </div>
  );
};

export default LastCompleted;

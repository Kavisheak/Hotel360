import React from 'react';
import { Star } from 'lucide-react';

const TopProviders = ({ providers = [] }: { providers: any[] }) => {
  return (
    <div className="bg-white border border-[#E0D8C3] p-6 sm:p-8 flex-1">
      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-6">
        Top-Rated Service Providers
      </p>
      <div className="space-y-5">
        {providers.length > 0 ? (
          providers.map((p) => (
          <div key={p.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={p.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80'}
                alt={p.name}
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80'; }}
                className="w-10 h-10 rounded-full object-cover border border-[#E0D8C3]"
              />
              <div>
                <p className="text-sm font-bold text-gray-800">{p.name}</p>
                <p className="text-[10px] text-gray-400 font-semibold">{p.category}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Star size={12} className="text-[#B08D2C]" />
                <span className="text-sm font-bold text-gray-800">{p.rating > 0 ? p.rating.toFixed(1) : 'New'}</span>
              </div>
              <p className="text-[10px] text-gray-400 font-semibold">{p.bookingsCount} Bookings</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-xs text-gray-500 italic">No providers available.</p>
      )}
      </div>
    </div>
  );
};

export default TopProviders;

import React from 'react';
import { Star } from 'lucide-react';

const providers = [
  {
    name: 'Julian Rossi',
    role: 'Bespoke Catering',
    rating: 4.9,
    bookings: 142,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80',
  },
  {
    name: 'Elara Vance',
    role: 'Floral Artistry',
    rating: 4.8,
    bookings: 98,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80',
  },
  {
    name: 'Sarah Sterling',
    role: 'Elite Concierge',
    rating: 5.0,
    bookings: 56,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80',
  },
];

const TopProviders = () => {
  return (
    <div className="bg-white border border-[#E0D8C3] p-6 sm:p-8 flex-1">
      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-6">
        Top-Rated Service Providers
      </p>
      <div className="space-y-5">
        {providers.map((p) => (
          <div key={p.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={p.avatar}
                alt={p.name}
                className="w-10 h-10 rounded-full object-cover border border-[#E0D8C3]"
              />
              <div>
                <p className="text-sm font-bold text-gray-800">{p.name}</p>
                <p className="text-[10px] text-gray-400 font-semibold">{p.role}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Star size={12} className="text-[#B08D2C]" />
                <span className="text-sm font-bold text-gray-800">{p.rating.toFixed(1)}</span>
              </div>
              <p className="text-[10px] text-gray-400 font-semibold">{p.bookings} Bookings</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProviders;

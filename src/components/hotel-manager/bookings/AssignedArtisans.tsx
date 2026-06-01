import React from 'react';

const artisans = [
  {
    role: 'Decorator',
    name: 'Julian Thorne',
    action: 'View Portfolio',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100',
  },
  {
    role: 'DJ / Sound',
    name: 'The Groove Collective',
    action: 'Equipment List',
    img: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=100&h=100',
  },
  {
    role: 'Videography',
    name: 'Cinematic Elegance',
    action: 'Sample Reel',
    img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=100&h=100',
  },
];

const AssignedArtisans = () => (
  <div className="bg-white border border-[#E0D8C3] rounded-xl p-5 shadow-sm mt-6">
    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] mb-5">
      Assigned Artisans
    </h4>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {artisans.map((a) => (
        <div key={a.role} className="flex flex-col items-center text-center">
          <img
            src={a.img}
            alt={a.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#E0D8C3] mb-3"
          />
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{a.role}</p>
          <p className="text-sm font-serif italic text-gray-700 mb-2">{a.name}</p>
          <button className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] underline hover:text-[#7C6A2E] transition-colors">
            {a.action}
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default AssignedArtisans;

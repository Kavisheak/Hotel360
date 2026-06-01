import React from 'react';

const providers = [
  { name: 'Elite Catering Services', rating: '9.4 RATING', score: 94, img: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=64&h=64' },
  { name: 'Royal Floral Designs', rating: '9.1 RATING', score: 91, img: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=64&h=64' },
  { name: 'Luxe AV & Lighting', rating: '8.7 RATING', score: 87, img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=64&h=64' },
];

const ProviderPerformance = () => (
  <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-sm h-full flex flex-col p-5">
    <div className="flex items-start justify-between mb-6">
      <h3 className="text-lg font-serif font-semibold text-gray-800 leading-tight pr-4">
        Service Provider<br />Performance
      </h3>
      <button className="text-[9px] font-bold uppercase tracking-widest text-[#B08D2C] hover:text-[#7C6A2E] text-right">
        View<br />All
      </button>
    </div>
    
    <div className="space-y-6 flex-1 flex flex-col justify-center">
      {providers.map((p, i) => (
        <div key={i} className="flex items-center gap-4">
          <img src={p.img} alt={p.name} className="w-10 h-10 rounded-full object-cover border border-[#E0D8C3]" />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-end mb-1">
              <h4 className="text-xs font-semibold text-gray-800 truncate pr-2">{p.name}</h4>
              <span className="text-[8px] font-bold uppercase tracking-widest text-green-600 shrink-0">{p.rating}</span>
            </div>
            <div className="w-full bg-[#E0D8C3] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#7C6A2E] h-full rounded-full" style={{ width: `${p.score}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ProviderPerformance;

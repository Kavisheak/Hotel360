"use client";

import React, { useState } from 'react';
import { Music, Mic2, Volume2, Plus } from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

const DetailBottom = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', text: 'Confirm equipment load-in time with venue', checked: true },
    { id: '2', text: 'Test sound system & subwoofers on-site', checked: false },
    { id: '3', text: 'Prepare timeline & setlist for event planner', checked: false },
    { id: '4', text: 'Set up lighting rig & DMX controller', checked: false },
    { id: '5', text: 'Coordinate with MC / event host for cues', checked: false },
  ]);

  const toggleCheck = (id: string) =>
    setChecklist(checklist.map(item => item.id === id ? { ...item, checked: !item.checked } : item));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
      {/* DJ Package Details */}
      <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm lg:col-span-3 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
            <h3 className="text-xl font-serif font-bold text-gray-900">Diamond DJ Package</h3>
            <span className="text-[8px] font-bold tracking-widest border border-[#B08D2C] text-[#7C6A2E] px-2 py-0.5 uppercase">PREMIUM TIER</span>
          </div>

          <div className="space-y-5 mb-8">
            <div className="flex items-start space-x-3">
              <Music size={16} className="text-[#B08D2C] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">5-Hour Live DJ Performance</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Full event coverage from cocktail hour through grand exit with custom setlist curated to client preferences and guest demographics.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Mic2 size={16} className="text-[#B08D2C] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Professional MC Hosting</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Bilingual MC services including introductions, toasts, first dance announcements, and crowd engagement throughout the reception.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Volume2 size={16} className="text-[#B08D2C] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Premium Sound & Light System</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">QSC K12.2 line array system with dual 18" subwoofers, intelligent LED wash, moving heads, and wireless uplighting package.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#FAF6EE] border-l-2 border-[#7C6A2E] p-4">
          <p className="text-[9px] font-bold tracking-[0.15em] text-[#7C6A2E] uppercase mb-1">CLIENT NOTES</p>
          <p className="text-xs font-serif italic text-gray-600 leading-relaxed">
            "Would love a mix of Bollywood classics, current hits, and Arabic pop. Please avoid hip-hop during dinner service. First dance song: 'A Thousand Years' — request a beautiful intro build-up."
          </p>
        </div>
      </div>

      {/* Event Day Checklist */}
      <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-serif font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">Event Day Checklist</h3>
          <div className="space-y-4 mb-8">
            {checklist.map(item => (
              <label key={item.id} className="flex items-center space-x-3 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleCheck(item.id)}
                  className="rounded border-[#E0D8C3] text-[#7C6A2E] focus:ring-[#7C6A2E] cursor-pointer"
                />
                <span className={`text-xs text-gray-600 font-medium transition-all ${item.checked ? 'line-through text-gray-400 opacity-70' : 'group-hover:text-gray-900'}`}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        </div>
        <button className="w-full border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] py-2 text-xs font-bold tracking-widest transition-colors uppercase flex items-center justify-center space-x-1">
          <Plus size={14} />
          <span>ADD TASK</span>
        </button>
      </div>
    </div>
  );
};

export default DetailBottom;

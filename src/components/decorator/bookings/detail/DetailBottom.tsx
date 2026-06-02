"use client";

import React, { useState } from 'react';
import { CheckCircle2, Plus } from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

const DetailBottom = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', text: 'Verify floral inventory', checked: true },
    { id: '2', text: 'Confirm lighting rig functionality', checked: false },
    { id: '3', text: 'Assemble backdrop frame components', checked: false },
    { id: '4', text: 'Brief installation crew on schedule', checked: false },
    { id: '5', text: 'Schedule final vendor walkthrough', checked: false }
  ]);

  const toggleCheck = (id: string) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
      {/* Gold Package Details (3/5 width on desktop) */}
      <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm lg:col-span-3 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
            <h3 className="text-xl font-serif font-bold text-gray-900">
              Gold Package Details
            </h3>
            <span className="text-[8px] font-bold tracking-widest border border-[#B08D2C] text-[#7C6A2E] px-2 py-0.5 uppercase">
              PREMIUM TIER
            </span>
          </div>

          <div className="space-y-5 mb-8">
            {/* Item 1 */}
            <div className="flex items-start space-x-3">
              <CheckCircle2 size={16} className="text-[#B08D2C] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Premium Floral Stage</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Bespoke arrangement using imported Dutch white orchids and heritage roses.
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-start space-x-3">
              <CheckCircle2 size={16} className="text-[#B08D2C] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Intelligent Lighting System</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  DMX-controlled warm LED uplighting and atmospheric fog units for stage grand entry.
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-start space-x-3">
              <CheckCircle2 size={16} className="text-[#B08D2C] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Full Bridal Suite Decor</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Vanity area floral installation and luxury seating upholstery matching main hall theme.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Client Notes Box */}
        <div className="bg-[#FAF6EE] border-l-2 border-[#7C6A2E] p-4">
          <p className="text-[9px] font-bold tracking-[0.15em] text-[#7C6A2E] uppercase mb-1">CLIENT NOTES</p>
          <p className="text-xs font-serif italic text-gray-600 leading-relaxed">
            “Wants a cascade of white orchids for the main stage. Preference for warm-tone LED uplighting. Please ensure the aisle runners are perfectly aligned with the stage center.”
          </p>
        </div>
      </div>

      {/* Team Checklist (2/5 width on desktop) */}
      <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-serif font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
            Team Checklist
          </h3>

          <div className="space-y-4 mb-8">
            {checklist.map((item) => (
              <label 
                key={item.id} 
                className="flex items-center space-x-3 cursor-pointer select-none group"
              >
                <input 
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleCheck(item.id)}
                  className="rounded border-[#E0D8C3] text-[#7C6A2E] focus:ring-[#7C6A2E] cursor-pointer"
                />
                <span className={`text-xs text-gray-600 font-medium transition-all ${
                  item.checked ? 'line-through text-gray-400 opacity-70' : 'group-hover:text-gray-900'
                }`}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Add Task Button */}
        <button className="w-full border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] py-2 text-xs font-bold tracking-widest transition-colors uppercase flex items-center justify-center space-x-1">
          <Plus size={14} />
          <span>ADD TASK</span>
        </button>
      </div>
    </div>
  );
};

export default DetailBottom;

'use client';

import { useLayoutStore, ArrangementStyle } from '@/store/useLayoutStore';
import { 
  Theater, GraduationCap, UtensilsCrossed, Armchair, LayoutGrid,
  Users, Table2, ChevronUp, ChevronDown, Eye, ArrowUpDown, Maximize2
} from 'lucide-react';
import { useState } from 'react';

const arrangementOptions: { label: ArrangementStyle; icon: React.ReactNode; description: string }[] = [
  { label: 'Theater', icon: <Theater size={18} />, description: 'Rows facing stage' },
  { label: 'Classroom', icon: <GraduationCap size={18} />, description: 'Tables with chairs' },
  { label: 'Banquet', icon: <UtensilsCrossed size={18} />, description: 'Round table dining' },
  { label: 'U-shape', icon: <Armchair size={18} />, description: 'U-shaped meeting' },
  { label: 'Boardroom', icon: <LayoutGrid size={18} />, description: 'Long central table' },
];

export const ControlPanel = () => {
  const {
    guestCount, setGuestCount,
    arrangementStyle, setArrangementStyle,
    spacing, setSpacing,
    viewMode, setViewMode,
    hallStats,
  } = useLayoutStore();

  const [isStatsOpen, setIsStatsOpen] = useState(true);

  return (
    <div className="w-full h-full overflow-y-auto bg-[#FDFBF7] border-r border-[#E8DFC9] flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-[#E8DFC9]">
        <h2 className="text-xl font-serif text-[#1A1512] tracking-tight">Hall Arranger</h2>
        <p className="text-xs text-gray-500 mt-1 tracking-wide uppercase">Configure your event layout</p>
      </div>

      {/* Guest Count */}
      <div className="p-5 border-b border-[#E8DFC9]">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Users size={15} className="text-[#C69C6D]" />
            Guest Count
          </label>
          <span className="text-sm font-semibold text-[#C69C6D] bg-[#FAF6EE] px-2.5 py-0.5 rounded-full">
            {guestCount}
          </span>
        </div>
        <input
          type="range"
          min={10}
          max={500}
          step={5}
          value={guestCount}
          onChange={(e) => setGuestCount(Number(e.target.value))}
          className="w-full accent-[#C69C6D] h-1.5 rounded-full cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-medium">
          <span>10</span>
          <span>250</span>
          <span>500</span>
        </div>
      </div>

      {/* Arrangement Style */}
      <div className="p-5 border-b border-[#E8DFC9]">
        <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
          <Table2 size={15} className="text-[#C69C6D]" />
          Arrangement Style
        </label>
        <div className="space-y-1.5">
          {arrangementOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setArrangementStyle(opt.label)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left transition-all duration-200 ${
                arrangementStyle === opt.label
                  ? 'bg-[#C69C6D] text-white shadow-md shadow-[#C69C6D]/20'
                  : 'bg-[#FAF6EE] text-gray-700 hover:bg-[#f0eadb] border border-transparent hover:border-[#E8DFC9]'
              }`}
            >
              <span className={arrangementStyle === opt.label ? 'text-white/90' : 'text-[#C69C6D]'}>
                {opt.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">{opt.label}</p>
                <p className={`text-[10px] leading-tight mt-0.5 ${
                  arrangementStyle === opt.label ? 'text-white/70' : 'text-gray-400'
                }`}>{opt.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div className="p-5 border-b border-[#E8DFC9]">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <ArrowUpDown size={15} className="text-[#C69C6D]" />
            Spacing
          </label>
          <span className="text-sm font-semibold text-[#C69C6D] bg-[#FAF6EE] px-2.5 py-0.5 rounded-full">
            {spacing.toFixed(1)}x
          </span>
        </div>
        <input
          type="range"
          min={0.5}
          max={2.0}
          step={0.1}
          value={spacing}
          onChange={(e) => setSpacing(Number(e.target.value))}
          className="w-full accent-[#C69C6D] h-1.5 rounded-full cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-medium">
          <span>Tight</span>
          <span>Normal</span>
          <span>Spacious</span>
        </div>
      </div>

      {/* View Mode */}
      <div className="p-5 border-b border-[#E8DFC9]">
        <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
          <Eye size={15} className="text-[#C69C6D]" />
          Camera View
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setViewMode('orbit')}
            className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg text-xs font-medium transition-all duration-200 ${
              viewMode === 'orbit'
                ? 'bg-[#C69C6D] text-white shadow-md shadow-[#C69C6D]/20'
                : 'bg-[#FAF6EE] text-gray-600 hover:bg-[#f0eadb]'
            }`}
          >
            <Maximize2 size={16} />
            <span>3D Orbit</span>
          </button>
          <button
            onClick={() => setViewMode('topDown')}
            className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg text-xs font-medium transition-all duration-200 ${
              viewMode === 'topDown'
                ? 'bg-[#C69C6D] text-white shadow-md shadow-[#C69C6D]/20'
                : 'bg-[#FAF6EE] text-gray-600 hover:bg-[#f0eadb]'
            }`}
          >
            <Eye size={16} />
            <span>Top Down</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-5 mt-auto">
        <button
          onClick={() => setIsStatsOpen(!isStatsOpen)}
          className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-3"
        >
          <span>Live Statistics</span>
          {isStatsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {isStatsOpen && (
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#FAF6EE] rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-[#1A1512]">{hallStats.totalChairs}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Chairs</p>
            </div>
            <div className="bg-[#FAF6EE] rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-[#1A1512]">{hallStats.totalTables}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Tables</p>
            </div>
            <div className="bg-[#FAF6EE] rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-[#1A1512]">{hallStats.totalGuests}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Seated</p>
            </div>
            <div className="bg-[#FAF6EE] rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-[#C69C6D]">{hallStats.utilization}%</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Capacity</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

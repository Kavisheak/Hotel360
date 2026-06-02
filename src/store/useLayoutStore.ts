import { create } from 'zustand';

export type ArrangementStyle = 'Theater' | 'Classroom' | 'Banquet' | 'U-shape' | 'Boardroom';
export type ViewMode = 'orbit' | 'topDown';

export interface HallStats {
  totalGuests: number;
  totalTables: number;
  totalChairs: number;
  utilization: number;
}

interface LayoutState {
  guestCount: number;
  arrangementStyle: ArrangementStyle;
  spacing: number;
  viewMode: ViewMode;
  hallStats: HallStats;
  setGuestCount: (count: number) => void;
  setArrangementStyle: (style: ArrangementStyle) => void;
  setSpacing: (spacing: number) => void;
  setViewMode: (mode: ViewMode) => void;
  setHallStats: (stats: HallStats) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  guestCount: 50,
  arrangementStyle: 'Theater',
  spacing: 1.0,
  viewMode: 'orbit',
  hallStats: {
    totalGuests: 0,
    totalTables: 0,
    totalChairs: 0,
    utilization: 0,
  },
  setGuestCount: (count) => set({ guestCount: count }),
  setArrangementStyle: (style) => set({ arrangementStyle: style }),
  setSpacing: (spacing) => set({ spacing }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setHallStats: (stats) => set({ hallStats: stats }),
}));

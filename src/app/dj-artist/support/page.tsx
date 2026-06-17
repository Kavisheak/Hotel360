import React from 'react';
import Sidebar from '@/components/dj-artist/overview/Sidebar';
import SupportMain from '@/components/dj-artist/support/SupportMain';

export default function DjSupportPage() {
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 pt-14 lg:pt-0 min-w-0">
        <SupportMain />
      </div>
    </div>
  );
}

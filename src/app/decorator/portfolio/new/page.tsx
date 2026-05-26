import React from 'react';
import Sidebar from '@/components/decorator/my_jobs/Sidebar';
import UploadNewWorkMain from '@/components/decorator/portfolio/new/UploadNewWorkMain';

/**
 * Premium Portfolio creation route handler.
 * Rebuilt to completely clear Turbopack caching.
 */
export default function UploadNewWorkPage() {
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      {/* Dynamic Collapsible Sidebar */}
      <Sidebar />
      
      {/* Main Content Pane */}
      <div className="flex-1 pt-14 lg:pt-0 min-w-0 flex flex-col">
        <UploadNewWorkMain />
      </div>
    </div>
  );
}

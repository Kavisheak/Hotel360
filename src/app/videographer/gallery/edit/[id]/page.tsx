import React from 'react';
import Sidebar from '@/components/videographer/shared/Sidebar';
import UploadProjectMain from '@/components/videographer/gallery/UploadProjectMain';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGalleryPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 pt-14 lg:pt-0 min-w-0 flex flex-col">
        <UploadProjectMain id={id} />
      </div>
    </div>
  );
}

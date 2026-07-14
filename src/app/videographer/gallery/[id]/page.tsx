import GalleryItemMain from '@/components/videographer/gallery/item/GalleryItemMain';
import Sidebar from '@/components/videographer/shared/Sidebar';

export default async function VideographerGalleryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 pt-14 lg:pt-0 min-w-0">
        <GalleryItemMain itemId={id} />
      </div>
    </div>
  );
}

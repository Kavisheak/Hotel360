import GalleryItemMain from '@/components/dj-artist/gallery/item/GalleryItemMain';
import Sidebar from '@/components/dj-artist/overview/Sidebar';

export default async function DJGalleryItemPage({ params }: { params: Promise<{ id: string }> }) {
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

import React from 'react';

const GalleryMain = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="px-10 py-6 border-b border-[#E0D8C3] bg-[#FDF9F1]"></div>

      <div className="flex-1 p-10 max-w-7xl mx-auto w-full">
        <h1 className="text-5xl font-serif text-[#7C6A2E] mb-2 tracking-tight">Gallery</h1>
        <p className="text-gray-500 font-serif italic text-lg mb-6">Event photos and portfolio media.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="bg-white border border-[#EDE6D6] rounded-md overflow-hidden shadow-sm">
              <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400">Image {i}</div>
              <div className="p-4 text-sm text-gray-700">Private Event — 2024</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryMain;

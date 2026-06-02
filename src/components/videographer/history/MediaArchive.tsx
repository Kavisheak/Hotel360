import React from 'react';

const photos = [
  {
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    alt: 'Cinematic event stage with gold lighting',
  },
  {
    src: 'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&w=800&q=80',
    alt: 'Evening reception with ambient lights',
  },
  {
    src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
    alt: 'Elegant banquet hall with chandeliers',
  },
];

const MediaArchive = () => {
  return (
    <div className="mb-10">
      <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 font-bold tracking-tight mb-6">Media Archive</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {photos.map((photo, idx) => (
          <div key={idx} className="aspect-[4/3] overflow-hidden group relative cursor-pointer">
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaArchive;

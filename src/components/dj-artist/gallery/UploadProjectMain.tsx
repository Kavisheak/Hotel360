"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  UploadCloud,
  Trash2,
  Plus,
  MapPin,
  Music,
  Headphones,
  Maximize,
  EyeOff,
  Layers,
  Mic2,
  Volume2,
  Radio,
} from 'lucide-react';
import Footer from '../overview/Footer';

interface MediaItem {
  id: string;
  src: string;
  isCover: boolean;
  name: string;
}

const UploadProjectMain = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [projectTitle, setProjectTitle] = useState('');
  const [eventType, setEventType] = useState('Wedding Reception');
  const [eventDate, setEventDate] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [setDuration, setSetDuration] = useState('');
  const [genre, setGenre] = useState('Top 40 / Pop');

  const [services, setServices] = useState({
    liveSet: true,
    mixedPlaylist: true,
    mcHosting: false,
    lightShow: false,
    soundSystem: false,
  });

  const [isFeatured, setIsFeatured] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const [mediaList, setMediaList] = useState<MediaItem[]>([
    {
      id: 'default-cover',
      src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
      isCover: true,
      name: 'Cover Shot',
    },
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file, idx) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaList(prev => [
          ...prev,
          { id: `uploaded-${Date.now()}-${idx}`, src: reader.result as string, isCover: false, name: file.name },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleRemoveMedia = (id: string) => {
    setMediaList(prev => {
      const filtered = prev.filter(item => item.id !== id);
      if (filtered.length > 0 && !filtered.some(i => i.isCover)) filtered[0].isCover = true;
      return filtered;
    });
  };

  const handleSetCover = (id: string) =>
    setMediaList(prev => prev.map(item => ({ ...item, isCover: item.id === id })));

  const handlePublish = () => {
    alert(`Success! "${projectTitle || 'Untitled Performance'}" has been published to your gallery.`);
    router.push('/dj-artist/gallery');
  };

  const handleCancel = () => router.push('/dj-artist/gallery');

  return (
    <div className="flex-grow overflow-y-auto bg-[#FDF9F1] flex flex-col justify-between">
      <div>
        {/* HEADER ACTION BAR */}
        <header className="sticky top-0 z-10 flex flex-col md:flex-row justify-between items-start md:items-center px-6 sm:px-8 py-5 bg-[#FDF9F1]/95 backdrop-blur-md border-b border-[#E0D8C3] gap-4">
          <div>
            <nav className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">
              <span onClick={handleCancel} className="hover:text-[#7C6A2E] cursor-pointer transition-colors">Gallery</span>
              <ChevronRight size={12} className="text-gray-300" />
              <span className="text-[#7C6A2E]">Upload New Project</span>
            </nav>
            <h2 className="text-3xl font-serif text-gray-900 font-bold tracking-tight italic">
              Add Performance Project
            </h2>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleCancel}
              className="flex-1 md:flex-initial px-6 py-3 border border-[#7C6A2E] text-[#7C6A2E] font-bold text-[10px] tracking-[0.15em] uppercase hover:bg-[#FAF6EE] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePublish}
              className="flex-1 md:flex-initial px-6 py-3 bg-[#B08D2C] hover:bg-[#9B7A20] text-white font-bold text-[10px] tracking-[0.15em] uppercase shadow-sm active:scale-95 transition-all"
            >
              Publish to Gallery
            </button>
          </div>
        </header>

        <div className="max-w-[1100px] mx-auto px-6 sm:px-8 py-10 space-y-16">

          {/* SECTION 1: MEDIA UPLOAD */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <h3 className="text-lg font-serif font-bold text-[#7C6A2E] mb-2 flex items-center gap-2">
                <Music size={18} className="text-[#B08D2C]" />
                Visual Showcase
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
                Upload your best performance shots, crowd photos, or stage stills. The primary image sets the first impression for this project.
              </p>
              <div className="pt-6 border-t border-[#E0D8C3] space-y-5">
                <h4 className="text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase">Photography Tips</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Maximize size={16} className="text-[#B08D2C] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-gray-800 block text-xs uppercase tracking-wide">Stage Shots</span>
                      <span className="text-[10px] text-gray-400 font-semibold leading-normal">Wide-angle shots from the crowd capture the full energy of the event.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Radio size={16} className="text-[#B08D2C] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-gray-800 block text-xs uppercase tracking-wide">Lighting Moments</span>
                      <span className="text-[10px] text-gray-400 font-semibold leading-normal">Capture strobe, laser, and LED lighting for an electrifying visual impact.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Layers size={16} className="text-[#B08D2C] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-gray-800 block text-xs uppercase tracking-wide">Crowd Energy</span>
                      <span className="text-[10px] text-gray-400 font-semibold leading-normal">Smiling, dancing guests are the best proof of a successful performance.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" />

              <div
                onClick={triggerFileSelect}
                className="relative group cursor-pointer h-[320px] sm:h-[380px] bg-white border-2 border-dashed border-[#E0D8C3] hover:border-[#B08D2C] transition-all flex flex-col items-center justify-center overflow-hidden"
              >
                <img
                  alt="DJ Background"
                  className="absolute inset-0 w-full h-full object-cover opacity-5 group-hover:opacity-10 transition-opacity"
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80"
                />
                <div className="relative z-10 flex flex-col items-center text-center px-6">
                  <UploadCloud size={48} className="text-[#B08D2C] mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-xl font-serif font-bold text-[#7C6A2E] mb-2">Drop Your Performance Stills</span>
                  <p className="text-xs text-gray-400 font-semibold max-w-[400px] leading-relaxed mb-6">
                    Maximum file size: 50MB. Recommended: High-res JPEGs (3000×2000px) from your event photographer.
                  </p>
                  <button className="px-5 py-2.5 bg-white border border-[#E0D8C3] group-hover:border-[#B08D2C] text-[#7C6A2E] font-bold text-[10px] tracking-widest uppercase transition-colors">
                    Select Images
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                {mediaList.map(item => (
                  <div
                    key={item.id}
                    className={`w-28 h-28 flex-shrink-0 bg-white border ${item.isCover ? 'border-[#B08D2C]' : 'border-[#E0D8C3]'} relative group overflow-hidden`}
                  >
                    <img className="w-full h-full object-cover" src={item.src} alt={item.name} />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                      <button onClick={() => handleRemoveMedia(item.id)} className="p-1.5 bg-[#93000a] text-white rounded-full hover:scale-110 transition-transform" title="Delete">
                        <Trash2 size={12} />
                      </button>
                      {!item.isCover && (
                        <button onClick={() => handleSetCover(item.id)} className="p-1.5 bg-[#7C6A2E] text-white rounded-full hover:scale-110 transition-transform text-[8px] font-bold tracking-wider uppercase px-2">
                          Cover
                        </button>
                      )}
                    </div>
                    {item.isCover && (
                      <div className="absolute bottom-1 right-1 bg-[#B08D2C] text-white text-[8px] px-1.5 py-0.5 font-bold uppercase tracking-wider shadow-sm">Cover</div>
                    )}
                  </div>
                ))}
                <div
                  onClick={triggerFileSelect}
                  className="w-28 h-28 flex-shrink-0 bg-white border-2 border-dashed border-[#E0D8C3] hover:border-[#B08D2C] flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Plus size={20} className="text-gray-400" />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: PROJECT DETAILS */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-[#E0D8C3] pt-12">
            <div className="lg:col-span-4">
              <h3 className="text-lg font-serif font-bold text-[#7C6A2E] mb-2 flex items-center gap-2">
                <Headphones size={18} className="text-[#B08D2C]" />
                Project Details
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Give this performance a title that captures the energy and spirit of the event and your set.
              </p>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">Project Title</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={e => setProjectTitle(e.target.value)}
                  placeholder="e.g. Sterling-Vance Wedding Reception Set"
                  className="w-full bg-white border border-[#E0D8C3] p-4 text-sm font-semibold text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#B08D2C]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">Event Type</label>
                  <select
                    value={eventType}
                    onChange={e => setEventType(e.target.value)}
                    className="w-full bg-white border border-[#E0D8C3] p-4 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#B08D2C] cursor-pointer"
                  >
                    <option>Wedding Reception</option>
                    <option>Corporate Gala</option>
                    <option>Club Night</option>
                    <option>Private Party</option>
                    <option>Festival / Arena</option>
                    <option>Birthday Celebration</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">Event Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="w-full bg-white border border-[#E0D8C3] p-4 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#B08D2C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">Set Duration</label>
                  <input
                    type="text"
                    value={setDuration}
                    onChange={e => setSetDuration(e.target.value)}
                    placeholder="e.g. 4 hours (8 PM – 12 AM)"
                    className="w-full bg-white border border-[#E0D8C3] p-4 text-sm font-semibold text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#B08D2C]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">Primary Genre</label>
                  <select
                    value={genre}
                    onChange={e => setGenre(e.target.value)}
                    className="w-full bg-white border border-[#E0D8C3] p-4 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#B08D2C] cursor-pointer"
                  >
                    <option>Top 40 / Pop</option>
                    <option>House & Electronic</option>
                    <option>Hip-Hop & R&B</option>
                    <option>Latin & Reggaeton</option>
                    <option>Bollywood & Desi</option>
                    <option>Classic Hits</option>
                    <option>Multi-Genre</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">Performance Story</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the vibe, the crowd energy, your setlist highlights, and what made this performance unforgettable..."
                  rows={5}
                  className="w-full bg-white border border-[#E0D8C3] p-4 text-sm font-semibold text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#B08D2C] leading-relaxed resize-none"
                />
              </div>
            </div>
          </section>

          {/* SECTION 3: PRODUCTION DETAILS */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-[#E0D8C3] pt-12">
            <div className="lg:col-span-4">
              <h3 className="text-lg font-serif font-bold text-[#7C6A2E] mb-2 flex items-center gap-2">
                <MapPin size={18} className="text-[#B08D2C]" />
                Production Details
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Tag your services so clients can find the exact mix of equipment and entertainment you provided.
              </p>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">Venue / Location</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B08D2C]"><MapPin size={16} /></span>
                  <input
                    type="text"
                    value={venue}
                    onChange={e => setVenue(e.target.value)}
                    placeholder="e.g. Rosewood Estate, London"
                    className="w-full bg-white border border-[#E0D8C3] p-4 pl-12 text-sm font-semibold text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#B08D2C]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">Services Delivered</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'liveSet', label: 'Live DJ Set' },
                    { key: 'mixedPlaylist', label: 'Mixed Playlist' },
                    { key: 'mcHosting', label: 'MC Hosting' },
                    { key: 'lightShow', label: 'Light Show' },
                    { key: 'soundSystem', label: 'Sound System' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3 group cursor-pointer">
                      <div className="w-5 h-5 border border-[#B08D2C] flex items-center justify-center bg-white shrink-0">
                        <div className={`w-3 h-3 bg-[#B08D2C] transition-transform ${services[key as keyof typeof services] ? 'scale-100' : 'scale-0'}`} />
                      </div>
                      <input
                        type="checkbox"
                        checked={services[key as keyof typeof services]}
                        onChange={e => setServices({ ...services, [key]: e.target.checked })}
                        className="hidden"
                      />
                      <span className="text-xs font-semibold text-gray-600 group-hover:text-[#7C6A2E] transition-colors uppercase tracking-wider">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: VISIBILITY */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-[#E0D8C3] pt-12">
            <div className="lg:col-span-4">
              <h3 className="text-lg font-serif font-bold text-[#7C6A2E] mb-2 flex items-center gap-2">
                <EyeOff size={18} className="text-[#B08D2C]" />
                Showcase Settings
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">Control how this project is featured in your public gallery.</p>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-6">
              {[
                { id: 'toggle-featured', checked: isFeatured, onChange: setIsFeatured, title: 'Feature on Profile', sub: 'Pin this set to your top 5 highlight reel' },
                { id: 'toggle-privacy', checked: isPrivate, onChange: setIsPrivate, title: 'Client Privacy', sub: 'Hide client name & sensitive event details' },
              ].map(toggle => (
                <div key={toggle.id} className="flex items-center justify-between p-6 bg-white border border-[#E0D8C3] shadow-sm">
                  <div>
                    <span className="text-sm font-serif font-bold text-gray-900 block mb-1">{toggle.title}</span>
                    <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">{toggle.sub}</span>
                  </div>
                  <div className="relative inline-block w-12 shrink-0 select-none">
                    <input type="checkbox" id={toggle.id} checked={toggle.checked} onChange={e => toggle.onChange(e.target.checked)} className="hidden" />
                    <label htmlFor={toggle.id} className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-250 ${toggle.checked ? 'bg-[#B08D2C]' : 'bg-gray-200'}`}>
                      <span className={`block w-6 h-6 rounded-full bg-white border border-gray-300 transform transition-transform duration-250 ${toggle.checked ? 'translate-x-6 border-[#B08D2C]' : 'translate-x-0'}`} />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UploadProjectMain;

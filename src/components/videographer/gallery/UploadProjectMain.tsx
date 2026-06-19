"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  UploadCloud,
  Trash2,
  Plus,
  MapPin,
  Film,
  Camera,
  Maximize,
  Check,
  Calendar,
  Layers,
  EyeOff,
  Video,
  Play,
  Aperture,
} from 'lucide-react';
import Footer from '../shared/Footer';

interface MediaItem {
  id: string;
  src: string;
  isCover: boolean;
  name: string;
}

const UploadProjectMain = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [projectTitle, setProjectTitle] = useState('');
  const [eventType, setEventType] = useState('Wedding Film');
  const [eventDate, setEventDate] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [filmDuration, setFilmDuration] = useState('');
  const [resolution, setResolution] = useState('4K Ultra HD');

  // Services checklist (videographer-specific)
  const [services, setServices] = useState({
    cinematicFilm: true,
    droneAerial: true,
    highlightReel: false,
    rawFootage: false,
    sameDay: false,
  });

  // Toggles
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  // Media Gallery State
  const [mediaList, setMediaList] = useState<MediaItem[]>([
    {
      id: 'default-cover',
      src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80',
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
          {
            id: `uploaded-${Date.now()}-${idx}`,
            src: reader.result as string,
            isCover: false,
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveMedia = (id: string) => {
    setMediaList(prev => {
      const filtered = prev.filter(item => item.id !== id);
      if (filtered.length > 0 && !filtered.some(i => i.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  const handleSetCover = (id: string) => {
    setMediaList(prev =>
      prev.map(item => ({ ...item, isCover: item.id === id }))
    );
  };

  const handlePublish = () => {
    alert(`Success! "${projectTitle || 'Untitled Cinematic Project'}" has been published to your portfolio.`);
    router.push('/videographer/gallery');
  };

  const handleCancel = () => {
    router.push('/videographer/gallery');
  };

  return (
    <div className="flex-grow overflow-y-auto custom-scrollbar bg-[#FDF9F1] flex flex-col justify-between">
      <div>
        {/* HEADER ACTION BAR */}
        <header className="sticky top-0 z-10 flex flex-col md:flex-row justify-between items-start md:items-center px-6 sm:px-8 py-5 bg-[#FDF9F1]/95 backdrop-blur-md border-b border-[#E0D8C3] gap-4">
          <div>
            <nav className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">
              <span
                onClick={handleCancel}
                className="hover:text-[#7C6A2E] cursor-pointer transition-colors"
              >
                Gallery
              </span>
              <ChevronRight size={12} className="text-gray-300" />
              <span className="text-[#7C6A2E]">Upload New Project</span>
            </nav>
            <h2 className="text-3xl font-serif text-gray-900 font-bold tracking-tight italic">
              Add Cinematic Project
            </h2>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleCancel}
              className="flex-1 md:flex-initial px-6 py-3 border border-[#7C6A2E] text-[#7C6A2E] font-bold text-[10px] tracking-[0.15em] uppercase hover:bg-[#FAF6EE] active:opacity-80 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePublish}
              className="flex-1 md:flex-initial px-6 py-3 bg-[#B08D2C] hover:bg-[#9B7A20] text-white font-bold text-[10px] tracking-[0.15em] uppercase shadow-sm active:scale-95 transition-all"
            >
              Publish to Portfolio
            </button>
          </div>
        </header>

        {/* FORM CONTENT BODY */}
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8 py-10 space-y-16">

          {/* SECTION 1: MEDIA UPLOAD */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <h3 className="text-lg font-serif font-bold text-[#7C6A2E] mb-2 flex items-center gap-2">
                <Film size={18} className="text-[#B08D2C]" />
                Visual Showcase
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
                Upload your best thumbnail stills from this project. The primary image will be the first impression clients see.
              </p>

              <div className="pt-6 border-t border-[#E0D8C3] space-y-5">
                <h4 className="text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase">
                  Cinematography Tips
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Maximize size={16} className="text-[#B08D2C] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-gray-800 block text-xs uppercase tracking-wide">4K Resolution</span>
                      <span className="text-[10px] text-gray-400 font-semibold leading-normal">Use high-resolution stills exported from your timeline for crisp display.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Aperture size={16} className="text-[#B08D2C] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-gray-800 block text-xs uppercase tracking-wide">Golden Hour Shots</span>
                      <span className="text-[10px] text-gray-400 font-semibold leading-normal">Warm natural light captures emotion and sets cinematic tone perfectly.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Layers size={16} className="text-[#B08D2C] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-gray-800 block text-xs uppercase tracking-wide">Widescreen Ratio</span>
                      <span className="text-[10px] text-gray-400 font-semibold leading-normal">16:9 or 2.35:1 cinematic ratio best showcases your storytelling framing.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="hidden"
              />

              {/* Dashed Dropzone */}
              <div
                onClick={triggerFileSelect}
                className="relative group cursor-pointer h-[320px] sm:h-[380px] bg-white border-2 border-dashed border-[#E0D8C3] hover:border-[#B08D2C] transition-all flex flex-col items-center justify-center overflow-hidden"
              >
                <img
                  alt="Cinematic Background"
                  className="absolute inset-0 w-full h-full object-cover opacity-5 group-hover:opacity-10 transition-opacity"
                  src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80"
                />
                <div className="relative z-10 flex flex-col items-center text-center px-6">
                  <UploadCloud size={48} className="text-[#B08D2C] mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-xl font-serif font-bold text-[#7C6A2E] mb-2">
                    Drop Your Cinematic Stills
                  </span>
                  <p className="text-xs text-gray-400 font-semibold max-w-[400px] leading-relaxed mb-6">
                    Maximum file size: 50MB. Recommended: Export high-res stills from your 4K or 6K timeline at 300 DPI.
                  </p>
                  <button className="px-5 py-2.5 bg-white border border-[#E0D8C3] group-hover:border-[#B08D2C] text-[#7C6A2E] font-bold text-[10px] tracking-widest uppercase transition-colors">
                    Select Images
                  </button>
                </div>
              </div>

              {/* Media Preview Strip */}
              <div className="flex flex-wrap gap-4 pt-2">
                {mediaList.map(item => (
                  <div
                    key={item.id}
                    className={`w-28 h-28 flex-shrink-0 bg-white border ${item.isCover ? 'border-[#B08D2C]' : 'border-[#E0D8C3]'
                      } relative group overflow-hidden`}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={item.src}
                      alt={item.name}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                      <button
                        onClick={() => handleRemoveMedia(item.id)}
                        className="p-1.5 bg-[#93000a] text-white rounded-full hover:scale-110 transition-transform"
                        title="Delete Image"
                      >
                        <Trash2 size={12} />
                      </button>
                      {!item.isCover && (
                        <button
                          onClick={() => handleSetCover(item.id)}
                          className="p-1.5 bg-[#7C6A2E] text-white rounded-full hover:scale-110 transition-transform text-[8px] font-bold tracking-wider uppercase px-2"
                        >
                          Cover
                        </button>
                      )}
                    </div>
                    {item.isCover && (
                      <div className="absolute bottom-1 right-1 bg-[#B08D2C] text-white text-[8px] px-1.5 py-0.5 font-bold uppercase tracking-wider shadow-sm">
                        Cover
                      </div>
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
                <Video size={18} className="text-[#B08D2C]" />
                Project Details
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Name your project with a title that captures the heart and emotion of the event you've documented.
              </p>
            </div>

            <div className="lg:col-span-8 space-y-6">
              {/* Project Title */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                  Project Title
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={e => setProjectTitle(e.target.value)}
                  placeholder="e.g. The Sterling-Vance Cinematic Wedding Film"
                  className="w-full bg-white border border-[#E0D8C3] p-4 text-sm font-semibold text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#B08D2C]"
                />
              </div>

              {/* Event Type & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                    Film Type
                  </label>
                  <select
                    value={eventType}
                    onChange={e => setEventType(e.target.value)}
                    className="w-full bg-white border border-[#E0D8C3] p-4 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#B08D2C] cursor-pointer"
                  >
                    <option>Wedding Film</option>
                    <option>Engagement Session</option>
                    <option>Corporate Event</option>
                    <option>Anniversary Film</option>
                    <option>Pre-Wedding Shoot</option>
                    <option>Event Highlight Reel</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="w-full bg-white border border-[#E0D8C3] p-4 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#B08D2C]"
                  />
                </div>
              </div>

              {/* Film Duration & Resolution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                    Final Film Duration
                  </label>
                  <input
                    type="text"
                    value={filmDuration}
                    onChange={e => setFilmDuration(e.target.value)}
                    placeholder="e.g. 8 minutes 30 seconds"
                    className="w-full bg-white border border-[#E0D8C3] p-4 text-sm font-semibold text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#B08D2C]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                    Resolution
                  </label>
                  <select
                    value={resolution}
                    onChange={e => setResolution(e.target.value)}
                    className="w-full bg-white border border-[#E0D8C3] p-4 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#B08D2C] cursor-pointer"
                  >
                    <option>4K Ultra HD</option>
                    <option>6K Cinema</option>
                    <option>1080p Full HD</option>
                    <option>Anamorphic 2.35:1</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                  Cinematic Story
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the narrative arc, shooting style, and the emotion you captured on this day..."
                  rows={5}
                  className="w-full bg-white border border-[#E0D8C3] p-4 text-sm font-semibold text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#B08D2C] leading-relaxed resize-none"
                />
              </div>
            </div>
          </section>

          {/* SECTION 3: METADATA & SERVICES */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-[#E0D8C3] pt-12">
            <div className="lg:col-span-4">
              <h3 className="text-lg font-serif font-bold text-[#7C6A2E] mb-2 flex items-center gap-2">
                <MapPin size={18} className="text-[#B08D2C]" />
                Production Details
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Tag your production services so clients can discover the exact coverage and deliverables you provided.
              </p>
            </div>

            <div className="lg:col-span-8 space-y-6">
              {/* Venue Location */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                  Venue / Location
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B08D2C]">
                    <MapPin size={16} />
                  </span>
                  <input
                    type="text"
                    value={venue}
                    onChange={e => setVenue(e.target.value)}
                    placeholder="e.g. Rosewood Estate, London"
                    className="w-full bg-white border border-[#E0D8C3] p-4 pl-12 text-sm font-semibold text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#B08D2C]"
                  />
                </div>
              </div>

              {/* Services */}
              <div className="space-y-4">
                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                  Services Delivered
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'cinematicFilm', label: 'Cinematic Film' },
                    { key: 'droneAerial', label: 'Drone Aerial' },
                    { key: 'highlightReel', label: 'Highlight Reel' },
                    { key: 'rawFootage', label: 'Raw Footage' },
                    { key: 'sameDay', label: 'Same-Day Edit' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3 group cursor-pointer">
                      <div className="w-5 h-5 border border-[#B08D2C] flex items-center justify-center bg-white shrink-0">
                        <div
                          className={`w-3 h-3 bg-[#B08D2C] transition-transform ${services[key as keyof typeof services] ? 'scale-100' : 'scale-0'
                            }`}
                        />
                      </div>
                      <input
                        type="checkbox"
                        checked={services[key as keyof typeof services]}
                        onChange={e =>
                          setServices({ ...services, [key]: e.target.checked })
                        }
                        className="hidden"
                      />
                      <span className="text-xs font-semibold text-gray-600 group-hover:text-[#7C6A2E] transition-colors uppercase tracking-wider">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: VISIBILITY SETTINGS */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-[#E0D8C3] pt-12">
            <div className="lg:col-span-4">
              <h3 className="text-lg font-serif font-bold text-[#7C6A2E] mb-2 flex items-center gap-2">
                <EyeOff size={18} className="text-[#B08D2C]" />
                Showcase Settings
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Control how this project is featured and who can view it in your public portfolio.
              </p>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Featured Toggle */}
              <div className="flex items-center justify-between p-6 bg-white border border-[#E0D8C3] shadow-sm">
                <div>
                  <span className="text-sm font-serif font-bold text-gray-900 block mb-1">Feature on Showreel</span>
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Pin this project to your top 5 highlight reel</span>
                </div>
                <div className="relative inline-block w-12 shrink-0 select-none">
                  <input
                    type="checkbox"
                    id="toggle-featured"
                    checked={isFeatured}
                    onChange={e => setIsFeatured(e.target.checked)}
                    className="hidden"
                  />
                  <label
                    htmlFor="toggle-featured"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-250 ${isFeatured ? 'bg-[#B08D2C]' : 'bg-gray-200'
                      }`}
                  >
                    <span
                      className={`block w-6 h-6 rounded-full bg-white border border-gray-300 transform transition-transform duration-250 ${isFeatured ? 'translate-x-6 border-[#B08D2C]' : 'translate-x-0'
                        }`}
                    />
                  </label>
                </div>
              </div>

              {/* Privacy Toggle */}
              <div className="flex items-center justify-between p-6 bg-white border border-[#E0D8C3] shadow-sm">
                <div>
                  <span className="text-sm font-serif font-bold text-gray-900 block mb-1">Client Privacy</span>
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Hide client name & sensitive event details</span>
                </div>
                <div className="relative inline-block w-12 shrink-0 select-none">
                  <input
                    type="checkbox"
                    id="toggle-privacy"
                    checked={isPrivate}
                    onChange={e => setIsPrivate(e.target.checked)}
                    className="hidden"
                  />
                  <label
                    htmlFor="toggle-privacy"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-250 ${isPrivate ? 'bg-[#B08D2C]' : 'bg-gray-200'
                      }`}
                  >
                    <span
                      className={`block w-6 h-6 rounded-full bg-white border border-gray-300 transform transition-transform duration-250 ${isPrivate ? 'translate-x-6 border-[#B08D2C]' : 'translate-x-0'
                        }`}
                    />
                  </label>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default UploadProjectMain;

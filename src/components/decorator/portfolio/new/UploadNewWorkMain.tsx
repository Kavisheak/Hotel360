"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  UploadCloud,
  Trash2,
  Plus,
  MapPin,
  Sparkles,
  Sun,
  Maximize,
  Check,
  Info,
  Calendar,
  Layers,
  EyeOff
} from 'lucide-react';
import Footer from '../../my_jobs/Footer';

interface MediaItem {
  id: string;
  src: string;
  isCover: boolean;
  file?: File;
  designType?: 'stage' | 'hall' | 'entrance' | 'general';
}

const UploadNewWorkMain = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State variables
  const [projectTitle, setProjectTitle] = useState('');
  const [eventType, setEventType] = useState('Grand Wedding');
  const [eventDate, setEventDate] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('installations');
  const [culturalStyle, setCulturalStyle] = useState('Western / Modern');

  // Services checklist
  const [services, setServices] = useState({
    floralArt: true,
    lightingDesign: true,
    stageConcept: false,
    tableScapes: false,
    entranceDecor: false
  });

  // Toggles
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  // Dynamic Uploads Gallery State
  const [mediaList, setMediaList] = useState<MediaItem[]>([
    {
      id: 'default-cover',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuCfX9L3XMXwbyx-3xt7_xIG01gsPmoROSGT9wIDStPdNJQK0ZTkGVtC7hzQatoWsrzhGeEs_PbmGwEAU_wBGAIxbMH6rQJy2SeTZlmi_x3DN4TOzgnt6yCW9ITuf7O_WLkEzTf7DhsB2-CQZimJY8FsR0H00Cj3w53859VbGZPDPtiuMwIQRyzUXOofRgTbG8_B4UJAVNNYI4Utz8gnTo3m4_sgcs70QwEh_bzkC-_drFgKsADPUta3GJ03g8KAhLPRj-LqWkpso',
      isCover: true,
      designType: 'general'
    }
  ]);
  const [successDetails, setSuccessDetails] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // Handle local image file uploads and base64 preview mapping
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file, idx) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaList(prev => [
          ...prev.filter(item => item.id !== 'default-cover'), // Remove placeholder if exists
          {
            id: `uploaded-${Date.now()}-${idx}`,
            src: reader.result as string,
            isCover: prev.filter(i => i.id !== 'default-cover').length === 0 && idx === 0,
            file: file,
            designType: 'general'
          }
        ]);
      };
      reader.readAsDataURL(file);
    });

    // Clear input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Trigger click on hidden native file selector
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Remove thumbnail item from preview strip
  const handleRemoveMedia = (id: string) => {
    setMediaList(prev => {
      const filtered = prev.filter(item => item.id !== id);
      // If we deleted the cover image, assign the first remaining image as cover
      if (filtered.length > 0 && !filtered.some(i => i.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  // Make an image the featured cover
  const handleSetCover = (id: string) => {
    setMediaList(prev => prev.map(item => ({
      ...item,
      isCover: item.id === id
    })));
  };

  const openDatePicker = (e: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    try {
      input.showPicker();
    } catch {
      input.focus();
    }
  };

  const handlePublish = async () => {
    if (!eventDate) {
      alert("Please select an event date.");
      return;
    }
    try {
      const { decoratorAPI } = await import('@/lib/api');
      const formData = new FormData();
      formData.append("title", projectTitle);
      formData.append("eventType", eventType);
      formData.append("eventDate", eventDate);
      formData.append("description", description);
      formData.append("venue", venue);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("culturalStyle", culturalStyle);
      formData.append("isFeatured", String(isFeatured));
      formData.append("isPrivate", String(isPrivate));
      
      const activeServices = Object.entries(services)
        .filter(([_, isActive]) => isActive)
        .map(([key]) => key);
      formData.append("servicesProvided", JSON.stringify(activeServices));
      
      // Find which file is the cover
      const coverItem = mediaList.find(m => m.isCover) || mediaList[0];
      if (coverItem && coverItem.file) {
        formData.append("coverImageName", coverItem.file.name);
      }

      const designTypes: string[] = [];
      mediaList.forEach(item => {
        if (item.file) {
          formData.append("media", item.file);
          designTypes.push(item.designType || 'general');
        }
      });
      formData.append("designTypes", JSON.stringify(designTypes));

      const res = await decoratorAPI.createPortfolioItem(formData);
      if (res.ok) {
        setSuccessDetails(`Success! "${projectTitle || 'Untitled Masterpiece'}" has been published to your elite portfolio.`);
      } else {
        setErrorDetails(res.data?.message || "Failed to communicate with the server. Please check your connection.");
      }
    } catch (e: any) {
      console.error(e);
      setErrorDetails("Failed to publish portfolio. Ensure the backend is running and the route is correct.");
    }
  };

  const handleContinue = () => {
    setSuccessDetails(null);
    router.push('/decorator/portfolio');
  };

  const handleCancel = () => {
    router.push('/decorator/portfolio');
  };

  return (
    <div className="flex-grow overflow-y-auto custom-scrollbar bg-[#FDF9F1] flex flex-col justify-between">
      {/* MAIN CONTAINER */}
      <div>
        {/* HEADER ACTION BAR */}
        <header className="sticky top-0 z-10 flex flex-col md:flex-row justify-between items-start md:items-center px-6 sm:px-8 py-5 bg-[#FDF9F1]/95 backdrop-blur-md border-b border-[#E0D8C3] gap-4">
          <div>
            <nav className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">
              <span onClick={handleCancel} className="hover:text-[#7C6A2E] cursor-pointer transition-colors">Portfolio</span>
              <ChevronRight size={12} className="text-gray-300" />
              <span className="text-[#7C6A2E]">Upload New Work</span>
            </nav>
            <h2 className="text-3xl font-serif text-gray-900 font-bold tracking-tight italic">
              Create Portfolio Masterpiece
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
                <Sparkles size={18} className="text-[#B08D2C]" />
                Visual Narrative
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
                Upload your high-resolution event imagery. The primary image will define the first impression of this project.
              </p>

              <div className="pt-6 border-t border-[#E0D8C3] space-y-5">
                <h4 className="text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase">
                  Gallery Excellence Tips
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Maximize size={16} className="text-[#B08D2C] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-gray-800 block text-xs uppercase tracking-wide">High Resolution</span>
                      <span className="text-[10px] text-gray-400 font-semibold leading-normal">Submit 300 DPI assets for the most crisp digital display.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sun size={16} className="text-[#B08D2C] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-gray-800 block text-xs uppercase tracking-wide">Golden Hour Glow</span>
                      <span className="text-[10px] text-gray-400 font-semibold leading-normal">Natural lighting highlights the intricate textures of our decor.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Layers size={16} className="text-[#B08D2C] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-gray-800 block text-xs uppercase tracking-wide">Cinematic Framing</span>
                      <span className="text-[10px] text-gray-400 font-semibold leading-normal">Widescreen compositions best showcase grand venue scale.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              {/* Native hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="hidden"
              />

              {/* Dashed Dropzone Box */}
              <div
                onClick={triggerFileSelect}
                className="relative group cursor-pointer h-[320px] sm:h-[380px] bg-white border-2 border-dashed border-[#E0D8C3] hover:border-[#B08D2C] transition-all flex flex-col items-center justify-center overflow-hidden"
              >
                {/* Background Decor Layer */}
                <img
                  alt="Background Wedding Decor"
                  className="absolute inset-0 w-full h-full object-cover opacity-5 group-hover:opacity-10 transition-opacity"
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80"
                />

                {/* Overlay upload triggers */}
                <div className="relative z-10 flex flex-col items-center text-center px-6">
                  <UploadCloud size={48} className="text-[#B08D2C] mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-xl font-serif font-bold text-[#7C6A2E] mb-2">
                    Drag &amp; Drop Masterpieces
                  </span>
                  <p className="text-xs text-gray-400 font-semibold max-w-[400px] leading-relaxed mb-6">
                    Maximum file size: 50MB. Recommended resolution: 2400 x 1600px for full-bleed display.
                  </p>
                  <button className="px-5 py-2.5 bg-white border border-[#E0D8C3] group-hover:border-[#B08D2C] text-[#7C6A2E] font-bold text-[10px] tracking-widest uppercase transition-colors">
                    Select Files
                  </button>
                </div>
              </div>

              {/* Media Preview Strip */}
              <div className="flex flex-wrap gap-4 pt-2">
                {mediaList.map((item) => (
                  <div
                    key={item.id}
                    className={`w-32 flex-shrink-0 bg-white border ${item.isCover ? 'border-[#B08D2C]' : 'border-[#E0D8C3]'
                      } relative group flex flex-col shadow-sm`}
                  >
                    <div className="h-24 w-full relative overflow-hidden">
                      <img
                        className="w-full h-full object-cover"
                        src={item.src}
                        alt="Thumbnail upload preview"
                      />

                      {/* Delete action overlay */}
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
                        <div className="absolute top-1 left-1 bg-[#B08D2C] text-white text-[8px] px-1.5 py-0.5 font-bold uppercase tracking-wider shadow-sm">
                          Cover
                        </div>
                      )}
                    </div>
                    
                    <select
                      value={item.designType || 'general'}
                      onChange={(e) => {
                        setMediaList(prev => prev.map(m => m.id === item.id ? { ...m, designType: e.target.value as any } : m))
                      }}
                      className="w-full h-7 text-[9px] bg-[#FAF6EE] text-[#7C6A2E] font-bold border-t border-[#E0D8C3] outline-none px-1 uppercase tracking-wider cursor-pointer text-center"
                    >
                      <option value="general">General</option>
                      <option value="stage">Stage</option>
                      <option value="hall">Hall</option>
                      <option value="entrance">Entrance</option>
                    </select>
                  </div>
                ))}

                {/* Quick Add Square */}
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
                <Plus size={18} className="text-[#B08D2C]" />
                Project Identity
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Define the soul of the event. Use a title that evokes the theme and emotional resonance of your design.
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
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. The Golden Orchid Gala"
                  className="w-full bg-white border border-[#E0D8C3] p-4 text-sm font-semibold text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#B08D2C]"
                />
              </div>

              {/* Event Type & Date of Event (Stacked on mobile, row on tablet/desktop) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                    Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-white border border-[#E0D8C3] p-4 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#B08D2C] cursor-pointer"
                  >
                    <option>Grand Wedding</option>
                    <option>Corporate Gala</option>
                    <option>Intimate Reception</option>
                    <option>Cultural Celebration</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="decorator-event-date" className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                    Date of Event
                  </label>
                  <input
                    id="decorator-event-date"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    onClick={openDatePicker}
                    onFocus={openDatePicker}
                    className="w-full bg-white border border-[#E0D8C3] p-4 pr-10 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#B08D2C] cursor-pointer min-h-[3rem] relative z-[1] [color-scheme:light] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-90 [&::-webkit-calendar-picker-indicator]:scale-125"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                    Cultural Style
                  </label>
                  <select
                    value={culturalStyle}
                    onChange={(e) => setCulturalStyle(e.target.value)}
                    className="w-full bg-white border border-[#E0D8C3] p-4 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#B08D2C] cursor-pointer"
                  >
                    <option value="Western / Modern">Western / Modern</option>
                    <option value="Sinhala Traditional">Sinhala Traditional</option>
                    <option value="Tamil Traditional">Tamil Traditional</option>
                    <option value="Muslim Traditional">Muslim Traditional</option>
                    <option value="Mixed / Fusion">Mixed / Fusion</option>
                  </select>
                </div>
              </div>

              {/* Narrative Description */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                  Narrative Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the inspiration, the client's vision, and how your team brought the dream to life..."
                  rows={5}
                  className="w-full bg-white border border-[#E0D8C3] p-4 text-sm font-semibold text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#B08D2C] leading-relaxed resize-none"
                />
              </div>
            </div>
          </section>

          {/* SECTION 3: METADATA & PRICING */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-[#E0D8C3] pt-12">
            <div className="lg:col-span-4">
              <h3 className="text-lg font-serif font-bold text-[#7C6A2E] mb-2 flex items-center gap-2">
                <Sparkles size={18} className="text-[#B08D2C]" />
                Investment &amp; Pricing
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Specify the project price to help clients understand your package tiers.
              </p>
            </div>

            <div className="lg:col-span-8 space-y-6">
              {/* Project Price */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                  Project Price (LKR)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B08D2C] font-bold">
                    LKR
                  </span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full bg-white border border-[#E0D8C3] p-4 pl-14 text-sm font-semibold text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#B08D2C]"
                  />
                </div>
              </div>
            </div>
          </section>
          </section>
        </div>
      </div>

      {/* Premium Success Modal */}
      {successDetails && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-[#FAF6EE] border border-[#E0D8C3] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Check size={32} className="text-[#7C6A2E]" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#7C6A2E] mb-2 tracking-wide">Published</h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              {successDetails}
            </p>
            <button 
              onClick={handleContinue}
              className="w-full bg-[#7C6A2E] hover:bg-[#5E4F20] text-white px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
            >
              Continue to Portfolio
            </button>
          </div>
        </div>
      )}

      {/* Premium Error Modal */}
      {errorDetails && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-[#FAF6EE] border border-red-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Info size={32} className="text-red-500" />
            </div>
            <h3 className="text-xl font-serif font-bold text-red-600 mb-2 tracking-wide">Upload Failed</h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              {errorDetails}
            </p>
            <button 
              onClick={() => setErrorDetails(null)}
              className="w-full bg-[#EBE5D9] hover:bg-[#E0D8C3] text-gray-700 px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default UploadNewWorkMain;

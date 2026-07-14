"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Plus, Info, Check, UploadCloud, EyeOff, MapPin, Sparkles, Maximize, Sun, Layers } from 'lucide-react';

interface EditPortfolioModalProps {
  item: any;
  onClose: () => void;
  onSuccess: () => void;
}

interface MediaItem {
  id: string;
  src: string;
  isCover: boolean;
  file?: File;
  isExisting?: boolean; // True if it's already on the server
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const EditPortfolioModal = ({ item, onClose, onSuccess }: EditPortfolioModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State variables pre-filled
  const [projectTitle, setProjectTitle] = useState(item.title || '');
  const [eventType, setEventType] = useState(item.eventType || 'Grand Wedding');
  const [eventDate, setEventDate] = useState(
    item.eventDate ? new Date(item.eventDate).toISOString().split('T')[0] : ''
  );
  const [description, setDescription] = useState(item.description || '');
  const [venue, setVenue] = useState(item.venue || '');
  const [price, setPrice] = useState(item.price ? String(item.price) : '');
  const [category, setCategory] = useState(item.category || 'installations');
  const [culturalStyle, setCulturalStyle] = useState(item.culturalStyle || 'Western / Modern');

  const [services, setServices] = useState({
    floralArt: item.servicesProvided?.includes('floralArt') || false,
    lightingDesign: item.servicesProvided?.includes('lightingDesign') || false,
    stageConcept: item.servicesProvided?.includes('stageConcept') || false,
    tableScapes: item.servicesProvided?.includes('tableScapes') || false,
    entranceDecor: item.servicesProvided?.includes('entranceDecor') || false
  });

  const [isFeatured, setIsFeatured] = useState(item.isFeatured || false);
  const [isPrivate, setIsPrivate] = useState(item.isPrivate || false);

  // Map existing media to MediaItem format
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [successDetails, setSuccessDetails] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item.media && item.media.length > 0) {
      setMediaList(item.media.map((m: any, index: number) => ({
        id: m._id || `existing-${index}`,
        src: m.url.startsWith("http") ? m.url : `${API_URL}${m.url}`,
        isCover: m.isCover || false,
        isExisting: true
      })));
    }
  }, [item]);

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
            isCover: prev.length === 0,
            file: file,
            isExisting: false
          }
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveMedia = (id: string) => {
    setMediaList(prev => {
      const filtered = prev.filter(m => m.id !== id);
      if (filtered.length > 0 && !filtered.some(i => i.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  const handleSetCover = (id: string) => {
    setMediaList(prev => prev.map(m => ({
      ...m,
      isCover: m.id === id
    })));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
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
      
      const coverItem = mediaList.find(m => m.isCover) || mediaList[0];
      if (coverItem && coverItem.file) {
        formData.append("coverImageName", coverItem.file.name);
      } else if (coverItem && coverItem.isExisting) {
        // If an existing image is still the cover, we might need a way to tell the backend.
        // For now, if no new files, the backend doesn't overwrite images.
      }

      // Append only NEW files, and send existing URLs
      mediaList.forEach(m => {
        if (m.file) {
          formData.append("media", m.file);
        } else if (m.isExisting) {
          // Pass the relative URL to backend
          formData.append("existingMedia", m.src.replace(API_URL, ""));
        }
      });

      const res = await decoratorAPI.updatePortfolioItem(item._id, formData);
      if (res.ok) {
        setSuccessDetails("Masterpiece updated successfully!");
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setErrorDetails(res.data?.message || "Failed to update item.");
      }
    } catch (e: any) {
      setErrorDetails("Failed to communicate with server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in">
      <div className="bg-[#FDF9F1] w-full max-w-5xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl relative flex flex-col">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-[#FDF9F1] border-b border-[#E0D8C3] px-8 py-5 flex justify-between items-center shadow-sm">
          <h2 className="text-2xl font-serif font-bold text-gray-900 italic">Edit Masterpiece</h2>
          <div className="flex gap-4">
            <button onClick={onClose} className="px-6 py-2 border border-[#7C6A2E] text-[#7C6A2E] text-[10px] font-bold uppercase tracking-widest hover:bg-[#FAF6EE]">
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#B08D2C] hover:bg-[#9B7A20] text-white text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="p-8 space-y-12">
          {/* MEDIA SECTION */}
          <section className="space-y-6">
            <h3 className="text-lg font-serif font-bold text-[#7C6A2E] flex items-center gap-2 border-b border-[#E0D8C3] pb-2">
              <Sparkles size={18} /> Edit Visual Narrative
            </h3>
            
            <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" />
            
            <div className="flex flex-wrap gap-4 pt-2">
              {mediaList.map((m) => (
                <div key={m.id} className={`w-32 h-32 flex-shrink-0 bg-white border ${m.isCover ? 'border-[#B08D2C] ring-2 ring-[#B08D2C]/30' : 'border-[#E0D8C3]'} relative group overflow-hidden`}>
                  <img className="w-full h-full object-cover" src={m.src} alt="preview" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                    <button onClick={() => handleRemoveMedia(m.id)} className="p-1.5 bg-[#93000a] text-white rounded-full"><Trash2 size={12} /></button>
                    {!m.isCover && (
                      <button onClick={() => handleSetCover(m.id)} className="p-1 text-[8px] bg-[#7C6A2E] text-white uppercase px-2 font-bold">Cover</button>
                    )}
                  </div>
                  {m.isCover && <div className="absolute bottom-1 right-1 bg-[#B08D2C] text-white text-[8px] px-1.5 font-bold uppercase">Cover</div>}
                  {m.isExisting && <div className="absolute top-1 left-1 bg-black/60 text-white text-[8px] px-1 font-bold">Existing</div>}
                </div>
              ))}
              <div onClick={triggerFileSelect} className="w-32 h-32 flex-shrink-0 bg-white border-2 border-dashed border-[#E0D8C3] hover:border-[#B08D2C] flex items-center justify-center cursor-pointer transition-colors text-gray-400 hover:text-[#B08D2C]">
                <Plus size={24} />
              </div>
            </div>
            <p className="text-xs text-gray-400 italic">Note: Uploading new images will replace your existing gallery if you press Save.</p>
          </section>

          {/* TEXT DETAILS SECTION */}
          <section className="space-y-6">
            <h3 className="text-lg font-serif font-bold text-[#7C6A2E] flex items-center gap-2 border-b border-[#E0D8C3] pb-2">
              <MapPin size={18} /> Edit Project Details
            </h3>
            
            <div className="space-y-4">
              <input type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="Project Title" className="w-full border border-[#E0D8C3] p-4 text-sm font-semibold focus:outline-none focus:border-[#B08D2C]" />
              
              <div className="grid grid-cols-2 gap-4">
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-[#E0D8C3] p-4 text-sm font-semibold focus:outline-none focus:border-[#B08D2C] cursor-pointer bg-white">
                  <option value="tablescapes">GRAND TABLE-SCAPES</option>
                  <option value="installations">FLORAL INSTALLATIONS</option>
                  <option value="lighting">LIGHTING DESIGN</option>
                  <option value="stages">STAGE SETUPS</option>
                </select>
                <div className="flex gap-4">
                  <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Venue" className="w-full border border-[#E0D8C3] p-4 text-sm font-semibold focus:outline-none focus:border-[#B08D2C]" />
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (LKR)" className="w-full border border-[#E0D8C3] p-4 text-sm font-semibold focus:outline-none focus:border-[#B08D2C]" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full border border-[#E0D8C3] p-4 text-sm font-semibold focus:outline-none focus:border-[#B08D2C]" />
                <input type="text" value={eventType} onChange={(e) => setEventType(e.target.value)} placeholder="Event Type (e.g. Grand Wedding)" className="w-full border border-[#E0D8C3] p-4 text-sm font-semibold focus:outline-none focus:border-[#B08D2C]" />
              </div>
              
              <select value={culturalStyle} onChange={(e) => setCulturalStyle(e.target.value)} className="w-full border border-[#E0D8C3] p-4 text-sm font-semibold focus:outline-none focus:border-[#B08D2C] cursor-pointer bg-white">
                <option value="Western / Modern">Western / Modern (Cultural Style)</option>
                <option value="Sinhala Traditional">Sinhala Traditional</option>
                <option value="Tamil Traditional">Tamil Traditional</option>
                <option value="Muslim Traditional">Muslim Traditional</option>
                <option value="Mixed / Fusion">Mixed / Fusion</option>
              </select>
              
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={4} className="w-full border border-[#E0D8C3] p-4 text-sm font-semibold focus:outline-none focus:border-[#B08D2C] resize-none" />

              <div className="border-t border-[#E0D8C3] pt-6 mt-6">
                <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Services Provided</h4>
                <div className="flex flex-wrap gap-4 mb-6">
                  {Object.entries({
                    floralArt: 'Floral Art',
                    lightingDesign: 'Lighting Design',
                    stageConcept: 'Stage Concept',
                    tableScapes: 'Table Scapes',
                    entranceDecor: 'Entrance Decor'
                  }).map(([key, label]) => (
                    <label key={key} className="flex items-center space-x-2 cursor-pointer bg-white border border-[#E0D8C3] px-3 py-2 text-xs font-semibold text-gray-700 hover:border-[#B08D2C] transition-colors">
                      <input 
                        type="checkbox" 
                        checked={services[key as keyof typeof services]} 
                        onChange={(e) => setServices(prev => ({ ...prev, [key]: e.target.checked }))} 
                        className="accent-[#B08D2C] w-3 h-3 cursor-pointer" 
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>

                <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Configuration & Visibility</h4>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="accent-[#B08D2C] w-4 h-4 cursor-pointer" />
                    <span className="text-sm font-semibold text-gray-700">Feature this Masterpiece</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} className="accent-[#B08D2C] w-4 h-4 cursor-pointer" />
                    <span className="text-sm font-semibold text-gray-700">Mark as Private</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Success/Error Overlays */}
      {successDetails && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60">
          <div className="bg-[#FDF9F1] p-8 text-center border border-[#E0D8C3]">
            <Check size={32} className="text-[#7C6A2E] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#7C6A2E]">{successDetails}</h3>
          </div>
        </div>
      )}
      {errorDetails && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60">
          <div className="bg-[#FDF9F1] p-8 text-center border border-red-200">
            <Info size={32} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-600 mb-4">{errorDetails}</h3>
            <button onClick={() => setErrorDetails(null)} className="px-6 py-2 bg-gray-200 uppercase text-xs font-bold">Dismiss</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPortfolioModal;

"use client";

import React, { useState } from "react";
import { X, CheckCircle2, AlertCircle, Loader2, Package, Camera, Video, Film, Headphones, Box } from "lucide-react";
import { videographerAPI } from "@/lib/api";

interface AddPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: (newPkg: any) => void;
  existingPackage?: any;
  isViewOnly?: boolean;
  onEditClick?: () => void;
}

export default function AddPackageModal({ isOpen, onClose, onSubmitSuccess, existingPackage, isViewOnly, onEditClick }: AddPackageModalProps) {
  // Section 1
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [eventTypes, setEventTypes] = useState<string[]>([]);

  // Section 2
  const [coverageDuration, setCoverageDuration] = useState("4 Hours");
  const [customHours, setCustomHours] = useState("");
  const [videographers, setVideographers] = useState(2);
  const [assistants, setAssistants] = useState(1);

  // Section 3 & 4
  const [coverageChecklist, setCoverageChecklist] = useState<string[]>([]);
  const [videoServices, setVideoServices] = useState<string[]>([]);

  // Section 5
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [highlightDuration, setHighlightDuration] = useState("");
  const [numberOfReels, setNumberOfReels] = useState("");

  // Section 6
  const [videoQuality, setVideoQuality] = useState<string[]>([]);
  const [cameraSetup, setCameraSetup] = useState<string[]>([]);
  const [audioSetup, setAudioSetup] = useState<string[]>([]);

  // Price
  const [price, setPrice] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (existingPackage) {
      setName(existingPackage.name || "");
      setDescription(existingPackage.description || "");
      setEventTypes(existingPackage.eventTypes || []);
      setCoverageDuration(existingPackage.coverageDuration || "4 Hours");
      setCustomHours(existingPackage.customHours || "");
      setVideographers(existingPackage.teamIncluded?.videographers || 2);
      setAssistants(existingPackage.teamIncluded?.assistants || 1);
      setCoverageChecklist(existingPackage.coverageChecklist || []);
      setVideoServices(existingPackage.videoServices || []);
      setDeliverables(existingPackage.deliverables || []);
      setHighlightDuration(existingPackage.highlightDuration || "");
      setNumberOfReels(existingPackage.numberOfReels || "");
      setVideoQuality(existingPackage.videoQuality || []);
      setCameraSetup(existingPackage.cameraSetup || []);
      setAudioSetup(existingPackage.audioSetup || []);
      setPrice(existingPackage.price?.toString() || "");
    } else {
      setName("");
      setDescription("");
      setEventTypes([]);
      setCoverageDuration("4 Hours");
      setCustomHours("");
      setVideographers(2);
      setAssistants(1);
      setCoverageChecklist([]);
      setVideoServices([]);
      setDeliverables([]);
      setHighlightDuration("");
      setNumberOfReels("");
      setVideoQuality([]);
      setCameraSetup([]);
      setAudioSetup([]);
      setPrice("");
    }
  }, [existingPackage, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !description.trim() || !price) {
      setErrorMsg("Please fill out all required fields (Name, Description, Price).");
      return;
    }
    if (eventTypes.length === 0) {
      setErrorMsg("Please select at least one suitable event type.");
      return;
    }
    if (coverageDuration === "Custom" && !customHours) {
      setErrorMsg("Please specify the number of custom hours.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        description,
        eventTypes,
        coverageDuration,
        customHours: coverageDuration === "Custom" ? Number(customHours) : undefined,
        teamIncluded: {
          videographers,
          assistants,
        },
        coverageChecklist,
        videoServices,
        deliverables,
        highlightDuration: deliverables.includes("Highlight Film") ? highlightDuration : undefined,
        numberOfReels: deliverables.includes("Social Media Reels") ? Number(numberOfReels) : undefined,
        videoQuality,
        cameraSetup,
        audioSetup,
        price: Number(price),
      };

      let res;
      if (existingPackage) {
        res = await videographerAPI.updatePackage(existingPackage._id, payload);
      } else {
        res = await videographerAPI.createPackage(payload);
      }

      if (res.ok) {
        onSubmitSuccess?.(res.data?.data);
      } else {
        setErrorMsg(res.data?.message || "Failed to save package.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An error occurred while saving the package.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, array: string[], item: string) => {
    if (array.includes(item)) setter(array.filter(i => i !== item));
    else setter([...array, item]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#FDFBF7] dark:bg-[#121212] border border-[#E8DFC9] dark:border-[#C9A84C]/30 rounded-[28px] shadow-2xl flex flex-col overflow-hidden my-auto">
        <header className="px-6 py-5 bg-[#FDFBF7]/95 dark:bg-[#121212]/95 backdrop-blur-md border-b border-[#E8DFC9] dark:border-white/10 flex items-center justify-between z-20 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#C9A84C] uppercase mb-1">
              <Package className="w-3.5 h-3.5" />
              <span>PACKAGE MANAGEMENT</span>
            </div>
            <h2 className="text-xl font-bold font-serif text-gray-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-[#D4AF37]" />
              {isViewOnly ? "View Package" : existingPackage ? "Edit Package" : "Create New Package"}
            </h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </header>

        {errorMsg && (
          <div className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 rounded-2xl flex items-center gap-3 text-red-700 dark:text-red-300 text-xs font-medium">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form id="package-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          <fieldset disabled={isViewOnly} className={`space-y-8 ${isViewOnly ? 'opacity-90' : ''}`}>
          
          {/* Section 1 */}
          <section className="bg-white dark:bg-[#181818] p-6 rounded-2xl border border-gray-200/80 dark:border-white/5 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#A67C52] border-b border-gray-100 dark:border-zinc-800 pb-3">Section 1 — Package Information</h3>
            
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">Package Name *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Cinematic Wedding Premium" required className="w-full px-4 py-3 bg-[#FDFBF7] dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold focus:border-[#D4AF37] outline-none" />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <div className="flex justify-between"><label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">Short Description *</label><span className="text-[10px] text-gray-400">{description.length}/500</span></div>
                <textarea value={description} onChange={e => setDescription(e.target.value.slice(0, 500))} rows={3} placeholder="Briefly describe what makes this package special..." required className="w-full p-4 bg-[#FDFBF7] dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs focus:border-[#D4AF37] outline-none resize-none" />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Suitable Event Types *</label>
                <div className="flex flex-wrap gap-2">
                  {["Wedding", "Engagement", "Birthday", "Anniversary", "Corporate", "Conference", "Graduation", "Baby Shower", "Homecoming", "Other"].map(opt => (
                    <label key={opt} className={`px-4 py-2 rounded-full border text-xs font-semibold cursor-pointer transition-colors ${eventTypes.includes(opt) ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]' : 'bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:border-[#D4AF37]/50'}`}>
                      <input type="checkbox" className="hidden" checked={eventTypes.includes(opt)} onChange={() => toggleArrayItem(setEventTypes, eventTypes, opt)} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-white dark:bg-[#181818] p-6 rounded-2xl border border-gray-200/80 dark:border-white/5 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#A67C52] border-b border-gray-100 dark:border-zinc-800 pb-3">Section 2 — Coverage & Team</h3>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">Coverage Duration *</label>
                <div className="grid grid-cols-2 gap-2">
                  {["4 Hours", "6 Hours", "8 Hours", "10 Hours", "12 Hours", "Full Day", "Custom"].map(dur => (
                    <label key={dur} className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                      <input type="radio" name="coverageDuration" checked={coverageDuration === dur} onChange={() => setCoverageDuration(dur)} className="w-3.5 h-3.5 text-[#D4AF37] focus:ring-[#D4AF37]" />
                      {dur}
                    </label>
                  ))}
                </div>
                {coverageDuration === "Custom" && (
                  <div className="pt-2">
                    <input type="number" value={customHours} onChange={e => setCustomHours(e.target.value)} placeholder="Number of hours" className="w-full px-4 py-2 bg-[#FDFBF7] dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-xs font-bold focus:border-[#D4AF37] outline-none" />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">Team Included *</label>
                <div className="flex items-center justify-between bg-[#FDFBF7] dark:bg-zinc-900 p-3 rounded-lg border border-gray-200 dark:border-zinc-800">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Videographers</span>
                  <input type="number" min="0" value={videographers} onChange={e => setVideographers(Number(e.target.value))} className="w-16 px-2 py-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded text-center text-xs outline-none focus:border-[#D4AF37]" />
                </div>
                <div className="flex items-center justify-between bg-[#FDFBF7] dark:bg-zinc-900 p-3 rounded-lg border border-gray-200 dark:border-zinc-800">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Assistants</span>
                  <input type="number" min="0" value={assistants} onChange={e => setAssistants(Number(e.target.value))} className="w-16 px-2 py-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded text-center text-xs outline-none focus:border-[#D4AF37]" />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 & 4 */}
          <section className="bg-white dark:bg-[#181818] p-6 rounded-2xl border border-gray-200/80 dark:border-white/5 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#A67C52] border-b border-gray-100 dark:border-zinc-800 pb-3">Section 3 & 4 — Coverage & Services Included</h3>
            
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2"><Camera className="w-3 h-3"/> What is covered?</label>
                <div className="space-y-2.5">
                  {["Getting Ready", "Pre-shoot / Couple Shoot", "Ceremony", "Reception", "Full Event", "Outdoor Coverage", "Candid Moments", "Guest Interviews", "Speeches / Stage Events"].map(opt => (
                    <label key={opt} className="flex items-center gap-2.5 text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                      <input type="checkbox" checked={coverageChecklist.includes(opt)} onChange={() => toggleArrayItem(setCoverageChecklist, coverageChecklist, opt)} className="w-4 h-4 text-[#D4AF37] focus:ring-[#D4AF37] rounded border-gray-300" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2"><Video className="w-3 h-3"/> Video Services</label>
                <div className="space-y-2.5">
                  {["Cinematic Videography", "Traditional Videography", "Candid Videography", "Drone Videography", "Multi-Camera Coverage", "Live Streaming", "Same-Day Edit"].map(opt => (
                    <label key={opt} className="flex items-center gap-2.5 text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                      <input type="checkbox" checked={videoServices.includes(opt)} onChange={() => toggleArrayItem(setVideoServices, videoServices, opt)} className="w-4 h-4 text-[#D4AF37] focus:ring-[#D4AF37] rounded border-gray-300" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-white dark:bg-[#181818] p-6 rounded-2xl border border-gray-200/80 dark:border-white/5 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#A67C52] border-b border-gray-100 dark:border-zinc-800 pb-3">Section 5 — Deliverables</h3>
            
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">What will the customer receive?</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {["Full Event Video", "Highlight Film", "Cinematic Trailer", "Teaser", "Social Media Reels", "Raw Footage", "Ceremony Video", "Reception Video", "Drone Footage", "Same-Day Edit"].map(opt => (
                <label key={opt} className="flex items-center gap-2.5 text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer bg-[#FDFBF7] dark:bg-zinc-900 p-2.5 rounded-lg border border-gray-100 dark:border-zinc-800 hover:border-[#D4AF37]/50 transition-colors">
                  <input type="checkbox" checked={deliverables.includes(opt)} onChange={() => toggleArrayItem(setDeliverables, deliverables, opt)} className="w-4 h-4 text-[#D4AF37] focus:ring-[#D4AF37] rounded border-gray-300" />
                  {opt}
                </label>
              ))}
            </div>

            <div className="flex gap-4 pt-2">
              {deliverables.includes("Highlight Film") && (
                <div className="flex-1 space-y-1.5 animate-fadeIn">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#A67C52]">Highlight Duration</label>
                  <input type="text" value={highlightDuration} onChange={e => setHighlightDuration(e.target.value)} placeholder="e.g. 5–7 minutes" className="w-full px-3 py-2 bg-amber-50/50 dark:bg-[#C9A84C]/10 border border-[#D4AF37]/30 rounded-lg text-xs outline-none focus:border-[#D4AF37]" />
                </div>
              )}
              {deliverables.includes("Social Media Reels") && (
                <div className="flex-1 space-y-1.5 animate-fadeIn">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#A67C52]">Number of Reels</label>
                  <input type="number" value={numberOfReels} onChange={e => setNumberOfReels(e.target.value)} placeholder="e.g. 3" className="w-full px-3 py-2 bg-amber-50/50 dark:bg-[#C9A84C]/10 border border-[#D4AF37]/30 rounded-lg text-xs outline-none focus:border-[#D4AF37]" />
                </div>
              )}
            </div>
          </section>

          {/* Section 6 & Price */}
          <section className="bg-white dark:bg-[#181818] p-6 rounded-2xl border border-gray-200/80 dark:border-white/5 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#A67C52] border-b border-gray-100 dark:border-zinc-800 pb-3">Section 6 — Quality, Production & Price</h3>
            
            <div className="grid sm:grid-cols-3 gap-6 mb-6">
              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5"><Film className="w-3 h-3"/> Video Quality</label>
                {["Full HD (1080p)", "4K"].map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"><input type="checkbox" checked={videoQuality.includes(opt)} onChange={() => toggleArrayItem(setVideoQuality, videoQuality, opt)} className="w-3.5 h-3.5 text-[#D4AF37] focus:ring-[#D4AF37] rounded border-gray-300" />{opt}</label>
                ))}
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5"><Camera className="w-3 h-3"/> Camera Setup</label>
                {["Single Camera", "Multi-Camera"].map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"><input type="checkbox" checked={cameraSetup.includes(opt)} onChange={() => toggleArrayItem(setCameraSetup, cameraSetup, opt)} className="w-3.5 h-3.5 text-[#D4AF37] focus:ring-[#D4AF37] rounded border-gray-300" />{opt}</label>
                ))}
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5"><Headphones className="w-3 h-3"/> Audio</label>
                {["Professional Audio Recording", "Wireless Microphones", "Direct Sound Recording"].map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"><input type="checkbox" checked={audioSetup.includes(opt)} onChange={() => toggleArrayItem(setAudioSetup, audioSetup, opt)} className="w-3.5 h-3.5 text-[#D4AF37] focus:ring-[#D4AF37] rounded border-gray-300" />{opt}</label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#2C1E14] dark:text-white mb-2">Package Price *</label>
              <div className="relative max-w-sm">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">LKR</span>
                <input type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="140000" required className="w-full pl-14 pr-4 py-3 bg-[#FDFBF7] dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-lg font-bold text-gray-900 dark:text-white outline-none focus:border-[#D4AF37]" />
              </div>
            </div>
          </section>
          </fieldset>
        </form>

        <footer className="px-6 py-4 bg-[#FDFBF7]/95 dark:bg-[#121212]/95 backdrop-blur-md border-t border-[#E8DFC9] dark:border-white/10 flex items-center justify-end gap-3 z-20 shrink-0">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full border border-gray-300 dark:border-zinc-700 transition-colors">
            {isViewOnly ? "Close" : "Cancel"}
          </button>
          {isViewOnly ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                if (onEditClick) onEditClick();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#C9A84C] hover:from-[#C9A84C] hover:to-[#B3933E] text-white text-xs font-bold rounded-full shadow-md transition-all flex justify-center items-center gap-2"
            >
              Edit Package
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#C9A84C] hover:from-[#C9A84C] hover:to-[#B3933E] text-white text-xs font-bold rounded-full shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <>{existingPackage ? "Save Changes" : "Create Package"}</>}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useRef } from "react";
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Film,
  Sparkles,
  MapPin,
  Calendar,
  Trash2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Video,
  FileText
} from "lucide-react";
import { decoratorAPI, videographerAPI, djAPI } from "@/lib/api";

export interface MediaUploadItem {
  id: string;
  url: string;
  name: string;
  sizeFormatted: string;
  file?: File;
  progress: number;
}

export interface AddPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorType: "decorator" | "videographer" | "dj";
  onSubmitSuccess?: (newPortfolio: any) => void;
}

export default function AddPortfolioModal({
  isOpen,
  onClose,
  vendorType,
  onSubmitSuccess,
}: AddPortfolioModalProps) {
  // Form State
  const [portfolioTitle, setPortfolioTitle] = useState("");
  const [eventType, setEventType] = useState("Wedding");
  const [eventDate, setEventDate] = useState("");
  const [category, setCategory] = useState("installations");
  const [culturalStyle, setCulturalStyle] = useState("Western / Modern");
  const [description, setDescription] = useState("");
  const [packagePrice, setPackagePrice] = useState("");
  const [eventLocation, setEventLocation] = useState("EASCC Main Hall");

  // Media State
  const [coverImage, setCoverImage] = useState<MediaUploadItem | null>(null);
  const [portfolioImages, setPortfolioImages] = useState<MediaUploadItem[]>([]);
  const [videos, setVideos] = useState<MediaUploadItem[]>([]);

  // Drag & Drop State
  const [isDragCover, setIsDragCover] = useState(false);
  const [isDragImages, setIsDragImages] = useState(false);
  const [isDragVideos, setIsDragVideos] = useState(false);

  // Submit State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Refs
  const coverInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);
  const videosInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (vendorType === "videographer") {
      setEventType("Wedding Film");
    } else if (vendorType === "dj") {
      setEventType("Wedding Reception");
    } else {
      setEventType("Wedding");
    }
  }, [vendorType, isOpen]);

  if (!isOpen) return null;

  // Format Helper
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Helper to simulate smooth progress
  const processFiles = (
    files: FileList | File[],
    callback: (items: MediaUploadItem[]) => void
  ) => {
    const newItems: MediaUploadItem[] = Array.from(files).map((file, idx) => {
      const url = URL.createObjectURL(file);
      return {
        id: `upload-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
        url,
        name: file.name,
        sizeFormatted: formatFileSize(file.size),
        file,
        progress: 100, // Ready preview
      };
    });
    callback(newItems);
  };

  // Cover Image Handling
  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFiles([e.target.files[0]], (items) => {
        setCoverImage(items[0]);
      });
    }
  };

  const handleCoverDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragCover(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles([e.dataTransfer.files[0]], (items) => {
        setCoverImage(items[0]);
      });
    }
  };

  // Portfolio Images Handling (Allow 3-20)
  const handleImagesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files, (newItems) => {
        setPortfolioImages((prev) => {
          const combined = [...prev, ...newItems];
          return combined.slice(0, 20); // Cap at 20 max
        });
      });
    }
  };

  const handleImagesDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragImages(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files, (newItems) => {
        setPortfolioImages((prev) => {
          const combined = [...prev, ...newItems];
          return combined.slice(0, 20);
        });
      });
    }
  };

  const removeImage = (id: string) => {
    setPortfolioImages((prev) => prev.filter((item) => item.id !== id));
  };

  const moveImage = (index: number, direction: "left" | "right") => {
    setPortfolioImages((prev) => {
      const updated = [...prev];
      const targetIdx = direction === "left" ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= updated.length) return prev;
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      return updated;
    });
  };

  // Video Handling
  const handleVideosSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files, (newItems) => {
        setVideos((prev) => [...prev, ...newItems].slice(0, 3));
      });
    }
  };

  const handleVideosDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragVideos(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files, (newItems) => {
        setVideos((prev) => [...prev, ...newItems].slice(0, 3));
      });
    }
  };

  const removeVideo = (id: string) => {
    setVideos((prev) => prev.filter((item) => item.id !== id));
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (vendorType === "decorator" && !portfolioTitle.trim()) {
      setErrorMsg("Portfolio Title is required for Decorators.");
      return;
    }

    if (!coverImage) {
      setErrorMsg("Please upload a Cover Image thumbnail for your portfolio.");
      return;
    }

    if (portfolioImages.length < 3) {
      setErrorMsg("Please upload at least 3 Portfolio Images (minimum 3 required).");
      return;
    }

    setIsSubmitting(true);

    try {
      let savedData: any = null;

      if (vendorType === "decorator") {
        // Step 1: Create album in MongoDB
        const albumTitle = portfolioTitle.trim();
        const createRes = await decoratorAPI.createAlbum({
          title: albumTitle,
          price: packagePrice ? Number(packagePrice) : 0,
          category,
          culturalStyle,
          eventDate: eventDate || undefined,
          eventType,
          description,
        });
        if (!createRes.ok || !createRes.data?.data?._id) {
          throw new Error(createRes.data?.message || "Failed to create album in database.");
        }

        const albumId = createRes.data.data._id;

        // Step 2: Upload cover image + portfolio photos to Cloudinary & store in MongoDB
        const formData = new FormData();
        if (coverImage.file) {
          formData.append("photos", coverImage.file);
        }
        portfolioImages.forEach((img) => {
          if (img.file) formData.append("photos", img.file);
        });

        const uploadRes = await decoratorAPI.uploadAlbumImages(albumId, formData);
        if (!uploadRes.ok) {
          throw new Error(uploadRes.data?.message || "Failed to upload images to Cloudinary.");
        }

        // Step 3: Publish album in MongoDB
        const updateRes = await decoratorAPI.updateAlbum(albumId, { status: "Published" });
        savedData = updateRes.data?.data || createRes.data?.data;

      } else if (vendorType === "videographer") {
        const formData = new FormData();
        formData.append("title", portfolioTitle || `${eventType} Showcase`);
        formData.append("eventType", eventType);
        formData.append("eventDate", eventDate || new Date().toISOString().substring(0, 10));
        formData.append("venue", eventLocation);
        formData.append("price", packagePrice || "0");
        formData.append("description", description || `${eventType} portfolio showcase.`);
        if (coverImage.file) {
          formData.append("coverImageName", coverImage.file.name);
          formData.append("media", coverImage.file);
        }

        portfolioImages.forEach((img) => {
          if (img.file) formData.append("media", img.file);
        });

        videos.forEach((vid) => {
          if (vid.file) formData.append("media", vid.file);
        });

        const res = await videographerAPI.createPortfolioItem(formData);
        if (!res.ok || !res.data?.success) {
          throw new Error(res.data?.message || "Failed to upload portfolio to Cloudinary & MongoDB.");
        }
        savedData = res.data?.data;

      } else if (vendorType === "dj") {
        const formData = new FormData();
        formData.append("title", portfolioTitle || `${eventType} Performance`);
        formData.append("eventType", eventType);
        formData.append("eventDate", eventDate || new Date().toISOString().substring(0, 10));
        formData.append("venue", eventLocation);
        formData.append("price", packagePrice || "0");
        formData.append("description", description || `${eventType} DJ performance gallery.`);
        if (coverImage.file) {
          formData.append("coverImageName", coverImage.file.name);
          formData.append("media", coverImage.file);
        }

        portfolioImages.forEach((img) => {
          if (img.file) formData.append("media", img.file);
        });

        videos.forEach((vid) => {
          if (vid.file) formData.append("media", vid.file);
        });

        const res = await djAPI.createGalleryItem(formData);
        if (!res.ok || !res.data?.success) {
          throw new Error(res.data?.message || "Failed to upload gallery item to Cloudinary & MongoDB.");
        }
        savedData = res.data?.data;
      }

      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        if (onSubmitSuccess) onSubmitSuccess(savedData);
        onClose();
      }, 1500);

    } catch (err: any) {
      console.error("Save Portfolio Error:", err);
      setErrorMsg(err.message || "Failed to save portfolio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const vendorTag =
    vendorType === "decorator"
      ? "DECORATOR SHOWCASE"
      : vendorType === "videographer"
        ? "VIDEOGRAPHER PORTFOLIO"
        : "DJ PERFORMANCE GALLERY";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#FDFBF7] dark:bg-[#121212] border border-[#E8DFC9] dark:border-[#C9A84C]/30 rounded-[28px] shadow-2xl flex flex-col overflow-hidden my-auto">

        {/* HEADER */}
        <header className="px-6 py-5 bg-[#FDFBF7]/95 dark:bg-[#121212]/95 backdrop-blur-md border-b border-[#E8DFC9] dark:border-white/10 flex items-center justify-between z-20 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#C9A84C] uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{vendorTag}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C1E14] dark:text-white leading-tight">
              Add New Portfolio
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:border-[#D4AF37] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* ERROR BANNER */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 rounded-2xl flex items-center gap-3 text-red-700 dark:text-red-300 text-xs font-medium">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* SUCCESS TOAST */}
        {showSuccessToast && (
          <div className="mx-6 mt-4 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Portfolio saved successfully to showcase!</span>
          </div>
        )}

        {/* FORM BODY */}
        <form id="portfolio-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">

          {/* SECTION 1: EVENT DETAILS */}
          <section className="bg-white dark:bg-[#181818] p-6 rounded-2xl border border-gray-200/80 dark:border-white/5 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 border-b border-gray-100 dark:border-zinc-800 pb-3">
              <FileText className="w-5 h-5 text-[#C9A84C]" />
              <div>
                <h3 className="text-base font-serif font-bold text-gray-900 dark:text-white">
                  Event & Project Information
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Provide key details about this showcase project.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Portfolio Title (ONLY FOR DECORATORS) */}
              {vendorType === "decorator" && (
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A67C52] dark:text-[#C9A84C]">
                    Portfolio Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={portfolioTitle}
                    onChange={(e) => setPortfolioTitle(e.target.value)}
                    placeholder="e.g. Royal Crystal Stage & Grand Floral Decoration"
                    required
                    className="w-full px-4 py-3 bg-[#FDFBF7] dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-gray-800 dark:text-white outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>
              )}

              {/* Event Type */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {vendorType === "decorator" ? "Event Type" : "Category / Event Type"}
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FDFBF7] dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-gray-800 dark:text-white outline-none focus:border-[#D4AF37] cursor-pointer"
                >
                  {vendorType === "videographer" && (
                    <>
                      <option value="Wedding Film">Wedding Film</option>
                      <option value="Engagement Session">Engagement Session</option>
                      <option value="Corporate Event">Corporate Event</option>
                      <option value="Pre-Wedding Shoot">Pre-Wedding Shoot</option>
                      <option value="Event Highlight Reel">Event Highlight Reel</option>
                      <option value="Anniversary Film">Anniversary Film</option>
                      <option value="Cinematic Story">Cinematic Story</option>
                    </>
                  )}
                  {vendorType === "dj" && (
                    <>
                      <option value="Wedding Reception">Wedding Reception</option>
                      <option value="Club Night">Club Night</option>
                      <option value="Corporate Gala">Corporate Gala</option>
                      <option value="Private Party">Private Party</option>
                      <option value="Festival / Arena">Festival / Arena</option>
                      <option value="Birthday Celebration">Birthday Celebration</option>
                    </>
                  )}
                  {vendorType !== "videographer" && vendorType !== "dj" && (
                    <>
                      <option value="Wedding">Wedding</option>
                      <option value="Reception">Reception</option>
                      <option value="Engagement">Engagement</option>
                      <option value="Homecoming">Homecoming</option>
                      <option value="Pre-Wedding Shoot">Pre-Wedding Shoot</option>
                      <option value="Corporate Gala">Corporate Gala</option>
                      <option value="Private Party">Private Party</option>
                      <option value="Anniversary">Anniversary</option>
                    </>
                  )}
                </select>
              </div>





              {/* Cultural Style */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Cultural Style
                </label>
                <select
                  value={culturalStyle}
                  onChange={(e) => setCulturalStyle(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FDFBF7] dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-gray-800 dark:text-white outline-none focus:border-[#D4AF37] cursor-pointer"
                >
                  <option value="Western / Modern">Western / Modern</option>
                  <option value="Sinhala Traditional">Sinhala Traditional</option>
                  <option value="Tamil Traditional">Tamil Traditional</option>
                  <option value="Muslim Traditional">Muslim Traditional</option>
                  <option value="Mixed / Fusion">Mixed / Fusion</option>
                </select>
              </div>

              {/* Package Price */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Package Pricing (LKR)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">LKR</span>
                  <input
                    type="number"
                    value={packagePrice}
                    onChange={(e) => setPackagePrice(e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full pl-12 pr-4 py-3 bg-[#FDFBF7] dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-gray-800 dark:text-white outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="sm:col-span-2 space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Short Description
                  </label>
                  <span className="text-[10px] text-gray-400">
                    {description.length}/500 chars
                  </span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                  rows={3}
                  placeholder="Describe the aesthetic, theme, setup, or highlights of this event..."
                  className="w-full p-4 bg-[#FDFBF7] dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs text-gray-800 dark:text-white outline-none focus:border-[#D4AF37] resize-none leading-relaxed"
                />
              </div>
            </div>
          </section>

          {/* SECTION 2: COVER IMAGE */}
          <section className="bg-white dark:bg-[#181818] p-6 rounded-2xl border border-gray-200/80 dark:border-white/5 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-gray-100 dark:border-zinc-800 pb-3">
              <ImageIcon className="w-5 h-5 text-[#C9A84C]" />
              <div>
                <h3 className="text-base font-serif font-bold text-gray-900 dark:text-white">
                  Cover Image (Main Thumbnail) <span className="text-red-500">*</span>
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Main highlight image displayed on your portfolio card.
                </p>
              </div>
            </div>

            <input
              type="file"
              ref={coverInputRef}
              onChange={handleCoverSelect}
              accept="image/*"
              className="hidden"
            />

            {!coverImage ? (
              <div
                onClick={() => coverInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragCover(true);
                }}
                onDragLeave={() => setIsDragCover(false)}
                onDrop={handleCoverDrop}
                className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${isDragCover
                  ? "border-[#D4AF37] bg-amber-50/50 dark:bg-[#C9A84C]/10"
                  : "border-gray-300 dark:border-zinc-700 bg-[#FDFBF7] dark:bg-zinc-900/50 hover:border-[#D4AF37]"
                  }`}
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-zinc-800 flex items-center justify-center text-[#C9A84C] mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                  Drag & Drop Cover Image here or <span className="text-[#C9A84C] underline">Browse</span>
                </span>
                <span className="text-[10px] text-gray-400 mt-1">
                  Supports JPG, PNG, WEBP up to 10MB
                </span>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-[#FDFBF7] dark:bg-zinc-900 p-4 flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={coverImage.url}
                  alt="Cover Preview"
                  className="w-full sm:w-36 h-28 object-cover rounded-xl shadow-sm"
                />
                <div className="flex-1 w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800 dark:text-white truncate max-w-[200px]">
                      {coverImage.name}
                    </span>
                    <span className="text-[10px] bg-amber-100 dark:bg-[#C9A84C]/20 text-[#C9A84C] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                      Cover Image
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 block">
                    {coverImage.sizeFormatted}
                  </span>

                  {/* Simulated Upload Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#D4AF37] h-full w-full transition-all duration-500"></div>
                  </div>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ready for upload (100%)
                  </span>
                </div>

                <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="flex-1 sm:flex-initial px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 text-[10px] font-bold rounded-lg uppercase tracking-wider"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverImage(null)}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* SECTION 3: PORTFOLIO IMAGES (3-20) */}
          <section className="bg-white dark:bg-[#181818] p-6 rounded-2xl border border-gray-200/80 dark:border-white/5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#C9A84C]" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    Portfolio Gallery Images <span className="text-red-500">*</span>
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Upload 3 to 20 photos showcasing your work details.
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${portfolioImages.length >= 3 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                }`}>
                {portfolioImages.length} / 20 Uploaded (Min 3)
              </span>
            </div>

            <input
              type="file"
              ref={imagesInputRef}
              onChange={handleImagesSelect}
              accept="image/*"
              multiple
              className="hidden"
            />

            {/* Dropzone */}
            <div
              onClick={() => imagesInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragImages(true);
              }}
              onDragLeave={() => setIsDragImages(false)}
              onDrop={handleImagesDrop}
              className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${isDragImages
                ? "border-[#D4AF37] bg-amber-50/50 dark:bg-[#C9A84C]/10"
                : "border-gray-300 dark:border-zinc-700 bg-[#FDFBF7] dark:bg-zinc-900/50 hover:border-[#D4AF37]"
                }`}
            >
              <UploadCloud className="w-7 h-7 text-[#C9A84C] mb-2" />
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                Drag & Drop multiple images here or <span className="text-[#C9A84C] underline">Browse</span>
              </span>
              <span className="text-[10px] text-gray-400 mt-1">
                Select 5 to 20 photos (JPG, PNG, WEBP)
              </span>
            </div>

            {/* Min 5 Warning Notice */}
            {portfolioImages.length > 0 && portfolioImages.length < 5 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 rounded-xl flex items-center gap-2 text-amber-700 dark:text-amber-300 text-[11px]">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                <span>You have added {portfolioImages.length} photo(s). Please add at least {5 - portfolioImages.length} more to meet the 5-photo minimum requirement.</span>
              </div>
            )}

            {/* Images Grid */}
            {portfolioImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                {portfolioImages.map((img, idx) => (
                  <div
                    key={img.id}
                    className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-[#FDFBF7] dark:bg-zinc-900 shadow-xs flex flex-col"
                  >
                    <div className="relative aspect-square w-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        #{idx + 1}
                      </span>
                    </div>

                    {/* Progress & Card Info */}
                    <div className="p-2 space-y-1">
                      <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 truncate block">
                        {img.name}
                      </span>
                      <div className="w-full bg-gray-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#D4AF37] h-full w-full"></div>
                      </div>

                      {/* Reorder & Controls */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveImage(idx, "left")}
                            className="p-1 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 text-gray-600 dark:text-gray-300 rounded disabled:opacity-30"
                            title="Move Left"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === portfolioImages.length - 1}
                            onClick={() => moveImage(idx, "right")}
                            className="p-1 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 text-gray-600 dark:text-gray-300 rounded disabled:opacity-30"
                            title="Move Right"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded"
                          title="Remove Image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SECTION 4: VIDEOS (OPTIONAL) */}
          <section className="bg-white dark:bg-[#181818] p-6 rounded-2xl border border-gray-200/80 dark:border-white/5 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-gray-100 dark:border-zinc-800 pb-3">
              <Film className="w-5 h-5 text-[#C9A84C]" />
              <div>
                <h3 className="text-base font-serif font-bold text-gray-900 dark:text-white">
                  Video Clips (Optional)
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Upload video reels or event highlights (MP4, MOV).
                </p>
              </div>
            </div>

            <input
              type="file"
              ref={videosInputRef}
              onChange={handleVideosSelect}
              accept="video/*"
              multiple
              className="hidden"
            />

            <div
              onClick={() => videosInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragVideos(true);
              }}
              onDragLeave={() => setIsDragVideos(false)}
              onDrop={handleVideosDrop}
              className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${isDragVideos
                ? "border-[#D4AF37] bg-amber-50/50 dark:bg-[#C9A84C]/10"
                : "border-gray-300 dark:border-zinc-700 bg-[#FDFBF7] dark:bg-zinc-900/50 hover:border-[#D4AF37]"
                }`}
            >
              <Video className="w-7 h-7 text-[#C9A84C] mb-2" />
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                Drag & Drop video reels or <span className="text-[#C9A84C] underline">Browse</span>
              </span>
              <span className="text-[10px] text-gray-400 mt-1">
                Supports MP4, MOV up to 100MB
              </span>
            </div>

            {/* Videos List */}
            {videos.length > 0 && (
              <div className="space-y-2 pt-2">
                {videos.map((vid) => (
                  <div
                    key={vid.id}
                    className="p-3 bg-[#FDFBF7] dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-zinc-800 flex items-center justify-center text-[#C9A84C]">
                        <Film className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-800 dark:text-white block truncate max-w-[200px] sm:max-w-[350px]">
                          {vid.name}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {vid.sizeFormatted} &bull; Uploaded
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVideo(vid.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </form>

        {/* STICKY FOOTER */}
        <footer className="px-6 py-4 bg-[#FDFBF7]/95 dark:bg-[#121212]/95 backdrop-blur-md border-t border-[#E8DFC9] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 z-20 shrink-0">
          <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
            Summary:{" "}
            <span className="font-bold text-gray-800 dark:text-white">
              {coverImage ? "1 Cover" : "0 Cover"}
            </span>{" "}
            &bull;{" "}
            <span className="font-bold text-gray-800 dark:text-white">
              {portfolioImages.length} Photos
            </span>{" "}
            &bull;{" "}
            <span className="font-bold text-gray-800 dark:text-white">
              {videos.length} Videos
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full border border-gray-300 dark:border-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="portfolio-form"
              disabled={isSubmitting}
              className="px-8 py-2.5 text-xs font-extrabold uppercase tracking-widest text-white bg-gradient-to-r from-[#D4AF37] to-[#C9A84C] hover:from-[#C9A84C] hover:to-[#B3933E] rounded-full shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Save Portfolio
                </>
              )}
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Trash2, Check, Star, Eye, EyeOff, Sparkles, AlertCircle, Save } from 'lucide-react';
import { decoratorAPI } from '@/lib/api';

const TAG_TAXONOMY = [
  "wedding",
  "birthday",
  "corporate",
  "engagement",
  "modern",
  "traditional",
  "rustic",
  "minimalist",
];

interface AlbumEditorProps {
  albumId: string;
  onBack: () => void;
  onAlbumUpdated: () => void;
}

const AlbumEditor: React.FC<AlbumEditorProps> = ({ albumId, onBack, onAlbumUpdated }) => {
  const [album, setAlbum] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ file: string; success: boolean; error?: string }[]>([]);

  // Matching fields with portfolio upload
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("installations");
  const [price, setPrice] = useState("");
  const [eventType, setEventType] = useState("Grand Wedding");
  const [culturalStyle, setCulturalStyle] = useState("Western / Modern");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchAlbumDetails();
  }, [albumId]);

  const fetchAlbumDetails = async () => {
    setIsLoading(true);
    try {
      const res = await decoratorAPI.getAlbumById(albumId);
      if (res.ok && res.data?.data) {
        const alb = res.data.data.album;
        setAlbum(alb);
        setImages(res.data.data.images || []);

        // Pre-fill fields matching upload form
        setTitle(alb.title || "");
        setCategory(alb.category || "installations");
        setPrice(alb.price ? String(alb.price) : "");
        setEventType(alb.eventType || "Grand Wedding");
        setCulturalStyle(alb.culturalStyle || "Western / Modern");
        setDescription(alb.description || "");
      } else {
        alert(res.data?.message || "Failed to load album details.");
        onBack();
      }
    } catch (e) {
      console.error("Fetch album error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!title.trim()) {
      alert("Album title is required.");
      return;
    }
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const payload = {
        title: title.trim(),
        category,
        price: price ? Number(price) : 0,
        eventType,
        culturalStyle,
        description,
      };

      const res = await decoratorAPI.updateAlbum(albumId, payload);
      if (res.ok && res.data?.data) {
        setAlbum(res.data.data);
        setSaveSuccess(true);
        onAlbumUpdated();
        setTimeout(() => setSaveSuccess(false), 2000);
      } else {
        alert(res.data?.message || "Failed to save album changes.");
      }
    } catch (e: any) {
      console.error("Save error:", e);
      alert(e.message || "Error saving changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    const nextStatus = album.status === "Published" ? "Draft" : "Published";
    try {
      const res = await decoratorAPI.updateAlbum(albumId, { status: nextStatus });
      if (res.ok) {
        setAlbum(res.data.data);
        onAlbumUpdated();
      } else {
        alert(res.data?.message || "Failed to update album status.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSetCover = async (imageId: string) => {
    try {
      const res = await decoratorAPI.updateAlbum(albumId, { coverImageId: imageId });
      if (res.ok) {
        setAlbum(res.data.data);
        onAlbumUpdated();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAlbum = async () => {
    if (confirm("Are you sure you want to delete this entire album and all its photos? This action cannot be undone.")) {
      try {
        const res = await decoratorAPI.deleteAlbum(albumId);
        if (res.ok) {
          onAlbumUpdated();
          onBack();
        } else {
          alert(res.data?.message || "Failed to delete album.");
        }
      } catch (e: any) {
        alert(e.message || "Server error while deleting album.");
      }
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    if (images.length + files.length > 50) {
      alert("Maximum 50 images per album allowed.");
      return;
    }

    const formData = new FormData();
    files.forEach((f) => formData.append("photos", f));

    setIsUploading(true);
    setUploadProgress([]);

    try {
      const res = await decoratorAPI.uploadAlbumImages(albumId, formData);
      if (res.ok && res.data?.results) {
        setUploadProgress(res.data.results);
        await fetchAlbumDetails();
        onAlbumUpdated();
      } else {
        alert(res.data?.message || "Bulk upload failed.");
      }
    } catch (err: any) {
      alert(err.message || "Server error during upload.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleUpdateImageMetadata = async (imageId: string, caption: string, tags: string[]) => {
    try {
      const res = await decoratorAPI.updateImage(imageId, { caption, tags });
      if (res.ok) {
        setImages((prev) => prev.map((img) => (img._id === imageId ? res.data.data : img)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleTag = (imageId: string, tag: string) => {
    const targetImage = images.find((i) => i._id === imageId);
    if (!targetImage) return;

    const curTags = targetImage.tags || [];
    const nextTags = curTags.includes(tag) ? curTags.filter((t: string) => t !== tag) : [...curTags, tag];

    handleUpdateImageMetadata(imageId, targetImage.caption || "", nextTags);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (confirm("Delete this image from the album?")) {
      try {
        const res = await decoratorAPI.deleteImage(imageId);
        if (res.ok) {
          await fetchAlbumDetails();
          onAlbumUpdated();
        } else {
          alert(res.data?.message || "Failed to delete image.");
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-sm font-serif italic text-gray-400 bg-white border border-[#E0D8C3] rounded-lg">
        Loading album details &amp; editor...
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 border border-[#E0D8C3] rounded-lg shadow-xs sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 border border-[#E0D8C3] hover:bg-gray-50 text-gray-600 rounded transition-colors"
            title="Back to Albums"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                album.status === 'Published'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {album.status}
              </span>
              {album.linkedBookingId && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#7C6A2E] bg-[#FEF9E8] px-2 py-0.5 rounded border border-[#D4B553]">
                  Linked Job #{album.linkedBookingId.bookingRef || "COMPLETED"}
                </span>
              )}
            </div>
            <h2 className="text-xl font-serif font-bold text-gray-900 mt-1">
              Edit Portfolio Album: <span className="italic text-[#7C6A2E]">{album.title}</span>
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
              <Check size={14} /> Saved!
            </span>
          )}
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="px-5 py-2 bg-[#7C6A2E] hover:bg-[#685724] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Save size={14} />
            {isSaving ? "Saving..." : "Save Portfolio Fields"}
          </button>

          <button
            onClick={handleTogglePublish}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 shadow-xs ${
              album.status === 'Published'
                ? 'border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {album.status === 'Published' ? <EyeOff size={14} /> : <Eye size={14} />}
            {album.status === 'Published' ? 'Unpublish' : 'Publish'}
          </button>

          <button
            onClick={handleDeleteAlbum}
            className="p-2 text-red-600 hover:bg-red-50 border border-red-200 rounded transition-colors"
            title="Delete Album"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* PORTFOLIO EDIT FORM FIELDS (Matching Upload Form) */}
      <div className="bg-white border border-[#E0D8C3] rounded-lg p-6 sm:p-8 space-y-8 shadow-xs">
        <h3 className="text-base font-serif font-bold text-[#7C6A2E] flex items-center gap-2 border-b border-[#E0D8C3] pb-3">
          <Sparkles size={18} className="text-[#B08D2C]" /> Edit Portfolio Details
        </h3>

        {/* Section 1: Title */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
            Portfolio Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Royal Orchid Stage Setup"
            className="w-full bg-[#FAF6EE] border border-[#E0D8C3] p-3 text-sm font-semibold text-gray-800 focus:border-[#7C6A2E] outline-none rounded"
          />
        </div>

        {/* Section 2: Event Type, Cultural Style & Price */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
              Event Type
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full bg-[#FAF6EE] border border-[#E0D8C3] p-3 text-sm font-semibold text-gray-800 focus:border-[#7C6A2E] outline-none rounded cursor-pointer"
            >
              <option value="Grand Wedding">Grand Wedding</option>
              <option value="Corporate Gala">Corporate Gala</option>
              <option value="Intimate Reception">Intimate Reception</option>
              <option value="Cultural Celebration">Cultural Celebration</option>
              <option value="Wedding">Wedding</option>
              <option value="Reception">Reception</option>
              <option value="Engagement">Engagement</option>
              <option value="Homecoming">Homecoming</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
              Cultural Style
            </label>
            <select
              value={culturalStyle}
              onChange={(e) => setCulturalStyle(e.target.value)}
              className="w-full bg-[#FAF6EE] border border-[#E0D8C3] p-3 text-sm font-semibold text-gray-800 focus:border-[#7C6A2E] outline-none rounded cursor-pointer"
            >
              <option value="Western / Modern">Western / Modern</option>
              <option value="Sinhala Traditional">Sinhala Traditional</option>
              <option value="Tamil Traditional">Tamil Traditional</option>
              <option value="Muslim Traditional">Muslim Traditional</option>
              <option value="Mixed / Fusion">Mixed / Fusion</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
              Project Price (LKR)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 250000"
              className="w-full bg-[#FAF6EE] border border-[#E0D8C3] p-3 text-sm font-semibold text-gray-800 focus:border-[#7C6A2E] outline-none rounded"
            />
          </div>
        </div>

        {/* Section 3: Narrative Description */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
            Short Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe the aesthetic, theme, setup, or highlights of this project..."
            className="w-full bg-[#FAF6EE] border border-[#E0D8C3] p-3 text-sm font-semibold text-gray-800 focus:border-[#7C6A2E] outline-none rounded resize-none"
          />
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="px-8 py-3 bg-[#7C6A2E] hover:bg-[#685724] text-white text-xs font-bold uppercase tracking-widest rounded shadow-sm transition-colors inline-flex items-center gap-2"
          >
            <Save size={14} />
            {isSaving ? "Saving Portfolio Details..." : "Save All Details"}
          </button>
        </div>
      </div>

      {/* Bulk Upload Dropzone Bar */}
      <div className="bg-white border-2 border-dashed border-[#E0D8C3] hover:border-[#7C6A2E] rounded-lg p-6 text-center transition-colors shadow-xs">
        <Upload size={32} className="mx-auto text-[#7C6A2E] mb-2" />
        <h3 className="font-serif font-bold text-gray-800 text-base mb-1">
          Upload Photos to "{title || album.title}"
        </h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto mb-4">
          Select multiple JPG, PNG, or WEBP photos (max 10MB per file, up to 50 photos total per album).
        </p>

        <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7C6A2E] hover:bg-[#685724] text-white text-xs font-bold uppercase tracking-wider rounded shadow-xs cursor-pointer transition-colors">
          <Upload size={14} /> Select Files to Upload
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleBulkUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>

        {isUploading && (
          <p className="text-xs font-serif italic text-gray-500 mt-3 animate-pulse">
            Uploading photos to Cloudinary...
          </p>
        )}

        {/* Per-File Upload Results */}
        {uploadProgress.length > 0 && (
          <div className="mt-4 text-left max-w-lg mx-auto bg-[#FAF6EE] p-3 rounded border border-[#E0D8C3] text-xs space-y-1">
            <span className="font-bold text-gray-700 block mb-1">Upload Results:</span>
            {uploadProgress.map((res, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px]">
                <span className="truncate max-w-[250px]">{res.file}</span>
                {res.success ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check size={12} /> Success
                  </span>
                ) : (
                  <span className="text-red-600 font-bold flex items-center gap-1">
                    <AlertCircle size={12} /> {res.error || "Failed"}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Album Image Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Album Photos ({images.length})
          </h3>
          <span className="text-xs text-gray-400 italic">Click chips to apply fixed category tags</span>
        </div>

        {images.length === 0 ? (
          <div className="py-12 text-center text-sm font-serif italic text-gray-400 bg-white border border-[#E0D8C3] rounded-lg">
            No photos uploaded to this album yet. Click the upload button above to add images.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {images.map((img) => {
              const isCover = album.coverImageId && (
                typeof album.coverImageId === 'string'
                  ? album.coverImageId === img._id
                  : album.coverImageId._id === img._id
              );

              return (
                <div
                  key={img._id}
                  className={`border rounded-lg bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                    isCover ? 'border-[#B08D2C] ring-2 ring-[#B08D2C]/20' : 'border-[#E0D8C3]'
                  }`}
                >
                  {/* Photo Container */}
                  <div className="relative aspect-4/3 bg-gray-100 overflow-hidden group">
                    <img
                      src={img.url}
                      alt={img.caption || "Album photo"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Cover Badge */}
                    {isCover && (
                      <span className="absolute top-2 left-2 bg-[#B08D2C] text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow-xs flex items-center gap-1">
                        <Star size={11} className="fill-white" /> Album Cover
                      </span>
                    )}

                    {/* Delete Action */}
                    <button
                      onClick={() => handleDeleteImage(img._id)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Metadata Editor */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Caption Input */}
                      <input
                        type="text"
                        defaultValue={img.caption || ""}
                        onBlur={(e) => handleUpdateImageMetadata(img._id, e.target.value, img.tags || [])}
                        placeholder="Add caption..."
                        className="w-full text-xs text-gray-800 bg-[#FAF6EE] border border-[#E0D8C3] p-2 rounded focus:border-[#7C6A2E] outline-none"
                      />

                      {/* Tag Chips Select */}
                      <div className="mt-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                          Style &amp; Event Tags
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {TAG_TAXONOMY.map((tag) => {
                            const isSelected = (img.tags || []).includes(tag);
                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => handleToggleTag(img._id, tag)}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize border transition-colors ${
                                  isSelected
                                    ? "bg-[#7C6A2E] text-white border-[#685724]"
                                    : "bg-white text-gray-600 border-[#E0D8C3] hover:bg-gray-50"
                                }`}
                              >
                                {tag}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Set Cover Button */}
                    {!isCover && (
                      <button
                        onClick={() => handleSetCover(img._id)}
                        className="w-full mt-3 py-1.5 border border-[#E0D8C3] text-gray-600 hover:text-[#7C6A2E] hover:border-[#7C6A2E] text-[10px] font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1"
                      >
                        <Star size={12} /> Set as Album Cover
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumEditor;

"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { djAPI } from '@/lib/api';
import { useToastStore } from '@/store/toastStore';

const EVENT_TYPES = [
  "Wedding", "Engagement", "Birthday", "Anniversary", "Corporate Event",
  "Conference", "Graduation", "Baby Shower", "Homecoming", "Private Party", "Other"
];

const DJ_SERVICES = [
  "DJ Performance", "MC / Master of Ceremonies", "Background Music", 
  "Special Entrance Music", "First Dance Music", "Event Announcements", 
  "Song Requests", "Custom Playlist", "Crowd Interaction"
];

const SOUND_EQUIPMENT = [
  "Professional Speakers", "Subwoofers", "DJ Controller / Mixer", 
  "Wireless Microphones", "Professional Audio Setup"
];

const LIGHTING_EQUIPMENT = [
  "Stage Lighting", "Dance Floor Lighting", "LED Lighting", 
  "Moving Head Lights", "Laser / Effect Lighting", "Fog / Smoke Machine"
];

const MUSIC_GENRES = [
  "Sinhala", "Tamil", "English", "Hindi / Bollywood", "Baila", 
  "Pop", "Rock", "EDM", "House", "Hip-Hop", "R&B", "Oldies / Classics", 
  "Mixed / All Genres"
];

interface AddPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingPackage?: any;
  onSave: () => void;
  isViewOnly?: boolean;
  onEditClick?: () => void;
}

export default function AddPackageModal({ isOpen, onClose, existingPackage, onSave, isViewOnly, onEditClick }: AddPackageModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    eventTypes: [] as string[],
    duration: "4 Hours",
    customDuration: "",
    services: [] as string[],
    sound: [] as string[],
    lighting: [] as string[],
    musicGenres: [] as string[],
    price: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (existingPackage) {
      const isCustomDuration = !["2 Hours", "3 Hours", "4 Hours", "5 Hours", "6 Hours", "8 Hours", "Full Event"].includes(existingPackage.duration);
      
      setFormData({
        name: existingPackage.name || "",
        description: existingPackage.description || "",
        eventTypes: existingPackage.eventTypes || [],
        duration: isCustomDuration ? "Custom" : (existingPackage.duration || "4 Hours"),
        customDuration: isCustomDuration ? existingPackage.duration : "",
        services: existingPackage.services || [],
        sound: existingPackage.sound || [],
        lighting: existingPackage.lighting || [],
        musicGenres: existingPackage.musicGenres || [],
        price: existingPackage.price || "",
      });
    }
  }, [existingPackage]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleArray = (field: keyof typeof formData, value: string) => {
    setFormData(prev => {
      const arr = prev[field] as string[];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter(v => v !== value) };
      } else {
        return { ...prev, [field]: [...arr, value] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.name || !formData.price || !formData.description) {
      setError("Please fill out all required fields (Name, Description, Price).");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        duration: formData.duration === "Custom" ? formData.customDuration : formData.duration
      };

      let res;
      if (existingPackage) {
        res = await djAPI.updatePackage(existingPackage._id, payload);
      } else {
        res = await djAPI.addPackage(payload);
      }

      if (res.ok) {
        useToastStore.getState().addToast({
          message: existingPackage ? "Package updated successfully" : "Package added successfully",
          type: "success"
        });
        onSave();
      } else {
        setError(res.data?.message || "Failed to save package.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E0D8C3] flex items-center justify-between bg-[#FDF9F1]">
          <h2 className="text-xl font-bold font-serif text-gray-900">
            {isViewOnly ? "View Package" : existingPackage ? "Edit Package" : "Add New Package"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2 text-sm font-semibold">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form id="package-form" onSubmit={handleSubmit} className="space-y-8">
            <fieldset disabled={isViewOnly} className={`space-y-8 ${isViewOnly ? 'opacity-90' : ''}`}>
            
            {/* 1. Basic Info */}
            <div className="space-y-4">
              <h3 className="font-bold text-[#7C6A2E] text-sm uppercase tracking-wider border-b border-[#E0D8C3] pb-2">1. Package Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Package Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Premium Wedding DJ Package"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#7C6A2E] focus:outline-none"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Short Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="e.g. Professional DJ performance with premium sound, lighting and MC service for wedding receptions."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-[#7C6A2E] focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 2. Event Types */}
            <div className="space-y-4">
              <h3 className="font-bold text-[#7C6A2E] text-sm uppercase tracking-wider border-b border-[#E0D8C3] pb-2">2. Suitable Event Types</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {EVENT_TYPES.map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.eventTypes.includes(type)}
                      onChange={() => toggleArray('eventTypes', type)}
                      className="accent-[#7C6A2E] w-4 h-4"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Duration */}
            <div className="space-y-4">
              <h3 className="font-bold text-[#7C6A2E] text-sm uppercase tracking-wider border-b border-[#E0D8C3] pb-2">3. Performance Duration</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["2 Hours", "3 Hours", "4 Hours", "5 Hours", "6 Hours", "8 Hours", "Full Event", "Custom"].map(dur => (
                  <label key={dur} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="radio"
                      name="duration"
                      value={dur}
                      checked={formData.duration === dur}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      className="accent-[#7C6A2E] w-4 h-4"
                    />
                    {dur}
                  </label>
                ))}
              </div>
              {formData.duration === "Custom" && (
                <div className="mt-2">
                  <input
                    type="text"
                    name="customDuration"
                    value={formData.customDuration}
                    onChange={handleInputChange}
                    placeholder="e.g. 10 hours"
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#7C6A2E] focus:outline-none w-64"
                  />
                </div>
              )}
            </div>

            {/* 4. Services */}
            <div className="space-y-4">
              <h3 className="font-bold text-[#7C6A2E] text-sm uppercase tracking-wider border-b border-[#E0D8C3] pb-2">4. DJ Services Included</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {DJ_SERVICES.map(srv => (
                  <label key={srv} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(srv)}
                      onChange={() => toggleArray('services', srv)}
                      className="accent-[#7C6A2E] w-4 h-4"
                    />
                    {srv}
                  </label>
                ))}
              </div>
            </div>

            {/* 5. Equipment */}
            <div className="space-y-6">
              <h3 className="font-bold text-[#7C6A2E] text-sm uppercase tracking-wider border-b border-[#E0D8C3] pb-2">5. Sound & Equipment Included</h3>
              
              <div>
                <h4 className="text-xs font-bold text-gray-800 mb-3">Sound System</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SOUND_EQUIPMENT.map(eq => (
                    <label key={eq} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={formData.sound.includes(eq)}
                        onChange={() => toggleArray('sound', eq)}
                        className="accent-[#7C6A2E] w-4 h-4"
                      />
                      {eq}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-800 mb-3">Lighting</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {LIGHTING_EQUIPMENT.map(eq => (
                    <label key={eq} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={formData.lighting.includes(eq)}
                        onChange={() => toggleArray('lighting', eq)}
                        className="accent-[#7C6A2E] w-4 h-4"
                      />
                      {eq}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 6. Music Genres */}
            <div className="space-y-4">
              <h3 className="font-bold text-[#7C6A2E] text-sm uppercase tracking-wider border-b border-[#E0D8C3] pb-2">6. Music & Entertainment</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {MUSIC_GENRES.map(gen => (
                  <label key={gen} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.musicGenres.includes(gen)}
                      onChange={() => toggleArray('musicGenres', gen)}
                      className="accent-[#7C6A2E] w-4 h-4"
                    />
                    {gen}
                  </label>
                ))}
              </div>
            </div>

            {/* 7. Price */}
            <div className="space-y-4">
              <h3 className="font-bold text-[#7C6A2E] text-sm uppercase tracking-wider border-b border-[#E0D8C3] pb-2">7. Package Price</h3>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Package Price (LKR) *</label>
                <div className="relative w-64">
                  <span className="absolute left-3 top-2.5 text-gray-500 font-bold text-sm">LKR</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="55000"
                    className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-2.5 text-sm focus:border-[#7C6A2E] focus:outline-none font-bold text-gray-900"
                    required
                  />
                </div>
              </div>
            </div>
            
            </fieldset>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E0D8C3] bg-gray-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isViewOnly ? "Close" : "Cancel"}
          </button>
          {isViewOnly ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                if (onEditClick) onEditClick();
              }}
              className="bg-[#7C6A2E] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold hover:bg-[#5E4F20] transition-colors"
            >
              Edit Package
            </button>
          ) : (
            <button
              type="submit"
              form="package-form"
              disabled={saving}
              className="bg-[#7C6A2E] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold hover:bg-[#5E4F20] transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? "Saving..." : (existingPackage ? "Save" : "Add Package")}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

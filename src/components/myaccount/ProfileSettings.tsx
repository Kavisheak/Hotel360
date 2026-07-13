"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { User, Save, Trash2, Loader2, X, Upload } from "lucide-react";
import Image from "next/image";
import Cropper from "react-easy-crop";
import { validateEmail, validatePhone } from "@/lib/validation";
import getCroppedImg from "@/utils/cropImage";
import { useAuthStore } from "@/store/authStore";
import { authAPI } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";

export default function ProfileSettings() {
  const { user: authUser, updateUser } = useAuthStore();
  
  const [profile, setProfile] = useState({
    firstName: authUser?.firstName || "",
    lastName: authUser?.lastName || "",
    email: authUser?.email || "",
    phone: authUser?.phone || "",
    address: authUser?.address || "",
    city: authUser?.city || "",
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Cropper states
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [errors, setErrors] = useState<{email?: string, phone?: string}>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    let hasError = false;
    const newErrors: typeof errors = {};

    if (!validateEmail(profile.email)) {
      newErrors.email = "Please enter a valid email address.";
      hasError = true;
    }
    if (!validatePhone(profile.phone)) {
      newErrors.phone = "Please enter a valid Sri Lankan phone number.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    setSaved(false);

    const { ok, data } = await authAPI.updateProfile(profile);

    setSaving(false);
    if (ok) {
      updateUser(profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert(data?.message || "Failed to update profile");
    }
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => setCropImageSrc(reader.result?.toString() || null));
    reader.readAsDataURL(file);
    
    // reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropUpload = async () => {
    if (!cropImageSrc || !croppedAreaPixels) return;

    setUploadingAvatar(true);
    try {
      const croppedBlob = await getCroppedImg(cropImageSrc, croppedAreaPixels);
      if (!croppedBlob) throw new Error("Failed to crop image");

      const formData = new FormData();
      formData.append("avatar", croppedBlob, "avatar.jpg");

      const { ok, data } = await authAPI.uploadAvatar(formData);
      
      if (ok && data.avatar) {
        updateUser({ avatar: data.avatar });
      } else {
        alert(data?.message || "Failed to upload avatar");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setUploadingAvatar(false);
      setCropImageSrc(null);
    }
  };

  const handleAvatarDelete = async () => {
    setUploadingAvatar(true);
    const { ok, data } = await authAPI.deleteAvatar();
    setUploadingAvatar(false);

    if (ok) {
      updateUser({ avatar: "" });
    } else {
      alert(data?.message || "Failed to delete avatar");
    }
  };

  return (
    <div className="bg-white dark:bg-[#111111] border border-[#C9A84C]/30 rounded-lg shadow-[0_4px_20px_rgba(201,168,76,0.15)] hover:shadow-[0_8px_30px_rgba(201,168,76,0.25)] hover:border-[#C9A84C]/60 transition-all duration-300 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-start gap-4 px-8 py-6 border-b border-[#E8DFC9]/60">
        <div className="mt-1">
          <User className="w-5 h-5 text-[#C69C6D]" strokeWidth={1.5} />
        </div>
        <div>
          <h4 className="text-[22px] font-serif text-[#1A1512]">Personal Information</h4>
          <p className="text-[11px] text-gray-500 font-medium tracking-wide mt-1">Update your profile details and contact information.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="p-8 space-y-8">
        {/* Avatar Upload */}
        <div className="flex items-center gap-6 border-b border-[#E8DFC9]/30 pb-8">
          <div className="w-24 h-24 rounded-full bg-[#FAF6EE] flex items-center justify-center text-[#C69C6D] relative overflow-hidden border border-[#E8DFC9]">
            {authUser?.avatar ? (
              <Image 
                src={getImageUrl(authUser.avatar)} 
                alt="Profile Avatar" 
                fill 
                className="object-cover"
                unoptimized
              />
            ) : (
              <User className="w-8 h-8" strokeWidth={1.5} />
            )}
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#1A1512]">Profile Photo</p>
            <p className="text-[10px] text-gray-500 font-medium mt-1 mb-4 tracking-wide">JPG, PNG or WEBP. Max 5MB.</p>
            <div className="flex items-center gap-3">
              <input 
                type="file" 
                accept="image/jpeg, image/png, image/webp" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleAvatarSelect}
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#C9A84C] border border-[#C9A84C]/40 rounded hover:bg-[#FAF6EE] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {uploadingAvatar ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" strokeWidth={2} />}
                {uploadingAvatar ? "Uploading..." : "Change Photo"}
              </button>
              {authUser?.avatar && (
                <button 
                  type="button"
                  onClick={handleAvatarDelete}
                  disabled={uploadingAvatar}
                  className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-red-500 border border-red-200 rounded hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={2} /> Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2">First Name</label>
            <input
              value={profile.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="w-full border border-gray-200 bg-transparent px-4 py-3 rounded text-[13px] text-[#1A1512] focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Last Name</label>
            <input
              value={profile.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="w-full border border-gray-200 bg-transparent px-4 py-3 rounded text-[13px] text-[#1A1512] focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full border border-gray-200 bg-transparent px-4 py-3 rounded text-[13px] text-[#1A1512] focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none transition-all"
            />
            {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Phone Number</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full border border-gray-200 bg-transparent px-4 py-3 rounded text-[13px] text-[#1A1512] focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none transition-all"
            />
            {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Street Address</label>
            <input
              value={profile.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full border border-gray-200 bg-transparent px-4 py-3 rounded text-[13px] text-[#1A1512] focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2">City / Region</label>
            <input
              value={profile.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="w-full border border-gray-200 bg-transparent px-4 py-3 rounded text-[13px] text-[#1A1512] focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#C9A84C] text-white font-bold text-[10px] uppercase tracking-wider rounded hover:bg-[#B58A59] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70"
          >
            <Save className="w-3.5 h-3.5" strokeWidth={2} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {saved && (
            <span className="text-[11px] text-emerald-600 font-bold uppercase tracking-wide animate-fadeIn">
              ✓ Profile updated successfully
            </span>
          )}
        </div>
      </form>

      {/* Crop Modal */}
      {mounted && cropImageSrc && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col border border-[#E8DFC9] dark:border-gray-800 animate-fadeIn">
            <div className="flex items-center justify-between p-4 border-b border-[#E8DFC9] dark:border-gray-800">
              <h3 className="font-serif text-lg text-[#1A1512] dark:text-white">Crop Profile Photo</h3>
              <button 
                onClick={() => setCropImageSrc(null)}
                className="text-gray-500 hover:text-[#1A1512] dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative w-full h-[300px] bg-black/5 dark:bg-black/20">
              <Cropper
                image={cropImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-[#C69C6D]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCropImageSrc(null)}
                  className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropUpload}
                  disabled={uploadingAvatar}
                  className="px-6 py-2 bg-[#C69C6D] text-white font-bold text-[10px] uppercase tracking-widest rounded hover:bg-[#B58A59] transition-colors btn-interactive flex items-center gap-2 disabled:opacity-70"
                >
                  {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {uploadingAvatar ? "Uploading..." : "Crop & Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { 
  Camera, 
  Building2, 
  Award, 
  Mail, 
  Phone, 
  Globe, 
  Link, 
  Share2, 
  MapPin, 
  ShieldCheck, 
  Lock, 
  Save, 
  Check, 
  AlertCircle, 
  User, 
  FileText,
  Key,
  Compass,
  Image as ImageIcon,
  CalendarCheck
} from "lucide-react";
import ImageCropModal from "./ImageCropModal";
import LocationMapModal from "./LocationMapModal";
import { authAPI, decoratorAPI, videographerAPI, djAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { validateEmail, validatePhone } from "@/lib/validation";
import { useRouter } from "next/navigation";

interface UnifiedVendorSettingsProps {
  vendorRole: "decorator" | "videographer" | "dj_artist";
  roleTitle: string;
}

const EVENT_TYPES = [
  "Wedding", "Engagement", "Birthday", "Anniversary", "Corporate",
  "Conference", "Graduation", "Baby Shower", "Homecoming", "Private Party", "Other", "Islandwide"
];

const DECORATION_SPECIALTIES = [
  "Wedding Stage", "Floral Decoration", "Balloon Decoration", "Entrance Decoration",
  "Table Decoration", "Ceiling Decoration", "Backdrop Decoration", "Theme Decoration",
  "Luxury Decoration", "Traditional Decoration", "Modern / Minimalist", "Outdoor Decoration",
  "Lighting", "Photo Booth", "Custom Decoration"
];

const CULTURAL_EXPERTISE = [
  "Buddhist", "Hindu", "Muslim", "Christian", "Catholic",
  "Traditional Sinhalese", "Traditional Tamil", "Western Style", "Fusion"
];

const VIDEOGRAPHY_SPECIALTIES = [
  "Wedding Cinematography", "Candid Videography", "Cinematic Films", "Traditional Event Videography",
  "Pre-shoot / Couple Shoot", "Drone Videography", "Highlight Films", "Same-Day Edits",
  "Live Streaming", "Corporate Videography", "Concert / Stage Events", "Documentary Style",
  "Social Media Reels"
];

const VIDEO_STYLES = [
  "Cinematic", "Traditional", "Documentary", "Storytelling", "Candid",
  "Editorial", "Luxury", "Natural / Minimal", "Creative"
];

const EQUIPMENT_LIST = [
  "4K Video", "Multiple Cameras", "Drone", "Gimbal", "Professional Audio",
  "Wireless Microphones", "Professional Lighting", "Stabilization Equipment", "Live Streaming"
];

const SERVICE_AREAS_LIST = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Galle", "Matara", "Kurunegala", "Nuwara Eliya", "Ratnapura", "Anuradhapura", "Jaffna", "Batticaloa", "Trincomalee", "Other", "Islandwide"
];

const DJ_SPECIALTIES = [
  "Wedding DJ", "Party DJ", "Corporate DJ", "Club-style DJ", 
  "Traditional Event DJ", "MC / Announcer", "Live DJ Mixing", 
  "Background Music", "Special Entrance Music"
];

const MUSIC_GENRES = [
  "Sinhala", "Tamil", "English", "Hindi / Bollywood", "Baila", 
  "Pop", "Rock", "EDM", "House", "Hip-Hop", "R&B", "Oldies / Classics", 
  "Mixed / All Genres"
];

const DJ_SERVICES = [
  "DJ Performance", "MC", "Sound System", 
  "Stage Lighting", "Dance Floor Lighting", "Background Music", 
  "Special Entrance Music", "Event Announcements", "Wireless Microphone"
];

const DJ_EQUIPMENT = [
  "DJ Controller", "DJ Mixer", "Professional Speakers", 
  "Subwoofers", "Wireless Microphones", "Stage Lighting", "Moving Head Lights", 
  "LED Lighting", "Laser / Effects", "Fog / Smoke Machine"
];

const DJ_PERFORMANCE = [
  "Live Mixing", "Crowd Interaction", "Song Requests", 
  "Custom Playlist", "Special Entrance Music", "First Dance Music", 
  "Cultural / Traditional Music", "Dinner Background Music"
];

export default function UnifiedVendorSettings({
  vendorRole,
  roleTitle,
}: UnifiedVendorSettingsProps) {
  const router = useRouter();
  const { user: authUser, updateUser } = useAuthStore();

  // 11 Core Form Fields State
  const [formData, setFormData] = useState({
    shopName: "",         // 2. Business Name
    experience: "",       // 3. Years of Experience
    eventsCompleted: "",  // Events Completed
    email: "",            // 4. Email
    phone: "",            // 5. Phone Number
    website: "",          // 6. Website URL
    instagram: "",        // 7. Social Media (Instagram)
    facebook: "",         // 7. Social Media (Facebook/Pinterest)
    bio: "",              // 8. About
    location: "",         // 9. Location
    defaultPackagePrice: 0, // Fixed DJ Package Price
    contactPerson: "",
    serviceAreas: [] as string[],
    eventTypesServed: [] as string[],
    culturalExpertise: [] as string[],
    specialties: [] as string[],
    whatsappNumber: "",
    youtube: "",
    teamSize: "",
    teamBreakdown: "",
    videoStyles: [] as string[],
    equipment: [] as string[],
    musicGenres: [] as string[],
    servicesOffered: [] as string[],
    equipmentDetails: "",
    performanceCapabilities: [] as string[],
    advancePaymentPercentage: 0,
  });

  // Owner details provisioned by Manager (Read-only)
  const [ownerInfo, setOwnerInfo] = useState({
    firstName: "",
    lastName: "",
    ownerNic: "",
  });

  // Avatar and Cover state
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [isUploadingCover, setIsUploadingCover] = useState(false);


  // Password Change State (11. Password Change Option)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Modals state
  const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);

  // Status & Validation states
  const [loading, setLoading] = useState<boolean>(true);
  const [savingProfile, setSavingProfile] = useState<boolean>(false);
  const [savingPassword, setSavingPassword] = useState<boolean>(false);
  
  const [profileErrors, setProfileErrors] = useState<{
    email?: string;
    phone?: string;
    website?: string;
  }>({});

  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const res = await authAPI.getMe();
      if (res.ok && res.data?.user) {
        const u = res.data.user;
        
        setAvatarUrl(u.avatar || "");
        setCoverImageUrl(u.vendorProfile?.coverImage || "");
        setOwnerInfo({
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          ownerNic: u.ownerNic || "Not Provisioned",
        });

        setFormData({
          shopName: u.shopName || "",
          experience: u.vendorProfile?.experience || "",
          eventsCompleted: u.vendorProfile?.eventsCompleted || "",
          email: u.email || "",
          phone: u.phone || "",
          website: u.vendorProfile?.website || "",
          instagram: u.vendorProfile?.instagram || "",
          facebook: u.vendorProfile?.pinterest || u.vendorProfile?.facebook || "",
          bio: u.vendorProfile?.bio || u.vendorProfile?.description || "",
          location: u.vendorProfile?.location || u.city || u.address || "Colombo, Sri Lanka",
          defaultPackagePrice: u.vendorProfile?.defaultPackagePrice || 0,
          contactPerson: u.vendorProfile?.contactPerson || "",
          serviceAreas: u.vendorProfile?.serviceAreas || [],
          eventTypesServed: u.vendorProfile?.eventTypesServed || [],
          culturalExpertise: u.vendorProfile?.culturalExpertise || [],
          specialties: Array.isArray(u.vendorProfile?.specialties) ? u.vendorProfile.specialties : (u.vendorProfile?.specialty ? u.vendorProfile.specialty.split(",").map((s: string) => s.trim()) : []),
          whatsappNumber: u.vendorProfile?.whatsappNumber || "",
          youtube: u.vendorProfile?.youtube || "",
          teamSize: u.vendorProfile?.teamSize || "",
          teamBreakdown: u.vendorProfile?.teamBreakdown || "",
          videoStyles: u.vendorProfile?.videoStyles || [],
          equipment: u.vendorProfile?.equipment || [],
          musicGenres: u.vendorProfile?.musicGenres || [],
          servicesOffered: u.vendorProfile?.servicesOffered || [],
          equipmentDetails: u.vendorProfile?.equipmentDetails || "",
          performanceCapabilities: u.vendorProfile?.performanceCapabilities || [],
          advancePaymentPercentage: u.vendorProfile?.advancePaymentPercentage || 0,
        });
      }
    } catch (e) {
      console.error("Failed to fetch vendor settings:", e);
      showToast("Failed to load profile settings.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name as keyof typeof profileErrors]) {
      setProfileErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Avatar Upload via Crop Modal
  const handleSaveCroppedAvatar = async (croppedBlob: Blob) => {
    try {
      const fd = new FormData();
      fd.append("avatar", croppedBlob, "vendor-avatar.jpg");
      const res = await authAPI.uploadAvatar(fd);
      if (res.ok && res.data?.avatar) {
        setAvatarUrl(res.data.avatar);
        updateUser({ avatar: res.data.avatar });
        showToast("Profile picture updated successfully!");
      } else {
        showToast(res.data?.message || "Failed to upload avatar.", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Error uploading avatar picture.", "error");
    }
  };

  // Avatar Delete
  const handleDeleteAvatar = async () => {
    try {
      const res = await authAPI.deleteAvatar();
      if (res.ok) {
        setAvatarUrl("");
        updateUser({ avatar: "" });
        showToast("Profile picture removed.");
      } else {
        showToast(res.data?.message || "Failed to remove avatar.", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Error deleting avatar.", "error");
    }
  };

  // Cover Image Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append("cover", file);
      const res = await authAPI.uploadCoverImage(fd);
      if (res.ok && res.data?.coverImage) {
        setCoverImageUrl(res.data.coverImage);
        showToast("Cover image updated successfully!");
      } else {
        showToast(res.data?.message || "Failed to upload cover.", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Error uploading cover picture.", "error");
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Toggle Checkbox for arrays
  const toggleSelection = (field: 'serviceAreas' | 'eventTypesServed' | 'specialties' | 'culturalExpertise' | 'videoStyles' | 'equipment' | 'musicGenres' | 'servicesOffered' | 'performanceCapabilities', value: string) => {
    setFormData(prev => {
      const arr = prev[field];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter(v => v !== value) };
      } else {
        return { ...prev, [field]: [...arr, value] };
      }
    });
  };


  // Profile Form Submission
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrors({});
    let hasErr = false;
    const newErrs: typeof profileErrors = {};

    if (!validateEmail(formData.email)) {
      newErrs.email = "Please enter a valid email address (e.g. info@vendor.lk).";
      hasErr = true;
    }

    if (!validatePhone(formData.phone)) {
      newErrs.phone = "Invalid Sri Lankan phone (e.g. 077 123 4567 or +94771234567).";
      hasErr = true;
    }

    if (formData.website && !formData.website.startsWith("http://") && !formData.website.startsWith("https://")) {
      newErrs.website = "Website URL should start with http:// or https://";
      hasErr = true;
    }

    if (hasErr) {
      setProfileErrors(newErrs);
      showToast("Please correct the highlighted errors.", "error");
      return;
    }

    setSavingProfile(true);
    try {
      const updatePayload = {
        shopName: formData.shopName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        experience: formData.experience.trim(),
        eventsCompleted: formData.eventsCompleted.trim(),
        website: formData.website.trim(),
        instagram: formData.instagram.trim(),
        pinterest: formData.facebook.trim(),
        bio: formData.bio.trim(),
        location: formData.location.trim(),
        defaultPackagePrice: formData.defaultPackagePrice,
        contactPerson: formData.contactPerson.trim(),
        serviceAreas: formData.serviceAreas,
        eventTypesServed: formData.eventTypesServed,
        culturalExpertise: formData.culturalExpertise,
        specialty: formData.specialties,
        whatsappNumber: formData.whatsappNumber.trim(),
        youtube: formData.youtube.trim(),
        teamSize: formData.teamSize.trim(),
        teamBreakdown: formData.teamBreakdown.trim(),
        videoStyles: formData.videoStyles,
        equipment: formData.equipment,
        musicGenres: formData.musicGenres,
        servicesOffered: formData.servicesOffered,
        equipmentDetails: formData.equipmentDetails.trim(),
        performanceCapabilities: formData.performanceCapabilities,
        facebook: formData.facebook.trim(),
        advancePaymentPercentage: formData.advancePaymentPercentage,
      };

      let res;
      if (vendorRole === "decorator") {
        res = await decoratorAPI.updateProfile(updatePayload);
      } else if (vendorRole === "videographer") {
        res = await videographerAPI.updateProfile(updatePayload);
      } else {
        res = await djAPI.updateProfile(updatePayload);
      }

      if (res.ok) {
        showToast("Settings & Brand Profile successfully updated!");
        updateUser({
          shopName: formData.shopName,
          email: formData.email,
          phone: formData.phone,
          vendorProfile: {
            ...authUser?.vendorProfile,
            experience: formData.experience,
            website: formData.website,
            instagram: formData.instagram,
            bio: formData.bio,
            location: formData.location,
            defaultPackagePrice: formData.defaultPackagePrice,
          },
        });
      } else {
        showToast(res.data?.message || "Failed to update profile.", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("An unexpected error occurred while saving profile.", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  // Password Change Submission
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors({});
    let hasErr = false;
    const newErrs: typeof passwordErrors = {};

    if (!passwordData.currentPassword) {
      newErrs.currentPassword = "Current password is required.";
      hasErr = true;
    }

    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      newErrs.newPassword = "New password must be at least 6 characters long.";
      hasErr = true;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrs.confirmPassword = "New password and confirmation do not match.";
      hasErr = true;
    }

    if (hasErr) {
      setPasswordErrors(newErrs);
      return;
    }

    setSavingPassword(true);
    try {
      const res = await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.ok) {
        showToast("Security password updated successfully! Please login again with your new password.");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(async () => {
          try {
            await authAPI.signout();
          } catch (err) {}
          useAuthStore.getState().clearUser();
          router.replace("/login");
        }, 2000);
      } else {
        showToast(res.data?.message || "Password update failed. Check current password.", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Error updating password.", "error");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#7C6A2E] dark:text-[#C9A84C] font-serif animate-pulse">
        <div className="w-10 h-10 border-4 border-[#7C6A2E] border-t-transparent rounded-full animate-spin mb-3" />
        Loading Vendor Settings...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div className="bg-white dark:bg-[#111111] border border-[#E0D8C3] dark:border-gray-800 p-6 md:p-8 rounded-xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#7C6A2E] dark:text-[#C9A84C] bg-[#FAF6EE] dark:bg-white/5 px-3 py-1 rounded border border-[#E0D8C3] dark:border-gray-800">
            {roleTitle} Portal Configuration
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white mt-2">
            Vendor Profile & Account Settings
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
            Manage your brand details, contact info, island-wide location, owner identification, and security credentials.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={savingProfile}
          className="w-full md:w-auto bg-[#7C6A2E] hover:bg-[#5E4F20] disabled:bg-gray-400 text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          {savingProfile ? (
            "Saving..."
          ) : (
            <>
              <Save size={16} /> Save All Changes
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-8">
        
        {/* SECTION 1: Brand & Profile Identity */}
        <div className="bg-white dark:bg-[#111111] border border-[#E0D8C3] dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-[#FAF6EE] dark:bg-[#161616] px-6 py-4 border-b border-[#E0D8C3] dark:border-gray-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#7C6A2E] dark:text-[#C9A84C]" />
            <h3 className="font-serif italic text-base font-bold text-[#7C6A2E] dark:text-[#C9A84C]">
              Brand & Profile Identity
            </h3>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* 1. Profile Picture with Crop Modal Trigger */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-[#E0D8C3]/50 dark:border-gray-800">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#7C6A2E] dark:border-[#C9A84C] bg-[#FAF6EE] dark:bg-[#252525] flex items-center justify-center shadow-md">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={formData.shopName || "Vendor Avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-[#7C6A2E] dark:text-[#C9A84C] opacity-70" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsCropModalOpen(true)}
                  className="absolute bottom-0 right-0 bg-[#7C6A2E] hover:bg-[#5E4F20] text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-black transition-transform hover:scale-110 cursor-pointer"
                  title="Change Profile Picture"
                >
                  <Camera size={14} />
                </button>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-white">
                  Profile Picture
                </h4>
                <p className="text-xs text-gray-500 max-w-md">
                  Upload a high-resolution logo or professional photo. Click "Adjust Photo" to crop, zoom, or adjust positioning.
                </p>
                <div className="pt-1 flex flex-wrap justify-center sm:justify-start gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCropModalOpen(true)}
                    className="px-4 py-2 bg-[#FAF6EE] dark:bg-[#222] border border-[#E0D8C3] dark:border-gray-700 hover:border-[#7C6A2E] text-xs font-bold text-[#7C6A2E] dark:text-[#C9A84C] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera size={14} /> Adjust & Crop Photo
                  </button>
                </div>
              </div>
            </div>

            {/* Cover Image Upload */}
            {(vendorRole === "decorator" || vendorRole === "videographer" || vendorRole === "dj_artist") && (
              <div className="flex flex-col gap-4 pb-6 border-b border-[#E0D8C3]/50 dark:border-gray-800">
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-white">
                      Cover Image
                    </h4>
                    <p className="text-xs text-gray-500 max-w-md mt-1">
                      Upload a wide, high-quality banner image for your public profile.
                    </p>
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      id="cover-upload"
                      className="hidden"
                      onChange={handleCoverUpload}
                    />
                    <label
                      htmlFor="cover-upload"
                      className="px-4 py-2 bg-[#FAF6EE] dark:bg-[#222] border border-[#E0D8C3] dark:border-gray-700 hover:border-[#7C6A2E] text-xs font-bold text-[#7C6A2E] dark:text-[#C9A84C] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ImageIcon size={14} /> {isUploadingCover ? "Uploading..." : "Change Cover"}
                    </label>
                  </div>
                </div>
                <div className="w-full h-40 sm:h-48 rounded-xl overflow-hidden border border-[#E0D8C3] dark:border-gray-700 bg-[#FAF6EE] dark:bg-[#252525] relative">
                  {coverImageUrl ? (
                    <img src={coverImageUrl} alt="Cover Banner" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon size={32} />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 2. Business Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                  <Building2 size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> Business Name (Shop / Brand Name)
                </label>
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  placeholder="e.g. Elegance Event Decorators"
                  required
                  className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-[#FDF9F1] dark:bg-[#1A1A1A] px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
                />
              </div>

              {/* Owner / Contact Person */}
              {(vendorRole === "decorator" || vendorRole === "videographer") && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                    <User size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> Owner / Contact Person
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe"
                    className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-[#FDF9F1] dark:bg-[#1A1A1A] px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
                  />
                </div>
              )}

              {/* 3. Years of Experience */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                  <Award size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> Years of Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="e.g. 5"
                  className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-[#FDF9F1] dark:bg-[#1A1A1A] px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
                />
              </div>

              {/* Events Completed */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                  <CalendarCheck size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> Events Completed
                </label>
                <input
                  type="text"
                  name="eventsCompleted"
                  value={formData.eventsCompleted}
                  onChange={handleInputChange}
                  placeholder="e.g. 120+"
                  className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-[#FDF9F1] dark:bg-[#1A1A1A] px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
                />
              </div>
              {vendorRole === "dj_artist" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                    <Award size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> Fixed Package Price (LKR)
                  </label>
                  <input
                    type="number"
                    name="defaultPackagePrice"
                    value={formData.defaultPackagePrice || ""}
                    onChange={handleInputChange}
                    placeholder="e.g. 45000"
                    className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-[#FDF9F1] dark:bg-[#1A1A1A] px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">This price will be used automatically when customers book your DJ services.</p>
                </div>
              )}
              
              {/* Advance Payment Percentage */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                  <Award size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> Advance Payment (%)
                </label>
                <input
                  type="number"
                  name="advancePaymentPercentage"
                  value={formData.advancePaymentPercentage || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. 20 (for 20%)"
                  min="0"
                  max="100"
                  className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-[#FDF9F1] dark:bg-[#1A1A1A] px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
                />
                <p className="text-[10px] text-gray-500 mt-1">Percentage of total cost required as advance payment (e.g. 20, 30, 40).</p>
              </div>
            </div>

            {/* 8. About (Bio) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                <FileText size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> About (Business Bio & Description)
              </label>
              <textarea
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Describe your artisan services, specialized themes, equipment, and background..."
                className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-[#FDF9F1] dark:bg-[#1A1A1A] px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
              />
            </div>

            {/* Team Information */}
            {vendorRole === "videographer" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E0D8C3]/50 dark:border-gray-800">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                    <User size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> Team Size
                  </label>
                  <input
                    type="text"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleInputChange}
                    placeholder="e.g. 3 Members"
                    className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-[#FDF9F1] dark:bg-[#1A1A1A] px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                    <User size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> Team Breakdown (Optional)
                  </label>
                  <input
                    type="text"
                    name="teamBreakdown"
                    value={formData.teamBreakdown}
                    onChange={handleInputChange}
                    placeholder="e.g. 2 Videographers, 1 Editor"
                    className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-[#FDF9F1] dark:bg-[#1A1A1A] px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
                  />
                </div>
              </div>
            )}

            {/* Checklists for Decorators & Videographers */}
            {(vendorRole === "decorator" || vendorRole === "videographer" || vendorRole === "dj_artist") && (
              <div className="space-y-6 pt-4 border-t border-[#E0D8C3]/50 dark:border-gray-800">
                {/* Event Types Served */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3">
                    Event Types Served
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {EVENT_TYPES.map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={formData.eventTypesServed.includes(type)}
                          onChange={() => toggleSelection('eventTypesServed', type)}
                          className="accent-[#7C6A2E] w-4 h-4 rounded"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Decoration Specialties */}
                {vendorRole === "decorator" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3">
                        Decoration Specialties
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {DECORATION_SPECIALTIES.map(specialty => (
                          <label key={specialty} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                            <input
                              type="checkbox"
                              checked={formData.specialties.includes(specialty)}
                              onChange={() => toggleSelection('specialties', specialty)}
                              className="accent-[#7C6A2E] w-4 h-4 rounded"
                            />
                            {specialty}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Cultural / Religious Expertise */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3">
                        Cultural & Religious Expertise
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {CULTURAL_EXPERTISE.map(culture => (
                          <label key={culture} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                            <input
                              type="checkbox"
                              checked={formData.culturalExpertise.includes(culture)}
                              onChange={() => toggleSelection('culturalExpertise', culture)}
                              className="accent-[#7C6A2E] w-4 h-4 rounded"
                            />
                            {culture}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Videography Specialties */}
                {vendorRole === "videographer" && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3">
                      Videography Specialties
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {VIDEOGRAPHY_SPECIALTIES.map(specialty => (
                        <label key={specialty} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                          <input
                            type="checkbox"
                            checked={formData.specialties.includes(specialty)}
                            onChange={() => toggleSelection('specialties', specialty)}
                            className="accent-[#7C6A2E] w-4 h-4 rounded"
                          />
                          {specialty}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* DJ Specialties */}
                {vendorRole === "dj_artist" && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Award size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> DJ Specialties
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {DJ_SPECIALTIES.map(specialty => (
                        <label key={specialty} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                          <input
                            type="checkbox"
                            checked={formData.specialties.includes(specialty)}
                            onChange={() => toggleSelection('specialties', specialty)}
                            className="accent-[#7C6A2E] w-4 h-4 rounded"
                          />
                          {specialty}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Music Genres */}
                {vendorRole === "dj_artist" && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Award size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> Music Genres
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {MUSIC_GENRES.map(genre => (
                        <label key={genre} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                          <input
                            type="checkbox"
                            checked={formData.musicGenres.includes(genre)}
                            onChange={() => toggleSelection('musicGenres', genre)}
                            className="accent-[#7C6A2E] w-4 h-4 rounded"
                          />
                          {genre}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* DJ Services Offered */}
                {vendorRole === "dj_artist" && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Award size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> Services Offered
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {DJ_SERVICES.map(service => (
                        <label key={service} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                          <input
                            type="checkbox"
                            checked={formData.servicesOffered.includes(service)}
                            onChange={() => toggleSelection('servicesOffered', service)}
                            className="accent-[#7C6A2E] w-4 h-4 rounded"
                          />
                          {service}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Style */}
                {vendorRole === "videographer" && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3">
                      Video Style
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {VIDEO_STYLES.map(style => (
                        <label key={style} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                          <input
                            type="checkbox"
                            checked={formData.videoStyles.includes(style)}
                            onChange={() => toggleSelection('videoStyles', style)}
                            className="accent-[#7C6A2E] w-4 h-4 rounded"
                          />
                          {style}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Equipment & Capabilities */}
                {vendorRole === "videographer" && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3">
                      Equipment & Technical Capabilities
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {EQUIPMENT_LIST.map(eq => (
                        <label key={eq} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                          <input
                            type="checkbox"
                            checked={formData.equipment.includes(eq)}
                            onChange={() => toggleSelection('equipment', eq)}
                            className="accent-[#7C6A2E] w-4 h-4 rounded"
                          />
                          {eq}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* DJ Equipment Available */}
                {vendorRole === "dj_artist" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <Award size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> Equipment Available
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        {DJ_EQUIPMENT.map(eq => (
                          <label key={eq} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                            <input
                              type="checkbox"
                              checked={formData.equipment.includes(eq)}
                              onChange={() => toggleSelection('equipment', eq)}
                              className="accent-[#7C6A2E] w-4 h-4 rounded"
                            />
                            {eq}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                        Equipment Details (Optional)
                      </label>
                      <textarea
                        name="equipmentDetails"
                        rows={2}
                        value={formData.equipmentDetails}
                        onChange={handleInputChange}
                        placeholder="e.g. Pioneer DJ controller, JBL sound system, wireless microphones..."
                        className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-[#FDF9F1] dark:bg-[#1A1A1A] px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
                      />
                    </div>
                  </div>
                )}

                {/* DJ Performance Features */}
                {vendorRole === "dj_artist" && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Award size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> Performance Capabilities
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {DJ_PERFORMANCE.map(cap => (
                        <label key={cap} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                          <input
                            type="checkbox"
                            checked={formData.performanceCapabilities.includes(cap)}
                            onChange={() => toggleSelection('performanceCapabilities', cap)}
                            className="accent-[#7C6A2E] w-4 h-4 rounded"
                          />
                          {cap}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service Areas */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3">
                    Service Areas
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {SERVICE_AREAS_LIST.map(area => (
                      <label key={area} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={formData.serviceAreas.includes(area)}
                          onChange={() => toggleSelection('serviceAreas', area)}
                          className="accent-[#7C6A2E] w-4 h-4 rounded"
                        />
                        {area}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: Contact, Web, Social & Location */}
        <div className="bg-white dark:bg-[#111111] border border-[#E0D8C3] dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-[#FAF6EE] dark:bg-[#161616] px-6 py-4 border-b border-[#E0D8C3] dark:border-gray-800 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#7C6A2E] dark:text-[#C9A84C]" />
            <h3 className="font-serif italic text-base font-bold text-[#7C6A2E] dark:text-[#C9A84C]">
              Contact, Web, Social & Location
            </h3>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 4. Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                  <Mail size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> Business Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="contact@artisan.lk"
                  required
                  className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-[#FDF9F1] dark:bg-[#1A1A1A] px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
                />
                {profileErrors.email && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} /> {profileErrors.email}
                  </p>
                )}
              </div>

              {/* 5. Phone Number & WhatsApp */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                    <Phone size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> Phone Number (Sri Lankan Format)
                  </label>
                  <div className="flex">
                    <span className="bg-[#FAF6EE] dark:bg-[#222] border border-[#E0D8C3] dark:border-gray-700 border-r-0 px-3.5 py-3 text-gray-600 dark:text-gray-300 text-xs font-bold flex items-center rounded-l-lg">
                      +94
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="077 123 4567"
                      required
                      className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-[#FDF9F1] dark:bg-[#1A1A1A] px-4 py-3 rounded-r-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
                    />
                  </div>
                  {profileErrors.phone && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} /> {profileErrors.phone}
                    </p>
                  )}
                </div>

                {(vendorRole === "decorator" || vendorRole === "videographer" || vendorRole === "dj_artist") && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                      <Phone size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> WhatsApp Number
                    </label>
                    <div className="flex">
                      <span className="bg-[#FAF6EE] dark:bg-[#222] border border-[#E0D8C3] dark:border-gray-700 border-r-0 px-3.5 py-3 text-gray-600 dark:text-gray-300 text-xs font-bold flex items-center rounded-l-lg">
                        +94
                      </span>
                      <input
                        type="tel"
                        name="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={handleInputChange}
                        placeholder="077 123 4567"
                        className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-[#FDF9F1] dark:bg-[#1A1A1A] px-4 py-3 rounded-r-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 6. Website URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                  <Globe size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> Website URL
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://www.yourbusiness.lk"
                  className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-[#FDF9F1] dark:bg-[#1A1A1A] px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
                />
                {profileErrors.website && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} /> {profileErrors.website}
                  </p>
                )}
              </div>

              {/* 7. Social Media (Instagram) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                  <Link size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> Instagram Profile
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/yourhandle"
                  className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-[#FDF9F1] dark:bg-[#1A1A1A] px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
                />
              </div>

              {/* 7. Social Media (Facebook/Pinterest) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                  <Share2 size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> Facebook / Pinterest Page
                </label>
                <input
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  placeholder="https://facebook.com/yourpage"
                  className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-[#FDF9F1] dark:bg-[#1A1A1A] px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
                />
              </div>

              {/* 7. Social Media (YouTube) */}
              {(vendorRole === "decorator" || vendorRole === "videographer" || vendorRole === "dj_artist") && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                    <Link size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> YouTube Channel
                  </label>
                  <input
                    type="text"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/c/yourchannel"
                    className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-[#FDF9F1] dark:bg-[#1A1A1A] px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
                  />
                </div>
              )}
            </div>

            {/* 9. Location & Interactive Map Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                <MapPin size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> Primary Business Location & Service District
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. 45 Galle Road, Colombo 03"
                    className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-[#FDF9F1] dark:bg-[#1A1A1A] pl-10 pr-4 py-3 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsMapModalOpen(true)}
                  className="px-5 py-3 bg-[#FAF6EE] dark:bg-[#252525] border border-[#7C6A2E] dark:border-[#C9A84C] text-[#7C6A2E] dark:text-[#C9A84C] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#7C6A2E] hover:text-white dark:hover:bg-[#C9A84C] dark:hover:text-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Compass size={16} /> Pick on Map Modal
                </button>
              </div>
            </div>

          </div>
        </div>
      </form>

      {/* SECTION 3: Manager Provisioned Owner Details (10. Owner Details) */}
      <div className="bg-white dark:bg-[#111111] border border-[#E0D8C3] dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-[#FAF6EE] dark:bg-[#161616] px-6 py-4 border-b border-[#E0D8C3] dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#7C6A2E] dark:text-[#C9A84C]" />
            <h3 className="font-serif italic text-base font-bold text-[#7C6A2E] dark:text-[#C9A84C]">
              Verified Owner Credentials (Manager Provisioned)
            </h3>
          </div>
          <span className="text-[9px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 px-2.5 py-1 rounded border border-emerald-300 dark:border-emerald-800">
            Verified Record
          </span>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <p className="text-xs text-gray-500 leading-relaxed">
            The owner details below were officially registered and verified by EASCC Hotel Management during your partner account provisioning.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#FAF6EE]/60 dark:bg-[#151515] p-6 rounded-xl border border-[#E0D8C3]/60 dark:border-gray-800">
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                Owner First Name
              </span>
              <p className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                {ownerInfo.firstName || "N/A"}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                Owner Last Name
              </span>
              <p className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                {ownerInfo.lastName || "N/A"}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                Owner NIC Number (Sri Lankan Format)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-mono text-[#7C6A2E] dark:text-[#C9A84C] bg-white dark:bg-black px-3 py-1 rounded border border-[#E0D8C3] dark:border-gray-800">
                  {ownerInfo.ownerNic}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Security & Password Changing */}
      <div className="bg-white dark:bg-[#111111] border border-[#E0D8C3] dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-[#FAF6EE] dark:bg-[#161616] px-6 py-4 border-b border-[#E0D8C3] dark:border-gray-800 flex items-center gap-2">
          <Key className="w-5 h-5 text-[#7C6A2E] dark:text-[#C9A84C]" />
          <h3 className="font-serif italic text-base font-bold text-[#7C6A2E] dark:text-[#C9A84C]">
            Security & Account Password Change
          </h3>
        </div>

        <form onSubmit={handleChangePassword} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                <Lock size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-[#FDF9F1] dark:bg-[#1A1A1A] px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
              />
              {passwordErrors.currentPassword && (
                <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                <Key size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Minimum 6 characters"
                className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-[#FDF9F1] dark:bg-[#1A1A1A] px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
              />
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                <Check size={14} className="text-[#7C6A2E] dark:text-[#C9A84C]" /> Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Repeat new password"
                className="w-full border border-[#E0D8C3] dark:border-gray-700 bg-[#FDF9F1] dark:bg-[#1A1A1A] px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#7C6A2E]"
              />
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingPassword}
              className="bg-[#4E411B] hover:bg-[#382F13] disabled:bg-gray-400 text-white px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md flex items-center gap-2 cursor-pointer"
            >
              {savingPassword ? "Updating..." : "Update Security Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Interactive Modals */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        onSave={handleSaveCroppedAvatar}
        onDeleteAvatar={avatarUrl ? handleDeleteAvatar : undefined}
        currentAvatar={avatarUrl}
      />

      <LocationMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSelectLocation={(loc) => setFormData((prev) => ({ ...prev, location: loc }))}
        initialLocation={formData.location}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] animate-[fadeIn_0.3s_ease-out]">
          <div
            className={`border text-white px-8 py-4 shadow-2xl flex items-center space-x-4 rounded-xl ${
              toastType === "success"
                ? "bg-gray-900 border-[#B08D2C]"
                : "bg-red-900 border-red-500"
            }`}
          >
            {toastType === "success" ? (
              <div className="w-6 h-6 rounded-full bg-[#B08D2C] flex items-center justify-center shrink-0">
                <Check size={14} className="text-white" />
              </div>
            ) : (
              <AlertCircle size={20} className="text-red-400" />
            )}
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-gray-100">
              {toastMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

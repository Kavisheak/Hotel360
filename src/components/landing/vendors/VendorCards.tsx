import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Heart, ShieldCheck, HelpCircle, Check, X, Phone, Mail, AlertTriangle, MessageSquare, MapPin, Briefcase, ChevronLeft, ChevronRight, Image as ImageIcon, SlidersHorizontal, PlayCircle, ArrowRight, Sparkles, Users, Eye, ShoppingBag } from "lucide-react";
import { Vendor } from "./types";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { useVendorStore } from "@/store/vendorStore";
import { useToastStore } from "@/store/toastStore";
import LoginRequiredModal from "@/components/landing/shared/LoginRequiredModal";
import VendorReplaceModal from "@/components/landing/shared/VendorReplaceModal";
import VendorFavoriteModal from "@/components/landing/shared/VendorFavoriteModal";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioViewerModal } from './PortfolioViewerModal';

interface VendorCardsProps {
  filteredVendors: Vendor[];
  onClearFilters: () => void;
  isGuest?: boolean;
  sortBy?: string;
}

export default function VendorCards({
  filteredVendors,
  onClearFilters,
  isGuest = true,
  sortBy
}: VendorCardsProps) {
  const router = useRouter();
  const { vendors: allVendors } = useVendorStore();
  const { addToast } = useToastStore();
  const { vendors: cartVendors, requestedDesigns, setVendor, favoriteVendors, toggleFavoriteVendor } = useVendorCartStore();
  
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalMessage, setLoginModalMessage] = useState("");

  const [compareList, setCompareList] = useState<string[]>([]);

  // Selection Replace Confirmation Modal State
  const [replaceModalOpen, setReplaceModalOpen] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<{ id: string; category: string; name: string; portfolioItemId?: string; portfolioPrice?: number } | null>(null);
  const [existingVendorName, setExistingVendorName] = useState("");

  // Favorite Confirmation Modal State
  const [favoriteModalOpen, setFavoriteModalOpen] = useState(false);
  const [pendingFavoriteVendor, setPendingFavoriteVendor] = useState<{ id: string; name: string; isRemoving: boolean } | null>(null);

  // Contact Modal State
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactVendor, setContactVendor] = useState<Vendor | null>(null);
  
  const [selectedPortfolio, setSelectedPortfolio] = useState<{ vendor: Vendor; item: any } | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const [inquiryText, setInquiryText] = useState("");
  const [isInquiring, setIsInquiring] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  
  const [flyingItem, setFlyingItem] = useState<{ id: number, url: string, startX: number, startY: number, endX: number, endY: number } | null>(null);

  // Gallery Navigation State
  const [galleryIndices, setGalleryIndices] = useState<Record<string, number>>({});

  // Pagination State
  const [visibleCount, setVisibleCount] = useState(24);

  React.useEffect(() => {
    setVisibleCount(24);
  }, [filteredVendors]);

  const handleRestrictedAction = (message: string, action: () => void) => {
    if (isGuest) {
      setLoginModalMessage(message);
      setLoginModalOpen(true);
    } else {
      action();
    }
  };

  const toggleCompare = (id: string) => {
    setCompareList(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const getStoreCategory = (category: string): "decorator" | "dj" | "videographer" | "photographer" | "cake" | "florist" => {
    const cat = (category || "").toLowerCase();
    if (cat.includes("decorator")) return "decorator";
    if (cat.includes("dj")) return "dj";
    if (cat.includes("videograph")) return "videographer";
    if (cat.includes("photograph")) return "photographer";
    if (cat.includes("cake")) return "cake";
    if (cat.includes("florist")) return "florist";
    return "decorator"; // fallback
  };

  const getAvailability = (vendor: Vendor) => {
    const lastChar = vendor.id.slice(-1);
    if (["3", "4", "5"].includes(lastChar)) {
      return { status: "booked", label: "Booked Out", color: "text-red-600 bg-red-100", dot: "bg-red-500" };
    }
    if (["0", "1", "2"].includes(lastChar)) {
      return { status: "limited", label: "Limited", color: "text-amber-600 bg-amber-100", dot: "bg-amber-500" };
    }
    return { status: "available", label: "Available", color: "text-emerald-700 bg-emerald-100", dot: "bg-emerald-500" };
  };

  const getButtonConfig = (cat: string, isSelected: boolean) => {
    if (cat === "videographer") {
      return {
        viewIcon: <PlayCircle className="w-4 h-4" />,
        viewText: "View Gallery",
        selectIcon: <ShoppingBag className="w-4 h-4" />,
        selectText: isSelected ? "Selected" : "Book Service",
      };
    }
    if (cat === "dj") {
      return {
        viewIcon: <Eye className="w-4 h-4" />,
        viewText: "View Profile",
        selectIcon: <ShoppingBag className="w-4 h-4" />,
        selectText: isSelected ? "Selected" : "Book DJ",
      };
    }
    return {
      viewIcon: <Eye className="w-4 h-4" />,
      viewText: "View Design",
      selectIcon: <ShoppingBag className="w-4 h-4" />,
      selectText: isSelected ? "Selected" : "Select Design",
    };
  };

  const triggerFlyAnimation = (url: string, startRect?: DOMRect) => {
    if (!startRect) return;
    
    // Fallback coordinates: bottom right corner where the FAB spawns
    let endX = window.innerWidth - 60;
    let endY = window.innerHeight - 60;
    
    // Slight delay to allow DOM to render the bottom banner if it wasn't there
    setTimeout(() => {
      const destBtn = document.getElementById('floating-cart-btn');
      if (destBtn) {
        const destRect = destBtn.getBoundingClientRect();
        endX = destRect.left + destRect.width / 2;
        endY = destRect.top + destRect.height / 2;
      }
      
      setFlyingItem({
        id: Date.now(),
        url,
        startX: startRect.left + startRect.width / 2,
        startY: startRect.top + startRect.height / 2,
        endX,
        endY
      });
      setTimeout(() => setFlyingItem(null), 1300);
    }, 10);
  };

  const handleSelectClick = (vendor: Vendor, portfolioItem: any, rect?: DOMRect) => {
    const storeCat = getStoreCategory(vendor.category);
    const existingId = cartVendors[storeCat];

    if (existingId === vendor.id) {
      if (portfolioItem && requestedDesigns[storeCat] !== (portfolioItem._id || portfolioItem.id)) {
        // Switching to a different design from the same vendor
        useVendorCartStore.setState((state) => ({
          requestedDesigns: { ...state.requestedDesigns, [storeCat]: (portfolioItem._id || portfolioItem.id) },
          requestedDesignPrices: { ...state.requestedDesignPrices, [storeCat]: portfolioItem.price }
        }));
        triggerFlyAnimation(vendor.avatar || vendor.image, rect);
      } else {
        // Toggling off completely
        setVendor(storeCat, null);
        useVendorCartStore.setState((state) => ({
          requestedDesigns: { ...state.requestedDesigns, [storeCat]: null },
          requestedDesignPrices: { ...state.requestedDesignPrices, [storeCat]: null }
        }));
      }
      return;
    }

    if (existingId) {
      const skipConfirmation = useVendorCartStore.getState().skipReplaceConfirmation;
      if (skipConfirmation) {
        // Skip modal, replace immediately
        setVendor(storeCat, vendor.id);
        useVendorCartStore.setState((state) => ({
          requestedDesigns: { ...state.requestedDesigns, [storeCat]: portfolioItem ? (portfolioItem._id || portfolioItem.id) : null },
          requestedDesignPrices: { ...state.requestedDesignPrices, [storeCat]: portfolioItem?.price || null }
        }));
        triggerFlyAnimation(vendor.avatar || vendor.image, rect);
      } else {
        const existing = allVendors.find(v => v.id === existingId);
        setExistingVendorName(existing ? existing.name : "another provider");
        // Save the rect in pending selection so we can trigger it upon confirm if we wanted, but we'll skip for now or just trigger it.
        setPendingSelection({ id: vendor.id, category: vendor.category, name: vendor.name, portfolioItemId: portfolioItem ? (portfolioItem._id || portfolioItem.id) : null, portfolioPrice: portfolioItem?.price });
        setReplaceModalOpen(true);
      }
    } else {
      setVendor(storeCat, vendor.id);
      useVendorCartStore.setState((state) => ({
        requestedDesigns: { ...state.requestedDesigns, [storeCat]: portfolioItem ? (portfolioItem._id || portfolioItem.id) : null },
        requestedDesignPrices: { ...state.requestedDesignPrices, [storeCat]: portfolioItem?.price || null }
      }));
      triggerFlyAnimation(vendor.avatar || vendor.image, rect);
    }
  };

  const confirmReplace = (dontAskAgain: boolean) => {
    if (pendingSelection) {
      if (dontAskAgain) {
        useVendorCartStore.getState().setSkipReplaceConfirmation(true);
      }
      
      const storeCat = getStoreCategory(pendingSelection.category);
      setVendor(storeCat, pendingSelection.id);
      useVendorCartStore.setState((state) => ({
        requestedDesigns: { ...state.requestedDesigns, [storeCat]: pendingSelection.portfolioItemId || null },
        requestedDesignPrices: { ...state.requestedDesignPrices, [storeCat]: pendingSelection.portfolioPrice || null }
      }));
      setReplaceModalOpen(false);
      setPendingSelection(null);
    }
  };

  const handleFavoriteClick = (vendor: Vendor) => {
    const isFavorite = favoriteVendors.includes(vendor.id);
    const skipConfirmation = useVendorCartStore.getState().skipFavoriteConfirmation;

    if (skipConfirmation) {
      toggleFavoriteVendor(vendor.id);
      addToast({ 
        message: isFavorite 
          ? `${vendor.name} removed from favorites` 
          : `${vendor.name} added to favorites!`, 
        type: isFavorite ? "info" : "success" 
      });
    } else {
      setPendingFavoriteVendor({ id: vendor.id, name: vendor.name, isRemoving: isFavorite });
      setFavoriteModalOpen(true);
    }
  };

  const confirmFavorite = (dontAskAgain: boolean) => {
    if (pendingFavoriteVendor) {
      if (dontAskAgain) {
        useVendorCartStore.getState().setSkipFavoriteConfirmation(true);
      }
      toggleFavoriteVendor(pendingFavoriteVendor.id);
      
      const isNowRemoving = pendingFavoriteVendor.isRemoving;
      addToast({ 
        message: isNowRemoving 
          ? `${pendingFavoriteVendor.name} removed from favorites` 
          : `${pendingFavoriteVendor.name} added to favorites!`, 
        type: isNowRemoving ? "info" : "success" 
      });

      setFavoriteModalOpen(false);
      setPendingFavoriteVendor(null);
    }
  };

  const sendInquiry = () => {
    setIsInquiring(true);
    setTimeout(() => {
      setIsInquiring(false);
      setInquirySent(true);
    }, 1200);
  };

  const handleContactClick = (vendor: Vendor) => {
    setContactVendor(vendor);
    setInquirySent(false);
    setContactModalOpen(true);
  };

  const nextGalleryImage = (e: React.MouseEvent, vendorId: string, max: number) => {
    e.stopPropagation();
    setGalleryIndices(prev => ({
      ...prev,
      [vendorId]: ((prev[vendorId] || 0) + 1) % max
    }));
  };

  const prevGalleryImage = (e: React.MouseEvent, vendorId: string, max: number) => {
    e.stopPropagation();
    setGalleryIndices(prev => ({
      ...prev,
      [vendorId]: ((prev[vendorId] || 0) - 1 + max) % max
    }));
  };

  const getGalleryImages = (vendor: Vendor) => {
    let images: string[] = [];
    if (vendor.portfolio && vendor.portfolio.length > 0) {
      images.push(...vendor.portfolio);
    }
    if (vendor.portfolioItems && vendor.portfolioItems.length > 0) {
      vendor.portfolioItems.forEach((pi) => {
        if (pi.media && Array.isArray(pi.media)) {
          pi.media.forEach((m: any) => {
            if (m.url) images.push(m.url);
          });
        }
      });
    }
    images = [...new Set(images)];
    if (images.length === 0) {
      images = [vendor.image, vendor.image, vendor.image];
    } else if (images.length < 3) {
      images = [...images, ...Array(3 - images.length).fill(vendor.image)];
    }
    return images;
  };

  const flattenedCards = filteredVendors.flatMap((vendor) => {
    if (vendor.portfolioItems && vendor.portfolioItems.length > 0) {
      return vendor.portfolioItems.map((item, idx) => ({
        vendor,
        portfolioItem: item,
        cardKey: `${vendor.id}-portfolio-${item._id || item.id || idx}`,
        createdAt: item.createdAt || "1970-01-01T00:00:00.000Z"
      }));
    }

    // Map legacy portfolio string array to individual cards for visual vendors
    const cat = (vendor.category || "").toLowerCase();
    const isDjCakeFlorist = cat.includes('dj') || cat.includes('florist') || cat.includes('cake');
    const isVisual = cat.includes('videograph') || cat.includes('decorator') || cat.includes('photograph');

    if (vendor.portfolio && vendor.portfolio.length > 0 && !isDjCakeFlorist) {
      return vendor.portfolio.map((url, idx) => ({
        vendor,
        portfolioItem: {
          id: `legacy-${idx}`,
          title: vendor.name + " Portfolio",
          description: vendor.description,
          price: parseInt(vendor.startingPrice?.replace(/[^0-9]/g, "")) || 0,
          media: [{ url, isCover: true, designType: 'general' }]
        },
        cardKey: `${vendor.id}-legacy-${idx}`,
        createdAt: vendor.createdAt || "1970-01-01T00:00:00.000Z"
      }));
    }

    // Hide visual vendors if they have absolutely no portfolio items
    if (isVisual) {
      return [];
    }

    // Fallback for DJs, Cakes, etc. who don't rely heavily on individual portfolio cards
    return [{
      vendor,
      portfolioItem: null,
      cardKey: vendor.id,
      createdAt: vendor.createdAt || "1970-01-01T00:00:00.000Z"
    }];
  });

  if (sortBy === "newest") {
    flattenedCards.sort((a, b) => {
      const timeA = new Date(a.portfolioItem?.createdAt || a.vendor.updatedAt || a.vendor.createdAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.portfolioItem?.createdAt || b.vendor.updatedAt || b.vendor.createdAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    });
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {filteredVendors.length === 0 ? (
        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 py-20 px-6 text-center space-y-4 rounded-[24px] shadow-xl">
          <HelpCircle className="w-16 h-16 mx-auto text-[#C9A84C]" />
          <h3 className="text-2xl font-serif text-[#2C1E14] dark:text-white">No Partners Found</h3>
          <p className="max-w-md mx-auto text-gray-500 dark:text-gray-400 text-sm font-light leading-relaxed">
            We couldn't find any service providers matching your search criteria. Try modifying your filters.
          </p>
          <button 
            onClick={onClearFilters}
            className="mt-4 bg-[#C9A84C] text-white px-8 py-3 text-xs uppercase font-bold tracking-widest hover:bg-[#B3933E] transition-colors rounded-full"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {flattenedCards.slice(0, visibleCount).map(({ vendor, portfolioItem, cardKey }) => {
            const isFavorite = favoriteVendors?.includes(vendor.id) || false;
            const isCompareSelected = compareList.includes(vendor.id);
            const storeCat = getStoreCategory(vendor.category);
            const isVendorSelected = cartVendors[storeCat] === vendor.id;
            
            const pId = portfolioItem ? (portfolioItem._id || portfolioItem.id) : null;
            const firstPId = vendor.portfolioItems?.[0] ? (vendor.portfolioItems[0]._id || vendor.portfolioItems[0].id) : null;
            
            const isSelected = isVendorSelected && (!portfolioItem || requestedDesigns[storeCat] === pId || (!requestedDesigns[storeCat] && pId === firstPId));
            const availability = getAvailability(vendor);
            
            // Get cover & gallery images for this specific portfolio card
            let coverImage = vendor.image;
            let coverIsVideo = false;
            let galleryMedia: { url: string, isVideo: boolean }[] = [];

            if (portfolioItem && portfolioItem.media && portfolioItem.media.length > 0) {
              const coverMedia = portfolioItem.media.find((m: any) => m.isCover) || portfolioItem.media[0];
              coverImage = coverMedia?.url || vendor.image;
              coverIsVideo = (coverMedia?.resourceType === 'video' || coverMedia?.mediaType === 'video');
              galleryMedia = portfolioItem.media.map((m: any) => ({
                url: m.url,
                isVideo: (m.resourceType === 'video' || m.mediaType === 'video')
              }));
            } else {
              const urls = getGalleryImages(vendor);
              if (urls.length > 0) coverImage = urls[0];
              galleryMedia = urls.map(url => ({ 
                url, 
                isVideo: url.includes('.mp4') || url.includes('.webm') || url.includes('/video/') 
              }));
            }

            if (galleryMedia.length < 3) {
              galleryMedia = [...galleryMedia, ...Array(3 - galleryMedia.length).fill({ url: vendor.image, isVideo: false })];
            }

            const currentGalleryIdx = galleryIndices[cardKey] || 0;
            const hasPortfolio = galleryMedia.length > 0 && galleryMedia[0].url !== vendor.image;

            const cardTitle = portfolioItem?.title ? portfolioItem.title : vendor.name;
            const cardPrice = portfolioItem?.price && portfolioItem.price > 0 ? `LKR ${portfolioItem.price.toLocaleString()}` : vendor.startingPrice;
            const cardDesc = portfolioItem?.description || vendor.description;

            return (
              <div 
                key={cardKey} 
                className={`bg-white flex flex-col transition-all duration-300 rounded-3xl overflow-hidden group relative
                  ${isSelected ? 'border-2 border-[#D4AF37] shadow-[0_12px_40px_rgba(201,168,76,0.25)] transform -translate-y-1' : 'border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]'}`}
              >

                {/* Main Cover Image/Video */}
                <div className="relative h-[200px] w-full bg-black overflow-hidden">
                  {coverIsVideo ? (
                    <video 
                      src={coverImage} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90" 
                    />
                  ) : (
                    <img src={coverImage} alt={cardTitle} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  )}
                  
                  {/* Curved SVG Bottom Overlay */}
                  <svg className="absolute bottom-[-1px] left-0 w-full text-white fill-current" viewBox="0 0 1440 100" preserveAspectRatio="none">
                    <path d="M0,50 C480,120 960,-20 1440,50 L1440,100 L0,100 Z" />
                  </svg>
                  
                  {/* Category Label (Top Left) */}
                  <div className="absolute top-4 left-4 bg-[#C9A84C] text-white px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md border border-[#D4AF37]/50">
                    <ImageIcon className="w-3 h-3" />
                    <span className="text-[10px] font-extrabold tracking-widest uppercase">{vendor.categoryLabel || storeCat}</span>
                  </div>

                  {/* Favorite Button (Top Right) */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestrictedAction("Please log in to add vendors to your favorites list.", () => handleFavoriteClick(vendor));
                    }} 
                    className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors z-20"
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                </div>

                {/* Card Body */}
                <div className="px-6 pt-12 pb-6 bg-white flex-1 flex flex-col relative text-left">
                  {/* Avatar (overlapping curve) */}
                  <div className="absolute -top-[42px] left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                    <img 
                      src={vendor.avatar || vendor.image} 
                      alt={vendor.name} 
                      onClick={() => handleRestrictedAction("Please log in to explore this profile.", () => router.push(`/customer/vendorProfile/${vendor.id}`))}
                      className="w-[84px] h-[84px] rounded-full object-cover border-[4px] border-white bg-white shadow-md pointer-events-auto cursor-pointer hover:scale-105 transition-transform" 
                    />
                  </div>
                  
                  {/* Name & Basic Info */}
                  <div className="mb-3 relative z-10 text-center">
                    <h3 className="text-[22px] font-serif font-bold text-[#1a202c] leading-tight truncate mb-1" title={cardTitle}>
                      {cardTitle}
                    </h3>
                    <p className="text-[13px] font-bold text-[#C9A84C] flex items-center justify-center gap-1.5">
                      by {vendor.name} {vendor.isVerified && <ShieldCheck className="w-4 h-4 text-[#C9A84C]" />}
                    </p>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-center gap-3 text-[11px] text-gray-500 font-medium whitespace-nowrap mb-4 relative z-10">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />
                      <strong className="text-gray-800 text-xs">{vendor.rating}</strong> ({vendor.reviewsCount} reviews)
                    </span>
                    <span className="text-gray-200">|</span>
                    <span className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-gray-400"/> {vendor.location || 'Eravur, Sri Lanka'}
                    </span>
                  </div>

                  {/* Price & Description */}
                  <div className={`flex ${storeCat === 'dj' ? 'flex-col gap-2 mb-2' : 'gap-4 mb-4'}`}>
                    {storeCat === 'decorator' && (
                      <div className="bg-[#FDFBF7] rounded-xl p-3 border border-[#F2E5C5] w-[140px] flex-shrink-0 flex flex-col justify-center text-center">
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Package Price</span>
                        <span className="text-lg font-bold text-[#C9A84C]">{cardPrice}</span>
                      </div>
                    )}
                    <div className="flex flex-col gap-2 overflow-hidden w-full">
                      <p className={`text-xs text-gray-600 leading-relaxed ${storeCat === 'dj' ? 'line-clamp-1 text-center italic px-4' : 'line-clamp-2'}`}>
                        {cardDesc || (storeCat === 'dj' ? 'Professional DJ mixing and premium sound systems.' : 'Elegant setup with premium accents, perfect for large stages and reception setups.')}
                      </p>
                      
                      {portfolioItem && storeCat !== 'videographer' && (
                        <div className="flex flex-wrap gap-1.5 mt-auto">
                          {portfolioItem.eventTypes && portfolioItem.eventTypes.slice(0, 1).map((t: string) => (
                            <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[9px] uppercase tracking-wider font-bold rounded-md truncate max-w-[100px]">
                              {t}
                            </span>
                          ))}
                          {portfolioItem.videoStyles && portfolioItem.videoStyles.slice(0, 1).map((t: string) => (
                            <span key={t} className="px-2 py-0.5 bg-[#FDFBF7] border border-[#F2E5C5] text-[#C9A84C] text-[9px] uppercase tracking-wider font-bold rounded-md truncate max-w-[100px]">
                              {t}
                            </span>
                          ))}
                          {portfolioItem.servicesProvided && portfolioItem.servicesProvided.slice(0, 1).map((t: string) => (
                            <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[9px] uppercase tracking-wider font-bold rounded-md truncate max-w-[100px]">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Removed inline dj tags to give them an expanded block below */}
                    </div>
                  </div>

                  {/* DJ Expanded Details (Replaces Gallery Strip space) */}
                  {!portfolioItem && storeCat === 'dj' && (
                    <div className="flex flex-col gap-2.5 h-[80px] mb-5 overflow-hidden px-1">
                      {vendor.musicGenres && vendor.musicGenres.length > 0 && (
                        <div className="flex items-start gap-2">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest shrink-0 w-[55px] pt-0.5">Genres</span>
                          <div className="flex flex-wrap gap-1.5">
                            {vendor.musicGenres.slice(0, 4).map((t: string) => (
                              <span key={`genre-${t}`} className="px-2 py-0.5 bg-[#FDFBF7] border border-[#F2E5C5] text-[#C9A84C] text-[9px] uppercase tracking-wider font-bold rounded-md truncate max-w-[100px]" title={t}>{t}</span>
                            ))}
                            {vendor.musicGenres.length > 4 && <span className="text-[9px] text-gray-400 font-bold self-center">+{vendor.musicGenres.length - 4}</span>}
                          </div>
                        </div>
                      )}
                      
                      {vendor.servicesOffered && vendor.servicesOffered.length > 0 && (
                        <div className="flex items-start gap-2">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest shrink-0 w-[55px] pt-0.5">Services</span>
                          <div className="flex flex-wrap gap-1.5">
                            {vendor.servicesOffered.slice(0, 3).map((t: string) => (
                              <span key={`service-${t}`} className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-gray-600 text-[9px] uppercase tracking-wider font-bold rounded-md truncate max-w-[100px]" title={t}>{t}</span>
                            ))}
                            {vendor.servicesOffered.length > 3 && <span className="text-[9px] text-gray-400 font-bold self-center">+{vendor.servicesOffered.length - 3}</span>}
                          </div>
                        </div>
                      )}

                      {vendor.eventTypesServed && vendor.eventTypesServed.length > 0 && (
                        <div className="flex items-start gap-2">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest shrink-0 w-[55px] pt-0.5">Events</span>
                          <div className="flex flex-wrap gap-1.5">
                            {vendor.eventTypesServed.slice(0, 3).map((t: string) => (
                              <span key={`event-${t}`} className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-gray-600 text-[9px] uppercase tracking-wider font-bold rounded-md truncate max-w-[100px]" title={t}>{t}</span>
                            ))}
                            {vendor.eventTypesServed.length > 3 && <span className="text-[9px] text-gray-400 font-bold self-center">+{vendor.eventTypesServed.length - 3}</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mini Gallery Strip */}
                  {hasPortfolio && (
                    <div className="flex gap-2 h-[60px] mb-5 overflow-hidden">
                      {galleryMedia.slice(0, 4).map((media, idx) => (
                        <div key={idx} className="relative h-full flex-1 min-w-0 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                          {media.isVideo ? (
                            <>
                              <video src={media.url} className="w-full h-full object-cover opacity-80" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                <PlayCircle className="w-4 h-4 text-white opacity-90 shadow-sm" />
                              </div>
                            </>
                          ) : (
                            <img src={media.url} className="w-full h-full object-cover" />
                          )}
                        </div>
                      ))}
                      {galleryMedia.length > 4 && (
                        <div 
                          className="h-full w-[60px] flex-shrink-0 bg-gray-50 border border-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors" 
                          onClick={() => { if(portfolioItem) { setSelectedPortfolio({ vendor, item: portfolioItem }); setIsViewerOpen(true); } else { router.push(`/customer/vendorProfile/${vendor.id}`); } }}
                        >
                          <ImageIcon className="w-4 h-4 mb-0.5" />
                          <span className="text-[9px] font-bold">+{galleryMedia.length - 4}<br/>More</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions Buttons */}
                  <div className="flex gap-3 mt-auto">
                    <button 
                      onClick={() => handleRestrictedAction("Please log in to view detailed portfolios.", () => {
                        if (portfolioItem) {
                          setSelectedPortfolio({ vendor, item: portfolioItem });
                          setIsViewerOpen(true);
                        } else {
                          router.push(`/customer/vendorProfile/${vendor.id}`);
                        }
                      })}
                      className="flex-1 py-3.5 rounded-xl border-2 border-gray-100 text-gray-700 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                    >
                      {getButtonConfig(storeCat, isSelected).viewIcon} {getButtonConfig(storeCat, isSelected).viewText}
                    </button>
                    <button 
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        handleRestrictedAction("Please log in to select vendors for your booking.", () => handleSelectClick(vendor, portfolioItem, rect));
                      }}
                      className={`flex-1 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg ${isSelected ? 'bg-[#D4AF37] text-white hover:bg-[#C9A84C]' : 'bg-[#C9A84C] text-white hover:bg-[#D4AF37] hover:-translate-y-0.5'}`}
                    >
                      {getButtonConfig(storeCat, isSelected).selectIcon} {getButtonConfig(storeCat, isSelected).selectText}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
          </div>
          
          {visibleCount < flattenedCards.length && (
            <div className="mt-12 flex justify-center">
              <button 
                onClick={() => setVisibleCount(prev => prev + 24)}
                className="bg-white dark:bg-[#111111] text-[#C9A84C] border border-[#C9A84C] px-10 py-3.5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#C9A84C] hover:text-white transition-all shadow-sm flex items-center gap-2 group"
              >
                Load More 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Selected Vendors Bottom Banner */}
      <AnimatePresence>
        {(cartVendors.decorator || cartVendors.videographer || cartVendors.dj || cartVendors.photographer || cartVendors.cake || cartVendors.florist) && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="relative z-10 w-full bg-white dark:bg-[#1A1A1A] border border-[#E8DFC9] dark:border-[#C9A84C]/30 shadow-xl rounded-[32px] mt-12 py-10 lg:py-12"
          >
            <div className="max-w-7xl mx-auto px-6">
              
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative">
                
                {/* Background ambient image decoration */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02] rounded-3xl overflow-hidden" style={{ backgroundImage: 'url("/images/placeholders/hero-hall.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }} />

                <div className="flex-1 flex flex-col md:flex-row items-center md:items-start gap-6 z-10 text-center md:text-left w-full lg:w-auto">
                  <div>
                    <span className="text-[9px] uppercase font-extrabold tracking-[0.25em] text-[#C9A84C] mb-2 block">Ready to make it perfect?</span>
                    <h2 className="text-3xl lg:text-4xl font-serif text-[#2C1E14] dark:text-white leading-none">Build Your <span className="text-[#C9A84C]">Dream Team</span></h2>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 font-light mt-3 mb-4 max-w-sm mx-auto md:mx-0">You've selected the best vendors for your special day. Let's create something unforgettable together.</p>
                    
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                      <div className="flex -space-x-2">
                        {[1,2,3,4].map(i => (
                          <img key={i} src={`/images/placeholders/vendors/default-${i}.jpg`} className="w-8 h-8 rounded-full border-[2px] border-white dark:border-[#1A1A1A] object-cover shadow-sm" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 leading-tight">
                        <strong className="text-black dark:text-white">5,000+</strong> Happy Couples<br/><span className="text-gray-400 font-medium">Trusted EASCCA</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center lg:items-end w-full z-10">
                  <div className="w-full max-w-[500px] bg-white dark:bg-[#111111] border border-gray-100 dark:border-white/5 shadow-sm rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-5">
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200 font-serif">Your Selected Vendors</span>
                      <button onClick={() => router.push('/customer/cart')} className="text-[10px] text-[#C9A84C] font-bold uppercase tracking-widest hover:underline hover:text-[#D4AF37]">View All ({(cartVendors.decorator ? 1 : 0) + (cartVendors.videographer ? 1 : 0) + (cartVendors.dj ? 1 : 0) + (cartVendors.photographer ? 1 : 0) + (cartVendors.cake ? 1 : 0) + (cartVendors.florist ? 1 : 0)})</button>
                    </div>
                    
                    <div className="flex items-center justify-between gap-3 overflow-x-auto pb-5 snap-x hide-scrollbar">
                      {/* Selected Avatars */}
                      {['decorator', 'videographer', 'dj', 'photographer', 'cake', 'florist'].map(role => {
                        const vId = cartVendors[role as keyof typeof cartVendors];
                        const v = vId ? allVendors.find(x => x.id === vId) : null;
                        if (!v) return null;
                        
                        return (
                          <div key={role} className="flex items-center gap-3 flex-shrink-0 snap-start bg-gray-50 dark:bg-white/5 py-2 px-3 rounded-full border border-gray-100 dark:border-white/5">
                            <img src={v.avatar || v.image} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                            <div className="flex flex-col pr-2">
                              <span className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-none">{v.name}</span>
                              <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-1 font-medium">{v.categoryLabel}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button 
                      id="proceed-booking-btn"
                      onClick={() => {
                        sessionStorage.setItem("importFromCart", "true");
                        router.push('/book?fromCart=true');
                      }}
                      className="group relative overflow-hidden w-full bg-gradient-to-r from-[#C9A84C] via-[#D4AF37] to-[#C9A84C] bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white py-4 rounded-xl text-xs uppercase font-extrabold tracking-widest hover:-translate-y-1 shadow-lg hover:shadow-[0_15px_30px_rgba(201,168,76,0.3)] flex items-center justify-center gap-2"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Proceed to Booking ({(cartVendors.decorator ? 1 : 0) + (cartVendors.videographer ? 1 : 0) + (cartVendors.dj ? 1 : 0) + (cartVendors.photographer ? 1 : 0) + (cartVendors.cake ? 1 : 0) + (cartVendors.florist ? 1 : 0)}/6)
                      </span>
                      <div className="relative z-10 flex items-center">
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                        <Sparkles className="w-4 h-4 absolute -right-2 opacity-0 group-hover:opacity-100 group-hover:animate-pulse text-white transition-opacity duration-300" />
                      </div>
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0"></div>
                    </button>
                    
                    <div className="flex justify-center items-center gap-6 mt-4.5 text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wider uppercase">
                      <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#C9A84C]"/> Secure</span>
                      <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-[#C9A84C]"/> Cozy</span>
                      <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-[#C9A84C]"/> Personalized</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginRequiredModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
        message={loginModalMessage} 
      />

      {/* Flying Cart Animation */}
      <AnimatePresence>
        {flyingItem && (
          <motion.img
            key={flyingItem.id}
            src={flyingItem.url}
            initial={{ 
              position: 'fixed', 
              left: flyingItem.startX, 
              top: flyingItem.startY, 
              width: 80, 
              height: 80,
              borderRadius: '50%',
              x: '-50%',
              y: '-50%',
              scale: 1,
              opacity: 1,
              zIndex: 9999
            }}
            animate={{ 
              top: flyingItem.endY, 
              left: flyingItem.endX,
              scale: 0.05,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            className="pointer-events-none object-cover border-4 border-[#D4AF37] shadow-2xl"
          />
        )}
      </AnimatePresence>

      {/* Vendor Replacement Confirmation Modal */}
      {replaceModalOpen && pendingSelection && (
        <VendorReplaceModal
          isOpen={replaceModalOpen}
          onClose={() => {
            setReplaceModalOpen(false);
            setPendingSelection(null);
          }}
          onConfirm={confirmReplace}
          categoryLabel={pendingSelection.category}
          newVendorName={pendingSelection.name}
          rating={allVendors.find(v => v.id === pendingSelection.id)?.rating}
          price={(pendingSelection.portfolioPrice || allVendors.find(v => v.id === pendingSelection.id)?.startingPrice) as any}
        />
      )}

      {/* Vendor Favorite Confirmation Modal */}
      <VendorFavoriteModal
        isOpen={favoriteModalOpen}
        onClose={() => {
          setFavoriteModalOpen(false);
          setPendingFavoriteVendor(null);
        }}
        onConfirm={confirmFavorite}
        vendorName={pendingFavoriteVendor?.name || ""}
        isRemoving={pendingFavoriteVendor?.isRemoving || false}
      />

      {/* Portfolio Viewer Modal */}
      <PortfolioViewerModal
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setTimeout(() => setSelectedPortfolio(null), 300); // clear after animation
        }}
        portfolioItem={selectedPortfolio?.item || null}
        vendor={selectedPortfolio?.vendor || null}
        onSelectDesign={() => {
          if (selectedPortfolio) {
            handleSelectClick(selectedPortfolio.vendor, selectedPortfolio.item, new DOMRect(window.innerWidth / 2, window.innerHeight / 2, 0, 0));
          }
        }}
      />

      {/* Contact Vendor Modal */}
      <AnimatePresence>
        {contactModalOpen && contactVendor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setContactModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-[#111111] p-8 max-w-lg w-full rounded-[24px] shadow-2xl border border-[#E8DFC9] dark:border-[#C9A84C]/30 z-10 flex flex-col"
            >
              <button 
                onClick={() => setContactModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {!inquirySent ? (
                <>
                  <h3 className="font-serif text-2xl text-[#2C1E14] dark:text-white mb-6 border-b border-[#E8DFC9] dark:border-zinc-800 pb-3">Contact Partner</h3>
                  
                  <div className="flex gap-4 items-center mb-6 bg-gray-50 dark:bg-black/40 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                    <img src={contactVendor.avatar || contactVendor.image} className="w-16 h-16 rounded-full object-cover border-2 border-[#C9A84C]" alt={contactVendor.name} />
                    <div className="text-left">
                      <h4 className="font-serif text-lg text-black dark:text-white font-bold">{contactVendor.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{contactVendor.categoryLabel} • {contactVendor.location || "Colombo, LK"}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-300">
                        <Phone className="w-4 h-4 text-[#C9A84C]" />
                        <span>{contactVendor.contactPhone || "+94 77 123 4567"}</span>
                      </div>
                      <div className="flex-1 flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-300">
                        <Mail className="w-4 h-4 text-[#C9A84C]" />
                        <span>{contactVendor.contactEmail || `hello@${contactVendor.id}.com`}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-2">Message Inquiry</label>
                      <textarea
                        rows={4}
                        value={inquiryText}
                        onChange={(e) => setInquiryText(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 text-sm text-black dark:text-white border border-gray-200 dark:border-zinc-700 p-4 outline-none focus:border-[#C9A84C] rounded-xl font-sans resize-none"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={sendInquiry}
                    disabled={isInquiring}
                    className="w-full py-4 bg-[#C9A84C] text-white text-xs uppercase font-bold tracking-widest hover:bg-[#B3933E] transition-all rounded-xl flex items-center justify-center gap-2"
                  >
                    {isInquiring ? "Sending inquiry..." : "Send Event Inquiry"}
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-emerald-500" strokeWidth={3} />
                  </div>
                  <h3 className="font-serif text-2xl text-[#2C1E14] dark:text-white mb-3">Inquiry Sent Successfully!</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 leading-relaxed px-4">
                    Your inquiry has been successfully transmitted to <strong className="text-black dark:text-white">{contactVendor.name}</strong>. A copy of the event details has been logged in your dashboard inquiries history.
                  </p>
                  <button 
                    onClick={() => setContactModalOpen(false)}
                    className="px-8 py-3 bg-[#C9A84C] text-white text-xs uppercase font-bold tracking-widest hover:bg-[#B3933E] transition-colors rounded-xl"
                  >
                    Back to Marketplace
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

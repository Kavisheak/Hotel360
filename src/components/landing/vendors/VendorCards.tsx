import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Heart, ShieldCheck, HelpCircle, Check, X, Phone, Mail, AlertTriangle, MessageSquare, MapPin, Briefcase, ChevronLeft, ChevronRight, Image as ImageIcon, SlidersHorizontal, PlayCircle, ArrowRight, Sparkles } from "lucide-react";
import { Vendor } from "./types";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { useVendorStore } from "@/store/vendorStore";
import { useToastStore } from "@/store/toastStore";
import LoginRequiredModal from "@/components/landing/shared/LoginRequiredModal";
import VendorReplaceModal from "@/components/landing/shared/VendorReplaceModal";
import VendorFavoriteModal from "@/components/landing/shared/VendorFavoriteModal";
import { motion, AnimatePresence } from "framer-motion";

interface VendorCardsProps {
  filteredVendors: Vendor[];
  onClearFilters: () => void;
  isGuest?: boolean;
}

export default function VendorCards({
  filteredVendors,
  onClearFilters,
  isGuest = true
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
  const [inquiryText, setInquiryText] = useState("");
  const [isInquiring, setIsInquiring] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  
  const [flyingItem, setFlyingItem] = useState<{ id: number, url: string, startX: number, startY: number, endX: number, endY: number } | null>(null);

  // Gallery Navigation State
  const [galleryIndices, setGalleryIndices] = useState<Record<string, number>>({});

  // Pagination State
  const [visibleCount, setVisibleCount] = useState(8);

  React.useEffect(() => {
    setVisibleCount(8);
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
    if (category === "decorators") return "decorator";
    if (category === "djs") return "dj";
    if (category === "videographers") return "videographer";
    if (category === "photographers") return "photographer";
    if (category === "cake") return "cake";
    if (category === "florists") return "florist";
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
      }));
    }
    return [{
      vendor,
      portfolioItem: null,
      cardKey: vendor.id,
    }];
  });

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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
            let galleryImages: string[] = [];

            if (portfolioItem && portfolioItem.media && portfolioItem.media.length > 0) {
              const coverMedia = portfolioItem.media.find((m: any) => m.isCover) || portfolioItem.media[0];
              coverImage = coverMedia?.url || vendor.image;
              galleryImages = portfolioItem.media.map((m: any) => m.url);
            } else {
              galleryImages = getGalleryImages(vendor);
              if (galleryImages.length > 0) coverImage = galleryImages[0];
            }

            if (galleryImages.length < 3) {
              galleryImages = [...galleryImages, ...Array(3 - galleryImages.length).fill(vendor.image)];
            }

            const currentGalleryIdx = galleryIndices[cardKey] || 0;
            const hasPortfolio = galleryImages.length > 0 && galleryImages[0] !== vendor.image;

            const cardTitle = portfolioItem?.title ? portfolioItem.title : vendor.name;
            const cardPrice = portfolioItem?.price && portfolioItem.price > 0 ? `LKR ${portfolioItem.price.toLocaleString()}` : vendor.startingPrice;
            const cardDesc = portfolioItem?.description || vendor.description;

            return (
              <div 
                key={cardKey} 
                className={`bg-white dark:bg-[#111111] flex flex-col transition-all duration-300 rounded-[24px] overflow-hidden group relative
                  ${isSelected ? 'border-2 border-[#D4AF37] shadow-[0_12px_40px_rgba(201,168,76,0.25)] transform -translate-y-1' : 'border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]'}`}
              >

                {/* Main Cover Image */}
                <div className="relative h-[100px] sm:h-[160px] w-full bg-gray-100 cursor-pointer overflow-hidden" onClick={() => handleRestrictedAction("Please log in to explore this portfolio.", () => router.push(`/customer/vendorProfile/${vendor.id}`))}>
                  <img src={coverImage} alt={cardTitle} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-90" />
                  
                  {/* Category Label (Top Left) */}
                  <span className="absolute top-3 left-3 sm:top-5 sm:left-5 bg-white/95 dark:bg-black/80 backdrop-blur-md text-gray-800 dark:text-gray-200 text-[8px] sm:text-[10px] uppercase font-extrabold tracking-widest px-2 py-1 sm:px-3.5 sm:py-1.5 rounded-full shadow-sm">
                    {vendor.categoryLabel}
                  </span>

                  {/* Badges / Favorite (Top Right) */}
                  <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10 flex items-center gap-1 sm:gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestrictedAction("Please log in to add vendors to your favorites list.", () => handleFavoriteClick(vendor));
                      }} 
                      className="w-8 h-8 flex items-center justify-center bg-white/95 dark:bg-black/80 rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-3 pb-3 sm:px-6 sm:pb-6 bg-white dark:bg-[#111111] flex-1 flex flex-col relative pt-0 text-center md:text-left">
                  
                  {/* Avatar & Selected Badge */}
                  <div className="relative -mt-6 sm:-mt-10 mb-2 sm:mb-3 flex flex-col md:flex-row items-center md:items-end justify-center md:justify-between gap-2 sm:gap-3 md:gap-0 z-20">
                    <div className="relative">
                      <img src={vendor.avatar || vendor.image} alt={vendor.name} className="w-12 h-12 sm:w-20 sm:h-20 rounded-full object-cover border-[2px] sm:border-[4px] border-white dark:border-[#111111] bg-white shadow-md mx-auto md:mx-0" />
                      {isSelected && (
                        <div className="absolute bottom-0 right-0 w-5 h-5 sm:w-7 sm:h-7 bg-[#D4AF37] rounded-full flex items-center justify-center border-[2px] border-white dark:border-[#111111] shadow-md z-10">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" strokeWidth={3.5} />
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <span className="bg-[#D4AF37] text-white text-[10px] uppercase font-bold tracking-widest px-5 py-2 rounded-full shadow-md mt-1 sm:mt-0 flex items-center gap-1">
                        Selected
                      </span>
                    )}
                  </div>

                  {/* Name & Basic Info */}
                  <div className="mb-2 sm:mb-4">
                    <div className="flex items-center justify-center md:justify-start gap-1 sm:gap-2 mb-1">
                      <h3 className="text-[14px] sm:text-[18px] font-serif font-bold text-[#2C1E14] dark:text-white leading-tight truncate" title={cardTitle}>
                        {cardTitle}
                      </h3>
                      <ShieldCheck className="w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] text-blue-500 flex-shrink-0" />
                    </div>
                    <p className="text-[9px] sm:text-[11px] font-semibold text-[#C9A84C] tracking-wide truncate">
                      by {vendor.name}
                    </p>
                    <div className="flex flex-col gap-1 sm:gap-2 mt-2">
                      <span className="flex items-center justify-center md:justify-start gap-1 sm:gap-1.5 text-[9px] sm:text-xs text-gray-600 dark:text-gray-300">
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37] fill-current" />
                        <strong className="text-gray-900 dark:text-white">{vendor.rating}</strong> ({vendor.reviewsCount} reviews)
                      </span>
                      <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-1 sm:gap-4 text-[8px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                        <span className="flex items-center gap-1 sm:gap-1.5"><MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400"/> {vendor.location || 'Colombo, Sri Lanka'}</span>
                        <span className="flex items-center gap-1 sm:gap-1.5"><Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400"/> {vendor.eventsCompleted || '8 Years Exp.'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Description */}
                  <div className="py-2 sm:py-3 border-t border-b border-gray-100 dark:border-white/5 mb-3 sm:mb-4 flex flex-col gap-1 sm:gap-2">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className="text-[8px] sm:text-[9px] text-gray-400 uppercase tracking-widest font-bold">Price</span>
                      <span className="text-[11px] sm:text-[13px] font-bold text-[#D4AF37]">{cardPrice}</span>
                    </div>
                    <p className="hidden sm:block text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {cardDesc || 'Professional and highly experienced wedding service provider delivering exceptional results for your special day.'}
                    </p>
                  </div>

                  {/* Mini Gallery Carousel */}
                  <div className="hidden sm:block relative mb-5 group/gallery h-[100px]">
                    {hasPortfolio ? (
                      <>
                        <div className="grid grid-cols-3 gap-2 h-full">
                          {[0, 1, 2].map((offset) => {
                            const imgIdx = (currentGalleryIdx + offset) % galleryImages.length;
                            return (
                              <div key={offset} className="w-full h-full rounded-xl overflow-hidden relative bg-gray-100 cursor-pointer shadow-sm">
                                <img src={galleryImages[imgIdx]} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                                {vendor.category === "videographers" && offset === 1 && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <PlayCircle className="w-6 h-6 text-white opacity-90 drop-shadow-md" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Gallery Navigation Arrows (Hover) */}
                        <button 
                          onClick={(e) => prevGalleryImage(e, cardKey, galleryImages.length)}
                          className="absolute -left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/95 dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-lg border border-gray-200 dark:border-zinc-700 opacity-0 group-hover/gallery:opacity-100 transition-all hover:scale-110"
                        >
                          <ChevronLeft className="w-3 h-3 text-gray-700 dark:text-gray-300"/>
                        </button>
                        <button 
                          onClick={(e) => nextGalleryImage(e, cardKey, galleryImages.length)}
                          className="absolute -right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/95 dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-lg border border-gray-200 dark:border-zinc-700 opacity-0 group-hover/gallery:opacity-100 transition-all hover:scale-110"
                        >
                          <ChevronRight className="w-3 h-3 text-gray-700 dark:text-gray-300"/>
                        </button>

                        {/* Pagination Dots */}
                        <div className="flex justify-center gap-1 mt-2">
                          {galleryImages.slice(0, 4).map((_, i) => (
                            <div key={i} className={`w-1 h-1 rounded-full transition-colors ${i === (currentGalleryIdx % 4) ? 'bg-gray-400 dark:bg-gray-500' : 'bg-gray-200 dark:bg-zinc-800'}`} />
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl flex flex-col items-center justify-center p-2 text-center">
                        <ImageIcon className="w-5 h-5 text-gray-300 dark:text-gray-600 mb-1" />
                        <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">Portfolio coming soon</span>
                        <p className="text-[8px] text-gray-400 mt-0.5 leading-tight">This vendor hasn't uploaded portfolio projects yet.</p>
                      </div>
                    )}
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-2">
                    <button 
                      onClick={() => handleRestrictedAction("Please log in to view detailed portfolios.", () => router.push(`/customer/vendorProfile/${vendor.id}`))}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-3.5 px-2 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-bold uppercase tracking-widest hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all hover:bg-gray-50 dark:hover:bg-white/5 whitespace-nowrap"
                    >
                      <ImageIcon className="hidden sm:block w-3.5 h-3.5"/> 
                      <span className="hidden sm:inline">View Portfolio</span>
                      <span className="sm:hidden">Portfolio</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        handleRestrictedAction("Please log in to select vendors for your booking.", () => handleSelectClick(vendor, portfolioItem, rect));
                      }}
                      className={`flex-1 flex items-center justify-center py-2 sm:py-3.5 px-2 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-bold tracking-widest uppercase transition-all shadow-md whitespace-nowrap ${isSelected ? 'bg-[#D4AF37] text-white hover:bg-[#C9A84C]' : 'bg-[#C9A84C] text-white hover:bg-[#D4AF37] hover:-translate-y-0.5 hover:shadow-lg'}`}
                    >
                      {isSelected ? (
                        <span className="flex items-center gap-1.5"><Check className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={3}/> Selected</span>
                      ) : (
                        vendor.category === "decorators" ? (
                          <><span className="hidden sm:inline">Select Design</span><span className="sm:hidden">Design</span></>
                        ) : (
                          <><span className="hidden sm:inline">Select Vendor</span><span className="sm:hidden">Select</span></>
                        )
                      )}
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
                onClick={() => setVisibleCount(prev => prev + 8)}
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
        {(cartVendors.decorator || cartVendors.videographer || cartVendors.dj) && (
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
                      <button onClick={() => router.push('/customer/cart')} className="text-[10px] text-[#C9A84C] font-bold uppercase tracking-widest hover:underline hover:text-[#D4AF37]">View All ({(cartVendors.decorator ? 1 : 0) + (cartVendors.videographer ? 1 : 0) + (cartVendors.dj ? 1 : 0)})</button>
                    </div>
                    
                    <div className="flex items-center justify-between gap-3 overflow-x-auto pb-5 snap-x hide-scrollbar">
                      {/* Selected Avatars */}
                      {['decorator', 'videographer', 'dj'].map(role => {
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
                      onClick={() => router.push('/book?fromCart=true')}
                      className="group relative overflow-hidden w-full bg-gradient-to-r from-[#C9A84C] via-[#D4AF37] to-[#C9A84C] bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white py-4 rounded-xl text-xs uppercase font-extrabold tracking-widest hover:-translate-y-1 shadow-lg hover:shadow-[0_15px_30px_rgba(201,168,76,0.3)] flex items-center justify-center gap-2"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Proceed to Booking ({(cartVendors.decorator ? 1 : 0) + (cartVendors.videographer ? 1 : 0) + (cartVendors.dj ? 1 : 0)}/3)
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
      {favoriteModalOpen && pendingFavoriteVendor && (
        <VendorFavoriteModal
          isOpen={favoriteModalOpen}
          onClose={() => {
            setFavoriteModalOpen(false);
            setPendingFavoriteVendor(null);
          }}
          onConfirm={confirmFavorite}
          vendorName={pendingFavoriteVendor.name}
          isRemoving={pendingFavoriteVendor.isRemoving}
        />
      )}

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

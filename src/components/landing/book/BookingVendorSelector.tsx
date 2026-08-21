"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Palette, Music, Video, Camera, Cake, Flower2, Plus, ArrowRight, ArrowLeft, Trash2, CheckCircle2, UploadCloud, BrainCircuit, Sparkles, Check } from "lucide-react";
import { useVendorStore } from "@/store/vendorStore";
import { useVendorCartStore } from "@/store/vendorCartStore";
import VendorReplaceModal from "@/components/landing/shared/VendorReplaceModal";
import { PortfolioViewerModal } from "@/components/landing/vendors/PortfolioViewerModal";

export interface VendorsState {
  decorator: string | null;
  decoratorPackage: string;
  dj: string | null;
  djPackage: string;
  videographer: string | null;
  videographerPackage: string;
  photographer?: string | null;
  photographerPackage?: string;
  cake?: string | null;
  cakePackage?: string;
  florist?: string | null;
  floristPackage?: string;
}

interface BookingVendorSelectorProps {
  vendors: VendorsState;
  onChange: (vendors: VendorsState, categoryUpdated?: string) => void;
  decoratorRequirements: string;
  setDecoratorRequirements: (val: string) => void;
  videographerRequirements: string;
  setVideographerRequirements: (val: string) => void;
  djRequirements: string;
  setDjRequirements: (val: string) => void;
}

export default function BookingVendorSelector({ 
  vendors, 
  onChange,
  decoratorRequirements,
  setDecoratorRequirements,
  videographerRequirements,
  setVideographerRequirements,
  djRequirements,
  setDjRequirements
}: BookingVendorSelectorProps) {
  const router = useRouter();
  const { vendors: globalVendors } = useVendorStore();
  const requestedDesigns = useVendorCartStore((state) => state.requestedDesigns);
  const requestedDesignPrices = useVendorCartStore((state) => state.requestedDesignPrices);

  const [activeCategorySelection, setActiveCategorySelection] = useState<string | null>(null);
  
  // Replace Modal State
  const [replaceModal, setReplaceModal] = useState<{
    isOpen: boolean;
    category: string;
    oldVendorId: string;
    newVendorData: any;
    isDesign: boolean;
  } | null>(null);

  // Viewer Modal State
  const [viewerModal, setViewerModal] = useState<{
    isOpen: boolean;
    item: any;
    vendor: any;
  }>({ isOpen: false, item: null, vendor: null });

  // AI Matchmaker State
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [expandedPackageDetails, setExpandedPackageDetails] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // When the category selection opens a vendor list,
    // wait a tick for the DOM to update, then gently scroll the container into view if it shifted.
    if (activeCategorySelection) {
      setTimeout(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          // If the top of the component is above the viewport or significantly below it
          if (rect.top < 0 || rect.top > window.innerHeight / 2) {
            containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 100);
    }
  }, [activeCategorySelection]);

  const handleAiUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAiScanning(true);
    setAiAnalysis(null);

    const formData = new FormData();
    formData.append("referenceImage", file);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/ai/match-design`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setAiAnalysis(data.data);
      } else {
        alert(data.message || "Failed to analyze image.");
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to AI service.");
    } finally {
      setIsAiScanning(false);
    }
  };

  const handleExplore = (categoryKey: string) => {
    setActiveCategorySelection(categoryKey);
    setAiAnalysis(null);
  };

  const handleRemove = (categoryKey: keyof VendorsState) => {
    onChange({
      ...vendors,
      [categoryKey]: "none",
      [`${categoryKey}Package`]: "none"
    } as any);
  };

  const getVendorDetails = (id?: string | null) => {
    if (!id || id === "none" || id === "custom_preference") return null;
    return globalVendors.find(v => v.id === id) || null;
  };

  const executeVendorSelection = (storeCategory: keyof VendorsState, vendorId: string, defaultPackage: string, portfolioItemId?: string, price?: number) => {
    useVendorCartStore.setState((state) => ({
      vendors: {
        ...state.vendors,
        [storeCategory]: vendorId
      },
      requestedDesigns: {
        ...state.requestedDesigns,
        [storeCategory]: portfolioItemId || null
      },
      requestedDesignPrices: {
        ...state.requestedDesignPrices,
        [storeCategory]: price || null
      }
    }));
    onChange({
      ...vendors,
      [storeCategory]: vendorId,
      [`${storeCategory}Package`]: defaultPackage
    } as any, storeCategory);
    setActiveCategorySelection(null);
    setAiAnalysis(null);
  };

  const handleSelectVendor = (storeCategory: keyof VendorsState, newVendorData: any, isDesign: boolean) => {
    const currentVendorId = vendors[storeCategory];
    const skipConfirmation = useVendorCartStore.getState().skipReplaceConfirmation;
    
    // If a vendor is already selected and it's not the same vendor, check if we should show confirmation
    if (currentVendorId && currentVendorId !== "none" && currentVendorId !== newVendorData.vendorId) {
      if (skipConfirmation) {
        // Skip modal, replace immediately
        executeVendorSelection(
          storeCategory, 
          newVendorData.vendorId, 
          newVendorData.defaultPackage, 
          newVendorData.portfolioItemId, 
          newVendorData.price
        );
      } else {
        // Show confirmation modal
        setReplaceModal({
          isOpen: true,
          category: storeCategory,
          oldVendorId: currentVendorId,
          newVendorData,
          isDesign
        });
      }
    } else {
      // Proceed directly
      executeVendorSelection(
        storeCategory, 
        newVendorData.vendorId, 
        newVendorData.defaultPackage, 
        newVendorData.portfolioItemId, 
        newVendorData.price
      );
    }
  };

  const handleConfirmReplace = (dontAskAgain: boolean) => {
    if (replaceModal) {
      if (dontAskAgain) {
        useVendorCartStore.getState().setSkipReplaceConfirmation(true);
      }
      
      executeVendorSelection(
        replaceModal.category as keyof VendorsState,
        replaceModal.newVendorData.vendorId,
        replaceModal.newVendorData.defaultPackage,
        replaceModal.newVendorData.portfolioItemId,
        replaceModal.newVendorData.price
      );
      setReplaceModal(null);
    }
  };

  const categories = [
    { key: "decorator", label: "Decorator", icon: <Palette className="w-5 h-5" />, path: "decorators" },
    { key: "videographer", label: "Videographer", icon: <Video className="w-5 h-5" />, path: "videographers" },
    { key: "dj", label: "DJ Artist", icon: <Music className="w-5 h-5" />, path: "djs" },
    { key: "photographer", label: "Photographer", icon: <Camera className="w-5 h-5" />, path: "photographers" },
    { key: "cake", label: "Cake & Bakery", icon: <Cake className="w-5 h-5" />, path: "cake" },
    { key: "florist", label: "Florist", icon: <Flower2 className="w-5 h-5" />, path: "florists" },
  ] as const;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  if (activeCategorySelection) {
    const selectedCatConfig = categories.find(c => c.key === activeCategorySelection);
    const categoryVendors = globalVendors.filter(v => v.category === selectedCatConfig?.path);
    
    if (activeCategorySelection === "decorator") {
      let portfolioItems: any[] = [];
      if (aiAnalysis && aiAnalysis.matches) {
        portfolioItems = aiAnalysis.matches;
      } else {
        portfolioItems = categoryVendors.flatMap(v => {
          if (v.portfolioItems && v.portfolioItems.length > 0) {
            return v.portfolioItems.map(item => {
              const coverMedia = item.media.find(m => m.isCover) || item.media[0];
              return {
                vendorId: v.id,
                vendorName: v.name,
                vendorRating: v.rating,
                image: coverMedia ? coverMedia.url : "",
                title: item.title,
                portfolioItemId: item.id,
                defaultPackage: v.packages?.[0]?.name || "none",
                price: item.price > 0 ? item.price : (parseInt(v.startingPrice.replace(/[^0-9]/g, "")) || 0)
              };
            });
          }
          return (v.portfolio || []).map((img, idx) => ({
            vendorId: v.id,
            vendorName: v.name,
            vendorRating: v.rating,
            image: img,
            title: `Design #${idx + 1}`,
            portfolioItemId: `legacy-${idx}`,
            defaultPackage: v.packages?.[0]?.name || "none",
            price: parseInt(v.startingPrice.replace(/[^0-9]/g, "")) || 0
          }));
        });
      }

      return (
        <div ref={containerRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center justify-between border-b border-[#C9A84C]/20 pb-4 mb-4">
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => { setActiveCategorySelection(null); setAiAnalysis(null); }} className="text-gray-500 hover:text-[#C9A84C] transition-colors cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-serif text-[#1A1512] dark:text-white">Select {selectedCatConfig?.label} Design</h3>
            </div>
          </div>

          {/* AI MATCHMAKER UPLOAD BOX */}
          <div className="bg-[#FAF6EE] dark:bg-[#111111] border border-dashed border-[#C9A84C]/50 rounded-lg p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/*" 
              onChange={handleAiUpload}
              className="hidden" 
            />
            {isAiScanning ? (
              <div className="flex flex-col items-center space-y-4 py-4 w-full">
                <BrainCircuit className="w-12 h-12 text-[#C9A84C] animate-pulse" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#1A1512] dark:text-white uppercase tracking-widest">Azure AI Engine Running</h4>
                  <p className="text-xs text-[#C9A84C] animate-pulse">Extracting visual features & matching portfolio tags...</p>
                </div>
                <div className="w-full max-w-md h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#C9A84C] animate-[progress_2s_ease-in-out_infinite]" style={{ width: "50%" }}></div>
                </div>
              </div>
            ) : aiAnalysis ? (
              <div className="flex flex-col items-center space-y-3 py-2 w-full">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                  <h4 className="font-bold uppercase tracking-widest text-sm">Visual Match Complete</h4>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {aiAnalysis.azureAnalysis?.tags?.map((tag: string, idx: number) => (
                    <span key={idx} className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
                <button type="button" onClick={() => setAiAnalysis(null)} className="mt-2 text-xs text-gray-500 hover:text-[#C9A84C] underline cursor-pointer">Clear Results</button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center space-y-3 cursor-pointer py-2"
              >
                <div className="w-12 h-12 rounded-full bg-white dark:bg-[#1A1A1A] border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] group-hover:scale-110 transition-transform shadow-sm">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A1512] dark:text-white flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                    AI Visual Matchmaker
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm">Have a dream stage? Upload a photo from Pinterest or Instagram and our Azure AI will find the exact match from our artisans.</p>
                </div>
                <button type="button" className="px-5 py-2 bg-[#1A1512] dark:bg-white text-white dark:text-[#1A1512] text-[10px] uppercase font-bold tracking-widest rounded-sm hover:bg-[#C9A84C] dark:hover:bg-[#C9A84C] dark:hover:text-white transition-colors cursor-pointer">
                  Upload Image
                </button>
              </div>
            )}
          </div>
          
          {portfolioItems.length === 0 ? (
             <p className="text-gray-500 italic text-center py-10">No portfolio designs available for this category.</p>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {portfolioItems.map((item, idx) => {
                const imgUrl = item.image.startsWith('http') ? item.image : `${API_URL}${item.image}`;
                return (
                  <div 
                    key={idx}
                    onClick={() => {
                      handleSelectVendor(
                        activeCategorySelection as keyof VendorsState,
                        {
                          vendorId: item.vendorId,
                          defaultPackage: item.defaultPackage,
                          portfolioItemId: item.portfolioItemId,
                          price: item.price,
                          vendorName: item.vendorName
                        },
                        true // isDesign
                      );
                    }}
                    className="relative break-inside-avoid rounded-sm overflow-hidden group cursor-pointer border border-[#E8DFC9] dark:border-gray-800 mb-4 bg-[#FDF9F1] dark:bg-[#111]"
                  >
                    <img src={imgUrl} alt={item.vendorName} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
                    
                    {item.matchScore && (
                      <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-lg flex items-center gap-1 z-10">
                        <Sparkles className="w-3 h-3" />
                        {item.matchScore}% AI Match
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/80 transition-colors duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 p-4 text-center">
                      <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-sm mb-2 backdrop-blur-sm border border-white/20">{item.vendorName}</span>
                      
                      <div className="flex items-center gap-2 mb-2 text-xs">
                        <span className="text-[#C9A84C]">★ {item.vendorRating !== undefined && item.vendorRating !== null ? item.vendorRating : 0}</span>
                      </div>

                      {item.price > 0 && (
                        <span className="text-white font-bold text-sm mb-4">Rs. {item.price.toLocaleString()}</span>
                      )}

                      <button type="button" className="w-full max-w-[85%] py-2 px-2 bg-[#C9A84C] hover:bg-[#B58B5C] text-white text-[9px] uppercase font-bold tracking-widest rounded-sm transition-colors shadow-lg text-center leading-tight">
                        Select This Design
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {replaceModal && (
            <VendorReplaceModal
              isOpen={replaceModal.isOpen}
              onClose={() => setReplaceModal(null)}
              onConfirm={handleConfirmReplace}
              categoryLabel={categories.find(c => c.key === replaceModal.category)?.label || "Vendor"}
              newVendorName={replaceModal.newVendorData.vendorName}
              rating={replaceModal.newVendorData.rating}
              price={replaceModal.newVendorData.price}
            />
          )}
        </div>
      );
    } else {
      return (
        <div ref={containerRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center justify-between border-b border-[#C9A84C]/20 pb-4 mb-4">
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setActiveCategorySelection(null)} className="text-gray-500 hover:text-[#C9A84C] transition-colors cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-serif text-[#1A1512] dark:text-white">Select {selectedCatConfig?.label}</h3>
            </div>
          </div>
          
          {categoryVendors.length === 0 ? (
             <p className="text-gray-500 italic text-center py-10">No vendors available for this category.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryVendors.map((vendor, idx) => {
                const imgUrl = vendor.image.startsWith('http') ? vendor.image : `${API_URL}${vendor.image}`;
                const price = parseInt(vendor.startingPrice?.replace(/[^0-9]/g, "") || "0") || 0;

                return (
                  <div 
                    key={idx}
                    className="border border-[#E8DFC9] dark:border-gray-800 bg-white dark:bg-[#111111] rounded-lg shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-300 h-full hover:border-[#C9A84C]/50"
                  >
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 mb-4">
                        <img 
                          src={imgUrl} 
                          alt={vendor.name} 
                          className="w-16 h-16 rounded-full object-cover border border-[#E8DFC9]/50 dark:border-gray-800" 
                        />
                        <div>
                          <h4 className="text-lg font-bold font-serif text-[#1A1512] dark:text-white leading-tight">
                            {vendor.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-xs">
                            <span className="text-[#C9A84C]">★ {vendor.rating !== undefined && vendor.rating !== null ? vendor.rating : 0}</span>
                            <span className="text-gray-400">({vendor.reviewsCount || 0} reviews)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-[#E8DFC9]/30 dark:border-gray-800">
                        <button 
                          type="button"
                          onClick={() => {
                            handleSelectVendor(
                              activeCategorySelection as keyof VendorsState,
                              {
                                vendorId: vendor.id,
                                defaultPackage: "none",
                                vendorName: vendor.name,
                                price: null,
                                rating: vendor.rating
                              },
                              false // isDesign
                            );
                          }}
                          className="w-full bg-[#1A1512] dark:bg-white text-white dark:text-[#1A1512] py-2.5 text-[10px] uppercase font-bold tracking-widest hover:bg-[#C9A84C] dark:hover:bg-[#C9A84C] dark:hover:text-white transition-colors rounded-md cursor-pointer"
                        >
                          Select Vendor
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {replaceModal && (
            <VendorReplaceModal
              isOpen={replaceModal.isOpen}
              onClose={() => setReplaceModal(null)}
              onConfirm={handleConfirmReplace}
              categoryLabel={categories.find(c => c.key === replaceModal.category)?.label || "Vendor"}
              newVendorName={replaceModal.newVendorData.vendorName}
              rating={replaceModal.newVendorData.rating}
              price={replaceModal.newVendorData.price}
            />
          )}
        </div>
      );
    }
  }

  return (
    <div ref={containerRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Top Badges */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {categories.map((cat) => {
          const isSelected = vendors[cat.key as keyof VendorsState] && vendors[cat.key as keyof VendorsState] !== "none";
          if (!isSelected) return null;
          return (
            <div key={cat.key} className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                {cat.label} Selected
              </span>
            </div>
          );
        })}
      </div>

      <div className="bg-[#FAFBF7] dark:bg-white/5 border border-[#E8DFC9] dark:border-gray-800 px-4 py-3 rounded-md mb-6">
        <p className="text-xs text-gray-500">You can add or remove vendors, select packages and specify your special requirements.</p>
      </div>

      {/* Premium AI Visualizer Banner */}
      <div className="bg-gradient-to-br from-[#1A1512] via-[#231d19] to-[#1A1512] rounded-xl p-6 md:p-8 relative overflow-hidden shadow-2xl mb-8 border border-[#C9A84C]/30 flex flex-col md:flex-row items-center justify-between gap-6 group">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#C9A84C] rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity duration-1000"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#C9A84C] rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000"></div>
        
        <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A84C] to-[#805D3A] p-[1px] shadow-lg shrink-0">
            <div className="w-full h-full bg-[#1A1512] rounded-2xl flex items-center justify-center">
              <BrainCircuit className="w-8 h-8 text-[#C9A84C]" />
            </div>
          </div>
          <div>
            <h4 className="text-xl md:text-2xl font-serif font-bold text-white flex items-center justify-center md:justify-start gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#C9A84C]" />
              AI Visual Decoration Matcher
            </h4>
            <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
              Have a dream stage design? Upload a photo from Pinterest or Instagram. Our Azure AI will instantly analyze the aesthetics and find the exact matching design from our elite decorator network.
            </p>
          </div>
        </div>

        <div className="relative z-10 shrink-0 w-full md:w-auto">
          <button 
            type="button"
            onClick={() => handleExplore("decorator")}
            className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-[#C9A84C] to-[#B58B5C] hover:from-[#B58B5C] hover:to-[#967045] text-[#1A1512] text-xs font-bold uppercase tracking-widest rounded transition-all shadow-[0_0_30px_rgba(201,168,76,0.3)] hover:shadow-[0_0_40px_rgba(201,168,76,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            Try AI Matchmaker
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {categories.map((cat, index) => {
          const selectedVendorId = vendors[cat.key as keyof VendorsState];
          const selectedVendor = getVendorDetails(selectedVendorId);
          const isSelected = selectedVendorId && selectedVendorId !== "none";

          if (!isSelected) return null;

          const selectedDesignId = requestedDesigns[cat.key as "decorator" | "dj" | "videographer"];
          let selectedDesign: { image: string; title: string } | null = null;
          
          if (selectedDesignId && selectedVendor) {
            if (selectedVendor.portfolioItems) {
              const item = selectedVendor.portfolioItems.find(p => 
                p.id === selectedDesignId || 
                (p as any)._id === selectedDesignId ||
                p.id?.toString() === selectedDesignId?.toString() ||
                (p as any)._id?.toString() === selectedDesignId?.toString()
              );
              if (item) {
                selectedDesign = { title: item.title, image: "" };
                const coverMedia = item.media?.find((m: any) => m.isCover) || item.media?.[0];
                const rawUrl = coverMedia ? coverMedia.url : "";
                selectedDesign.image = rawUrl.startsWith("http") ? rawUrl : `${API_URL}${rawUrl}`;
              }
            }
            if (!selectedDesign && selectedVendor.portfolio) {
              const idx = parseInt(selectedDesignId.replace("legacy-", ""), 10);
              if (!isNaN(idx) && selectedVendor.portfolio[idx]) {
                const rawUrl = selectedVendor.portfolio[idx];
                selectedDesign = {
                  image: rawUrl.startsWith("http") ? rawUrl : `${API_URL}${rawUrl}`,
                  title: `Inspiration Design #${idx + 1}`
                };
              }
            }
          }

          const vendorPackage = vendors[`${cat.key}Package` as keyof VendorsState];

          return (
            <div key={cat.key} className="border border-[#E8DFC9] dark:border-gray-800 bg-white dark:bg-[#111111] rounded-lg shadow-sm overflow-hidden p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAF6EE] border border-[#C9A84C] text-[#C9A84C] flex items-center justify-center font-bold text-sm shadow-sm">
                    {index + 1}
                  </div>
                  <h4 className="text-xl font-serif text-[#1A1512] dark:text-white">{cat.label}</h4>
                  <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Selected</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => handleExplore(cat.key)}
                    className="px-4 py-2 border border-[#C9A84C] text-[#C9A84C] bg-white dark:bg-transparent rounded-sm text-[10px] font-bold tracking-widest hover:bg-[#C9A84C]/10 transition-colors uppercase cursor-pointer"
                  >
                    {cat.key === "decorator" ? "Change Design" : "Change Vendor"}
                  </button>
                  <button 
                    type="button"
                    onClick={() => onChange({ ...vendors, [cat.key]: "none", [`${cat.key}Package`]: "" })}
                    className="px-3 py-2 border border-red-200 text-red-500 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30 rounded-sm text-[10px] font-bold tracking-widest hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors uppercase cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {cat.key === "decorator" ? (
                <div className="space-y-6">
                  {selectedDesign && (
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <img 
                        src={selectedDesign.image} 
                        alt={selectedDesign.title} 
                        className="w-full md:w-64 h-40 rounded-sm object-cover border border-[#E8DFC9]/30" 
                      />
                      <div className="space-y-2">
                        <h5 className="text-lg font-bold text-[#1A1512] dark:text-white">{selectedDesign.title}</h5>
                        <p className="text-xs text-gray-500">by {selectedVendor?.name}</p>
                        <div className="inline-block bg-[#FAF6EE] border border-[#E8DFC9] px-2 py-0.5 rounded-sm text-[10px] text-[#805D3A] font-bold uppercase tracking-widest mt-1 mb-2">
                          {requestedDesignPrices?.[cat.key] ? "Custom Quote" : "Wedding"}
                        </div>
                        <p className="text-sm font-bold text-[#1A1512] dark:text-white mb-4">
                           {requestedDesignPrices?.[cat.key] ? `Rs. ${requestedDesignPrices[cat.key]?.toLocaleString()}` : `Rs. ${(parseInt(selectedVendor?.startingPrice?.replace(/[^0-9]/g, "") || "0")).toLocaleString()}`}
                        </p>
                        <button 
                          type="button"
                          onClick={() => setViewerModal({ isOpen: true, item: selectedDesign, vendor: selectedVendor })}
                          className="flex items-center gap-1.5 px-4 py-2 border border-[#C9A84C] text-[#C9A84C] rounded-sm text-[10px] font-bold tracking-wider hover:bg-[#C9A84C]/10 transition-colors uppercase cursor-pointer"
                        >
                          View Design
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-[#E8DFC9] dark:border-gray-800">
                    <label className="block text-xs font-bold text-[#1A1512] dark:text-white mb-1">
                      Special Decoration Requirements (Optional)
                    </label>
                    <p className="text-[10px] text-gray-500 mb-3">Share any special requests or additional notes for the decorator and our manager.</p>
                    <textarea 
                      value={decoratorRequirements}
                      onChange={(e) => setDecoratorRequirements(e.target.value)}
                      placeholder="Please use more white flowers and avoid red roses. We would like a larger welcome board."
                      className="w-full bg-[#FAFBF7] dark:bg-[#1A1A1A] border border-[#E8DFC9] dark:border-gray-800 rounded-sm p-4 text-sm outline-none focus:border-[#C9A84C] min-h-[100px] resize-none"
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] text-gray-500 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-[#C9A84C]" /> This request will be sent to the decorator and manager.
                      </span>
                      <span className="text-[10px] text-gray-400">{decoratorRequirements.length} / 500</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedVendor && (
                    <div className="flex flex-col md:flex-row gap-6 items-start border-b border-[#E8DFC9] dark:border-gray-800 pb-6">
                      <img 
                        src={selectedVendor.image.startsWith('http') ? selectedVendor.image : `${API_URL}${selectedVendor.image}`} 
                        alt={selectedVendor.name} 
                        className="w-full md:w-48 h-32 rounded-sm object-cover border border-[#E8DFC9]/50" 
                      />
                      <div className="space-y-1">
                        <h5 className="text-xl font-bold text-[#1A1512] dark:text-white">{selectedVendor.name}</h5>
                        <p className="text-xs text-gray-500">
                          {selectedVendor.location || "Colombo"} • ★ {selectedVendor.rating || 4.9} ({selectedVendor.reviewsCount || 0} reviews)
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h5 className="text-sm font-bold text-[#1A1512] dark:text-white mb-1">Choose a Package</h5>
                    <p className="text-[10px] text-gray-500 mb-4">Select the package that best matches your event.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedVendor?.packages?.map((pkg) => {
                        const isPkgSelected = vendorPackage === pkg.name;
                        const isExpanded = expandedPackageDetails === pkg.name;
                        
                        return (
                          <div 
                            key={pkg.name}
                            onClick={() => onChange({
                              ...vendors,
                              [`${cat.key}Package`]: pkg.name
                            } as any)}
                            className={`border rounded-sm p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between h-full ${isPkgSelected ? 'border-[#C9A84C] bg-[#FAF6EE] dark:bg-[#C9A84C]/5 ring-1 ring-[#C9A84C]' : 'border-[#E8DFC9] dark:border-gray-800 hover:border-[#C9A84C]/50'}`}
                          >
                            <div>
                              <div className="flex items-start gap-3 mb-3">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${isPkgSelected ? 'border-[#C9A84C] bg-[#C9A84C]' : 'border-gray-300'}`}>
                                  {isPkgSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                </div>
                                <div className="w-full">
                                  <h6 className="text-xs font-bold text-[#1A1512] dark:text-white">{pkg.name}</h6>
                                  {pkg.eventTypes && pkg.eventTypes.length > 0 && (
                                    <p className="text-[10px] text-[#C9A84C] font-semibold mt-1">Events: {pkg.eventTypes.join(", ")}</p>
                                  )}
                                  {pkg.duration && (
                                    <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Duration: {pkg.duration}</p>
                                  )}
                                  {pkg.musicGenres && pkg.musicGenres.length > 0 && (
                                    <p className="text-[10px] text-[#805D3A] font-semibold mt-0.5">Music: {pkg.musicGenres.join(", ")}</p>
                                  )}
                                  <div className="mt-2 space-y-1">
                                    {pkg.features.slice(0, isExpanded ? undefined : 3).map((f, i) => (
                                      <p key={i} className="text-[10px] text-gray-500">• {f}</p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-[#E8DFC9]/50 dark:border-gray-800 flex flex-col gap-3">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-[#1A1512] dark:text-white">
                                  Rs. {String(pkg.price).replace(/LKR|Rs\.?|Rs/gi, '').trim()}
                                </span>
                                {isPkgSelected && <span className="text-[9px] uppercase tracking-widest font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded-sm">Selected</span>}
                              </div>
                              {pkg.features.length > 3 && (
                                <button 
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedPackageDetails(isExpanded ? null : pkg.name);
                                  }}
                                  className="w-full text-center text-[9px] font-bold uppercase tracking-wider text-[#C9A84C] hover:underline"
                                >
                                  {isExpanded ? "View Less" : "View More Details"}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Expanded Package Details */}
                  {vendorPackage && vendorPackage !== "none" && selectedVendor?.packages?.find(p => p.name === vendorPackage) && (() => {
                    const activePkg = selectedVendor.packages.find(p => p.name === vendorPackage);
                    return (
                      <div className="bg-[#FAFBF7] dark:bg-[#1A1A1A] border border-[#E8DFC9] dark:border-gray-800 rounded-sm p-5 mt-6">
                        <div className="flex justify-between items-center mb-4 border-b border-[#E8DFC9]/50 dark:border-gray-800 pb-4">
                          <div>
                            <h6 className="text-sm font-bold text-[#1A1512] dark:text-white">{vendorPackage} – Package Details</h6>
                            {activePkg?.description && (
                              <p className="text-[10px] text-gray-500 mt-1 max-w-xl">{activePkg.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 px-2 py-0.5 rounded-sm h-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Selected</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div className="col-span-2 md:col-span-1 flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-[#111] border border-[#E8DFC9] flex items-center justify-center shrink-0">
                              <Video className="w-4 h-4 text-[#805D3A]" />
                            </div>
                            <div>
                              <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold block mb-0.5">Coverage / Duration</span>
                              <span className="text-xs font-medium text-[#1A1512] dark:text-white">{activePkg?.coverageDuration || activePkg?.duration || "Included"}</span>
                            </div>
                          </div>
                          
                          <div className="col-span-2 md:col-span-1 flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-[#111] border border-[#E8DFC9] flex items-center justify-center shrink-0">
                              <Music className="w-4 h-4 text-[#805D3A]" />
                            </div>
                            <div>
                              <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold block mb-0.5">Events</span>
                              <span className="text-xs font-medium text-[#1A1512] dark:text-white">
                                {activePkg?.eventTypes?.length ? activePkg.eventTypes.join(", ") : "All Suitable Events"}
                              </span>
                            </div>
                          </div>

                          {(activePkg?.videoQuality || activePkg?.cameraSetup) && (
                            <div className="col-span-2 md:col-span-2 flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-white dark:bg-[#111] border border-[#E8DFC9] flex items-center justify-center shrink-0">
                                <Camera className="w-4 h-4 text-[#805D3A]" />
                              </div>
                              <div>
                                <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold block mb-0.5">Production Quality</span>
                                <span className="text-xs font-medium text-[#1A1512] dark:text-white">
                                  {[activePkg?.videoQuality, activePkg?.cameraSetup].filter(Boolean).join(" • ")}
                                </span>
                              </div>
                            </div>
                          )}

                          {activePkg?.musicGenres && activePkg.musicGenres.length > 0 && (
                            <div className="col-span-2 md:col-span-2 flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-white dark:bg-[#111] border border-[#E8DFC9] flex items-center justify-center shrink-0">
                                <Music className="w-4 h-4 text-[#805D3A]" />
                              </div>
                              <div>
                                <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold block mb-0.5">Music Genres</span>
                                <span className="text-xs font-medium text-[#1A1512] dark:text-white">
                                  {activePkg.musicGenres.join(", ")}
                                </span>
                              </div>
                            </div>
                          )}

                          {(activePkg?.sound?.length || activePkg?.lighting?.length) ? (
                            <div className="col-span-2 md:col-span-4 flex flex-col gap-2 mt-2">
                              {activePkg.sound && activePkg.sound.length > 0 && (
                                <div>
                                  <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Sound Equipment</span>
                                  <span className="text-xs font-medium text-[#1A1512] dark:text-white">{activePkg.sound.join(" • ")}</span>
                                </div>
                              )}
                              {activePkg.lighting && activePkg.lighting.length > 0 && (
                                <div>
                                  <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Lighting Setup</span>
                                  <span className="text-xs font-medium text-[#1A1512] dark:text-white">{activePkg.lighting.join(" • ")}</span>
                                </div>
                              )}
                            </div>
                          ) : null}

                          <div className="col-span-2 md:col-span-4 mt-2">
                            <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold block mb-3">Included Features & Deliverables</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4">
                              {activePkg?.features.map((f, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-[#1A1512] dark:text-gray-300">
                                  <Check className="w-3.5 h-3.5 text-[#C9A84C] shrink-0 mt-0.5" />
                                  {f}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="pt-6 border-t border-[#E8DFC9] dark:border-gray-800">
                    <label className="block text-xs font-bold text-[#1A1512] dark:text-white mb-1">
                      Special {cat.label} Requirements (Optional)
                    </label>
                    <p className="text-[10px] text-gray-500 mb-3">Share any special requests or shots you want us to capture.</p>
                    <textarea 
                      value={cat.key === "videographer" ? videographerRequirements : djRequirements}
                      onChange={(e) => cat.key === "videographer" ? setVideographerRequirements(e.target.value) : setDjRequirements(e.target.value)}
                      placeholder={cat.key === "videographer" ? "Please capture drone shots of the venue and the entrance." : "Please include Sinhala, Tamil, English and Bollywood music."}
                      className="w-full bg-[#FAFBF7] dark:bg-[#1A1A1A] border border-[#E8DFC9] dark:border-gray-800 rounded-sm p-4 text-sm outline-none focus:border-[#C9A84C] min-h-[100px] resize-none"
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] text-gray-500 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-[#C9A84C]" /> This request will be sent to the {cat.label.toLowerCase()} and manager.
                      </span>
                      <span className="text-[10px] text-gray-400">{(cat.key === "videographer" ? videographerRequirements : djRequirements).length} / 500</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-gray-800 border-dashed rounded-lg p-6">
        <h5 className="text-sm font-bold text-[#1A1512] dark:text-white mb-1">Need more services?</h5>
        <p className="text-[10px] text-gray-500 mb-4">Add additional vendors to make your event perfect.</p>
        <div className="flex flex-wrap gap-4">
          {categories.filter(c => ["decorator", "videographer", "dj"].includes(c.key)).map((cat) => {
            if (vendors[cat.key as keyof VendorsState] && vendors[cat.key as keyof VendorsState] !== "none") return null;
            return (
              <button 
                type="button"
                key={cat.key}
                onClick={() => handleExplore(cat.key)}
                className="flex items-center gap-2 px-5 py-2.5 border border-[#E8DFC9] hover:border-[#C9A84C] bg-[#FAFBF7] hover:bg-white dark:bg-[#1A1A1A] dark:border-gray-800 rounded-sm text-xs font-bold text-[#1A1512] dark:text-white uppercase tracking-widest transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#C9A84C]" />
                Add {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {replaceModal && (
        <VendorReplaceModal
          isOpen={replaceModal.isOpen}
          onClose={() => setReplaceModal(null)}
          onConfirm={handleConfirmReplace}
          categoryLabel={categories.find(c => c.key === replaceModal.category)?.label || "Vendor"}
          newVendorName={replaceModal.newVendorData.vendorName}
          rating={replaceModal.newVendorData.rating}
          price={replaceModal.newVendorData.price}
        />
      )}

      {/* Portfolio Viewer Modal for viewing selected designs */}
      <PortfolioViewerModal
        isOpen={viewerModal.isOpen}
        onClose={() => setViewerModal({ isOpen: false, item: null, vendor: null })}
        portfolioItem={viewerModal.item}
        vendor={viewerModal.vendor}
        hideSelectButton={true}
        onViewVendorProfile={() => {
          const vendorId = viewerModal.vendor?.id || viewerModal.vendor?._id;
          if (vendorId) {
            window.open(`/vendors/${vendorId}`, "_blank");
          }
        }}
      />
    </div>
  );

}

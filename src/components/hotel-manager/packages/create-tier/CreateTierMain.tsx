"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { packageAPI } from '@/lib/api';
import Sidebar from '@/components/hotel-manager/overview/Sidebar';
import PackagesHeader from '../PackagesHeader';
import TierIdentity from './TierIdentity';
import PricingCapacity from './PricingCapacity';
import CoreInclusions from './CoreInclusions';
import PromotionalBadge from './PromotionalBadge';
import CustomerLivePreview from './CustomerLivePreview';

const CreateTierMain = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // States for interactive live preview
  const [tierName, setTierName] = useState('Platinum Elite');
  const [selectedIcon, setSelectedIcon] = useState('diamond');
  const [description, setDescription] = useState('Our most exclusive sanctuary of romance.');
  const [baseRate, setBaseRate] = useState('450,000');
  const [minCapacity, setMinCapacity] = useState('200');
  const [maxCapacity, setMaxCapacity] = useState('1000');
  const [guestSurcharge, setGuestSurcharge] = useState('1500');
  const [badge, setBadge] = useState('MOST POPULAR'); // NONE, MOST POPULAR, LIMITED OFFER

  // Features tag list
  const [features, setFeatures] = useState([
    '6-Hour Venue Access',
    'Basic Lighting',
    'Standard Stage Decor'
  ]);
  const [newFeature, setNewFeature] = useState('');

  // Checkbox inclusions state
  const [inclusions, setInclusions] = useState({
    valet: true,
    bridal: false,
    led: false,
    catering: true
  });

  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (feat: string) => {
    setFeatures(features.filter(f => f !== feat));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const priceNum = parseInt(baseRate.replace(/,/g, ''), 10);
      const guestsNum = parseInt(maxCapacity, 10);

      const payload = {
        name: tierName,
        description,
        price: isNaN(priceNum) ? 0 : priceNum,
        maxGuests: isNaN(guestsNum) ? 1 : guestsNum,
        baseGuests: parseInt(minCapacity, 10) || 0,
        guestSurcharge: parseInt(guestSurcharge, 10) || 0,
        icon: selectedIcon,
        badge: badge,
        features,
        inclusions
      };

      const res = await packageAPI.createPackage(payload);
      if (res.ok) {
        setShowSuccessModal(true);
      } else {
        alert(`Error: ${res.data.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to create package.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800 flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1 min-w-0 pt-14 lg:pt-0 flex flex-col">
        <PackagesHeader />

        <div className="flex-1 px-4 sm:px-8 lg:px-10 py-8 max-w-[1400px] mx-auto w-full">
          {/* Breadcrumbs + Page Title */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">
              <Link href="/hotel-manager/packages" className="hover:text-gray-600 transition-colors">Package Settings</Link>
              <span>&gt;</span>
              <span className="text-[#7C6A2E]">Add New Tier</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#7C6A2E] tracking-tight uppercase">
                Create New Hall Tier
              </h1>
              <Link
                href="/hotel-manager/packages"
                className="flex items-center gap-2 text-xs font-bold text-[#7C6A2E] hover:text-[#5E4F20] transition-colors"
              >
                <ArrowLeft size={16} /> BACK TO LIST
              </Link>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Left Form Column (8/12) */}
            <div className="xl:col-span-8 space-y-6">
              
              <TierIdentity
                tierName={tierName}
                setTierName={setTierName}
                selectedIcon={selectedIcon}
                setSelectedIcon={setSelectedIcon}
                description={description}
                setDescription={setDescription}
              />

              <PricingCapacity
                baseRate={baseRate}
                setBaseRate={setBaseRate}
                minCapacity={minCapacity}
                setMinCapacity={setMinCapacity}
                maxCapacity={maxCapacity}
                setMaxCapacity={setMaxCapacity}
                guestSurcharge={guestSurcharge}
                setGuestSurcharge={setGuestSurcharge}
              />

              <CoreInclusions
                features={features}
                newFeature={newFeature}
                setNewFeature={setNewFeature}
                handleAddFeature={handleAddFeature}
                handleRemoveFeature={handleRemoveFeature}
                inclusions={inclusions}
                setInclusions={setInclusions}
              />

              <PromotionalBadge
                badge={badge}
                setBadge={setBadge}
              />

            </div>

            {/* Right Column Preview (4/12) */}
            <div className="xl:col-span-4 space-y-6">
              
              <CustomerLivePreview
                tierName={tierName}
                selectedIcon={selectedIcon}
                description={description}
                baseRate={baseRate}
                features={features}
                inclusions={inclusions}
                badge={badge}
                onSave={handleSave}
                isSubmitting={isSubmitting}
              />

            </div>
          </div>

        </div>
      </div>

      {/* Premium Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-[#FAF6EE] border border-[#E0D8C3] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 size={32} className="text-[#7C6A2E]" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#7C6A2E] mb-2 tracking-wide">Package Created</h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              The <span className="font-bold text-gray-800">{tierName}</span> package has been successfully configured and added to your portfolio. It is now instantly available for booking.
            </p>
            <button 
              onClick={() => router.push('/hotel-manager/packages')}
              className="w-full bg-[#7C6A2E] hover:bg-[#5E4F20] text-white px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
            >
              Return to Packages
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTierMain;

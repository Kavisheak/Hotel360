"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Sidebar from '@/components/super-admin/dashboard/Sidebar';
import PackagesHeader from '../PackagesHeader';
import TierIdentity from './TierIdentity';
import PricingCapacity from './PricingCapacity';
import CoreInclusions from './CoreInclusions';
import PromotionalBadge from './PromotionalBadge';
import CustomerLivePreview from './CustomerLivePreview';

const CreateTierMain = () => {
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

  const handleSave = () => {
    alert('Tier Configuration saved successfully.');
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
              <Link href="/super-admin/packages" className="hover:text-gray-600 transition-colors">Package Settings</Link>
              <span>&gt;</span>
              <span className="text-[#7C6A2E]">Add New Tier</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#7C6A2E] tracking-tight uppercase">
                Create New Hall Tier
              </h1>
              <Link
                href="/super-admin/packages"
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
              />

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateTierMain;

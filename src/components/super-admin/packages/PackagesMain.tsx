"use client";

import React, { useState } from 'react';
import { initialTiers, initialFees, type Tier, type SupplementalFee } from './packagesData';
import PackagesHeader from './PackagesHeader';
import TierConfigurations from './TierConfigurations';
import SupplementalFees from './SupplementalFees';
import GlobalParameters from './GlobalParameters';
import { PackagePreview, PriceLockReminder } from './PackageSidePanels';
import Sidebar from '@/components/hotel-manager/overview/Sidebar';
import Footer from '@/components/super-admin/dashboard/Footer';

const PackagesMain = () => {
  const [tiers, setTiers] = useState<Tier[]>(initialTiers);
  const [fees, setFees] = useState<SupplementalFee[]>(initialFees);
  const [deposit, setDeposit] = useState(25);
  const [taxRate, setTaxRate] = useState('7.5');
  const [currency, setCurrency] = useState('USD ($) - US Dollar');
  const [enforcement, setEnforcement] = useState(true);

  const handlePriceChange = (id: string, val: number) =>
    setTiers(prev => prev.map(t => (t.id === id ? { ...t, price: val } : t)));

  const handleFeeChange = (id: string, val: number) =>
    setFees(prev => prev.map(f => (f.id === id ? { ...f, fee: val } : f)));

  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800 flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1 min-w-0 pt-14 lg:pt-0 flex flex-col">
        <PackagesHeader />

        <div className="flex-1 px-4 sm:px-8 lg:px-10 py-8 max-w-[1400px] mx-auto w-full">
          {/* Page Title + Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#7C6A2E] tracking-tight">
                Package &amp; Pricing Configuration
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Define the parameters of luxury experiences and meticulous service tiers.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button className="border border-[#7C6A2E] text-[#7C6A2E] font-bold text-[10px] tracking-[0.15em] uppercase px-5 py-3 hover:bg-[#FAF6EE] transition-colors">
                DISCARD CHANGES
              </button>
              <button className="bg-[#7C6A2E] hover:bg-[#5E4F20] text-white font-bold text-[10px] tracking-[0.15em] uppercase px-5 py-3 transition-colors shadow-sm">
                PUBLISH UPDATES
              </button>
            </div>
          </div>

          {/* Two-column layout: Left (main) + Right (sidebar) */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
            {/* Left Column */}
            <div className="space-y-6">
              <TierConfigurations tiers={tiers} onPriceChange={handlePriceChange} />
              <SupplementalFees fees={fees} onFeeChange={handleFeeChange} />
            </div>

            {/* Right Sidebar Panel */}
            <div className="space-y-6">
              <GlobalParameters
                deposit={deposit}
                onDepositChange={setDeposit}
                taxRate={taxRate}
                onTaxRateChange={setTaxRate}
                currency={currency}
                onCurrencyChange={setCurrency}
                enforcement={enforcement}
                onEnforcementToggle={() => setEnforcement(e => !e)}
              />
              <PackagePreview />
              <PriceLockReminder />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default PackagesMain;

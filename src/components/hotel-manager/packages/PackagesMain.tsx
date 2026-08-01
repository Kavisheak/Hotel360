"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { initialTiers, initialFees, type Tier, type SupplementalFee } from './packagesData';
import { packageAPI } from '@/lib/api';
import PackagesHeader from './PackagesHeader';
import TierConfigurations from './TierConfigurations';
import GlobalParameters from './GlobalParameters';
import { PackagePreview, PriceLockReminder } from './PackageSidePanels';
import Sidebar from '@/components/hotel-manager/overview/Sidebar';
import Footer from '@/components/super-admin/dashboard/Footer';

const PackagesMain = () => {
  const [tiers, setTiers] = useState<Tier[]>(initialTiers);
  const [fees, setFees] = useState<SupplementalFee[]>(initialFees);
  const [deposit, setDeposit] = useState(25);
  const [taxRate, setTaxRate] = useState('7.5');
  const [enforcement, setEnforcement] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [tierToEdit, setTierToEdit] = useState<Tier | null>(null);
  const [tierToDelete, setTierToDelete] = useState<Tier | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [successDetails, setSuccessDetails] = useState<string | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const [res, settingsRes] = await Promise.all([
        packageAPI.getAllPackages(),
        packageAPI.getSettings()
      ]);

      if (res.ok && res.data.data && res.data.data.length > 0) {
        const backendTiers: Tier[] = res.data.data.map((pkg: any, idx: number) => {
          let badgeVal = pkg.badge && pkg.badge !== 'NONE' ? pkg.badge : undefined;
          
          return {
            id: pkg._id || String(idx),
            label: pkg.name || 'Unnamed Package',
            description: pkg.description || '',
            price: typeof pkg.price === 'number' ? pkg.price : 0,
            guests: typeof pkg.maxGuests === 'number' ? pkg.maxGuests : 0,
            baseGuests: pkg.baseGuests || 0,
            guestSurcharge: pkg.guestSurcharge || 0,
            icon: pkg.icon || 'diamond',
            badge: badgeVal,
            features: pkg.features && Array.isArray(pkg.features) 
              ? pkg.features.map((f: string) => ({ text: f, included: true }))
              : [],
            inclusions: pkg.inclusions || { valet: false, bridal: false, led: false, catering: false }
          };
        });
        const orderMap: Record<string, number> = { silver: 1, gold: 2, diamond: 3 };
        backendTiers.sort((a, b) => {
          const getOrder = (name: string) => {
            const lower = name.toLowerCase();
            if (lower.includes('silver')) return 1;
            if (lower.includes('gold')) return 2;
            if (lower.includes('diamond')) return 3;
            return 4;
          };
          return getOrder(a.label) - getOrder(b.label);
        });

        setTiers(backendTiers);
      }

      if (settingsRes.ok && settingsRes.data.data) {
        const s = settingsRes.data.data;
        if (s.fees && s.fees.length > 0) setFees(s.fees);
        if (s.deposit !== undefined) setDeposit(s.deposit);
        if (s.taxRate !== undefined) setTaxRate(s.taxRate);
        if (s.enforcement !== undefined) setEnforcement(s.enforcement);
      }
    } catch (err) {
      console.error(err);
      setErrorDetails('Failed to load package configurations.');
    } finally {
    }
  };

  const handlePriceChange = (id: string, val: number) =>
    setTiers(prev => prev.map(t => (t.id === id ? { ...t, price: val } : t)));

  const handleFeeChange = (id: string, val: number) =>
    setFees(prev => prev.map(f => (f.id === id ? { ...f, fee: val } : f)));

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Loop over tiers and push updates to backend
      for (const t of tiers) {
        const payload = {
          name: t.label,
          description: t.description || `${t.label} package for up to ${t.guests} guests.`,
          price: t.price,
          maxGuests: t.guests,
          baseGuests: t.baseGuests || 0,
          guestSurcharge: t.guestSurcharge || 0,
          icon: t.icon || 'diamond',
          badge: t.badge || 'NONE',
          features: t.features ? t.features.map(f => f.text) : [],
          inclusions: t.inclusions || { valet: false, bridal: false, led: false, catering: false }
        };

        if (t.id && t.id.length > 10) {
          // Existing package
          const res = await packageAPI.updatePackage(t.id, payload);
          if (!res.ok) throw new Error(res.data?.message || 'Failed to update package');
        } else {
          // New package (e.g. from initial hardcoded list)
          const res = await packageAPI.createPackage(payload);
          if (!res.ok) throw new Error(res.data?.message || 'Failed to create package');
        }
      }

      // Publish global settings
      const settingsPayload = {
        deposit,
        taxRate,
        enforcement,
      };
      const settingsRes = await packageAPI.updateSettings(settingsPayload);
      if (!settingsRes.ok) throw new Error(settingsRes.data?.message || 'Failed to update settings');

      setShowSuccessModal(true);
      fetchPackages();
    } catch (err) {
      console.error(err);
      setErrorDetails('Failed to publish updates.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUpdateTier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tierToEdit) return;
    setIsUpdating(true);
    
    try {
      const payload = {
        name: tierToEdit.label,
        description: tierToEdit.description || `${tierToEdit.label} package for up to ${tierToEdit.guests} guests.`,
        price: tierToEdit.price,
        maxGuests: tierToEdit.guests,
        baseGuests: tierToEdit.baseGuests || 0,
        guestSurcharge: tierToEdit.guestSurcharge || 0,
        icon: tierToEdit.icon || 'diamond',
        badge: tierToEdit.badge || 'NONE',
        features: tierToEdit.features.map(f => f.text),
        inclusions: tierToEdit.inclusions || { valet: false, bridal: false, led: false, catering: false }
      };

      if (tierToEdit.id && tierToEdit.id.length > 10) {
        const res = await packageAPI.updatePackage(tierToEdit.id, payload);
        if (res.ok) {
          setTiers(prev => prev.map(t => t.id === tierToEdit.id ? tierToEdit : t));
          setTierToEdit(null);
          setSuccessDetails('Tier updated successfully!');
        } else {
          setErrorDetails(`Error: ${res.data?.message}`);
        }
      } else {
        const res = await packageAPI.createPackage(payload);
        if (res.ok) {
          setTierToEdit(null);
          setSuccessDetails('Tier created successfully!');
          fetchPackages();
        } else {
          setErrorDetails(`Error: ${res.data?.message}`);
        }
      }
    } catch (error) {
      console.error(error);
      setErrorDetails('Failed to update tier.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTier = async () => {
    if (!tierToDelete) return;
    setIsUpdating(true);
    try {
      const res = await packageAPI.deletePackage(tierToDelete.id);
      if (res.ok) {
        setTiers(prev => prev.filter(t => t.id !== tierToDelete.id));
        setTierToDelete(null);
        setTierToEdit(null);
        setSuccessDetails('Tier deleted successfully!');
      } else {
        setErrorDetails(`Error deleting: ${res.data.message}`);
      }
    } catch (err) {
      console.error(err);
      setErrorDetails('Failed to delete tier.');
    } finally {
      setIsUpdating(false);
    }
  };

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
              <button 
                onClick={handlePublish}
                disabled={isPublishing}
                className="bg-[#7C6A2E] hover:bg-[#5E4F20] disabled:opacity-50 text-white font-bold text-[10px] tracking-[0.15em] uppercase px-5 py-3 transition-colors shadow-sm"
              >
                {isPublishing ? 'PUBLISHING...' : 'PUBLISH UPDATES'}
              </button>
            </div>
          </div>

          {/* Two-column layout: Left (main) + Right (sidebar) */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
            {/* Left Column */}
            <div className="space-y-6">
              <TierConfigurations tiers={tiers} onPriceChange={handlePriceChange} onEdit={setTierToEdit} />
            </div>

            {/* Right Sidebar Panel */}
            <div className="space-y-6">
              <GlobalParameters
                deposit={deposit}
                onDepositChange={setDeposit}
                taxRate={taxRate}
                onTaxRateChange={setTaxRate}
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

      {/* Premium Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-[#FAF6EE] border border-[#E0D8C3] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 size={32} className="text-[#7C6A2E]" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#7C6A2E] mb-2 tracking-wide">Updates Published</h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              All package configurations and pricing adjustments have been successfully synced with the live booking portal.
            </p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#7C6A2E] hover:bg-[#5E4F20] text-white px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Premium Edit Modal */}
      {tierToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">
            <div className="bg-[#FAF6EE] p-6 border-b border-[#E0D8C3] flex justify-between items-center">
              <h3 className="text-sm font-bold tracking-widest uppercase text-[#7C6A2E]">
                Edit Package Tier
              </h3>
              <button onClick={() => setTierToEdit(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleUpdateTier} className="overflow-y-auto p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Package Name</label>
                <input 
                  required
                  type="text" 
                  value={tierToEdit.label}
                  onChange={(e) => setTierToEdit({...tierToEdit, label: e.target.value})}
                  className="w-full border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Base Rate ($)</label>
                  <input 
                    required
                    type="number" 
                    value={tierToEdit.price}
                    onChange={(e) => setTierToEdit({...tierToEdit, price: Number(e.target.value)})}
                    className="w-full border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Max Capacity</label>
                  <input 
                    required
                    type="number" 
                    value={tierToEdit.guests}
                    onChange={(e) => setTierToEdit({...tierToEdit, guests: Number(e.target.value)})}
                    className="w-full border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Icon</label>
                  <select 
                    value={tierToEdit.icon || 'diamond'}
                    onChange={(e) => setTierToEdit({...tierToEdit, icon: e.target.value})}
                    className="w-full border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-white"
                  >
                    <option value="diamond">Diamond</option>
                    <option value="crown">Crown (Gold)</option>
                    <option value="star">Star</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Badge</label>
                  <select 
                    value={tierToEdit.badge || 'NONE'}
                    onChange={(e) => setTierToEdit({...tierToEdit, badge: e.target.value})}
                    className="w-full border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-white"
                  >
                    <option value="NONE">None</option>
                    <option value="MOST POPULAR">Most Popular</option>
                    <option value="LIMITED OFFER">Limited Offer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Surcharge (LKR)</label>
                  <input 
                    type="number" 
                    value={tierToEdit.guestSurcharge || 0}
                    onChange={(e) => setTierToEdit({...tierToEdit, guestSurcharge: Number(e.target.value)})}
                    className="w-full border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-white"
                  />
                </div>
              </div>

              {/* Vendor Interchangeability & Package Visibility */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 bg-blue-50/60 border border-blue-200 rounded-lg">
                <div>
                  <label className="block text-[10px] font-bold text-[#1E56A0] tracking-widest uppercase mb-1.5">Vendor Interchangeability</label>
                  <select 
                    className="w-full border border-blue-300 px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#1E56A0] bg-white rounded"
                  >
                    <option value="interchangeable">Interchangeable (Customer Choice)</option>
                    <option value="fixed">Fixed (Pre-assigned Vendors Only)</option>
                  </select>
                  <p className="text-[9px] text-gray-500 mt-1">Controls if clients can swap decorators/DJs in booking steps.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#1E56A0] tracking-widest uppercase mb-1.5">Package Visibility</label>
                  <select 
                    className="w-full border border-blue-300 px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#1E56A0] bg-white rounded"
                  >
                    <option value="public">Public (Visible on Portal)</option>
                    <option value="draft">Draft (Manager Only)</option>
                    <option value="archived">Archived</option>
                  </select>
                  <p className="text-[9px] text-gray-500 mt-1">Controls public availability in the customer booking flow.</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Features (One per line)</label>
                <textarea 
                  required
                  rows={8}
                  value={tierToEdit.features.map(f => f.text).join('\n')}
                  onChange={(e) => {
                    const featArray = e.target.value.split('\n').map(f => f.trim()).filter(f => f);
                    setTierToEdit({
                      ...tierToEdit, 
                      features: featArray.map(f => ({ text: f, included: true }))
                    });
                  }}
                  className="w-full border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-white"
                />
              </div>

              <div className="flex gap-4 pt-4 mt-2 border-t border-[#E0D8C3]">
                <button 
                  type="button"
                  onClick={() => setTierToDelete(tierToEdit)}
                  disabled={isUpdating}
                  className="bg-transparent border border-red-200 text-red-600 hover:bg-red-50 px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors"
                >
                  Delete
                </button>
                <div className="flex-1 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setTierToEdit(null)}
                    disabled={isUpdating}
                    className="flex-1 bg-transparent border border-[#E0D8C3] text-gray-600 hover:bg-[#FAF6EE] px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 bg-[#7C6A2E] hover:bg-[#5E4F20] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Premium Delete Confirmation Modal */}
      {tierToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FDF9F1] border border-red-200 shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <span className="text-red-500 text-2xl">⚠</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 tracking-wide">
              Delete {tierToDelete.label}?
            </h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              Are you sure you want to permanently delete this package tier? This action cannot be undone and will immediately remove it from the public booking portal.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setTierToDelete(null)}
                disabled={isUpdating}
                className="flex-1 bg-white border border-[#E0D8C3] hover:bg-gray-50 text-gray-800 px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteTier}
                disabled={isUpdating}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm disabled:opacity-50"
              >
                {isUpdating ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Success Modal (for CRUD operations) */}
      {successDetails && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-[#FAF6EE] border border-[#E0D8C3] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 size={32} className="text-[#7C6A2E]" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#7C6A2E] mb-2 tracking-wide">Success</h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              {successDetails}
            </p>
            <button 
              onClick={() => setSuccessDetails(null)}
              className="w-full bg-[#7C6A2E] hover:bg-[#5E4F20] text-white px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Premium Error Modal */}
      {errorDetails && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FDF9F1] border border-red-200 shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <span className="text-red-500 text-2xl font-bold">!</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 tracking-wide">
              Action Failed
            </h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              {errorDetails}
            </p>
            <button 
              onClick={() => setErrorDetails(null)}
              className="w-full bg-white border border-[#E0D8C3] hover:bg-gray-50 text-gray-800 px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
            >
              Close & Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackagesMain;

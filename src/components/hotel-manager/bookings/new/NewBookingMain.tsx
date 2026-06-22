"use client";

import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, CalendarDays, Users, Package, Palette, Music, Video, Check, Search, MapPin } from 'lucide-react';
import Link from 'next/link';
import { VENDORS_DATA, Vendor } from '@/components/landing/vendors/types';
import { bookingAPI, packageAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

const NewBookingMain = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState('380');
  const [packageType, setPackageType] = useState('gold');
  const [timeslot, setTimeslot] = useState('evening');
  
  const [vendors, setVendors] = useState<{ [key: string]: string }>({ decorator: '', dj: '', videographer: '' });
  
  const [clientInfo, setClientInfo] = useState({ name: '', email: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cashConfirmed, setCashConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [dbPackages, setDbPackages] = useState<any[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    packageAPI.getAllPackages().then(res => {
      if (res.ok && res.data?.data) {
        setDbPackages(res.data.data);
        if (res.data.data.length > 0) setPackageType(res.data.data[0]._id);
      }
    });
  }, []);

  const decorators = VENDORS_DATA.filter(v => v.category === 'decorators');
  const djs = VENDORS_DATA.filter(v => v.category === 'djs');
  const videographers = VENDORS_DATA.filter(v => v.category === 'others');

  const handleVendorSelect = (category: string, vendorId: string) => {
    setVendors(prev => ({
      ...prev,
      [category]: prev[category] === vendorId ? '' : vendorId
    }));
  };

  const getVendorCost = (cat: string) => {
    if (!vendors[cat]) return 0;
    const v = VENDORS_DATA.find(x => x.id === vendors[cat]);
    if (!v) return 0;
    const numericStr = v.startingPrice.replace(/[^0-9]/g, "");
    return numericStr ? parseInt(numericStr, 10) : 0;
  };

  const selectedPkgData = dbPackages.find(p => p._id === packageType);
  const basePrice = selectedPkgData ? selectedPkgData.price : 0;
  const foodCost = parseInt(guests) * 3500;
  const timeslotPremium = timeslot === 'full' ? 500000 : 0;
  const decCost = getVendorCost('decorator');
  const vidCost = getVendorCost('videographer');
  const djCost = getVendorCost('dj');
  const totalCost = basePrice + foodCost + timeslotPremium + decCost + vidCost + djCost;
  const depositAmount = totalCost * 0.3;
  const balanceAmount = totalCost * 0.7;

  const submitBooking = async () => {
    setIsSubmitting(true);
    const finalStatus = (paymentMethod === 'cash' && cashConfirmed) ? "DepositPaid" : "PENDING";

    const payload = {
      clientName: clientInfo.name || 'Walk-in Client',
      email: clientInfo.email || 'N/A',
      phone: clientInfo.phone || 'N/A',
      eventType: selectedPkgData ? selectedPkgData.name : (packageType === 'silver' ? 'Classic Silver Package' : packageType === 'diamond' ? 'Luxury Diamond Gala' : 'Grand Gold Celebration'),
      packageId: packageType,
      date: selectedDate || new Date().toISOString().split('T')[0],
      timeslot: timeslot,
      guests: parseInt(guests),
      status: finalStatus,
      totalCost,
      vendors: {
        decorator: {
          vendorId: vendors.decorator || null,
          status: vendors.decorator ? 'Pending' : 'NotRequired',
          packageName: ''
        },
        dj: {
          vendorId: vendors.dj || null,
          status: vendors.dj ? 'Pending' : 'NotRequired',
          packageName: ''
        },
        videographer: {
          vendorId: vendors.videographer || null,
          status: vendors.videographer ? 'Pending' : 'NotRequired',
          packageName: ''
        }
      },
      menuType: "signature",
      createdAt: new Date().toISOString()
    };

    try {
      const res = await bookingAPI.createBooking(payload);
      if (res.ok) {
        alert(`Booking successfully created!`);
        router.push('/hotel-manager/bookings');
      } else {
        alert(`Error: ${res.data.message}`);
      }
    } catch (err) {
      alert('Failed to create booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderVendorCard = (vendor: Vendor, category: string) => {
    const isSelected = vendors[category] === vendor.id;
    return (
      <div 
        key={vendor.id}
        onClick={() => handleVendorSelect(category, vendor.id)}
        className={`bg-white border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${isSelected ? 'border-[#B08D2C] ring-2 ring-[#B08D2C]/20 shadow-md' : 'border-[#E0D8C3] hover:border-[#B08D2C] hover:shadow-sm'}`}
      >
        <div className="h-40 overflow-hidden relative">
          <img src={vendor.image} alt={vendor.name} className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? 'scale-105' : 'hover:scale-105'}`} />
          {isSelected && (
            <div className="absolute top-3 right-3 bg-[#B08D2C] text-white p-1 rounded-full shadow-sm">
              <Check size={14} strokeWidth={3} />
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold tracking-widest px-2 py-1 rounded">
            {vendor.startingPrice}
          </div>
        </div>
        <div className="p-4">
          <p className="text-[9px] font-bold text-[#A6955C] tracking-widest uppercase mb-1">{vendor.categoryLabel}</p>
          <h4 className="text-lg font-serif font-bold text-gray-900 mb-2">{vendor.name}</h4>
          <p className="text-xs text-gray-500 line-clamp-2">{vendor.description}</p>
          <div className="mt-3 flex flex-wrap gap-1">
            {vendor.specialties.slice(0, 2).map((s, idx) => (
              <span key={idx} className="bg-[#FDF9F1] border border-[#F2EADA] text-gray-600 text-[9px] px-2 py-0.5 rounded-sm">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-screen bg-[#FDF9F1]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#FDF9F1]/90 backdrop-blur-md border-b border-[#E0D8C3] flex items-center px-4 lg:px-6 h-16 pl-14 lg:pl-6">
        <div className="flex items-center gap-4 w-full">
          <Link href="/hotel-manager" className="text-gray-400 hover:text-[#7C6A2E] transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="w-px h-6 bg-[#E0D8C3]" />
          <h2 className="font-serif italic text-[#7C6A2E] text-xl font-semibold tracking-wide">
            New Assisted Booking
          </h2>
        </div>
      </header>

      <main className="flex-1 px-4 lg:px-10 py-8 max-w-6xl mx-auto w-full">
        {/* Stepper */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-[#E0D8C3] -z-10" />
          {[
            { step: 1, label: 'Event Details' },
            { step: 2, label: 'Service Assignments' },
            { step: 3, label: 'Finalization' }
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center bg-[#FDF9F1] px-4 gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                currentStep === item.step ? 'border-[#B08D2C] text-[#B08D2C] bg-[#FDF9F1]' :
                currentStep > item.step ? 'border-[#B08D2C] bg-[#B08D2C] text-white' : 'border-[#E0D8C3] text-gray-400 bg-[#FDF9F1]'
              }`}>
                {currentStep > item.step ? <Check size={14} strokeWidth={3} /> : item.step}
              </div>
              <span className={`text-[10px] font-bold tracking-widest uppercase ${currentStep >= item.step ? 'text-[#7C6A2E]' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: Details */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white border border-[#E0D8C3] p-8 shadow-sm">
              <h3 className="text-2xl font-serif font-bold text-[#7C6A2E] mb-6">Hall & Date Parameters</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-3">Target Date</label>
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border border-[#E0D8C3] px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-3">Expected Guests</label>
                  <input 
                    type="number" 
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full border border-[#E0D8C3] px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-transparent"
                  />
                </div>
              </div>

              <div className="mt-8">
                <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-4">Package Tier</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dbPackages.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No packages available. Create one in the Package Settings.</p>
                  ) : (
                    dbPackages.map(pkg => (
                      <div 
                        key={pkg._id}
                        onClick={() => setPackageType(pkg._id)}
                        className={`border p-4 cursor-pointer transition-colors flex items-center gap-3 ${packageType === pkg._id ? 'border-[#B08D2C] bg-[#FDF9F1]' : 'border-[#E0D8C3] hover:border-[#B08D2C] bg-white'}`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${packageType === pkg._id ? 'border-[#B08D2C]' : 'border-gray-300'}`}>
                          {packageType === pkg._id && <div className="w-2 h-2 rounded-full bg-[#B08D2C]" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800 uppercase tracking-widest">{pkg.name}</p>
                          <p className="text-[10px] text-gray-500 font-serif italic mt-0.5">
                            {(pkg.price / 1000000).toFixed(1)}M LKR Base
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-8">
                <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-4">Timeslot</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setTimeslot('evening')}
                    className={`border p-4 cursor-pointer transition-colors ${timeslot === 'evening' ? 'border-[#B08D2C] bg-[#FDF9F1]' : 'border-[#E0D8C3] hover:border-[#B08D2C] bg-white'}`}
                  >
                    <p className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-1">Evening Only</p>
                    <p className="text-[10px] text-gray-500">Standard 6-hour access. No extra charge.</p>
                  </div>
                  <div 
                    onClick={() => setTimeslot('full')}
                    className={`border p-4 cursor-pointer transition-colors ${timeslot === 'full' ? 'border-[#B08D2C] bg-[#FDF9F1]' : 'border-[#E0D8C3] hover:border-[#B08D2C] bg-white'}`}
                  >
                    <p className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-1">Full Day</p>
                    <p className="text-[10px] text-gray-500">+500,000 LKR Premium. 12-hour access.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Service Assignments */}
        {currentStep === 2 && (
          <div className="space-y-10 animate-fadeIn">
            {/* Visual presentation header for the customer */}
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h3 className="text-3xl font-serif font-bold text-[#7C6A2E] mb-3">Artisan Showcases</h3>
              <p className="text-sm text-gray-600 font-serif italic">
                Present these portfolios to the client. Allow them to review the visual works and select their preferred professionals for the celebration.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-[#E0D8C3] pb-2">
                  <Palette size={18} className="text-[#B08D2C]" />
                  <h4 className="text-[12px] font-bold tracking-widest uppercase text-[#7C6A2E]">Master Decorators</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {decorators.map(v => renderVendorCard(v, 'decorator'))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-[#E0D8C3] pb-2">
                  <Video size={18} className="text-[#B08D2C]" />
                  <h4 className="text-[12px] font-bold tracking-widest uppercase text-[#7C6A2E]">Cinematography & Photography</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videographers.map(v => renderVendorCard(v, 'videographer'))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-[#E0D8C3] pb-2">
                  <Music size={18} className="text-[#B08D2C]" />
                  <h4 className="text-[12px] font-bold tracking-widest uppercase text-[#7C6A2E]">Musical Entertainment</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {djs.map(v => renderVendorCard(v, 'dj'))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Finalization */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
              
              {/* Left Column: Client Info & Payment */}
              <div className="space-y-8">
                {/* Client Info */}
                <div className="bg-white border border-[#E0D8C3] p-8 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#B08D2C]" />
                  <h3 className="text-xl font-serif font-bold text-[#7C6A2E] mb-6">Client Registry</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Full Name</label>
                      <input 
                        type="text" 
                        value={clientInfo.name}
                        onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
                        placeholder="e.g. John & Sarah"
                        className="w-full border border-[#E0D8C3] px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-[#FDF9F1]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Email Address</label>
                        <input 
                          type="email" 
                          value={clientInfo.email}
                          onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                          placeholder="client@example.com"
                          className="w-full border border-[#E0D8C3] px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-[#FDF9F1]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Phone Number</label>
                        <input 
                          type="tel" 
                          value={clientInfo.phone}
                          onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})}
                          placeholder="+94 77 ..."
                          className="w-full border border-[#E0D8C3] px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-[#FDF9F1]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Collection */}
                <div className="bg-white border border-[#E0D8C3] p-8 shadow-sm">
                  <h3 className="text-xl font-serif font-bold text-[#7C6A2E] mb-2">Payment Collection</h3>
                  <p className="text-xs text-gray-500 italic font-serif mb-6">
                    A 30% initial deposit is required to secure the reservation. The remaining 70% must be paid 14 days prior to the event date.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div 
                      onClick={() => setPaymentMethod('card')}
                      className={`border p-4 cursor-pointer text-center transition-colors ${paymentMethod === 'card' ? 'border-[#B08D2C] bg-[#FDF9F1]' : 'border-[#E0D8C3] hover:border-[#B08D2C]'}`}
                    >
                      <p className="text-xs font-bold text-gray-800 uppercase tracking-widest">Card Payment</p>
                      <p className="text-[10px] text-gray-500 mt-1">Send payment link</p>
                    </div>
                    <div 
                      onClick={() => setPaymentMethod('cash')}
                      className={`border p-4 cursor-pointer text-center transition-colors ${paymentMethod === 'cash' ? 'border-[#B08D2C] bg-[#FDF9F1]' : 'border-[#E0D8C3] hover:border-[#B08D2C]'}`}
                    >
                      <p className="text-xs font-bold text-gray-800 uppercase tracking-widest">Cash Deposit</p>
                      <p className="text-[10px] text-gray-500 mt-1">Collect at desk</p>
                    </div>
                  </div>

                  {paymentMethod === 'cash' && (
                    <div className="bg-[#FAF6EE] p-4 border border-[#E0D8C3] flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        id="cashConfirm" 
                        checked={cashConfirmed}
                        onChange={(e) => setCashConfirmed(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-[#B08D2C] cursor-pointer"
                      />
                      <label htmlFor="cashConfirm" className="text-xs text-gray-700 cursor-pointer">
                        <strong className="text-[#7C6A2E]">I confirm</strong> that I have physically received the 30% initial deposit (<strong className="text-gray-900">LKR {depositAmount.toLocaleString()}</strong>) in cash from the client.
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Premium Summary */}
              <div className="bg-[#FAF6EE] border border-[#E0D8C3] shadow-lg flex flex-col h-fit sticky top-24">
                <div className="bg-[#4E411B] p-6 text-center">
                  <h3 className="text-xl font-serif font-bold text-white tracking-widest uppercase">Investment Summary</h3>
                </div>
                
                <div className="p-6 space-y-6 flex-1">
                  {/* Event Details */}
                  <div className="border-b border-[#E0D8C3] pb-4">
                    <p className="text-[9px] font-bold text-[#A6955C] tracking-widest uppercase mb-1">Event Date</p>
                    <p className="text-sm font-bold text-gray-900">{selectedDate || 'Date Not Selected'}</p>
                  </div>

                  {/* Itemized List */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Base {selectedPkgData?.name || 'Package'}</span>
                      <span className="text-xs font-bold text-gray-900">LKR {basePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Signature Menu ({guests} pax)</span>
                      <span className="text-xs font-bold text-gray-900">LKR {foodCost.toLocaleString()}</span>
                    </div>
                    {timeslotPremium > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Full Day Access Premium</span>
                        <span className="text-xs font-bold text-gray-900">LKR {timeslotPremium.toLocaleString()}</span>
                      </div>
                    )}
                    {decCost > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Decorator ({VENDORS_DATA.find(v=>v.id===vendors.decorator)?.name})</span>
                        <span className="text-xs font-bold text-gray-900">LKR {decCost.toLocaleString()}</span>
                      </div>
                    )}
                    {vidCost > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Videography ({VENDORS_DATA.find(v=>v.id===vendors.videographer)?.name})</span>
                        <span className="text-xs font-bold text-gray-900">LKR {vidCost.toLocaleString()}</span>
                      </div>
                    )}
                    {djCost > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Entertainment ({VENDORS_DATA.find(v=>v.id===vendors.dj)?.name})</span>
                        <span className="text-xs font-bold text-gray-900">LKR {djCost.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="pt-4 border-t border-[#E0D8C3]">
                    <div className="flex justify-between items-end mb-4">
                      <span className="text-xs font-bold tracking-widest uppercase text-[#7C6A2E]">Total Investment</span>
                      <span className="text-2xl font-serif font-bold text-gray-900">LKR {totalCost.toLocaleString()}</span>
                    </div>
                    
                    <div className="bg-white border border-[#E0D8C3] p-4 text-center">
                      <p className="text-[9px] font-bold tracking-widest text-[#B08D2C] uppercase mb-1">Initial Deposit Due Now (30%)</p>
                      <p className="text-xl font-serif font-bold text-gray-900">
                        LKR {depositAmount.toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-3 text-center">
                      <p className="text-[10px] text-gray-500">
                        Balance of <strong className="text-[#7C6A2E]">LKR {balanceAmount.toLocaleString()}</strong> due before event.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-[#E0D8C3]">
          {currentStep > 1 ? (
            <button 
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-[#7C6A2E] transition-colors"
            >
              &larr; Previous Step
            </button>
          ) : (
            <div></div> // Spacer
          )}

          {currentStep < 3 ? (
            <button 
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="bg-[#7C6A2E] hover:bg-[#5E4F20] text-white text-[10px] font-bold uppercase tracking-widest px-8 py-3 rounded shadow-sm transition-colors"
            >
              Continue &rarr;
            </button>
          ) : (
            <button 
              onClick={submitBooking}
              disabled={isSubmitting}
              className="bg-green-700 hover:bg-green-800 text-white text-[10px] font-bold uppercase tracking-widest px-8 py-3 rounded shadow-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Finalizing...' : 'Finalize & Add Booking'}
            </button>
          )}
        </div>

      </main>
    </div>
  );
};

export default NewBookingMain;

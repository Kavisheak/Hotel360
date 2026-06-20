'use client';

import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, Lock, Save, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NewVendorMain = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'decorator',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password: pass }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to create staff account
    setTimeout(() => {
      alert(`Vendor account for ${formData.firstName} ${formData.lastName} created successfully! Credentials sent to ${formData.email}.`);
      setIsSubmitting(false);
      router.push('/hotel-manager/vendors');
    }, 1500);
  };

  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-screen bg-[#FDF9F1]">
      <header className="sticky top-0 z-30 bg-[#FDF9F1]/90 backdrop-blur-md border-b border-[#E0D8C3] flex items-center px-4 lg:px-10 h-16">
        <div className="flex items-center gap-4 w-full">
          <Link href="/hotel-manager/vendors" className="text-gray-400 hover:text-[#7C6A2E] transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="w-px h-6 bg-[#E0D8C3]" />
          <h2 className="font-serif italic text-[#7C6A2E] text-xl font-semibold tracking-wide">
            Add New Vendor
          </h2>
        </div>
      </header>

      <main className="flex-1 px-4 lg:px-10 py-10 max-w-5xl mx-auto w-full">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-[#7C6A2E] mb-3">Onboard a Partner</h1>
          <p className="text-sm text-gray-600 font-serif italic">
            Create an official portal account for a new external artisan. This grants them access to manage their assigned bookings and portfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white border border-[#E0D8C3] shadow-sm overflow-hidden">
              <div className="bg-[#FAF6EE] p-6 border-b border-[#E0D8C3]">
                <h3 className="text-sm font-bold tracking-widest uppercase text-[#7C6A2E] flex items-center gap-2">
                  <User size={16} /> Vendor Profile Details
                </h3>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">First Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-[#FDF9F1]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Last Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-[#FDF9F1]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2 flex items-center gap-1">
                      <Mail size={12}/> Email Address
                    </label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-[#FDF9F1]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2 flex items-center gap-1">
                      <Phone size={12}/> Contact Number
                    </label>
                    <div className="flex">
                      <span className="bg-[#FAF6EE] border border-[#E0D8C3] border-r-0 px-3 py-2.5 text-gray-500 text-sm flex items-center">
                        +94
                      </span>
                      <input 
                        required
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-[#FDF9F1]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-3">Service Category</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { id: 'decorator', label: 'Decorator' },
                      { id: 'videographer', label: 'Videography' },
                      { id: 'dj_artist', label: 'DJ / Music' }
                    ].map(role => (
                      <div 
                        key={role.id}
                        onClick={() => setFormData({...formData, role: role.id})}
                        className={`border p-3 cursor-pointer text-center transition-colors ${formData.role === role.id ? 'border-[#B08D2C] bg-[#FDF9F1] ring-1 ring-[#B08D2C]' : 'border-[#E0D8C3] hover:border-[#B08D2C] bg-white'}`}
                      >
                        <p className={`text-xs font-bold uppercase tracking-widest ${formData.role === role.id ? 'text-[#7C6A2E]' : 'text-gray-600'}`}>
                          {role.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E0D8C3] shadow-sm overflow-hidden">
              <div className="bg-[#FAF6EE] p-6 border-b border-[#E0D8C3]">
                <h3 className="text-sm font-bold tracking-widest uppercase text-[#7C6A2E] flex items-center gap-2">
                  <Lock size={16} /> Authentication
                </h3>
              </div>
              <div className="p-8">
                <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Initial Password</label>
                <div className="flex gap-3">
                  <input 
                    required
                    type="text" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Set temporary password"
                    className="flex-1 border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-[#FDF9F1] font-mono"
                  />
                  <button 
                    type="button"
                    onClick={generatePassword}
                    className="bg-[#E0D8C3] hover:bg-[#D4C9A8] text-[#4E411B] px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors"
                  >
                    Auto Generate
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-2 italic">The vendor will be required to change this upon their first login.</p>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Link href="/hotel-manager/vendors" className="px-6 py-3 border border-[#E0D8C3] text-gray-600 text-[10px] font-bold uppercase tracking-widest hover:bg-[#FAF6EE] transition-colors">
                Cancel
              </Link>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-[#7C6A2E] hover:bg-[#5E4F20] disabled:bg-gray-400 text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-sm"
              >
                {isSubmitting ? 'Creating...' : <><Save size={16} /> Create Account</>}
              </button>
            </div>
          </form>

          {/* Right Column Context */}
          <div className="space-y-6">
            <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-6">
              <h3 className="text-sm font-bold tracking-widest uppercase text-[#7C6A2E] mb-4 flex items-center gap-2">
                <ShieldCheck size={16} /> Security Notice
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Creating an account grants this vendor access to the EASCC internal portal. Ensure all offline contracts are signed before provisioning access.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle2 size={14} className="text-[#B08D2C] shrink-0 mt-0.5" />
                  <span>Vendor can view assigned bookings only</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle2 size={14} className="text-[#B08D2C] shrink-0 mt-0.5" />
                  <span>Vendor can upload portfolio items</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle2 size={14} className="text-[#B08D2C] shrink-0 mt-0.5" />
                  <span>Vendor cannot see financial metrics</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#4E411B] text-[#FDF9F1] p-6 text-center">
              <Tag size={24} className="mx-auto mb-3 opacity-80" />
              <h3 className="text-sm font-bold tracking-widest uppercase mb-2">Automated Email</h3>
              <p className="text-[10px] opacity-80 leading-relaxed">
                Once created, the system will automatically dispatch an introductory email to the vendor containing their secure login link and temporary credentials.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewVendorMain;

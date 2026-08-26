'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Mail, Phone, Palette, Video, Music } from 'lucide-react';
import Link from 'next/link';

import { staffAPI } from '@/lib/api';
import { validateEmail, validatePhone } from '@/lib/validation';

// Premium SVG Icons
const DecoratorIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17.5 13.5C16.67 13.5 16 12.83 16 12C16 11.17 16.67 10.5 17.5 10.5C18.33 10.5 19 11.17 19 12C19 12.83 18.33 13.5 17.5 13.5ZM14.5 9.5C13.67 9.5 13 8.83 13 8C13 7.17 13.67 6.5 14.5 6.5C15.33 6.5 16 7.17 16 8C16 8.83 15.33 9.5 14.5 9.5ZM9.5 9.5C8.67 9.5 8 8.83 8 8C8 7.17 8.67 6.5 9.5 6.5C10.33 6.5 11 7.17 11 8C11 8.83 10.33 9.5 9.5 9.5ZM6.5 13.5C5.67 13.5 5 12.83 5 12C5 11.17 5.67 10.5 6.5 10.5C7.33 10.5 8 11.17 8 12C8 12.83 7.33 13.5 6.5 13.5ZM12 19C9.33 19 7 17.33 7 15H17C17 17.33 14.67 19 12 19Z" fill="currentColor" />
  </svg>
);

const VideoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 10.5V7C17 5.9 16.1 5 15 5H4C2.9 5 2 5.9 2 7V17C2 18.1 2.9 19 4 19H15C16.1 19 17 18.1 17 17V13.5L22 18.5V5.5L17 10.5Z" fill="currentColor" />
  </svg>
);

const DJIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17C6 19.21 7.79 21 10 21C12.21 21 14 19.21 14 17V7H18V3H12Z" fill="currentColor" />
  </svg>
);

const roleConfig: Record<string, { label: string, icon: React.ReactNode, color: string, bg: string }> = {
  'decorator': { label: 'Decorator', icon: <DecoratorIcon />, color: 'text-[#7C6A2E]', bg: 'bg-[#FDF9F1] border-[#E0D8C3] shadow-sm' },
  'videographer': { label: 'Videographer', icon: <VideoIcon />, color: 'text-[#2C3E50]', bg: 'bg-[#F8F9FA] border-[#DEE2E6] shadow-sm' },
  'dj_artist': { label: 'DJ Artist', icon: <DJIcon />, color: 'text-[#8B5A2B]', bg: 'bg-[#FFF8DC] border-[#EEDD82] shadow-sm' },
};

const VendorsListMain = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vendorToDelete, setVendorToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [vendorToEdit, setVendorToEdit] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [successDetails, setSuccessDetails] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string, phone?: string }>({});

  React.useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const response = await staffAPI.getAllVendors();
      if (response.ok && response.data.data) {
        setVendors(response.data.data);
      } else {
        console.error("Failed to load vendors", response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorToEdit) return;

    setErrors({});
    let hasError = false;
    const newErrors: typeof errors = {};

    if (!validateEmail(vendorToEdit.email)) {
      newErrors.email = "Please enter a valid email address.";
      hasError = true;
    }
    if (!validatePhone(vendorToEdit.phone)) {
      newErrors.phone = "Please enter a valid Sri Lankan phone number.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsUpdating(true);

    try {
      const response = await staffAPI.updateVendor(vendorToEdit._id, vendorToEdit);
      if (response.ok) {
        setVendors(prev => prev.map(v => v._id === vendorToEdit._id ? response.data.data : v));
        setVendorToEdit(null);
        setSuccessDetails('Vendor profile updated successfully.');
      } else {
        setErrorDetails(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error(error);
      setErrorDetails('Failed to update vendor.');
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = async () => {
    if (!vendorToDelete) return;
    setIsDeleting(true);

    try {
      const response = await staffAPI.deleteVendor(vendorToDelete);
      if (response.ok) {
        setVendors(prev => prev.filter(v => v._id !== vendorToDelete));
        setVendorToDelete(null);
        setSuccessDetails('Vendor removed successfully.');
      } else {
        setErrorDetails(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error(error);
      setErrorDetails('Failed to delete vendor.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || v.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto bg-[#FDF9F1] space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#7C6A2E] mb-2 tracking-wide">Vendor Directory & Performance</h1>
          <p className="text-gray-500 text-sm">Manage vendor registrations, monitor performance metrics, and assign package preferences.</p>
        </div>

        <Link
          href="/hotel-manager/vendors/new"
          className="bg-[#1E56A0] hover:bg-[#15417E] text-white px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={16} /> Register New Vendor
        </Link>
      </div>

      {/* Performance Summary Cards - Connected to Real Backend Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E0D8C3] shadow-xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Registered Artisans</p>
          <p className="text-2xl font-bold text-[#7C6A2E] mt-1">{isLoading ? "..." : vendors.length}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">Decorators, Videographers &amp; DJs</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#E0D8C3] shadow-xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Provider Ratio</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {isLoading ? "..." : `${vendors.length > 0 ? Math.round((vendors.filter(v => v.isActive !== false).length / vendors.length) * 100) : 100}%`}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">
            {vendors.filter(v => v.isActive !== false).length} active of {vendors.length} total
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#E0D8C3] shadow-xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Events Assigned</p>
          <p className="text-2xl font-bold text-[#1E56A0] mt-1">
            {isLoading ? "..." : vendors.reduce((acc, v) => acc + (v.bookings || 0), 0)}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">Across all registered vendor accounts</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#E0D8C3] shadow-xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Provider Breakdown</p>
          <p className="text-sm font-bold text-gray-700 mt-1 flex items-center gap-2">
            <span className="flex items-center gap-1"><Palette size={14} className="text-[#7C6A2E]" /> {vendors.filter(v => v.role === 'decorator').length}</span>
            <span className="flex items-center gap-1"><Video size={14} className="text-[#2C3E50]" /> {vendors.filter(v => v.role === 'videographer').length}</span>
            <span className="flex items-center gap-1"><Music size={14} className="text-[#8B5A2B]" /> {vendors.filter(v => v.role === 'dj_artist').length}</span>
          </p>
          <p className="text-[10px] text-gray-500 mt-1">Decorator • Videographer • DJ</p>
        </div>
      </div>

      <div className="bg-white border border-[#E0D8C3] shadow-sm rounded-sm mb-8">
        <div className="p-6 border-b border-[#E0D8C3] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#FAF6EE]">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E0D8C3] rounded text-sm focus:outline-none focus:border-[#7C6A2E] bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} className="text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="border border-[#E0D8C3] py-2 px-4 rounded text-sm text-gray-700 bg-white focus:outline-none focus:border-[#7C6A2E]"
            >
              <option value="all">All Roles</option>
              <option value="decorator">Decorators</option>
              <option value="videographer">Videographers</option>
              <option value="dj_artist">DJ Artists</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-[#A48F40] text-white text-[10px] uppercase tracking-widest">
                <th className="px-6 py-4 font-bold">Vendor Name</th>
                <th className="px-6 py-4 font-bold">Role Category</th>
                <th className="px-6 py-4 font-bold">Contact Info</th>
                <th className="px-6 py-4 font-bold">Bookings</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Verification</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0D8C3]">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">
                    Loading vendors...
                  </td>
                </tr>
              )}
              {!isLoading && filteredVendors.map((vendor, idx) => {
                const roleInfo = roleConfig[vendor.role] || { label: 'Unknown', icon: null, color: 'text-gray-700', bg: 'bg-gray-100' };
                return (
                  <tr key={vendor._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF6EE] hover:bg-[#F2EADA] transition-colors'}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#E0D8C3] flex items-center justify-center text-[#7C6A2E] font-bold font-serif">
                          {vendor.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{vendor.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">{vendor._id.substring(0, 8).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-bold tracking-widest uppercase ${roleInfo.bg} ${roleInfo.color}`}>
                        {roleInfo.icon} {roleInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Mail size={12} /> {vendor.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Phone size={12} /> {vendor.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {vendor.bookings || 0} Events
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${vendor.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}>
                        {vendor.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${vendor.isVerified ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}>
                        {vendor.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setVendorToEdit(vendor)}
                          className="text-gray-400 hover:text-[#7C6A2E] transition-colors" title="Edit Vendor"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setVendorToDelete(vendor._id)}
                          className="text-gray-400 hover:text-red-600 transition-colors" title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!isLoading && filteredVendors.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">
                    No vendors found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium Delete Confirmation Modal */}
      {vendorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2 tracking-wide">Remove Vendor?</h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              Are you sure you want to permanently revoke this vendor's portal access and remove them from the directory? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setVendorToDelete(null)}
                disabled={isDeleting}
                className="flex-1 bg-transparent border border-[#E0D8C3] text-gray-600 hover:bg-[#FAF6EE] px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm disabled:opacity-50"
              >
                {isDeleting ? 'Removing...' : 'Confirm Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Premium Edit Modal */}
      {vendorToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">
            <div className="bg-[#FAF6EE] p-6 border-b border-[#E0D8C3] flex justify-between items-center">
              <h3 className="text-sm font-bold tracking-widest uppercase text-[#7C6A2E] flex items-center gap-2">
                <Edit2 size={16} /> Edit Vendor Profile
              </h3>
              <button onClick={() => setVendorToEdit(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleUpdate} className="overflow-y-auto p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Shop Name / Business Name</label>
                <input
                  required
                  type="text"
                  value={vendorToEdit.shopName || ''}
                  onChange={(e) => setVendorToEdit({ ...vendorToEdit, shopName: e.target.value })}
                  className="w-full border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">First Name (Contact)</label>
                  <input
                    required
                    type="text"
                    value={vendorToEdit.firstName || ''}
                    onChange={(e) => setVendorToEdit({ ...vendorToEdit, firstName: e.target.value })}
                    className="w-full border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Last Name (Contact)</label>
                  <input
                    required
                    type="text"
                    value={vendorToEdit.lastName || ''}
                    onChange={(e) => setVendorToEdit({ ...vendorToEdit, lastName: e.target.value })}
                    className="w-full border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Email Address</label>
                  <input
                    required
                    type="email"
                    value={vendorToEdit.email}
                    onChange={(e) => {
                      setVendorToEdit({ ...vendorToEdit, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    className="w-full border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-white"
                  />
                  {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Contact Number</label>
                  <input
                    required
                    type="tel"
                    value={vendorToEdit.phone}
                    onChange={(e) => {
                      setVendorToEdit({ ...vendorToEdit, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: undefined });
                    }}
                    className="w-full border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-white"
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Role Category</label>
                  <select
                    value={vendorToEdit.role}
                    onChange={(e) => setVendorToEdit({ ...vendorToEdit, role: e.target.value })}
                    className="w-full border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-white"
                  >
                    <option value="decorator">Decorator</option>
                    <option value="videographer">Videographer</option>
                    <option value="dj_artist">DJ Artist</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Account Status</label>
                  <select
                    value={vendorToEdit.isActive ? 'true' : 'false'}
                    onChange={(e) => setVendorToEdit({ ...vendorToEdit, isActive: e.target.value === 'true' })}
                    className="w-full border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-white"
                  >
                    <option value="true">Active (Access Granted)</option>
                    <option value="false">Inactive (Access Revoked)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Verification Status</label>
                  <select
                    value={vendorToEdit.isVerified ? 'true' : 'false'}
                    onChange={(e) => setVendorToEdit({ ...vendorToEdit, isVerified: e.target.value === 'true' })}
                    className="w-full border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-white"
                  >
                    <option value="true">Verified (Badge Shown)</option>
                    <option value="false">Unverified</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4 mt-2 border-t border-[#E0D8C3]">
                <button
                  type="button"
                  onClick={() => setVendorToEdit(null)}
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
            </form>
          </div>
        </div>
      )}

      {/* Premium Success Modal (for CRUD operations) */}
      {successDetails && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-[#FAF6EE] border border-[#E0D8C3] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <svg className="w-8 h-8 text-[#7C6A2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
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

export default VendorsListMain;

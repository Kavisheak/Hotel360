'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Mail, Phone, Palette, Video, Music } from 'lucide-react';
import Link from 'next/link';

// Mock data for initial state
const MOCK_VENDORS = [
  { id: 'V001', name: 'Nayana Decorators', email: 'nayana@example.com', phone: '0771234567', role: 'decorator', status: 'Active', bookings: 12 },
  { id: 'V002', name: 'Focus Studio', email: 'focus@example.com', phone: '0719876543', role: 'videographer', status: 'Active', bookings: 8 },
  { id: 'V003', name: 'DJ Blast', email: 'blast@example.com', phone: '0723456789', role: 'dj_artist', status: 'Inactive', bookings: 3 },
];

// Premium SVG Icons
const DecoratorIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17.5 13.5C16.67 13.5 16 12.83 16 12C16 11.17 16.67 10.5 17.5 10.5C18.33 10.5 19 11.17 19 12C19 12.83 18.33 13.5 17.5 13.5ZM14.5 9.5C13.67 9.5 13 8.83 13 8C13 7.17 13.67 6.5 14.5 6.5C15.33 6.5 16 7.17 16 8C16 8.83 15.33 9.5 14.5 9.5ZM9.5 9.5C8.67 9.5 8 8.83 8 8C8 7.17 8.67 6.5 9.5 6.5C10.33 6.5 11 7.17 11 8C11 8.83 10.33 9.5 9.5 9.5ZM6.5 13.5C5.67 13.5 5 12.83 5 12C5 11.17 5.67 10.5 6.5 10.5C7.33 10.5 8 11.17 8 12C8 12.83 7.33 13.5 6.5 13.5ZM12 19C9.33 19 7 17.33 7 15H17C17 17.33 14.67 19 12 19Z" fill="currentColor"/>
  </svg>
);

const VideoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 10.5V7C17 5.9 16.1 5 15 5H4C2.9 5 2 5.9 2 7V17C2 18.1 2.9 19 4 19H15C16.1 19 17 18.1 17 17V13.5L22 18.5V5.5L17 10.5Z" fill="currentColor"/>
  </svg>
);

const DJIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17C6 19.21 7.79 21 10 21C12.21 21 14 19.21 14 17V7H18V3H12Z" fill="currentColor"/>
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

  const filteredVendors = MOCK_VENDORS.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || v.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto bg-[#FDF9F1]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#7C6A2E] mb-2 tracking-wide">Vendor Directory</h1>
          <p className="text-gray-500 text-sm">Manage external service providers and their access to the portal.</p>
        </div>
        
        <Link 
          href="/hotel-manager/vendors/new"
          className="bg-[#7C6A2E] hover:bg-[#5E4F20] text-white px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={16} /> Add New Vendor
        </Link>
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
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0D8C3]">
              {filteredVendors.map((vendor, idx) => {
                const roleInfo = roleConfig[vendor.role] || { label: 'Unknown', icon: null, color: 'text-gray-700', bg: 'bg-gray-100' };
                return (
                  <tr key={vendor.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF6EE] hover:bg-[#F2EADA] transition-colors'}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#E0D8C3] flex items-center justify-center text-[#7C6A2E] font-bold font-serif">
                          {vendor.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{vendor.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">{vendor.id}</p>
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
                      {vendor.bookings} Events
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                        vendor.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button className="text-gray-400 hover:text-[#7C6A2E] transition-colors" title="Edit Vendor"><Edit2 size={16} /></button>
                        <button className="text-gray-400 hover:text-red-600 transition-colors" title="Remove"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredVendors.length === 0 && (
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
    </div>
  );
};

export default VendorsListMain;

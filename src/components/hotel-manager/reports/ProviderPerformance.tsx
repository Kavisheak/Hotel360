"use client";

import React, { useEffect, useState } from 'react';
import { staffAPI, bookingAPI } from '../../../lib/api';
import { getImageUrl } from '@/lib/utils';
import { User } from 'lucide-react';

const ProviderPerformance = () => {
  const [providers, setProviders] = useState<any[]>([
    { name: 'Loading...', subtitle: '-', score: 0, img: null, count: 0 }
  ]);

  useEffect(() => {
    const fetchProviders = async () => {
      const [vendorsRes, bookingsRes] = await Promise.all([
        staffAPI.getAllVendors(),
        bookingAPI.getAllBookings()
      ]);

      if (vendorsRes.ok && bookingsRes.ok) {
        const vendors = vendorsRes.data.data;
        const bookings = bookingsRes.data.data;
        
        let totalValidBookings = 0;
        const vendorBookingCounts: Record<string, number> = {};

        bookings.forEach((b: any) => {
          if (b.status !== "Cancelled" && b.status !== "Rejected") {
            totalValidBookings++;
            if (b.vendors) {
              Object.keys(b.vendors).forEach((role) => {
                const vendorData = b.vendors[role];
                if (vendorData && vendorData.vendorId) {
                  const vid = vendorData.vendorId._id || vendorData.vendorId;
                  vendorBookingCounts[vid] = (vendorBookingCounts[vid] || 0) + 1;
                }
              });
            }
          }
        });

        const sorted = vendors.map((v: any) => {
          const rawImg = v.profileImage || v.logo || v.avatar || v.image;
          const assignedCount = vendorBookingCounts[v._id] || 0;
          // Score relative to the highest possible (being assigned to every single booking)
          const percentage = totalValidBookings > 0 ? (assignedCount / totalValidBookings) * 100 : 0;
          
          return {
            name: v.name || v.companyName || "Service Provider",
            subtitle: `${assignedCount} ASSIGNED`,
            score: percentage,
            img: rawImg ? getImageUrl(rawImg) : null,
            count: assignedCount
          };
        }).sort((a: any, b: any) => b.count - a.count).slice(0, 3);
        
        setProviders(sorted.length > 0 ? sorted : [
          { name: 'No Providers', subtitle: '-', score: 0, img: null, count: 0 }
        ]);
      }
    };
    fetchProviders();
  }, []);

  return (
  <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-sm h-full flex flex-col p-5">
    <div className="flex items-start justify-between mb-6">
      <h3 className="text-lg font-serif font-semibold text-gray-800 leading-tight pr-4">
        Most Assigned<br />Providers
      </h3>
      <button className="text-[9px] font-bold uppercase tracking-widest text-[#B08D2C] hover:text-[#7C6A2E] text-right">
        View<br />All
      </button>
    </div>
    
    <div className="space-y-6 flex-1 flex flex-col justify-center">
      {providers.map((p, i) => (
        <div key={i} className="flex items-center gap-4">
          {p.img ? (
            <img src={p.img} alt={p.name} className="w-10 h-10 rounded-full object-cover border border-[#E0D8C3]" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#E0D8C3] border border-[#E0D8C3] flex items-center justify-center text-gray-600">
              <User size={18} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-end mb-1">
              <h4 className="text-xs font-semibold text-gray-800 truncate pr-2">{p.name}</h4>
              <span className="text-[8px] font-bold uppercase tracking-widest text-[#7C6A2E] shrink-0">{p.subtitle}</span>
            </div>
            <div className="w-full bg-[#E0D8C3] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#7C6A2E] h-full rounded-full transition-all duration-700" style={{ width: `${p.score}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

export default ProviderPerformance;

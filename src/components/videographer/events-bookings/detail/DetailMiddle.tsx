import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { getApiImageUrl } from '@/lib/vendorUtils';

interface DetailMiddleProps {
  clientName: string;
  clientSubtitle: string;
  phone: string;
  email: string;
  clientAvatar?: string;
  coverImage: string;
  coverCaption: string;
}

const DetailMiddle = ({ clientName, clientSubtitle, phone, email, clientAvatar, coverImage, coverCaption }: DetailMiddleProps) => {
  const avatarUrl = clientAvatar
    ? getApiImageUrl(clientAvatar)
    : "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&h=120";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm">
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-6 pb-2 border-b">Client Profile</h3>
        <div className="flex items-center space-x-4 mb-6">
          <img src={avatarUrl} alt={clientName} className="w-16 h-16 rounded-full object-cover border border-[#E0D8C3]" />
          <div>
            <h4 className="text-lg font-serif font-bold">{clientName}</h4>
            <p className="text-xs text-[#A6955C] font-semibold">{clientSubtitle}</p>
          </div>
        </div>
        <div className="space-y-3.5 text-xs text-gray-600">
          <div className="flex items-center space-x-3">
            <Phone size={14} className="text-[#A6955C] shrink-0" />
            <span className="font-semibold">{phone}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Mail size={14} className="text-[#A6955C] shrink-0" />
            <span className="font-semibold truncate">{email}</span>
          </div>
        </div>
      </div>
      <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm lg:col-span-2">
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-6 pb-2 border-b">Event Scene</h3>
        <div className="relative overflow-hidden w-full h-64 lg:h-80">
          <img src={coverImage} alt="Event" className="w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5">
            <p className="text-white text-sm font-serif italic text-center">{coverCaption}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailMiddle;

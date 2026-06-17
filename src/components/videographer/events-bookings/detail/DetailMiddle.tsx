import React from 'react';
import { Phone, Mail } from 'lucide-react';

interface DetailMiddleProps {
  clientName: string;
  clientSubtitle: string;
  phone: string;
  email: string;
  coverImage: string;
  coverCaption: string;
}

const DetailMiddle = ({
  clientName,
  clientSubtitle,
  phone,
  email,
  coverImage,
  coverCaption,
}: DetailMiddleProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Client Profile (1/3 width on desktop) */}
      <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-serif font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
            Client Profile
          </h3>

          <div className="flex items-center space-x-4 mb-6">
            <img
              src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&h=120"
              alt={clientName}
              className="w-16 h-16 rounded-full object-cover border border-[#E0D8C3]"
            />
            <div>
              <h4 className="text-lg font-serif font-bold text-gray-900 leading-tight">{clientName}</h4>
              <p className="text-xs text-[#A6955C] font-semibold mt-0.5">{clientSubtitle}</p>
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
      </div>

      {/* Event Cover Shot (2/3 width on desktop) */}
      <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm lg:col-span-2">
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
          Event Scene Preview
        </h3>

        <div className="relative overflow-hidden w-full h-64 sm:h-72 lg:h-80 group">
          <img
            src={coverImage}
            alt="Event Scene"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Cinematic letterbox overlay */}
          <div className="absolute inset-x-0 top-0 h-6 bg-black" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5">
            <div className="absolute inset-x-0 bottom-0 h-6 bg-black" />
            <p className="text-white text-xs sm:text-sm font-serif italic text-center tracking-wide pb-7">
              {coverCaption}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailMiddle;

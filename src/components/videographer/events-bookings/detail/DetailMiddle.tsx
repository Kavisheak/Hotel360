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
            {/* Phone → WhatsApp */}
            <a
              href={`https://wa.me/${phone.replace(/[^\d]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 hover:text-[#25D366] transition-colors group"
              title="Message on WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366] shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="font-semibold group-hover:underline">{phone}</span>
            </a>
            {/* Email → mailto */}
            <a
              href={`mailto:${email}`}
              className="flex items-center space-x-3 hover:text-[#A6955C] transition-colors group"
              title="Send Email"
            >
              <Mail size={14} className="text-[#A6955C] shrink-0" />
              <span className="font-semibold truncate group-hover:underline">{email}</span>
            </a>
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

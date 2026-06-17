import { PackageData } from "../data";
import Image from "next/image";
import { Check } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pkg: PackageData | null;
}

export default function PackageDetailsModal({ isOpen, onClose, pkg }: Props) {
  if (!isOpen || !pkg) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C1E14]/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#F0E6D0] rounded-sm w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative border border-[#C9A84C]/30 section-reveal">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white hover:text-[#C9A84C] rounded-sm shadow-sm text-[#2C1E14] transition-colors btn-interactive"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Gallery */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-white">
          {[pkg.image].map((img, i) => (
            <div key={i} className="relative h-64 overflow-hidden group">
              <Image
                src={img}
                alt={`${pkg.name} view ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-[#2C1E14]/10 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 pb-8 border-b border-[#D4C9A8]">
            <div className="flex-1">
              <h2 className={`text-3xl md:text-4xl font-serif text-[#2C1E14] mb-3`}>
                {pkg.name} Package
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed font-light">{pkg.description}</p>
            </div>
            <div className="text-right bg-white border border-[#D4C9A8] p-5 rounded-sm shadow-sm shrink-0">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Starting from</p>
              <p className="text-3xl font-serif text-[#C9A84C]">
                LKR {(pkg.priceValue / 1000000).toFixed(2)}M
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-serif text-[#2C1E14] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#C9A84C]">star</span>
              Package Inclusions
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pkg.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 hover:bg-white/50 p-2 -mx-2 rounded-sm transition-colors">
                  <Check className="w-5 h-5 text-[#C9A84C] shrink-0" />
                  <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-[#D4C9A8] text-center">
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">
              Note: Final price varies based on selected date, guest count, and additional vendor selections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

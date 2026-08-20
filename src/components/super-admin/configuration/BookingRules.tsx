import React from 'react';
import { CalendarClock, Percent } from 'lucide-react';

const BookingRules = ({ data, onChange }: any) => {
    if (!data) return null;

    return (
        <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm flex flex-col justify-between h-full space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 border border-[#E0D8C3] rounded text-[#7C6A2E]">
                    <CalendarClock size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-serif font-bold text-gray-950">Booking &</h2>
                    <h2 className="text-xl font-serif font-bold text-gray-950 -mt-1.5">Payment Rules</h2>
                </div>
            </div>

            <div className="space-y-4 flex-1">
                <div>
                    <label className="block text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-2">Default Deposit Required</label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <Percent className="h-4 w-4" />
                        </div>
                        <input
                            type="number"
                            value={data.defaultDeposit}
                            onChange={(e) => onChange({ ...data, defaultDeposit: Number(e.target.value) })}
                            className="block w-full border border-[#E0D8C3] pl-10 pr-3 py-2 text-sm focus:ring-[#A48F40] focus:border-[#A48F40] bg-[#FAF6EE]/50"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-2">Final Payment Deadline</label>
                    <input
                        type="text"
                        value="Strictly on Event Day"
                        readOnly
                        className="block w-full border border-[#E0D8C3] px-3 py-2 text-sm text-gray-500 bg-[#E0D8C3]/20 italic cursor-not-allowed"
                    />
                </div>
            </div>

            <div className="pt-4 border-t border-[#E0D8C3] flex gap-3">
                <button className="flex-1 bg-white border border-[#E0D8C3] py-2 text-[10px] font-bold tracking-widest text-[#7C6A2E] hover:bg-[#FAF6EE]">RESET DEFAULTS</button>
                <button className="flex-1 bg-[#A48F40] text-white py-2 text-[10px] font-bold tracking-widest hover:bg-[#8D7B37]">UPDATE RULES</button>
            </div>
        </div>
    );
};

export default BookingRules;

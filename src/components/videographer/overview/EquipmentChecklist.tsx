"use client";

import React, { useState, useEffect } from 'react';
import { Camera, CheckSquare, Square } from 'lucide-react';
import { useRouter } from 'next/navigation';

const EquipmentChecklist = () => {
  const router = useRouter();
  const [checklist, setChecklist] = useState([
    { id: '1', text: "Camera Battery Verification", completed: false },
    { id: '2', text: "Lens & Sensor Cleaning", completed: false },
    { id: '3', text: "Audio Recorder Sync Test", completed: false },
    { id: '4', text: "Memory Card Formatting", completed: false },
    { id: '5', text: "Drone Flight Authorization", completed: false },
  ]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('videographer-equipment-checklist');
    if (saved) {
      try {
        setChecklist(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load checklist", e);
      }
    }
  }, []);

  const toggleItem = (id: string) => {
    const updated = checklist.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updated);
    localStorage.setItem('videographer-equipment-checklist', JSON.stringify(updated));
  };

  if (!isClient) return null; // Avoid hydration mismatch

  return (
    <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-6 shadow-sm">
      <div className="space-y-4 mb-8">
        {checklist.map(item => (
          <div key={item.id} className="flex items-center space-x-3 cursor-pointer group" onClick={() => toggleItem(item.id)}>
            {item.completed ? (
              <CheckSquare size={18} className="text-[#7C6A2E] shrink-0" />
            ) : (
              <Square size={18} className="text-gray-300 shrink-0 group-hover:text-gray-400 transition-colors" />
            )}
            <span className={`text-sm select-none ${item.completed ? 'text-[#A6955C] line-through decoration-[#A6955C]' : 'text-gray-700 font-medium group-hover:text-[#7C6A2E] transition-colors'}`}>
              {item.text}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-[#E0D8C3]">
        <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-800 uppercase mb-4">DELIVERABLES</h4>
        <div
          onClick={() => router.push('/videographer/events-bookings')}
          className="border-2 border-dashed border-[#E0D8C3] bg-white p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#FAF6EE] hover:border-[#B08D2C] transition-colors group"
        >
          <Camera size={24} className="text-[#7C6A2E] mb-3 group-hover:scale-110 transition-transform" />
          <p className="text-xs text-gray-500 font-medium">
            Jump to Bookings to upload files<br />
            and mark coverage as complete.<br />
          </p>
        </div>
      </div>

      <button
        onClick={() => router.push('/videographer/events-bookings')}
        className="w-full bg-[#7C6A2E] hover:bg-[#5E4F20] text-white py-4 mt-6 font-semibold text-[10px] uppercase tracking-[0.2em] transition-colors shadow-md"
      >
        MANAGE BOOKINGS
      </button>
    </div>
  );
};

export default EquipmentChecklist;

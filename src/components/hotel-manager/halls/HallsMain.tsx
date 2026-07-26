"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Edit3,
  Eye,
  ImagePlus,
  PauseCircle,
  Sparkles,
  Trash2,
  Upload,
  X,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}


interface VenueState {
  id: string;
  name: string;
  code: string;
  description: string;
  amenities: string[];
  galleryImages: GalleryImage[];
  virtualTourUrl: string;
  blockedDates: string[];
  paused: boolean;
}

const initialVenue: VenueState = {
  id: 'venue-1',
  name: 'Grand Royal Ballroom',
  code: 'GRB-01',
  description: 'Our flagship air-conditioned grand hall featuring crystal chandeliers, premium acoustics, and a polished banquet experience for weddings and formal events.',
  amenities: ['Central AC', 'Stage & Sound', 'VIP Lounge', 'Bridal Suite', '300 Cars Parking'],
  galleryImages: [
    { id: 'img-1', src: '/virtual_tour_bg.png', alt: 'Main hall view' },
    { id: 'img-2', src: '/gold_package.png', alt: 'Dining setup' },
    { id: 'img-3', src: '/silver_package.png', alt: 'Stage arrangement' },
  ],
  virtualTourUrl: '/customer/virtual-tour',
  blockedDates: ['2026-08-15', '2026-11-14', '2026-12-25'],
  paused: false,
};

const sectionLabels = [
  { key: 'details', label: 'Edit venue details' },
  { key: 'gallery', label: 'Manage photo gallery' },
  { key: 'tour', label: 'Virtual tour media' },
  { key: 'dates', label: 'Blocked dates' },
  { key: 'booking', label: 'Pause bookings' },
] as const;

export default function HallsMain() {
  const [venue, setVenue] = useState<VenueState>(initialVenue);
  const [activeSection, setActiveSection] = useState<(typeof sectionLabels)[number]['key']>('details');
  const [newDate, setNewDate] = useState('');

  const updateVenue = (updates: Partial<VenueState>) => {
    setVenue((prev) => ({ ...prev, ...updates }));
  };

  const handleAmenitiesChange = (value: string) => {
    updateVenue({ amenities: value.split(',').map((item) => item.trim()).filter(Boolean) });
  };

  const moveGalleryImage = (index: number, direction: -1 | 1) => {
    const nextImages = [...venue.galleryImages];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= nextImages.length) return;
    const [moved] = nextImages.splice(index, 1);
    nextImages.splice(targetIndex, 0, moved);
    updateVenue({ galleryImages: nextImages });
  };

  const removeGalleryImage = (index: number) => {
    const nextImages = venue.galleryImages.filter((_, itemIndex) => itemIndex !== index);
    updateVenue({ galleryImages: nextImages });
  };

  const addGalleryImage = () => {
    const sampleImages = ['/diamond_package.png', '/gold_package.png', '/silver_package.png'];
    const nextImage = sampleImages[venue.galleryImages.length % sampleImages.length];
    updateVenue({
      galleryImages: [
        ...venue.galleryImages,
        { id: `img-${Date.now()}`, src: nextImage, alt: 'Additional venue image' },
      ],
    });
  };

  const addBlockedDate = () => {
    if (!newDate) return;
    if (!venue.blockedDates.includes(newDate)) {
      updateVenue({ blockedDates: [...venue.blockedDates, newDate] });
    }
    setNewDate('');
  };

  const removeBlockedDate = (value: string) => {
    updateVenue({ blockedDates: venue.blockedDates.filter((date) => date !== value) });
  };


  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-[#1E56A0]" />
              <h1 className="text-2xl font-bold text-gray-900">Venue Management</h1>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Manage one venue profile with details, gallery, tour media, pricing, layouts, availability, and booking controls.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#F4F8FC] px-3 py-2 text-sm font-semibold text-[#1E56A0]">
            <Sparkles className="h-4 w-4" />
            Single hall workflow
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Venue</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{venue.name}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Bookings</p>
            <p className={`mt-1 text-lg font-bold ${venue.paused ? 'text-amber-700' : 'text-emerald-700'}`}>
              {venue.paused ? 'Paused' : 'Open'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Management areas</h2>
          <div className="mt-4 space-y-2">
            {sectionLabels.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  activeSection === section.key
                    ? 'bg-[#1E56A0] text-white shadow-sm'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{section.label}</span>
                <Edit3 className="h-4 w-4" />
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
          {activeSection === 'details' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Edit venue details</h2>
                <p className="mt-1 text-sm text-gray-500">Update the single hall profile without creating extra halls.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Venue name</label>
                  <input
                    value={venue.name}
                    onChange={(e) => updateVenue({ name: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1E56A0] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Venue code</label>
                  <input
                    value={venue.code}
                    onChange={(e) => updateVenue({ code: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1E56A0] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  value={venue.description}
                  onChange={(e) => updateVenue({ description: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1E56A0] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Amenities</label>
                <textarea
                  value={venue.amenities.join(', ')}
                  onChange={(e) => handleAmenitiesChange(e.target.value)}
                  rows={3}
                  placeholder="Central AC, Stage & Sound, Bridal Suite"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1E56A0] focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeSection === 'gallery' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Manage photo gallery</h2>
                  <p className="mt-1 text-sm text-gray-500">Upload, reorder, and remove images for the single venue profile.</p>
                </div>
                <button
                  onClick={addGalleryImage}
                  className="flex items-center gap-2 rounded-lg bg-[#1E56A0] px-3 py-2 text-sm font-semibold text-white"
                >
                  <ImagePlus className="h-4 w-4" /> Add image
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {venue.galleryImages.map((image, index) => (
                  <div key={image.id} className="rounded-xl border border-gray-200 p-3">
                    <Image src={image.src} alt={image.alt} width={600} height={240} className="h-36 w-full rounded-lg object-cover" />
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-800">Image {index + 1}</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveGalleryImage(index, -1)}
                          className="rounded-md border border-gray-200 p-1.5 text-gray-600 hover:bg-gray-100"
                          aria-label="Move image up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveGalleryImage(index, 1)}
                          className="rounded-md border border-gray-200 p-1.5 text-gray-600 hover:bg-gray-100"
                          aria-label="Move image down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeGalleryImage(index)}
                          className="rounded-md border border-red-200 p-1.5 text-red-600 hover:bg-red-50"
                          aria-label="Delete image"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'tour' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Upload virtual tour media</h2>
                <p className="mt-1 text-sm text-gray-500">The venue uses one shared tour entry rather than a per-hall selector.</p>
              </div>

              <div className="rounded-2xl border border-dashed border-[#1E56A0] bg-[#F4F8FC] p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#1E56A0] p-2 text-white">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Virtual tour media</p>
                    <p className="text-sm text-gray-500">Upload a single 360° tour or link the hosted tour asset here.</p>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Tour link or media URL</label>
                  <input
                    value={venue.virtualTourUrl}
                    onChange={(e) => updateVenue({ virtualTourUrl: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#1E56A0] focus:outline-none"
                    placeholder="https://.../virtual-tour"
                  />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <a
                    href={venue.virtualTourUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#1E56A0] px-3 py-2 text-sm font-semibold text-white"
                  >
                    <Eye className="h-4 w-4" /> Preview tour
                  </a>
                  <span className="text-sm text-gray-500">Single tour entry for this venue</span>
                </div>
              </div>
            </div>
          )}


          {activeSection === 'dates' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Block unavailable dates</h2>
                <p className="mt-1 text-sm text-gray-500">Use this section for maintenance, private-use blocks, and holiday closures.</p>
              </div>

              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1E56A0] focus:outline-none"
                />
                <button
                  onClick={addBlockedDate}
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#1E56A0] px-3 py-2 text-sm font-semibold text-white"
                >
                  <CalendarDays className="h-4 w-4" /> Add block out date
                </button>
              </div>

              <div className="space-y-2">
                {venue.blockedDates.map((date) => (
                  <div key={date} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700">
                    <span>{date}</span>
                    <button onClick={() => removeBlockedDate(date)} className="text-red-600 hover:text-red-700">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'booking' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Pause bookings</h2>
                <p className="mt-1 text-sm text-gray-500">This replaces archive or deactivate for a single venue and temporarily stops new bookings.</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">Temporarily stop accepting new bookings</p>
                    <p className="mt-1 text-sm text-gray-500">Use this for renovation, maintenance, or private-use periods.</p>
                  </div>
                  <button
                    onClick={() => updateVenue({ paused: !venue.paused })}
                    className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${
                      venue.paused ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {venue.paused ? <PauseCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                    {venue.paused ? 'Paused' : 'Active'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

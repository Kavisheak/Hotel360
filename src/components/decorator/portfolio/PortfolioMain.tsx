"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plus, Filter, Image as ImageIcon, Sparkles, Folder, Check, Eye, EyeOff } from 'lucide-react';
import { decoratorAPI } from '@/lib/api';
import AddPortfolioModal from '@/components/shared/AddPortfolioModal';
import DeleteConfirmationModal from '@/components/shared/DeleteConfirmationModal';
import AlbumEditor from './AlbumEditor';
import Footer from '../my_jobs/Footer';

const PortfolioMain: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [albums, setAlbums] = useState<any[]>([]);
  const [activeStatus, setActiveStatus] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  // New Album Modal State
  const [isNewAlbumModalOpen, setIsNewAlbumModalOpen] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, [activeStatus]);

  // Deep-link handler from My Jobs ("Add photos from this job ->")
  useEffect(() => {
    const linkedBookingId = searchParams.get("linkedBookingId");
    const suggestedTitle = searchParams.get("suggestedTitle");

    if (linkedBookingId) {
      handleDeepLinkCreation(linkedBookingId, suggestedTitle || "Completed Job Album");
    }
  }, [searchParams]);

  const fetchAlbums = async () => {
    setIsLoading(true);
    try {
      const res = await decoratorAPI.getAlbums(activeStatus);
      if (res.ok && res.data?.data) {
        setAlbums(res.data.data);
      } else {
        setAlbums([]);
      }
    } catch (e) {
      console.error("Failed to fetch albums:", e);
      setAlbums([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeepLinkCreation = async (linkedBookingId: string, title: string) => {
    try {
      const res = await decoratorAPI.getAlbums("All");
      if (res.ok && res.data?.data) {
        const existing = res.data.data.find((a: any) => a.linkedBooking?.id === linkedBookingId || a.linkedBooking?._id === linkedBookingId);
        if (existing) {
          setSelectedAlbumId(existing._id);
          return;
        }
      }

      // Create pre-filled draft album for linked booking
      const createRes = await decoratorAPI.createAlbum({ title, linkedBookingId });
      if (createRes.ok && createRes.data?.data) {
        setSelectedAlbumId(createRes.data.data._id);
        fetchAlbums();
      }
    } catch (e) {
      console.error("Deep link album creation failed:", e);
    }
  };

  const handleCreateNewAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumTitle.trim()) return;

    setIsCreatingAlbum(true);
    try {
      const res = await decoratorAPI.createAlbum({ title: newAlbumTitle.trim() });
      if (res.ok && res.data?.data) {
        setNewAlbumTitle("");
        setIsNewAlbumModalOpen(false);
        fetchAlbums();
        setSelectedAlbumId(res.data.data._id);
      } else {
        alert(res.data?.message || "Failed to create album.");
      }
    } catch (e: any) {
      alert(e.message || "Server error while creating album.");
    } finally {
      setIsCreatingAlbum(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!albumToDelete) return;
    setIsDeleting(true);
    try {
      await decoratorAPI.deleteAlbum(albumToDelete);
      fetchAlbums();
      setAlbumToDelete(null);
    } catch (e) {
      console.error("Failed to delete album:", e);
    } finally {
      setIsDeleting(false);
    }
  };

  if (selectedAlbumId) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
        <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
          <AlbumEditor
            albumId={selectedAlbumId}
            onBack={() => setSelectedAlbumId(null)}
            onAlbumUpdated={fetchAlbums}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1] font-sans">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">

        {/* Header */}
        <div className="mb-8 mt-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-serif italic text-[#A6955C]">Decorator Showcase</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 font-bold tracking-tight leading-none mt-1">
              Portfolio Albums
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mt-2 max-w-2xl">
              Organize your studio’s decoration work into albums. Upload photos, tag styles, and publish albums to showcase on your public vendor profile.
            </p>
          </div>

          <button
            onClick={() => setIsNewAlbumModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#7C6A2E] hover:bg-[#685724] text-white text-xs font-bold uppercase tracking-wider rounded shadow-xs transition-colors self-start md:self-auto"
          >
            <Plus size={16} /> New Album
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#E0D8C3] pb-3 overflow-x-auto">
          {["All", "Published", "Draft"].map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatus(st)}
              className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                activeStatus === st
                  ? "bg-[#7C6A2E] text-white shadow-xs"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-[#E0D8C3]"
              }`}
            >
              {st === "Draft" ? "Drafts" : st}
            </button>
          ))}
        </div>

        {/* Album Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-sm font-serif italic text-gray-400 bg-white border border-[#E0D8C3] rounded-lg">
            Loading portfolio albums...
          </div>
        ) : albums.length === 0 ? (
          <div className="py-20 text-center bg-white border border-[#E0D8C3] rounded-lg shadow-xs flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#FEF9E8] border border-[#D4B553] flex items-center justify-center text-[#7C6A2E] mb-4">
              <Folder size={32} />
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-800 mb-1">
              No Albums Found ({activeStatus})
            </h3>
            <p className="text-xs text-gray-500 max-w-md leading-relaxed mb-6">
              You haven't created any {activeStatus !== 'All' ? activeStatus.toLowerCase() : ''} albums yet. Click below to create an album for your studio.
            </p>
            <button
              onClick={() => setIsNewAlbumModalOpen(true)}
              className="px-5 py-2.5 bg-[#7C6A2E] hover:bg-[#685724] text-white text-xs font-bold uppercase tracking-wider rounded shadow-xs"
            >
              Create First Album
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums
              .map((alb) => (
              <div
                key={alb._id}
                onClick={() => setSelectedAlbumId(alb._id)}
                className="relative bg-white border border-[#E0D8C3] rounded-lg overflow-hidden shadow-xs hover:shadow-md hover:border-[#B08D2C] transition-all duration-300 cursor-pointer flex flex-col justify-between group"
              >
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setAlbumToDelete(alb._id);
                  }}
                  className="absolute top-3 right-3 z-20 bg-white/90 text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                  title="Delete Album"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>

                <div>
                  {/* Cover Photo */}
                  <div className="relative aspect-16/10 bg-[#FAF6EE] overflow-hidden pointer-events-none">
                    {alb.coverUrl ? (
                      <img
                        src={alb.coverUrl}
                        alt={alb.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                        <ImageIcon size={40} />
                        <span className="text-[10px] uppercase tracking-widest mt-1">No Cover Photo</span>
                      </div>
                    )}

                    {/* Status Badge */}
                    <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow-xs ${
                      alb.status === 'Published'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}>
                      {alb.status}
                    </span>

                    {alb.linkedBooking ? (
                      <span className="absolute bottom-3 left-3 bg-black/70 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur-xs">
                        Linked Job #{alb.linkedBooking.bookingRef || 'Completed'}
                      </span>
                    ) : null}
                  </div>

                  {/* Album Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif font-bold text-gray-900 text-lg group-hover:text-[#7C6A2E] transition-colors truncate">
                        {alb.title}
                      </h3>
                      {alb.price > 0 && (
                        <span className="text-xs font-bold text-[#7C6A2E] shrink-0 ml-2">
                          LKR {alb.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {alb.photoCount} Photo(s) &bull; Created {new Date(alb.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-3 bg-[#FAF6EE] border-t border-[#E0D8C3] text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C6A2E] group-hover:underline">
                    Edit Album & Photos &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Premium Add Portfolio Modal */}
      <AddPortfolioModal
        isOpen={isNewAlbumModalOpen}
        onClose={() => setIsNewAlbumModalOpen(false)}
        vendorType="decorator"
        onSubmitSuccess={() => fetchAlbums()}
      />

      <DeleteConfirmationModal
        isOpen={!!albumToDelete}
        onClose={() => setAlbumToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        title="Delete Album"
        message="Are you sure you want to delete this album? All photos inside this album will be permanently removed. This action cannot be undone."
      />

      <Footer />
    </div>
  );
};

export default PortfolioMain;

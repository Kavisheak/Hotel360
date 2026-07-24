"use client";

import React, { useState, useEffect } from 'react';
import { Video, Upload, CheckCircle2, Clock, AlertCircle, Link, FileVideo, ExternalLink, ShieldCheck } from 'lucide-react';
import { videographerAPI } from '@/lib/api';

const DeliverablesMain: React.FC = () => {
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDeliverables();
  }, []);

  const fetchDeliverables = async () => {
    setIsLoading(true);
    try {
      const res = await videographerAPI.getDeliverables();
      if (res.ok && res.data?.data) {
        setDeliverables(res.data.data);
      } else {
        setDeliverables([]);
      }
    } catch (e) {
      console.error("Failed to fetch videographer deliverables:", e);
      setDeliverables([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (!videoUrlInput.trim() && !selectedFile) {
      alert("Please provide a video URL link or select a video file to upload.");
      return;
    }

    setIsSubmitting(true);
    try {
      let body: any = { videoUrl: videoUrlInput.trim() };
      if (selectedFile) {
        const formData = new FormData();
        formData.append("videoFile", selectedFile);
        if (videoUrlInput.trim()) formData.append("videoUrl", videoUrlInput.trim());
        body = formData;
      }

      const res = await videographerAPI.submitDeliverable(selectedJob.bookingId, body);
      if (res.ok) {
        alert("Video deliverable submitted successfully! Customer has been notified.");
        setSelectedJob(null);
        setVideoUrlInput("");
        setSelectedFile(null);
        fetchDeliverables();
      } else {
        alert(res.data?.message || "Failed to submit deliverable.");
      }
    } catch (err: any) {
      alert(err.message || "Server error while submitting deliverable.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingCount = deliverables.filter((d) => d.deliverableStatus === "Pending").length;
  const deliveredCount = deliverables.filter((d) => d.deliverableStatus === "Delivered").length;
  const acknowledgedCount = deliverables.filter((d) => d.deliverableStatus === "Acknowledged").length;

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1] font-sans">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">

        {/* Header */}
        <div className="mb-8 mt-4">
          <span className="text-xs font-serif italic text-[#A6955C]">Post-Event Obligation & Balance Payout Gate</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 font-bold tracking-tight leading-none mt-1">
            Video Deliverables
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mt-2 max-w-2xl">
            Upload final edited cinematic films for completed jobs. Submitting deliverables triggers customer acknowledgment and releases your remaining escrow balance payout.
          </p>
        </div>

        {/* Deliverables Summary Bar */}
        <div className="mb-6 p-4 bg-white border border-[#E0D8C3] rounded-lg shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">Awaiting Delivery</span>
              <strong className="text-base font-serif text-amber-600">{pendingCount} Job(s)</strong>
            </div>
            <div className="h-8 w-px bg-[#E0D8C3]"></div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">Delivered (Pending Ack)</span>
              <strong className="text-base font-serif text-blue-600">{deliveredCount} Job(s)</strong>
            </div>
            <div className="h-8 w-px bg-[#E0D8C3]"></div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">Acknowledged & Released</span>
              <strong className="text-base font-serif text-emerald-600">{acknowledgedCount} Job(s)</strong>
            </div>
          </div>

          <div className="text-xs text-gray-500 flex items-center gap-1.5 bg-[#FAF6EE] px-3 py-1.5 rounded border border-[#E0D8C3]">
            <ShieldCheck size={14} className="text-[#A6955C]" />
            <span>Escrow balance holds until video is delivered & acknowledged (or 7-day grace period).</span>
          </div>
        </div>

        {/* Deliverables List */}
        {isLoading ? (
          <div className="py-20 text-center text-sm font-serif italic text-gray-400 bg-white border border-[#E0D8C3] rounded-lg">
            Loading video deliverables queue...
          </div>
        ) : deliverables.length === 0 ? (
          <div className="py-16 text-center bg-white border border-[#E0D8C3] rounded-lg flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[#FEF9E8] border border-[#D4B553] flex items-center justify-center text-[#7C6A2E] mb-3">
              <Video size={28} />
            </div>
            <h3 className="text-lg font-serif font-bold text-gray-800">No Completed Videography Jobs Yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mt-1">
              When an event passes and is marked Completed, it will appear here for final video upload.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {deliverables.map((item) => (
              <div
                key={item.bookingId}
                className="bg-white border border-[#E0D8C3] rounded-lg p-5 shadow-xs hover:border-[#B08D2C] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900 font-serif">
                      {item.eventType} &bull; {item.clientName}
                    </span>
                    <span className="text-[10px] font-bold text-[#7C6A2E] bg-[#FEF9E8] px-2 py-0.5 rounded border border-[#D4B553]">
                      Ref #{item.bookingRef}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      item.deliverableStatus === 'Acknowledged'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : item.deliverableStatus === 'Delivered'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {item.deliverableStatus}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">
                    Event Date: {new Date(item.eventDate).toLocaleDateString()} &bull; Client Email: {item.email}
                  </p>

                  {item.requirements?.deliverableStyle && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 bg-[#FAF6EE] px-2 py-0.5 rounded border border-[#E0D8C3]">
                        Style: {item.requirements.deliverableStyle}
                      </span>
                      {item.requirements.coverageHours && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 bg-[#FAF6EE] px-2 py-0.5 rounded border border-[#E0D8C3]">
                          Coverage: {item.requirements.coverageHours} Hrs
                        </span>
                      )}
                      {(item.requirements.addOns || []).map((addon: string) => (
                        <span key={addon} className="text-[9px] font-bold uppercase tracking-wider text-[#7C6A2E] bg-[#FEF9E8] px-2 py-0.5 rounded border border-[#D4B553]">
                          + {addon}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.deliverableUrl && (
                    <div className="pt-2 flex items-center gap-2 text-xs">
                      <ExternalLink size={14} className="text-[#7C6A2E]" />
                      <a
                        href={item.deliverableUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#7C6A2E] hover:underline font-bold text-xs truncate max-w-md"
                      >
                        {item.deliverableUrl}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {item.deliverableStatus === "Pending" ? (
                    <button
                      onClick={() => {
                        setSelectedJob(item);
                        setVideoUrlInput("");
                        setSelectedFile(null);
                      }}
                      className="px-4 py-2 bg-[#7C6A2E] hover:bg-[#685724] text-white text-xs font-bold uppercase tracking-wider rounded shadow-xs flex items-center gap-1.5"
                    >
                      <Upload size={14} /> Submit Video Deliverable
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedJob(item);
                        setVideoUrlInput(item.deliverableUrl || "");
                      }}
                      className="px-3 py-1.5 border border-[#E0D8C3] bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 rounded transition-colors flex items-center gap-1.5"
                    >
                      <FileVideo size={14} /> Update Video Link
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Deliverable Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl rounded-xl max-w-md w-full p-6 text-left">
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">
              Submit Video Deliverable
            </h3>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Job: <strong className="text-gray-800">{selectedJob.eventType}</strong> ({selectedJob.clientName}) &bull; Ref #{selectedJob.bookingRef}
            </p>

            <form onSubmit={handleSubmitDeliverable} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Cloudinary / YouTube / Vimeo Video URL Link
                </label>
                <div className="relative">
                  <Link size={14} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="url"
                    value={videoUrlInput}
                    onChange={(e) => setVideoUrlInput(e.target.value)}
                    placeholder="https://vimeo.com/... or https://youtube.com/..."
                    className="w-full pl-9 border border-[#E0D8C3] bg-white p-2.5 rounded text-xs text-gray-800 focus:border-[#7C6A2E] outline-none"
                  />
                </div>
              </div>

              <div className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider my-1">
                &mdash; OR UPLOAD FILE &mdash;
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Upload MP4 / MOV Video File Buffer
                </label>
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-gray-700 bg-white border border-[#E0D8C3] p-2 rounded"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-[#E0D8C3] mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 border border-[#E0D8C3] text-gray-600 hover:bg-gray-50 font-bold text-xs uppercase tracking-wider rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#7C6A2E] hover:bg-[#685724] text-white font-bold text-xs uppercase tracking-wider rounded shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? "Submitting..." : "Submit Deliverable"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliverablesMain;

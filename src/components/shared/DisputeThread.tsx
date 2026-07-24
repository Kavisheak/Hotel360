"use client";

import React, { useEffect, useState } from "react";
import { MessageSquare, Send, X, ShieldAlert, CheckCircle2, Loader2, Paperclip } from "lucide-react";
import { disputeAPI } from "@/lib/api";

interface DisputeThreadProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  bookingRef?: string;
  itemType: string;
  userRole: "customer" | "vendor" | "hotel_manager";
  onResolveDispute?: (action: "approve" | "deny", details: any) => void;
}

export default function DisputeThread({
  isOpen,
  onClose,
  bookingId,
  bookingRef = "",
  itemType,
  userRole,
  onResolveDispute,
}: DisputeThreadProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fetchMessages = async () => {
    if (!bookingId || !itemType) return;
    try {
      setIsLoading(true);
      const { ok, data } = await disputeAPI.getMessages(bookingId, itemType);
      if (ok && data?.data) {
        setMessages(data.data);
      }
    } catch (e) {
      console.error("Failed to fetch dispute messages:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen, bookingId, itemType]);

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setIsSending(true);
      const { ok, data } = await disputeAPI.sendMessage(bookingId, itemType, {
        message: newMessage,
        attachments: attachmentUrl.trim() ? [attachmentUrl.trim()] : [],
      });
      if (ok && data?.data) {
        setNewMessage("");
        setAttachmentUrl("");
        setMessages((prev) => [...prev, data.data]);
      }
    } catch (err) {
      console.error("Failed to send dispute message:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs text-left font-sans">
      <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-gray-900 dark:text-white text-base">
                Dispute Thread: <span className="capitalize text-[#C9A84C]">{itemType}</span>
              </h3>
              <p className="text-xs text-gray-500">
                Booking Ref: <strong className="text-gray-700 dark:text-gray-300">{bookingRef || bookingId.slice(-6)}</strong> • Scoped to Customer, Vendor & Manager
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/30 dark:bg-black/20 custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C]" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-gray-400 italic text-xs">
              No messages posted yet in this dispute thread.
            </div>
          ) : (
            messages.map((msg) => {
              const isManager = msg.senderRole === "hotel_manager";
              const isVendor = msg.senderRole === "vendor";
              return (
                <div
                  key={msg._id}
                  className={`flex flex-col ${
                    msg.senderRole === userRole ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    <span>{msg.senderName}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[8px] ${
                        isManager
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                          : isVendor
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      }`}
                    >
                      {msg.senderRole}
                    </span>
                    <span>• {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div
                    className={`max-w-[80%] p-3.5 rounded-xl text-xs leading-relaxed ${
                      msg.senderRole === userRole
                        ? "bg-[#1E56A0] text-white rounded-tr-none"
                        : "bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-xs"
                    }`}
                  >
                    <p>{msg.message}</p>
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/20 dark:border-zinc-700">
                        {msg.attachments.map((att: string, idx: number) => (
                          <a
                            key={idx}
                            href={att}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] underline hover:opacity-80"
                          >
                            <Paperclip className="w-3 h-3" /> Attachment Link
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Action Bar (Manager Resolve Option) */}
        {userRole === "hotel_manager" && onResolveDispute && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border-t border-amber-200/60 dark:border-amber-900/40 flex justify-between items-center px-6">
            <span className="text-xs text-amber-800 dark:text-amber-300 font-semibold">Manager Control Panel:</span>
            <div className="flex gap-2">
              <button
                onClick={() => onResolveDispute("approve", { bookingId, itemType })}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wider rounded transition-colors"
              >
                Approve Refund
              </button>
              <button
                onClick={() => onResolveDispute("deny", { bookingId, itemType })}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] uppercase tracking-wider rounded transition-colors"
              >
                Deny Refund
              </button>
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-[#121212] space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message to all parties..."
              className="flex-1 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-gray-800 dark:text-gray-100 outline-none focus:border-[#C9A84C]"
            />
            <button
              type="submit"
              disabled={isSending || !newMessage.trim()}
              className="p-2.5 bg-[#1E56A0] hover:bg-[#16417A] text-white rounded-xl disabled:opacity-50 transition-colors"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <input
            type="text"
            value={attachmentUrl}
            onChange={(e) => setAttachmentUrl(e.target.value)}
            placeholder="Optional attachment URL / photo proof link..."
            className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-[10px] text-gray-600 dark:text-gray-400 outline-none"
          />
        </form>
      </div>
    </div>
  );
}

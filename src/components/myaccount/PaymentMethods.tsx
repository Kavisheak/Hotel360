"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Plus, Trash2, Star, ShieldCheck, Loader2, DollarSign, Calendar, FileText, Download } from "lucide-react";
import { accountAPI, customerBookingAPI } from "@/lib/api";
import { startPayHerePayment } from "@/utils/payhere";
import EscrowTracker from "./EscrowTracker";
import BookingCreditsList from "./BookingCreditsList";
import RefundRequestModal from "./RefundRequestModal";

export default function PaymentMethods() {
  const [methods, setMethods] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Booking & Transaction State
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isPayingBalance, setIsPayingBalance] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const fetchMethods = async () => {
    setIsLoading(true);
    const { ok, data } = await accountAPI.getPaymentMethods();
    if (ok && data.savedCards) {
      setMethods(data.savedCards);
    }
    setIsLoading(false);
  };

  const fetchBookings = async () => {
    const { ok, data } = await customerBookingAPI.getMyBookings();
    if (ok && data?.data) {
      setBookings(data.data);
      if (data.data.length > 0 && !selectedBookingId) {
        setSelectedBookingId(data.data[0]._id || data.data[0].id);
      }
    }
  };

  const fetchTransactions = async () => {
    const { ok, data } = await customerBookingAPI.getTransactionHistory();
    if (ok && data?.data) {
      setTransactions(data.data);
    }
  };

  const handleRefreshAll = () => {
    fetchBookings();
    fetchTransactions();
  };

  useEffect(() => {
    fetchMethods();
    fetchBookings();
    fetchTransactions();
  }, []);

  const handleSetPrimary = async (id: string) => {
    setMethods((prev) =>
      prev.map((m) => ({ ...m, isDefault: m._id === id }))
    );
  };

  const handleRemove = async (id: string) => {
    const { ok } = await accountAPI.deletePaymentMethod(id);
    if (ok) {
      fetchMethods();
    }
  };

  const handleAddCard = async () => {
    if (!cardNumber || !cardName || !expiry || !cvv) return;
    setIsSubmitting(true);
    const { ok } = await accountAPI.addPaymentMethod({
      cardName,
      cardNumber,
      expiry,
      isDefault: methods.length === 0
    });
    setIsSubmitting(false);
    if (ok) {
      setShowAddForm(false);
      setCardNumber("");
      setCardName("");
      setExpiry("");
      setCvv("");
      fetchMethods();
    }
  };

  const handlePayBalance = async (bookingId: string) => {
    setIsPayingBalance(true);
    await startPayHerePayment({
      bookingId,
      paymentType: "balance",
      onSuccess: () => {
        setIsPayingBalance(false);
        handleRefreshAll();
      },
      onDismiss: () => setIsPayingBalance(false),
      onError: () => setIsPayingBalance(false),
    });
  };

  const getCardType = (number: string) => {
    if (number.startsWith("4")) return "visa";
    if (number.startsWith("5")) return "mastercard";
    if (number.startsWith("3")) return "amex";
    return "visa";
  };

  const formatCurrency = (val: number) => "LKR " + (val || 0).toLocaleString();

  const selectedBooking = bookings.find((b) => (b._id || b.id) === selectedBookingId);
  const balanceDue = selectedBooking 
    ? (selectedBooking.totalCost - selectedBooking.depositAmount - (selectedBooking.balanceAmount || 0)) 
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* 1. Payment Methods Registry */}
      <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-zinc-800/80 rounded-xl shadow-sm overflow-hidden text-left">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800/80 bg-gray-50/50 dark:bg-[#1A1A1A]/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-[#C9A84C]" />
            </div>
            <div>
              <h4 className="text-sm font-serif text-[#2C1E14] dark:text-white">Saved Payment Methods</h4>
              <p className="text-[10px] text-gray-500 font-light mt-0.5">Manage your credit cards for booking payments.</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 border border-[#C9A84C] text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest rounded hover:bg-[#FAF6EE] dark:hover:bg-[#1C1C1C] transition-all flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Card
          </button>
        </div>

        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-[#C9A84C]" /></div>
          ) : methods.map((card, idx) => {
            const type = getCardType(card.cardNumber.replace(/\D/g, ''));
            return (
              <div
                key={card._id || idx}
                className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
                  card.isDefault 
                    ? "border-[#C9A84C] bg-[#FAF6EE]/20 dark:bg-amber-950/5 shadow-sm" 
                    : "border-gray-100 dark:border-zinc-800 hover:border-gray-250 dark:hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-5 p-4">
                  <div className="w-12 h-8 rounded bg-[#2C1E14] text-white flex items-center justify-center font-bold text-[9px] uppercase tracking-wider shrink-0">
                    {type}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                        •••• •••• •••• {card.cardNumber.slice(-4)}
                      </p>
                      {card.isDefault && (
                        <span className="text-[8px] uppercase tracking-wider font-bold text-[#C9A84C] bg-[#C9A84C]/15 px-2 py-0.5 rounded border border-[#C9A84C]/25">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">{card.cardName} • Exp {card.expiry}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {!card.isDefault && (
                      <button
                        onClick={() => handleSetPrimary(card._id)}
                        className="text-[9px] uppercase tracking-wider font-bold text-gray-500 hover:text-black dark:hover:text-white"
                      >
                        Set Primary
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(card._id)}
                      className="text-[9px] uppercase tracking-wider font-bold text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {!isLoading && methods.length === 0 && (
            <div className="text-center py-6 text-gray-500 text-xs italic">
              No saved payment cards. Register a card to make booking payments.
            </div>
          )}

          {showAddForm && (
            <div className="border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl p-5 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/30">
              <h5 className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C]">Add New Card</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Card Number</label>
                  <input
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    className="w-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black p-2.5 rounded text-xs outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Cardholder Name</label>
                  <input
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                    placeholder="Name on card"
                    className="w-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black p-2.5 rounded text-xs outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Expiry</label>
                    <input
                      value={expiry}
                      onChange={e => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black p-2.5 rounded text-xs outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">CVV</label>
                    <input
                      value={cvv}
                      onChange={e => setCvv(e.target.value)}
                      placeholder="•••"
                      type="password"
                      className="w-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black p-2.5 rounded text-xs outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleAddCard} disabled={isSubmitting} className="px-4 py-2 bg-[#C9A84C] text-[#2C1E14] font-bold text-[10px] uppercase tracking-widest rounded hover:bg-[#B58B5C]">
                  {isSubmitting ? <Loader2 className="w-3 animate-spin" /> : "Save Card"}
                </button>
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-500 hover:bg-gray-100">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Outstanding Balance & Escrow Tracker */}
      <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-zinc-800/80 rounded-xl shadow-sm p-6 text-left space-y-6">
        <div>
          <h3 className="text-lg font-serif text-gray-900 dark:text-white">Active Event Payments</h3>
          <p className="text-xs text-gray-500 mt-1 font-light">Monitor escrow statuses and pay remaining balances.</p>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-6">
            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Select Event Booking</label>
              <select
                value={selectedBookingId}
                onChange={(e) => setSelectedBookingId(e.target.value)}
                className="w-full max-w-md border border-gray-200 dark:border-zinc-850 bg-white dark:bg-black p-2.5 rounded text-xs outline-none focus:border-[#C9A84C]"
              >
                {bookings.map((b) => (
                  <option key={b._id || b.id} value={b._id || b.id}>
                    {b.bookingRef} — {b.eventName || b.eventType} ({new Date(b.date).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>

            {selectedBooking && (
              <div className="border border-gray-100 dark:border-zinc-850 p-5 rounded-xl space-y-6">
                
                {/* Event Summary and Balance Panel */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-50 dark:bg-zinc-900/40 p-4 rounded-lg">
                  <div>
                    <h4 className="font-serif text-sm font-bold text-gray-900 dark:text-white capitalize">
                      {selectedBooking.eventName || selectedBooking.eventType}
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-1">Ref: {selectedBooking.bookingRef} • Status: {selectedBooking.status}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Remaining Balance</span>
                    <span className="text-xl font-bold text-[#C9A84C] font-serif">{formatCurrency(balanceDue)}</span>
                  </div>
                </div>

                {/* Pay Balance Action Button */}
                {balanceDue > 0 && selectedBooking.status === "Confirmed" && (
                  <div className="bg-amber-50/20 border border-amber-200/50 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-left space-y-1">
                      <p className="text-xs text-gray-600 dark:text-amber-300 font-medium">
                        Remaining 70% Balance Due Date: <span className="font-bold text-[#C9A84C]">{new Date(new Date(selectedBooking.date).getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span> (7 Days Before Event)
                      </p>
                      {(() => {
                        const vendorCategories = ["decorator", "dj", "videographer", "photographer", "cake", "florist"];
                        const pendingVendors = selectedBooking.vendors ? vendorCategories.filter(cat => {
                          const v = (selectedBooking.vendors as any)[cat];
                          return v && v.vendorId && v.status === "Pending";
                        }) : [];
                        if (pendingVendors.length > 0) {
                          return (
                            <p className="text-[10px] text-red-500 font-medium">
                              ⚠️ Balance payment activates once venue and all selected vendors ({pendingVendors.join(", ")}) confirm participation.
                            </p>
                          );
                        }
                        return (
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                            ✓ Venue and all selected partners have accepted. You can settle the remaining 70% balance now.
                          </p>
                        );
                      })()}
                    </div>
                    {(() => {
                      const vendorCategories = ["decorator", "dj", "videographer", "photographer", "cake", "florist"];
                      const pendingVendors = selectedBooking.vendors ? vendorCategories.filter(cat => {
                        const v = (selectedBooking.vendors as any)[cat];
                        return v && v.vendorId && v.status === "Pending";
                      }) : [];
                      const canPay = pendingVendors.length === 0;
                      return (
                        <button
                          onClick={() => handlePayBalance(selectedBooking._id || selectedBooking.id)}
                          disabled={isPayingBalance || !canPay}
                          className={`px-5 py-2.5 font-bold text-[10px] uppercase tracking-widest rounded transition-colors shrink-0 flex items-center gap-1.5 ${
                            canPay 
                              ? "bg-[#C9A84C] text-[#2C1E14] hover:bg-[#B58B5C]" 
                              : "bg-gray-200 text-gray-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed border border-gray-300 dark:border-zinc-700"
                          }`}
                        >
                          {isPayingBalance ? <Loader2 className="w-3 animate-spin" /> : <DollarSign className="w-3.5 h-3.5" />}
                          Pay Balance
                        </button>
                      );
                    })()}
                  </div>
                )}

                {/* Mounted Escrow Allocations Tracker */}
                <EscrowTracker bookingId={selectedBooking._id || selectedBooking.id} />

                {/* Cancellation trigger */}
                {!["Completed", "Cancelled", "Rejected"].includes(selectedBooking.status) && (
                  <div className="pt-4 border-t border-gray-150 dark:border-zinc-800 flex justify-end">
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="px-4 py-2 border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 rounded text-[10px] uppercase font-bold tracking-wider"
                    >
                      Cancel Reservation &amp; Request Refund
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">No bookings found to display payment schedules.</p>
        )}
      </div>

      {/* 3. Booking Credits Panel */}
      <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-zinc-800/80 rounded-xl shadow-sm p-6">
        <BookingCreditsList />
      </div>

      {/* 4. Transaction History Log & Invoice downloads */}
      <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-zinc-800/80 rounded-xl shadow-sm p-6 text-left space-y-6">
        <div>
          <h3 className="text-lg font-serif text-gray-900 dark:text-white">Transaction Logs</h3>
          <p className="text-xs text-gray-500 mt-1 font-light">Audit trail of advance payments, refunds, and released escrows.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800/80 text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-2.5">Transaction ID / Reference</th>
                <th className="py-2.5">Action</th>
                <th className="py-2.5">Date</th>
                <th className="py-2.5">Amount</th>
                <th className="py-2.5">Details</th>
                <th className="py-2.5 text-right">Invoices</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/40">
              {transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20">
                  <td className="py-3 font-semibold text-gray-700 dark:text-gray-300">
                    {tx.bookingId?.bookingRef || "N/A"}
                  </td>
                  <td className="py-3 capitalize text-gray-600 dark:text-zinc-400">{tx.action}</td>
                  <td className="py-3 text-gray-500">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 font-medium text-gray-800 dark:text-gray-200">
                    {tx.amount > 0 ? formatCurrency(tx.amount) : "—"}
                  </td>
                  <td className="py-3 text-gray-500 max-w-xs truncate">{tx.details}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => {
                        const receiptWindow = window.open("", "_blank");
                        if (receiptWindow) {
                          receiptWindow.document.write(`
                            <html>
                              <head>
                                <title>EASCCA Conference Centre - Receipt</title>
                                <style>
                                  body { font-family: sans-serif; padding: 40px; color: #333; }
                                  .header { border-bottom: 2px solid #C9A84C; padding-bottom: 20px; margin-bottom: 30px; }
                                  .title { font-size: 24px; font-weight: bold; color: #1A1512; }
                                  .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px; }
                                  .amount { font-size: 32px; font-weight: bold; color: #C9A84C; margin: 30px 0; }
                                  .footer { border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #999; text-align: center; margin-top: 50px; }
                                </style>
                              </head>
                              <body>
                                <div class="header">
                                  <div class="title">EASCCA Conference Centre</div>
                                  <p>Official Transaction Receipt</p>
                                </div>
                                <div class="meta">
                                  <div>
                                    <strong>Booking Ref:</strong> ${tx.bookingId?.bookingRef || "N/A"}<br/>
                                    <strong>Date:</strong> ${new Date(tx.createdAt).toLocaleString()}
                                  </div>
                                  <div>
                                    <strong>Action Status:</strong> ${tx.action}
                                  </div>
                                </div>
                                <hr/>
                                <div>
                                  <h3>Transaction Details</h3>
                                  <p>${tx.details}</p>
                                </div>
                                <div class="amount">
                                  ${tx.amount > 0 ? formatCurrency(tx.amount) : "N/A"}
                                </div>
                                <div class="footer">
                                  Thank you for choosing EASCCA Conference Centre for your luxury event.
                                </div>
                                <script>window.print();</script>
                              </body>
                            </html>
                          `);
                          receiptWindow.document.close();
                        }
                      }}
                      className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded text-[9px] uppercase font-bold tracking-wider text-gray-600 flex items-center gap-1.5 ml-auto dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-750"
                    >
                      <Download className="w-3 h-3" /> Receipt
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-400 italic">No transaction audits found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Cancellation Modal Popup */}
      {showCancelModal && selectedBooking && (
        <RefundRequestModal
          booking={selectedBooking}
          onClose={() => setShowCancelModal(false)}
          onSuccess={handleRefreshAll}
        />
      )}

    </div>
  );
}

"use client";

import React, { useState, useMemo } from 'react';
import { 
  CreditCard, ArrowUpRight, CheckCircle2, 
  AlertCircle, Upload, ShieldCheck, Download, Clock 
} from 'lucide-react';

interface PaymentTransaction {
  id: number;
  ref: string;
  date: string;
  amount: number;
  method: string;
  status: "verified" | "pending" | "declined";
}

export default function PaymentsPage() {
  const invoiceItems = [
    { name: "Gold Package Base (380 Guests Capacity)", details: "Estate spaces & Catering Menu G included", price: 3400000 },
    { name: "Timeslot Premium: Evening Soiree Gala", details: "Exclusive hold 4:00 PM - 10:00 PM", price: 100000 },
    { name: "Additional Guest Surcharge (0 excess guests)", details: "No capacity variance above baseline 380 pax", price: 0 }
  ];

  const totalInvoice = 3500000;

  const [transactions, setTransactions] = useState<PaymentTransaction[]>([
    { id: 1, ref: "TXN-2026-0012", date: "June 1, 2026", amount: 875000, method: "Bank Transfer", status: "verified" },
    { id: 2, ref: "TXN-2026-0044", date: "June 2, 2026", amount: 975000, method: "Bank Transfer", status: "verified" }
  ]);

  // Upload Form States
  const [amountInput, setAmountInput] = useState("");
  const [bankInput, setBankInput] = useState("Sampath Bank");
  const [fileAttached, setFileAttached] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const amountPaid = useMemo(() => {
    return transactions
      .filter(t => t.status === "verified")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const amountPending = useMemo(() => {
    return transactions
      .filter(t => t.status === "pending")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const amountRemaining = useMemo(() => {
    return Math.max(0, totalInvoice - amountPaid);
  }, [totalInvoice, amountPaid]);

  const progressPaid = useMemo(() => {
    return Math.round((amountPaid / totalInvoice) * 100);
  }, [amountPaid, totalInvoice]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0
    }).format(val).replace("LKR", "LKR ");
  };

  const handleUploadSlip = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmt = parseFloat(amountInput.replace(/[^0-9]/g, ''));
    if (!parsedAmt || parsedAmt <= 0) {
      alert("Please enter a valid transfer amount.");
      return;
    }
    if (!fileAttached) {
      alert("Please attach a copy of the bank deposit slip.");
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      const newTxn: PaymentTransaction = {
        id: Date.now(),
        ref: `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        amount: parsedAmt,
        method: `Transfer (${bankInput})`,
        status: "pending"
      };
      setTransactions([newTxn, ...transactions]);
      setAmountInput("");
      setFileAttached(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#1A1512]">
      {/* Header */}
      <div className="pb-6 border-b border-[#E8DFC9]">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#C69C6D] block mb-1">
          BILLING & STATEMENTS
        </span>
        <h2 className="text-3xl font-serif text-gray-900 leading-tight">
          Payments & <span className="italic text-[#C69C6D]">Finances</span>
        </h2>
        <p className="text-xs text-gray-500 font-light mt-1">
          Review invoices, paid records, and securely upload bank transfer receipts for vetting.
        </p>
      </div>

      {/* Progress Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E8DFC9] p-5 shadow-sm rounded-sm">
          <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Total Invoiced Statement</span>
          <span className="block text-2xl font-serif font-bold text-gray-900 mt-1">{formatCurrency(totalInvoice)}</span>
          <span className="block text-[10px] text-gray-500 font-light mt-2">VAT and Service Surcharges included</span>
        </div>

        <div className="bg-[#FAF6EE] border border-[#E8DFC9] p-5 shadow-sm rounded-sm relative">
          <span className="text-[9px] uppercase tracking-wider text-[#C69C6D] font-bold">Verified Payments Cleared</span>
          <span className="block text-2xl font-serif font-bold text-[#7C6A2E] mt-1">{formatCurrency(amountPaid)}</span>
          
          {/* Miniature progress bar */}
          <div className="w-full bg-[#E8DFC9] h-1.5 rounded-full overflow-hidden mt-3.5 relative">
            <div className="bg-[#7C6A2E] h-full" style={{ width: `${progressPaid}%` }}></div>
          </div>
          <span className="block text-[9px] text-[#7C6A2E] font-semibold uppercase tracking-wider mt-1">{progressPaid}% Completed</span>
        </div>

        <div className="bg-white border border-[#E8DFC9] p-5 shadow-sm rounded-sm">
          <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Remaining Outstanding Balance</span>
          <span className="block text-2xl font-serif font-bold text-[#1A1512] mt-1">{formatCurrency(amountRemaining)}</span>
          
          {amountPending > 0 ? (
            <span className="inline-flex items-center gap-1 text-[9px] text-orange-500 font-semibold uppercase mt-2.5">
              <Clock className="w-3 h-3 animate-spin" /> {formatCurrency(amountPending)} Pending Vetting
            </span>
          ) : (
            <span className="block text-[10px] text-gray-500 font-light mt-2">Next payment installment due today</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Invoice items & Transaction list */}
        <div className="lg:col-span-8 space-y-6">
          {/* Invoice item breakdown list */}
          <div className="bg-white border border-[#E8DFC9] p-6 shadow-sm rounded-sm space-y-4">
            <div className="flex justify-between items-baseline border-b border-gray-100 pb-3">
              <h3 className="text-lg font-serif text-gray-900">Banquet Statement Invoice</h3>
              <button 
                onClick={() => alert("Invoice print utility dispatched.")}
                className="text-[9px] uppercase tracking-widest font-bold text-[#C69C6D] flex items-center gap-1 hover:text-black transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {invoiceItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div>
                    <h4 className="font-semibold text-gray-900 leading-normal">{item.name}</h4>
                    <p className="text-[10px] text-gray-400 font-light mt-0.5">{item.details}</p>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0">{formatCurrency(item.price)}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#FAF6EE] p-4 text-xs font-light text-gray-500 border border-[#E8DFC9]/40 rounded-sm">
              Note: Food selections are dynamic. Finalizing menus with custom items or gourmet meat swaps will be updated here post consulting.
            </div>
          </div>

          {/* Transactions list log */}
          <div className="bg-white border border-[#E8DFC9] p-6 shadow-sm rounded-sm space-y-4">
            <h3 className="text-lg font-serif text-gray-900">Transaction History Log</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#FAF6EE] text-[9px] uppercase tracking-widest font-bold text-gray-400">
                    <th className="pb-3">Reference ID</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Transfer Method</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="font-light">
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="border-b border-gray-50 hover:bg-[#FAF6EE]/30 transition-colors last:border-0">
                      <td className="py-3.5 font-semibold text-gray-800">{txn.ref}</td>
                      <td className="py-3.5 text-gray-500">{txn.date}</td>
                      <td className="py-3.5 text-gray-500">{txn.method}</td>
                      <td className="py-3.5 font-bold text-gray-900">{formatCurrency(txn.amount)}</td>
                      <td className="py-3.5 text-right">
                        {txn.status === "verified" && (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-sm font-semibold text-[9px] uppercase">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Vetted
                          </span>
                        )}
                        {txn.status === "pending" && (
                          <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-0.5 rounded-sm font-semibold text-[9px] uppercase">
                            <Clock className="w-3 h-3 text-orange-500 animate-pulse" /> Vetting
                          </span>
                        )}
                        {txn.status === "declined" && (
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-0.5 rounded-sm font-semibold text-[9px] uppercase">
                            <AlertCircle className="w-3 h-3 text-red-500" /> Declined
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Submit payments widget */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E8DFC9] p-6 shadow-sm rounded-sm">
            <h3 className="text-lg font-serif text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#C69C6D]" /> Report Bank Transfer
            </h3>

            {uploadSuccess && (
              <div className="mb-4 bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 text-[11px] leading-relaxed rounded-sm">
                <strong>Receipt Transmitted!</strong> EASCC accountant office will review your slip within 24 working hours.
              </div>
            )}

            <form onSubmit={handleUploadSlip} className="space-y-4 text-xs font-light">
              <div>
                <label className="block uppercase font-bold text-[8px] tracking-wider text-gray-400 mb-1">Transfer Amount (LKR) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1,000,000"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-2 outline-none focus:border-[#C69C6D] text-gray-900 font-semibold font-sans rounded-sm"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-[8px] tracking-wider text-gray-400 mb-1">Destination EASCC Bank Account *</label>
                <select
                  value={bankInput}
                  onChange={(e) => setBankInput(e.target.value)}
                  className="w-full bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-2 outline-none focus:border-[#C69C6D] font-sans font-semibold rounded-sm"
                >
                  <option value="Sampath Bank">Sampath Bank (Acc: 0012-0044-8891)</option>
                  <option value="Commercial Bank">Commercial Bank (Acc: 8812-4412-0091)</option>
                  <option value="Hatton National Bank">Hatton National Bank (Acc: 9912-3344-0120)</option>
                </select>
              </div>

              {/* Upload area */}
              <div className="space-y-2">
                <label className="block uppercase font-bold text-[8px] tracking-wider text-gray-400 mb-1">Attach Slip Photocopy *</label>
                
                <div 
                  onClick={() => setFileAttached(true)}
                  className={`border-2 border-dashed rounded-sm p-4 text-center cursor-pointer transition-all ${
                    fileAttached 
                      ? 'border-[#C69C6D] bg-[#FAF6EE]/50 text-[#C69C6D]'
                      : 'border-gray-200 hover:border-gray-300 text-gray-400'
                  }`}
                >
                  <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  {fileAttached ? (
                    <span className="text-[11px] font-bold text-gray-800">transfer_slip_june2.png attached!</span>
                  ) : (
                    <span className="text-[10px]">Click to mock drag & upload transfer slip</span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-[#1A1512] text-white hover:bg-[#C69C6D] hover:text-black py-3 rounded-sm text-[9px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <span>Vetting Slip...</span>
                ) : (
                  <>
                    <span>Submit Transfer Slip</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Secure Assurance Card */}
          <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-sm flex gap-3 text-xs leading-relaxed text-emerald-800">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold">Compliant Protection</h4>
              <p className="text-[10px] text-emerald-700 font-light mt-0.5">
                All transactions details are audited by EASCC accountant and backed by standard bank-grade SSL protocol.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

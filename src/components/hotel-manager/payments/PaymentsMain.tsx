"use client";

import React, { useState } from 'react';
import PaymentsHeader from './PaymentsHeader';
import PaymentMetrics from './PaymentMetrics';
import CashReceipts from './CashReceipts';
import PaymentStatus from './PaymentStatus';
import TransactionLedger from './TransactionLedger';
import GrowthTrend from './GrowthTrend';
import FinancialsDashboard from './FinancialsDashboard';
import PaymentsLedger from './PaymentsLedger';
import PayoutQueue from './PayoutQueue';
import RefundQueue from './RefundQueue';
import CommissionSettings from '../settings/CommissionSettings';
import ManagerFooter from '../overview/Footer';

const PaymentsMain = () => {
  const [view, setView] = useState<'standard' | 'ledger' | 'payouts' | 'refunds' | 'commission' | 'escrow'>('ledger');

  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-screen bg-[#FDF9F1] dark:bg-[#0A0A0A]">
      {/* Page header bar */}
      <header className="sticky top-0 z-30 bg-[#FDF9F1]/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#E0D8C3] dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 lg:px-6 py-3 sm:h-16 pl-14 lg:pl-6 gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-serif italic text-[#7C6A2E] dark:text-[#C9A84C] text-xl font-semibold tracking-wide">
            Payments, Escrows &amp; Payout Engine
          </h2>
        </div>
        
        {/* Tab view selectors */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <div className="flex bg-[#EFE9DB] dark:bg-zinc-900 rounded-lg p-1 text-xs">
            <button
              onClick={() => setView('ledger')}
              className={`px-3 py-1.5 rounded-md font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                view === 'ledger' 
                  ? "bg-[#1E56A0] text-white shadow-xs" 
                  : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Payments Ledger
            </button>
            <button
              onClick={() => setView('payouts')}
              className={`px-3 py-1.5 rounded-md font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                view === 'payouts' 
                  ? "bg-[#1E56A0] text-white shadow-xs" 
                  : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Payout Queue
            </button>
            <button
              onClick={() => setView('refunds')}
              className={`px-3 py-1.5 rounded-md font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                view === 'refunds' 
                  ? "bg-[#1E56A0] text-white shadow-xs" 
                  : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Refunds &amp; Disputes
            </button>
            <button
              onClick={() => setView('commission')}
              className={`px-3 py-1.5 rounded-md font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                view === 'commission' 
                  ? "bg-[#1E56A0] text-white shadow-xs" 
                  : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Commission Rates
            </button>
            <button
              onClick={() => setView('standard')}
              className={`px-3 py-1.5 rounded-md font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                view === 'standard' 
                  ? "bg-[#1E56A0] text-white shadow-xs" 
                  : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setView('escrow')}
              className={`px-3 py-1.5 rounded-md font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                view === 'escrow' 
                  ? "bg-[#1E56A0] text-white shadow-xs" 
                  : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Escrows Summary
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 lg:px-6 py-6 space-y-6">
        {view === 'ledger' && <PaymentsLedger />}
        {view === 'payouts' && <PayoutQueue />}
        {view === 'refunds' && <RefundQueue />}
        {view === 'commission' && <CommissionSettings />}
        {view === 'escrow' && <FinancialsDashboard />}

        {view === 'standard' && (
          <>
            <PaymentsHeader />
            <PaymentMetrics />

            {/* Two-column: main (left 2/3) + sidebar (right 1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column */}
              <div className="lg:col-span-2 space-y-6">
                <CashReceipts />
                <TransactionLedger />
              </div>

              {/* Right column */}
              <div className="lg:col-span-1 space-y-0">
                <PaymentStatus />
                <div className="mt-4">
                  <GrowthTrend />
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <ManagerFooter />
    </div>
  );
};

export default PaymentsMain;

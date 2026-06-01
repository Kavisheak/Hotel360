import React from 'react';
import PaymentsHeader from './PaymentsHeader';
import PaymentMetrics from './PaymentMetrics';
import CashReceipts from './CashReceipts';
import PaymentStatus from './PaymentStatus';
import TransactionLedger from './TransactionLedger';
import GrowthTrend from './GrowthTrend';
import ManagerFooter from '../overview/Footer';

const PaymentsMain = () => (
  <div className="flex flex-col flex-1 min-w-0 min-h-screen bg-[#FDF9F1]">
    {/* Page header bar */}
    <header className="sticky top-0 z-30 bg-[#FDF9F1]/90 backdrop-blur-md border-b border-[#E0D8C3] flex items-center px-4 lg:px-6 h-16 pl-14 lg:pl-6">
      <h2 className="font-serif italic text-[#7C6A2E] text-xl font-semibold tracking-wide">Payments</h2>
    </header>

    <main className="flex-1 px-4 lg:px-6 py-6">
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
    </main>

    <ManagerFooter />
  </div>
);

export default PaymentsMain;

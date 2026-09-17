import React, { useState } from 'react';
import { ShieldAlert, Bell, XCircle, Clock } from 'lucide-react';
import MaintenanceBroadcastModal from './MaintenanceBroadcastModal';
import { superAdminAPI } from '@/lib/api';

const PlatformSecurity = ({ data, onChange, onSecurityAction, showToast }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  if (!data) return null;

  const notice = data.maintenanceNotice;
  const isNoticeActive = notice && notice.isActive && notice.scheduledAt;

  const handleCancelNotice = async () => {
    setCancelling(true);
    try {
      const res = await superAdminAPI.cancelMaintenanceNotice();
      if (res.ok) {
        showToast?.('Scheduled maintenance notice cancelled.', 'info');
        onChange({
          ...data,
          maintenanceNotice: { ...data.maintenanceNotice, isActive: false }
        });
      } else {
        showToast?.('Failed to cancel maintenance notice.', 'error');
      }
    } catch (e) {
      showToast?.('Error cancelling notice.', 'error');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm flex flex-col justify-between h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-[#E0D8C3] rounded text-[#7C6A2E]">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-gray-950">Platform Security</h2>
          </div>
        </div>

        {isNoticeActive && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF6EE] border border-[#C9A84C] text-[#7C6A2E] text-[9px] font-bold uppercase tracking-wider rounded-sm animate-pulse">
            <Clock size={12} /> Notice Active
          </span>
        )}
      </div>

      {/* Active Broadcast Notice Banner if scheduled */}
      {isNoticeActive && (
        <div className="bg-[#FAF6EE] border border-[#C9A84C] p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div>
            <p className="text-[10px] font-bold text-[#7C6A2E] uppercase tracking-wider mb-0.5">
              Advance Warning Dispatched to Vendors, Managers & Customers
            </p>
            <p className="text-xs text-gray-700">
              Scheduled Lockout: <span className="font-bold">{new Date(notice.scheduledAt).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span> ({notice.estimatedDuration || '1 hour'})
              {notice.endsAt && (
                <span className="text-emerald-800 font-medium ml-1">
                  • Auto-reopens at <span className="font-bold">{new Date(notice.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </span>
              )}
            </p>
            {notice.recipientsSummary && (
              <p className="text-[10px] text-gray-500 mt-1">
                Audience: {notice.recipientsSummary}
              </p>
            )}
          </div>
          <button
            onClick={handleCancelNotice}
            disabled={cancelling}
            className="flex items-center justify-center gap-1 px-3 py-1.5 border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-[9px] font-bold tracking-widest uppercase transition-colors rounded-sm shrink-0 disabled:opacity-50"
          >
            <XCircle size={12} />
            {cancelling ? 'Cancelling...' : 'Cancel Notice'}
          </button>
        </div>
      )}

      {/* Main Form Fields + Maintenance Mode side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-[9px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-2">
              Manager Idle Logout (Minutes)
            </label>
            <input
              type="number"
              value={data.managerIdleLogout}
              onChange={(e) => onChange({ ...data, managerIdleLogout: Number(e.target.value) })}
              className="w-full border border-[#E0D8C3] text-xs py-3 px-4 text-gray-700 bg-transparent focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full border border-[#7C6A2E] bg-[#FAF6EE] hover:bg-[#F2EADA] text-[#7C6A2E] font-bold text-[9px] tracking-widest uppercase py-3 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Bell size={13} />
            NOTIFY USERS & BROADCAST
          </button>
        </div>

        {/* Maintenance Mode Box */}
        <div className="bg-[#FAF6EE] border border-[#E0D8C3] p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold tracking-wider text-red-700 uppercase">
              Maintenance Mode
            </span>
            <button
              onClick={() => onChange({ ...data, maintenanceMode: !data.maintenanceMode })}
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative focus:outline-none ${data.maintenanceMode ? 'bg-red-600' : 'bg-gray-300'
                }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-sm ${data.maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>
          <p className="text-[10px] text-gray-500 leading-relaxed mt-4">
            When enabled, the public booking platform will be entirely blocked. Super Admins retain full bypass access.
          </p>
        </div>
      </div>

      {/* Security Actions */}
      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSecurityAction && onSecurityAction('FORCE_LOGOUT')}
          className="w-full border border-red-200 bg-red-50 hover:bg-red-100 text-red-800 font-bold text-[9px] tracking-widest uppercase py-3 transition-colors cursor-pointer"
        >
          FORCE LOGOUT EVERYONE
        </button>
        <button
          type="button"
          onClick={() => onSecurityAction && onSecurityAction('RESET_PASSWORDS')}
          className="w-full border border-[#E0D8C3] hover:bg-[#FAF6EE] text-gray-800 font-bold text-[9px] tracking-widest uppercase py-3 transition-colors cursor-pointer"
        >
          RESET STAFF PASSWORDS
        </button>
      </div>

      {/* Broadcast Modal */}
      <MaintenanceBroadcastModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showToast={showToast || ((msg: string) => alert(msg))}
        onSuccess={(updatedNotice) => {
          onChange({
            ...data,
            maintenanceNotice: updatedNotice
          });
        }}
      />
    </div>
  );
};

export default PlatformSecurity;

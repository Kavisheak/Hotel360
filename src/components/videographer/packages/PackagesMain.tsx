"use client";

import React, { useState, useEffect } from "react";
import { Package, Plus, Loader2, Trash2 } from "lucide-react";
import { videographerAPI } from "@/lib/api";
import AddPackageModal from "./AddPackageModal";

export default function PackagesMain() {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const res = await videographerAPI.getPackages();
      if (res.ok && res.data?.data) {
        setPackages(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching packages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!packageToDelete) return;
    try {
      const res = await videographerAPI.deletePackage(packageToDelete);
      if (res.ok) {
        setPackages(packages.filter((pkg) => pkg._id !== packageToDelete));
      } else {
        alert(res.data?.message || "Failed to delete package.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the package.");
    } finally {
      setPackageToDelete(null);
    }
  };

  return (
    <>
      <div className="space-y-6 animate-fadeIn p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-[#D4AF37]" />
            Manage Packages
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage the videography packages offered to your clients.
          </p>
        </div>
        <button
          onClick={() => { setEditingPackage(null); setIsViewOnly(false); setIsAddModalOpen(true); }}
          className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#C9A84C] hover:from-[#C9A84C] hover:to-[#B3933E] text-white text-xs font-bold uppercase tracking-widest rounded-full flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#C9A84C]" />
          <p>Loading packages...</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-amber-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-[#C9A84C]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Packages Yet</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            You haven't created any videography packages. Click the button above to add your first package.
          </p>
          <button
            onClick={() => { setEditingPackage(null); setIsViewOnly(false); setIsAddModalOpen(true); }}
            className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-full transition-colors hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            Create Your First Package
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg._id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] to-[#C9A84C]"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white font-serif">{pkg.name}</h3>
                  <p className="text-[10px] font-bold tracking-wider text-[#A67C52] uppercase mt-1">LKR {pkg.price?.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { setEditingPackage(pkg); setIsViewOnly(true); setIsAddModalOpen(true); }}
                    className="p-1.5 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-colors"
                    title="View Package"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                  <button 
                    onClick={() => { setEditingPackage(pkg); setIsViewOnly(false); setIsAddModalOpen(true); }}
                    className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                    title="Edit Package"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button 
                    onClick={() => setPackageToDelete(pkg._id)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    title="Delete Package"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">{pkg.description}</p>
              
              <div className="mt-auto space-y-3">
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {pkg.coverageDuration === 'Custom' ? `${pkg.customHours} Hours` : pkg.coverageDuration}
                  </span>
                </div>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Team:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {pkg.teamIncluded?.videographers} Video, {pkg.teamIncluded?.assistants} Asst.
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex flex-wrap gap-1.5">
                  {pkg.eventTypes?.slice(0, 3).map((type: string) => (
                    <span key={type} className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-[10px] rounded-full text-gray-600 dark:text-gray-400">
                      {type}
                    </span>
                  ))}
                  {pkg.eventTypes?.length > 3 && (
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-[10px] rounded-full text-gray-600 dark:text-gray-400">
                      +{pkg.eventTypes.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      </div>

      {isAddModalOpen && (
        <AddPackageModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          existingPackage={editingPackage}
          isViewOnly={isViewOnly}
          onEditClick={() => setIsViewOnly(false)}
          onSubmitSuccess={(newPkg) => {
            fetchPackages();
            setIsAddModalOpen(false);
          }}
        />
      )}

      {packageToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col transform transition-all animate-fadeIn">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100 dark:border-red-900/30">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold font-serif text-gray-900 dark:text-white mb-2">Delete Package?</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Are you sure you want to delete this package? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-zinc-800/50 flex items-center justify-center gap-3 border-t border-gray-100 dark:border-zinc-800">
              <button
                onClick={() => setPackageToDelete(null)}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex-1 shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

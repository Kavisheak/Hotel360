"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Box, Info } from 'lucide-react';
import { djAPI } from '@/lib/api';
import AddPackageModal from './AddPackageModal';

export default function PackagesMain() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await djAPI.getPackages();
      if (res.ok && res.data?.data) {
        setPackages(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!packageToDelete) return;
    try {
      const res = await djAPI.deletePackage(packageToDelete);
      if (res.ok) {
        setPackages(packages.filter(p => p._id !== packageToDelete));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPackageToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C6A2E]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-wide">
            My Packages
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your service packages, pricing, and inclusions.
          </p>
        </div>
        <button
          onClick={() => { setEditingPackage(null); setIsViewOnly(false); setIsModalOpen(true); }}
          className="bg-[#7C6A2E] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-semibold hover:bg-[#5E4F20] transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Package
        </button>
      </div>

      {/* Packages Grid */}
      {packages.length === 0 ? (
        <div className="bg-white border border-[#E0D8C3] rounded-xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-[#FDF9F1] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E0D8C3]">
            <Box className="w-8 h-8 text-[#A6955C]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 font-serif">No Packages Found</h3>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            You haven't created any service packages yet. Click "Add Package" to set up your pricing and services.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <div key={pkg._id} className="bg-white border border-[#E0D8C3] rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold font-serif text-gray-900">{pkg.name}</h3>
                  <div className="text-right">
                    <span className="text-xs uppercase tracking-widest text-[#A6955C] font-semibold block mb-1">PRICE</span>
                    <span className="text-lg font-bold text-gray-900">LKR {Number(pkg.price).toLocaleString()}</span>
                  </div>
                </div>
                {pkg.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-xs mt-6">
                  {pkg.duration && (
                    <div>
                      <span className="font-bold text-gray-800 block mb-1">Duration</span>
                      <span className="text-gray-600">{pkg.duration}</span>
                    </div>
                  )}
                  {pkg.eventTypes && pkg.eventTypes.length > 0 && (
                    <div>
                      <span className="font-bold text-gray-800 block mb-1">Events</span>
                      <span className="text-gray-600">{pkg.eventTypes.slice(0, 2).join(", ")}{pkg.eventTypes.length > 2 ? "..." : ""}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-[#FDF9F1] px-6 py-4 border-t border-[#E0D8C3] flex items-center justify-end gap-3">
                <button
                  onClick={() => { setEditingPackage(pkg); setIsViewOnly(true); setIsModalOpen(true); }}
                  className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 px-3 py-1.5 rounded transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  View
                </button>
                <button
                  onClick={() => { setEditingPackage(pkg); setIsViewOnly(false); setIsModalOpen(true); }}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#7C6A2E] hover:text-[#5E4F20] px-3 py-1.5 rounded transition-colors"
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button
                  onClick={() => setPackageToDelete(pkg._id)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-700 px-3 py-1.5 rounded transition-colors"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <AddPackageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          existingPackage={editingPackage}
          isViewOnly={isViewOnly}
          onEditClick={() => setIsViewOnly(false)}
          onSave={() => {
            fetchPackages();
            setIsModalOpen(false);
          }}
        />
      )}

      {packageToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col transform transition-all animate-fadeIn">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold font-serif text-gray-900 mb-2">Delete Package?</h3>
              <p className="text-gray-500 text-sm">
                Are you sure you want to delete this package? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-center gap-3 border-t border-gray-100">
              <button
                onClick={() => setPackageToDelete(null)}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex-1"
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
    </div>
  );
}

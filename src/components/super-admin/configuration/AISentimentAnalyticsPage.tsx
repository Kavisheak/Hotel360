"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/super-admin/dashboard/Sidebar";
import ConfigHeader from "@/components/super-admin/configuration/ConfigHeader";
import { superAdminAPI } from "@/lib/api";
import { AlertOctagon, AlertTriangle, CheckCircle, BrainCircuit, Activity, BarChart4, Loader2, Phone, Mail, User, Star, Sparkles, X, Copy, Check, MessageSquare, PhoneCall } from "lucide-react";

export default function AISentimentAnalytics() {
    const [data, setData] = useState<any>(null);
    const [resolvedAlerts, setResolvedAlerts] = useState<string[]>([]);
    const [resolvingId, setResolvingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [contactModal, setContactModal] = useState<{
        name: string;
        role: string;
        phone: string;
        email?: string;
        type: "vendor" | "guest";
        reviewText: string;
        rating?: number;
    } | null>(null);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleResolve = async (id: string) => {
        setResolvingId(id);
        try {
            const res = await superAdminAPI.resolveGrievance(id);
            if (res.ok) {
                setResolvedAlerts(prev => [...prev, id]);
                showToast("Grievance marked as resolved and Hotel Manager notified successfully!");
            } else {
                showToast(res.data?.message || "Failed to resolve grievance.", "error");
            }
        } catch (err) {
            showToast("Network error while resolving grievance.", "error");
        } finally {
            setResolvingId(null);
        }
    };

    useEffect(() => {
        superAdminAPI.getOverview()
            .then(res => {
                if (res.ok && res.data?.data?.sentimentAnalytics) {
                    setData(res.data.data.sentimentAnalytics);
                } else {
                    setData({
                        averageCsat: "4.6",
                        distribution: { positive: 140, neutral: 25, negative: 6, total: 171 },
                        negativeAlerts: [
                            { id: "1", reviewText: "The DJ was playing the wrong songs entirely.", score: -2 },
                            { id: "2", reviewText: "Videographer arrived late and missed important moments.", score: -4 }
                        ]
                    });
                }
            })
            .catch(() => {
                setData({
                    averageCsat: "4.6",
                    distribution: { positive: 140, neutral: 25, negative: 6, total: 171 },
                    negativeAlerts: [
                        { id: "1", reviewText: "The DJ was playing the wrong songs entirely.", score: -2 },
                        { id: "2", reviewText: "Videographer arrived late and missed important moments.", score: -4 }
                    ]
                });
            });
    }, []);

    if (!data) return (
        <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800 flex-col lg:flex-row">
            <Sidebar />
            <div className="flex-1 min-w-0 flex flex-col pt-14 lg:pt-0">
                <ConfigHeader />
                <div className="flex-1 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B08D2C]"></div>
                </div>
            </div>
        </div>
    );

    const total = data.distribution.total || 1;
    const positivePct = Math.round((data.distribution.positive / total) * 100);
    const activeAlerts = data.negativeAlerts.filter((a: any) => !resolvedAlerts.includes(a.id));

    return (
        <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800 flex-col lg:flex-row">
            <Sidebar />

            <div className="flex-1 min-w-0 flex flex-col pt-14 lg:pt-0 bg-[#FDF9F1]">
                <ConfigHeader />

                <div className="p-8 md:p-12 space-y-10 max-w-[1500px] mx-auto w-full">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between border-b pb-6 border-[#E0D8C3]">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3D3000] tracking-tight">
                                Neural Sentiment Engine
                            </h1>
                            <p className="text-sm font-serif italic text-gray-500 mt-2 flex items-center gap-2">
                                <BrainCircuit size={16} className="text-[#B08D2C]" />
                                AI-driven analysis of guest experiences and service provider performance.
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7C6A2E] bg-white px-4 py-2 border border-[#E0D8C3] rounded-sm shadow-sm transition-all hover:bg-[#FAF6EE]">
                            <Activity size={14} className="animate-pulse" /> Live Feed Active
                        </div>
                    </div>

                    {/* Top KPI Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col bg-white border border-[#E0D8C3] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-sm overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                            <div className="h-1 w-full bg-gradient-to-r from-[#A48F40] to-[#E0D8C3]"></div>
                            <div className="p-8">
                                <p className="font-bold tracking-widest text-gray-400 text-[10px] uppercase mb-4">Positive Resonance</p>
                                <h2 className="text-3xl font-serif font-bold text-[#3D3000] flex items-baseline">{positivePct}<span className="text-xl text-[#7C6A2E] ml-0.5">%</span></h2>
                                <p className="text-xs text-[#7C6A2E] mt-3 font-medium uppercase tracking-widest flex justify-between items-center">
                                    <span>{data.distribution.positive} Reviews</span>
                                    <BarChart4 size={14} className="opacity-50" />
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col bg-white border border-[#E0D8C3] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-sm overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                            <div className="h-1 w-full bg-gradient-to-r from-[#8C4A4A] to-[#FDF2F2]"></div>
                            <div className="p-8">
                                <p className="font-bold tracking-widest text-gray-400 text-[10px] uppercase mb-4">Critical Alerts</p>
                                <h2 className="text-3xl font-serif font-bold text-[#8C4A4A]">{activeAlerts.length}</h2>
                                <p className="text-xs text-[#8C4A4A] mt-3 font-medium uppercase tracking-widest flex justify-between items-center">
                                    <span>Immediate Action Required</span>
                                    <AlertTriangle size={14} className="opacity-50" />
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col bg-white border border-[#E0D8C3] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-sm overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                            <div className="h-1 w-full bg-gradient-to-r from-[#4E5A44] to-[#7B8B6F]"></div>
                            <div className="p-8">
                                <p className="font-bold tracking-widest text-gray-400 text-[10px] uppercase mb-4">Global Satisfaction</p>
                                <h2 className="text-3xl font-serif font-bold text-[#3D3000] flex items-baseline">{data.averageCsat}<span className="text-xl text-[#7C6A2E] ml-1">/ 5.0</span></h2>
                                <p className="text-xs text-[#4E5A44] mt-3 font-medium uppercase tracking-widest flex justify-between items-center">
                                    <span>Across {total} Testimonials</span>
                                    <CheckCircle size={14} className="opacity-50" />
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                        {/* Sentiment Distribution Ring */}
                        <div className="xl:col-span-1 bg-white border border-[#E0D8C3] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] rounded-sm flex flex-col h-full">
                            <div className="p-6 border-b border-[#F2EADA]">
                                <h2 className="text-xs font-bold tracking-widest text-[#3D3000] uppercase">Aggregated Sentiment</h2>
                            </div>
                            <div className="p-8 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FAF6EE] to-white opacity-50 pointer-events-none"></div>
                                <div
                                    className="relative z-10 w-56 h-56 rounded-full flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] transition-transform hover:scale-105 duration-700"
                                    style={{
                                        background: `conic-gradient(
                                            #8C4A4A 0% ${(data.distribution.negative / total) * 100}%,
                                            #E0D8C3 ${(data.distribution.negative / total) * 100}% ${((data.distribution.negative + data.distribution.neutral) / total) * 100}%,
                                            #A48F40 ${((data.distribution.negative + data.distribution.neutral) / total) * 100}% 100%
                                        )`
                                    }}
                                >
                                    {/* Ultra-premium inset core */}
                                    <div className="w-44 h-44 bg-white rounded-full flex flex-col items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.08)] border-[3px] border-white">
                                        <span className="text-3xl font-serif font-bold text-[#3D3000]">{total}</span>
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-1">Total Data</span>
                                    </div>
                                </div>
                                <div className="z-10 flex flex-col w-full gap-3 mt-10">
                                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#FDF9F1] rounded-sm border border-[#E0D8C3]">
                                        <div className="flex items-center gap-2"><span className="w-2 h-2 bg-[#A48F40] rounded-full shadow-sm"></span><span className="text-[10px] uppercase tracking-widest font-bold text-gray-600">Positive</span></div>
                                        <span className="font-bold font-serif text-[#7C6A2E]">{data.distribution.positive}</span>
                                    </div>
                                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#F8F9FA] rounded-sm border border-[#DEE2E6]">
                                        <div className="flex items-center gap-2"><span className="w-2 h-2 bg-[#E0D8C3] rounded-full shadow-sm"></span><span className="text-[10px] uppercase tracking-widest font-bold text-gray-600">Neutral</span></div>
                                        <span className="font-bold font-serif text-gray-500">{data.distribution.neutral}</span>
                                    </div>
                                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#FDF2F2] rounded-sm border border-[#FAD2D2]">
                                        <div className="flex items-center gap-2"><span className="w-2 h-2 bg-[#8C4A4A] rounded-full shadow-sm"></span><span className="text-[10px] uppercase tracking-widest font-bold text-[#8C4A4A]">Negative</span></div>
                                        <span className="font-bold font-serif text-[#8C4A4A]">{data.distribution.negative}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Review Ledger Table */}
                        <div className="xl:col-span-2 bg-white border border-[#E0D8C3] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] rounded-sm flex flex-col h-full">
                            <div className="p-6 border-b border-[#F2EADA] flex justify-between items-center bg-[#FAF6EE]">
                                <h2 className="text-xs font-bold tracking-widest text-[#3D3000] uppercase">Neural Flag Ledger</h2>
                                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold bg-white px-3 py-1.5 rounded-full border border-[#E0D8C3] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">Latest Extraction</span>
                            </div>
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-white">
                                        <tr>
                                            <th className="px-6 py-5 text-[9px] font-bold text-gray-400 tracking-widest uppercase border-b border-[#E0D8C3]">Guest Submission</th>
                                            <th className="px-6 py-5 text-[9px] font-bold text-gray-400 tracking-widest uppercase border-b border-[#E0D8C3]">Classification</th>
                                            <th className="px-6 py-5 text-[9px] font-bold text-gray-400 tracking-widest uppercase border-b border-[#E0D8C3]">Impact Factor</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#F2EADA] bg-white">
                                        {activeAlerts.length > 0 ? activeAlerts.map((alert: any, i: number) => (
                                            <tr key={alert.id || i} className="hover:bg-[#FDF9F1] transition-colors group">
                                                <td className="px-6 py-6 w-1/2">
                                                    <p className="font-serif text-[15px] text-gray-800 leading-relaxed italic border-l-[3px] border-[#8C4A4A]/30 pl-4 py-1">
                                                        "{alert.reviewText}"
                                                    </p>
                                                    {(alert.vendorName || alert.customerName) && (
                                                        <div className="flex items-center flex-wrap gap-2 text-[10px] mt-2.5 pl-4">
                                                            {alert.vendorName && (
                                                                <span className="flex items-center gap-1 font-semibold text-[#7C6A2E] bg-[#FAF6EE] px-2 py-0.5 rounded-xs border border-[#E8DFC9]">
                                                                    <Sparkles size={10} /> {alert.vendorName} ({alert.vendorRole || "Provider"})
                                                                </span>
                                                            )}
                                                            {alert.customerName && (
                                                                <span className="flex items-center gap-1 text-gray-500 font-medium">
                                                                    <User size={10} /> Guest: {alert.customerName}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-6 font-sans">
                                                    <span className="text-[#8C4A4A] font-bold text-[9px] tracking-widest uppercase bg-[#FDF2F2] px-3 flex w-max items-center gap-1.5 py-1.5 rounded-sm border border-[#8C4A4A]/20 shadow-sm">
                                                        <AlertTriangle size={12} strokeWidth={2.5} /> Flagged
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6 font-sans">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-10 h-10 rounded-full border border-[#8C4A4A]/20 bg-[#FDF2F2] flex items-center justify-center text-[#8C4A4A] font-bold shadow-sm">
                                                            {alert.score}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={3} className="px-8 py-20 text-center bg-[#FAF6EE]/50">
                                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 mb-4 shadow-sm">
                                                        <CheckCircle size={28} className="text-emerald-500" />
                                                    </div>
                                                    <p className="text-lg font-serif italic text-[#3D3000]">
                                                        No critical anomalies detected in recent feedback.
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">
                                                        Customer Satisfaction is within optimal parameters.
                                                    </p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Operational Action Items */}
                    {activeAlerts.length > 0 && (
                        <div className="pt-4 pb-12">
                            <h2 className="text-xs font-bold tracking-widest text-[#8C4A4A] uppercase flex items-center gap-3 mb-6">
                                <span className="bg-[#FDF2F2] p-1.5 rounded-sm border border-[#8C4A4A]/20 shadow-[0_1px_3px_rgba(140,74,74,0.1)]">
                                    <AlertOctagon size={16} strokeWidth={2.5} />
                                </span>
                                Immediate Escalation Required
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {activeAlerts.map((alert: any) => (
                                    <div key={alert.id} className="bg-white p-8 border-l-4 border-l-[#8C4A4A] border-t border-r border-b border-[#E0D8C3] shadow-[0_8px_30px_-4px_rgba(140,74,74,0.06)] rounded-r-sm flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 space-y-6">
                                        <div>
                                            {/* Top Info Bar: Severity + Star Rating */}
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8C4A4A] opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8C4A4A]"></span>
                                                    </span>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                        AI Detected Grievance
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {alert.rating && (
                                                        <span className="flex items-center gap-1 text-amber-700 font-serif font-bold text-xs bg-amber-50 px-2.5 py-0.5 rounded-sm border border-amber-200">
                                                            <Star size={11} className="fill-amber-500 text-amber-500" />
                                                            {alert.rating}.0 / 5.0
                                                        </span>
                                                    )}
                                                    <span className="text-[#8C4A4A] bg-[#FDF2F2] px-2.5 py-1 rounded-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] border border-[#8C4A4A]/10 font-bold text-[10px]">
                                                        {alert.score} Sev
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Guest Submission Quote */}
                                            <p className="font-serif italic text-gray-800 text-lg md:text-xl leading-relaxed mb-6 border-l-2 border-[#8C4A4A]/30 pl-4 py-1">
                                                "{alert.reviewText}"
                                            </p>

                                            {/* Investigation Dossier Container */}
                                            <div className="bg-[#FAF6EE] border border-[#E8DFC9] p-4 rounded-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {/* Vendor Investigation Details */}
                                                <div className="space-y-1.5 border-b sm:border-b-0 sm:border-r border-[#E0D8C3] pb-3 sm:pb-0 sm:pr-4">
                                                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#7C6A2E] flex items-center gap-1.5">
                                                        <Sparkles size={11} /> Accused Provider
                                                    </p>
                                                    <p className="font-serif font-bold text-[#2C1E14] text-base flex items-center gap-2">
                                                        {alert.vendorName || "Assigned Provider"}
                                                        <span className="text-[9px] uppercase tracking-wider font-sans font-semibold bg-white border border-[#E0D8C3] px-1.5 py-0.5 text-gray-600 rounded-xs">
                                                            {alert.vendorRole || "Vendor"}
                                                        </span>
                                                    </p>
                                                    {alert.vendorPhone ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => setContactModal({
                                                                name: alert.vendorName || "Assigned Provider",
                                                                role: alert.vendorRole || "Vendor",
                                                                phone: alert.vendorPhone,
                                                                email: alert.vendorEmail,
                                                                type: "vendor",
                                                                reviewText: alert.reviewText,
                                                                rating: alert.rating
                                                            })}
                                                            className="inline-flex items-center gap-1.5 text-xs text-[#7C6A2E] hover:underline font-mono font-medium text-left cursor-pointer"
                                                        >
                                                            <Phone size={12} /> {alert.vendorPhone}
                                                        </button>
                                                    ) : (
                                                        <p className="text-xs text-gray-400 italic">No direct phone</p>
                                                    )}
                                                </div>

                                                {/* Guest Details */}
                                                <div className="space-y-1.5 sm:pl-2">
                                                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500 flex items-center gap-1.5">
                                                        <User size={11} /> Reporting Guest
                                                    </p>
                                                    <p className="font-serif font-bold text-[#2C1E14] text-base">
                                                        {alert.customerName || "Verified Guest"}
                                                    </p>
                                                    <div className="flex flex-col gap-0.5">
                                                        {alert.customerPhone && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setContactModal({
                                                                    name: alert.customerName || "Verified Guest",
                                                                    role: "Verified Guest",
                                                                    phone: alert.customerPhone,
                                                                    email: alert.customerEmail,
                                                                    type: "guest",
                                                                    reviewText: alert.reviewText,
                                                                    rating: alert.rating
                                                                })}
                                                                className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:underline font-mono font-medium text-left cursor-pointer"
                                                            >
                                                                <Phone size={12} /> {alert.customerPhone}
                                                            </button>
                                                        )}
                                                        {alert.customerEmail && (
                                                            <a
                                                                href={`mailto:${alert.customerEmail}`}
                                                                className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 hover:underline truncate"
                                                            >
                                                                <Mail size={11} /> {alert.customerEmail}
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer Row: Call shortcut + Resolve button */}
                                        <div className="pt-4 border-t border-[#FDF2F2] flex flex-col sm:flex-row items-center justify-between gap-3">
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                {alert.createdAt ? `Logged on ${new Date(alert.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}` : "Recent Feedback"}
                                            </span>

                                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                                {alert.vendorPhone && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setContactModal({
                                                            name: alert.vendorName || "Assigned Provider",
                                                            role: alert.vendorRole || "Vendor",
                                                            phone: alert.vendorPhone,
                                                            email: alert.vendorEmail,
                                                            type: "vendor",
                                                            reviewText: alert.reviewText,
                                                            rating: alert.rating
                                                        })}
                                                        className="border border-[#7C6A2E] text-[#7C6A2E] hover:bg-[#FAF6EE] font-bold text-[9px] tracking-widest uppercase px-4 py-3 rounded-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                                                    >
                                                        <PhoneCall size={12} /> Call Vendor
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleResolve(alert.id)}
                                                    disabled={resolvingId === alert.id}
                                                    title="Mark resolved and notify hotel manager"
                                                    className="bg-[#8C4A4A] hover:bg-[#723C3C] text-white font-bold text-[9px] tracking-widest uppercase px-6 py-3 rounded-sm shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-[#8C4A4A] flex items-center gap-2 group-hover:bg-[#723C3C] disabled:opacity-60 cursor-pointer"
                                                >
                                                    {resolvingId === alert.id ? (
                                                        <>
                                                            <Loader2 size={13} className="animate-spin" />
                                                            Resolving & Notifying...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle size={13} />
                                                            Resolve Grievance
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Ultra-Premium Direct Contact Concierge Modal */}
                {contactModal && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
                        onClick={() => setContactModal(null)}
                    >
                        <div 
                            className="bg-white border border-[#E0D8C3] shadow-2xl rounded-sm w-full max-w-md overflow-hidden animate-scale-up"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Top Gold Accent Ribbon */}
                            <div className="h-1.5 w-full bg-gradient-to-r from-[#A48F40] via-[#C9A84C] to-[#E0D8C3]"></div>

                            {/* Modal Header */}
                            <div className="p-6 pb-4 border-b border-[#F2EADA] flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#FAF6EE] border border-[#E0D8C3] flex items-center justify-center text-[#7C6A2E] shadow-xs">
                                        <PhoneCall size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-bold text-lg text-[#2C1E14]">
                                            {contactModal.type === "vendor" ? "Service Provider Dispatch" : "Guest Relations Hotline"}
                                        </h3>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                                            Direct Concierge Communication
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setContactModal(null)}
                                    className="text-gray-400 hover:text-gray-700 p-1.5 rounded-sm hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-5">
                                {/* Person Profile Dossier */}
                                <div className="bg-[#FAF6EE] border border-[#E8DFC9] p-4 rounded-sm flex items-center justify-between">
                                    <div>
                                        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#7C6A2E] block mb-1">
                                            {contactModal.type === "vendor" ? "Accused Artisan" : "Verified Customer"}
                                        </span>
                                        <h4 className="font-serif font-bold text-lg text-[#2C1E14]">
                                            {contactModal.name}
                                        </h4>
                                        <span className="inline-block mt-1 text-[9px] uppercase tracking-wider font-semibold bg-white border border-[#E0D8C3] px-2 py-0.5 text-gray-700 rounded-xs">
                                            {contactModal.role}
                                        </span>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-white border border-[#E0D8C3] flex items-center justify-center font-serif text-xl font-bold text-[#7C6A2E] shadow-xs">
                                        {contactModal.name.charAt(0)}
                                    </div>
                                </div>

                                {/* Grievance Context Reminder */}
                                <div className="border-l-2 border-[#8C4A4A] pl-3 py-1.5 bg-red-50/60 rounded-r-sm">
                                    <p className="text-[9px] uppercase tracking-wider text-[#8C4A4A] font-bold flex items-center gap-1.5">
                                        <AlertTriangle size={11} /> Context for Conversation
                                    </p>
                                    <p className="font-serif italic text-xs text-gray-700 mt-1">
                                        "{contactModal.reviewText}"
                                    </p>
                                </div>

                                {/* Main Contact Channels */}
                                <div className="space-y-3 pt-1">
                                    {/* Phone Channel with Copy button */}
                                    {contactModal.phone ? (
                                        <div className="p-3.5 bg-white border border-[#E0D8C3] rounded-sm flex items-center justify-between shadow-xs">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-[#FAF6EE] text-[#7C6A2E] rounded-xs border border-[#E8DFC9]">
                                                    <Phone size={15} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</p>
                                                    <p className="font-mono font-bold text-base text-[#2C1E14] tracking-wide">{contactModal.phone}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(contactModal.phone)}
                                                className="px-3.5 py-1.5 border border-[#E0D8C3] text-gray-700 hover:bg-[#FAF6EE] text-[10px] font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check size={12} className="text-emerald-600" />
                                                        <span className="text-emerald-600">Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={12} />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">No direct phone registered.</p>
                                    )}

                                    {/* WhatsApp Fast Dispatch */}
                                    {contactModal.phone && (
                                        <a
                                            href={`https://wa.me/94${contactModal.phone.replace(/^0/, '').replace(/\s+/g, '')}?text=${encodeURIComponent(`Hello ${contactModal.name}, this is EASCCA Luxury Venue Management regarding feedback on your recent service assignment.`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                                        >
                                            <MessageSquare size={15} />
                                            Open WhatsApp Chat
                                        </a>
                                    )}

                                    {/* Direct System Dialer */}
                                    {contactModal.phone && (
                                        <a
                                            href={`tel:${contactModal.phone}`}
                                            className="w-full py-2.5 px-4 bg-[#FAF6EE] hover:bg-[#F2EADA] border border-[#C9A84C] text-[#7C6A2E] rounded-sm text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <PhoneCall size={14} />
                                            Launch Phone Dialer ({contactModal.phone})
                                        </a>
                                    )}

                                    {/* Email Option */}
                                    {contactModal.email && (
                                        <a
                                            href={`mailto:${contactModal.email}?subject=${encodeURIComponent("EASCCA Management - Feedback Review Inquiry")}`}
                                            className="w-full py-2.5 px-4 border border-[#E0D8C3] text-gray-700 hover:bg-gray-50 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Mail size={14} className="text-[#7C6A2E]" />
                                            Email {contactModal.email}
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 bg-[#FAF6EE] border-t border-[#E8DFC9] flex justify-end">
                                <button
                                    onClick={() => setContactModal(null)}
                                    className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:text-gray-900 border border-transparent hover:border-[#E0D8C3] rounded-xs transition-colors cursor-pointer"
                                >
                                    Close Window
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Floating Toast Notification */}
                {toast && (
                    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
                        <div className={`px-5 py-3.5 rounded-sm shadow-xl flex items-center gap-3 border text-xs font-sans ${
                            toast.type === "success"
                                ? "bg-[#FAF6EE] text-[#7C6A2E] border-[#C9A84C]"
                                : "bg-[#FDF2F2] text-[#8C4A4A] border-[#FAD2D2]"
                        }`}>
                            {toast.type === "success" ? <CheckCircle size={16} className="text-[#C9A84C]" /> : <AlertTriangle size={16} className="text-[#8C4A4A]" />}
                            <span className="font-semibold">{toast.message}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

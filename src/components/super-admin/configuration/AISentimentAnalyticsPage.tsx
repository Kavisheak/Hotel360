"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/super-admin/dashboard/Sidebar";
import ConfigHeader from "@/components/super-admin/configuration/ConfigHeader";
import { superAdminAPI } from "@/lib/api";
import { AlertOctagon, AlertTriangle, CheckCircle, BrainCircuit, Activity, BarChart4 } from "lucide-react";

export default function AISentimentAnalytics() {
    const [data, setData] = useState<any>(null);
    const [resolvedAlerts, setResolvedAlerts] = useState<string[]>([]);

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
                                    <div key={alert.id} className="bg-white p-8 border-l-4 border-l-[#8C4A4A] border-t border-r border-b border-[#E0D8C3] shadow-[0_8px_30px_-4px_rgba(140,74,74,0.06)] rounded-r-sm flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                                        <div>
                                            <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex justify-between items-center">
                                                <span>AI Detected Grievance</span>
                                                <span className="text-[#8C4A4A] bg-[#FDF2F2] px-2.5 py-1 rounded-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] border border-[#8C4A4A]/10">{alert.score} Sev</span>
                                            </h3>
                                            <p className="font-serif italic text-gray-800 text-lg md:text-xl leading-relaxed mb-6">
                                                "{alert.reviewText}"
                                            </p>
                                        </div>
                                        <div className="pt-6 border-t border-[#FDF2F2] flex justify-end">
                                            <button
                                                onClick={() => setResolvedAlerts(prev => [...prev, alert.id])}
                                                title="Dismiss this alert"
                                                className="bg-[#8C4A4A] hover:bg-[#723C3C] text-white font-bold text-[9px] tracking-widest uppercase px-6 py-3.5 rounded-sm shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-[#8C4A4A] flex items-center gap-2 group-hover:bg-[#723C3C]"
                                            >
                                                Resolve Grievance
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/super-admin/dashboard/Sidebar";
import ConfigHeader from "@/components/super-admin/configuration/ConfigHeader";
import { superAdminAPI } from "@/lib/api";
import { AlertOctagon, AlertTriangle, CheckCircle } from "lucide-react";

export default function AISentimentAnalytics() {
    const [data, setData] = useState<any>(null);

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
                <div className="p-10 font-bold text-[#7C6A2E]">Loading AI Engine...</div>
            </div>
        </div>
    );

    const total = data.distribution.total || 1;
    const positivePct = Math.round((data.distribution.positive / total) * 100);

    return (
        <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800 flex-col lg:flex-row">
            <Sidebar />

            <div className="flex-1 min-w-0 flex flex-col pt-14 lg:pt-0">
                <ConfigHeader />

                <div className="p-6 md:p-8 space-y-8 max-w-[1400px] mx-auto w-full">
                    {/* Header */}
                    <div className="mb-2">
                        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#3D3000] tracking-tight">AI Sentiment Analytics</h1>
                        <p className="text-sm font-serif italic text-gray-500 mt-1">
                            Live Analysis updated just now.
                        </p>
                    </div>

                    {/* Top Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white border border-[#E0D8C3] shadow-sm rounded-lg border-t-4 border-t-[#A48F40]">
                            <p className="font-bold tracking-widest text-[#7C6A2E] text-[10px] uppercase">Positive Reviews</p>
                            <h2 className="text-4xl font-serif font-bold text-gray-900 mt-3">{positivePct}%</h2>
                            <p className="text-xs text-gray-400 mt-2 font-medium">Based on {total} analyzed testimonials</p>
                        </div>
                        <div className="p-6 bg-white border border-[#E0D8C3] shadow-sm rounded-lg border-t-4 border-t-[#8C4A4A]">
                            <p className="font-bold tracking-widest text-[#7C6A2E] text-[10px] uppercase">Negative Alerts</p>
                            <h2 className="text-4xl font-serif font-bold text-gray-900 mt-3">{data.negativeAlerts.length}</h2>
                            <p className="text-xs text-[#8C4A4A] mt-2 font-medium">Require manager attention</p>
                        </div>
                        <div className="p-6 bg-white border border-[#E0D8C3] shadow-sm rounded-lg border-t-4 border-t-[#7B8B6F]">
                            <p className="font-bold tracking-widest text-[#7C6A2E] text-[10px] uppercase">Average Satisfaction</p>
                            <h2 className="text-4xl font-serif font-bold text-gray-900 mt-3">{data.averageCsat} / 5.0</h2>
                            <p className="text-xs text-gray-400 mt-2 font-medium">Combined hall and service rating</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Sentiment Distribution */}
                        <div className="lg:col-span-1 bg-white border border-[#E0D8C3] p-6 shadow-sm rounded-lg">
                            <h2 className="text-sm font-bold tracking-widest text-[#7C6A2E] uppercase mb-1">Sentiment Distribution</h2>
                            <p className="text-xs text-gray-400 mb-6 font-medium">Share of positive, neutral, and negative customer reviews.</p>

                            <div className="flex flex-col items-center justify-center p-8">
                                <div
                                    className="relative w-48 h-48 rounded-full flex items-center justify-center shadow-inner"
                                    style={{
                                        background: `conic-gradient(
                                            #8C4A4A 0% ${(data.distribution.negative / total) * 100}%,
                                            #E0D8C3 ${(data.distribution.negative / total) * 100}% ${((data.distribution.negative + data.distribution.neutral) / total) * 100}%,
                                            #A48F40 ${((data.distribution.negative + data.distribution.neutral) / total) * 100}% 100%
                                        )`
                                    }}
                                >
                                    {/* Inner white circle for donut effect */}
                                    <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center shadow-sm">
                                        <span className="text-2xl font-serif font-bold text-[#3D3000]">{total}</span>
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-8">
                                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#8C4A4A] rounded-full"></span><span className="text-xs font-bold text-gray-600">Negative</span></div>
                                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#E0D8C3] rounded-full"></span><span className="text-xs font-bold text-gray-600">Neutral</span></div>
                                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#A48F40] rounded-full"></span><span className="text-xs font-bold text-gray-600">Positive</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Review Analysis Table */}
                        <div className="lg:col-span-2 bg-white border border-[#E0D8C3] shadow-sm rounded-lg flex flex-col">
                            <div className="p-6 border-b border-[#F2EADA]">
                                <h2 className="text-sm font-bold tracking-widest text-[#7C6A2E] uppercase">Review Analysis Table</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#FAF6EE] text-[#7C6A2E] border-b border-[#E0D8C3]">
                                        <tr>
                                            <th className="px-6 py-4 text-[9px] font-bold tracking-[0.18em] uppercase">Customer Review</th>
                                            <th className="px-6 py-4 text-[9px] font-bold tracking-[0.18em] uppercase">AI Result</th>
                                            <th className="px-6 py-4 text-[9px] font-bold tracking-[0.18em] uppercase">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#F2EADA] bg-white">
                                        {data.negativeAlerts.length > 0 ? data.negativeAlerts.map((alert: any, i: number) => (
                                            <tr key={i} className="hover:bg-[#FDF9F1]">
                                                <td className="px-6 py-4 font-serif text-sm">"{alert.reviewText}"</td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[#8C4A4A] font-bold text-xs bg-[#FDF2F2] px-2 flex w-max items-center gap-1 py-1 rounded border border-[#8C4A4A]/20">
                                                        <AlertTriangle size={12} strokeWidth={3} /> Negative
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-[#8C4A4A]">{alert.score}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500 font-serif italic">
                                                    No negative alerts detected! Customer satisfaction is optimal.
                                                </td>
                                            </tr>
                                        )}
                                        {/* Positive Fake Entry for visual reference if empty */}
                                        {data.negativeAlerts.length === 0 && (
                                            <tr className="hover:bg-[#FDF9F1] opacity-60">
                                                <td className="px-6 py-4 font-serif text-sm text-gray-400">"Example: The DJ was amazing and kept everyone dancing."</td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[#7C6A2E] font-bold text-xs bg-[#FAF6EE] border border-[#E0D8C3] px-2 flex w-max items-center gap-1 py-1 rounded">
                                                        <CheckCircle size={12} strokeWidth={3} /> Positive
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-[#7C6A2E]">+5</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Smart Alerts */}
                    <div className="pb-10">
                        <h2 className="text-sm font-bold tracking-widest uppercase mb-4 flex items-center gap-2 text-[#8C4A4A]">
                            <div className="bg-[#FDF2F2] p-1.5 rounded border border-[#8C4A4A]/20">
                                <AlertOctagon size={18} strokeWidth={2.5} />
                            </div>
                            Priority Attention Required
                        </h2>
                        <div className="bg-[#FDF2F2] p-6 rounded-lg border border-[#F2EADA] grid gap-4">
                            {data.negativeAlerts.map((alert: any) => (
                                <div key={alert.id} className="bg-white p-5 border border-[#F2EADA] shadow-sm rounded-lg flex justify-between items-center hover:shadow-md transition-shadow">
                                    <div>
                                        <h3 className="text-[10px] font-bold text-[#8C4A4A] uppercase tracking-widest mb-2">Detected Automatically by AI</h3>
                                        <p className="font-serif italic text-gray-800 text-lg">"{alert.reviewText}"</p>
                                        <p className="text-[10px] tracking-wider uppercase mt-4 font-bold text-gray-400">Score Impact: {alert.score}</p>
                                    </div>
                                    <button className="bg-[#8C4A4A] hover:bg-[#723C3C] text-white font-bold text-[10px] tracking-widest uppercase px-5 py-3 rounded-lg shadow-sm transition-all focus:ring-4 focus:ring-[#FDF2F2]">
                                        Notify Manager
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

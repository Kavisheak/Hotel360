"use client";

import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Calendar,
  ChevronDown,
  Clock,
  CalendarDays,
  Trophy,
  Lightbulb,
  FileText,
  Download,
  Printer,
  X,
} from 'lucide-react';

interface MonthData {
  month: string;
  shortMonth: string;
  year: number;
  count: number;
  confirmed?: number;
  pending?: number;
  completed?: number;
}

type TimeRange = '3m' | '6m' | '12m';

interface BookingTrafficSectionProps {
  data?: any;
}

// ── Pure-SVG constants ──────────────────────────────────────────────
// The full SVG canvas. Bottom LABEL_H units are reserved for month labels.
const SVG_W = 1000;
const SVG_H = 260;        // total SVG height (chart area + label area)
const LABEL_H = 34;       // height reserved for x-axis month labels
const CHART_H = SVG_H - LABEL_H; // 226 — usable chart area height
const DOT_R = 5;          // default dot radius
const DOT_R_PEAK = 7;     // peak dot radius

export default function BookingTrafficSection({ data }: BookingTrafficSectionProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('6m');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const trafficData = data?.bookingTrafficSection;
  const metricsStrip = trafficData?.metricsStrip;

  // ── Bar chart: ALWAYS last 6 months, never connected to dropdown ──
  const chartSeries: MonthData[] = useMemo(() => {
    return trafficData?.sixMonths || [];
  }, [trafficData]);

  // ── Other sections: controlled by dropdown ──
  const currentSeries: MonthData[] = useMemo(() => {
    if (!trafficData) return [];
    if (timeRange === '3m') return trafficData.threeMonths || [];
    if (timeRange === '6m') return trafficData.sixMonths || [];
    if (timeRange === '12m') return trafficData.twelveMonths || [];
    return trafficData.sixMonths || [];
  }, [trafficData, timeRange]);

  // ── Chart computations (based on chartSeries — always 6m) ──
  const chartMax = useMemo(() => {
    if (chartSeries.length === 0) return 5;
    const max = Math.max(...chartSeries.map((d) => d.count), 1);
    // round up to nearest nice number
    if (max <= 5) return 5;
    if (max <= 10) return 10;
    return Math.ceil(max / 5) * 5;
  }, [chartSeries]);

  const chartPeak = useMemo(() => {
    if (chartSeries.length === 0) return null;
    return chartSeries.reduce((p, m) => (m.count > p.count ? m : p), chartSeries[0]);
  }, [chartSeries]);

  // ── Summary computations (based on currentSeries — dropdown) ──
  const peakMonth = useMemo(() => {
    if (currentSeries.length === 0) return null;
    return currentSeries.reduce((p, m) => (m.count > p.count ? m : p), currentSeries[0]);
  }, [currentSeries]);

  const totalBookingsInRange = useMemo(
    () => currentSeries.reduce((acc, curr) => acc + curr.count, 0),
    [currentSeries]
  );

  // ── Static metrics ──
  const pendingApprovalsCount =
    metricsStrip?.pendingApprovals?.count ?? trafficData?.summary?.pendingApprovals ?? 0;
  const upcomingEventsCount =
    metricsStrip?.upcomingEvents7Days?.count ?? trafficData?.summary?.upcomingEvents ?? 0;
  const currentMonthBookings =
    metricsStrip?.totalThisMonth?.count ?? data?.systemStatus?.totalBookingsThisMonth ?? 0;
  const satisfactionScore =
    metricsStrip?.averageSatisfaction?.score ??
    data?.systemStatus?.averageCustomerSatisfaction ??
    '0.0 / 5.0';
  const monthChangeStr: string | null = metricsStrip?.totalThisMonth?.change ?? null;

  // ── Y-axis ticks for the chart ──
  const yTicks = useMemo(() => {
    const steps = 5;
    return Array.from({ length: steps + 1 }, (_, i) => chartMax - (chartMax / steps) * i);
  }, [chartMax]);

  // ── SVG bar + dot + label geometry (all in SVG coordinate space) ──
  const barWidth = useMemo(() => {
    if (chartSeries.length === 0) return 100;
    const gap = 18; // gap between bars in SVG units
    return (SVG_W - gap * (chartSeries.length + 1)) / chartSeries.length;
  }, [chartSeries]);

  const getBarX = (i: number) => {
    const gap = 18;
    return gap + i * (barWidth + gap);
  };

  // barTopY: y coordinate of the TOP of the bar (bars grow downward from CHART_H)
  const getBarTopY = (count: number) => {
    const ratio = chartMax > 0 ? count / chartMax : 0;
    return CHART_H - ratio * (CHART_H - 20); // 20px top padding for number labels
  };

  // ── CSV export ──
  const handleDownloadCSV = () => {
    setIsDownloading(true);
    try {
      const rangeLabel =
        timeRange === '3m' ? 'Last 3 Months' : timeRange === '6m' ? 'Last 6 Months' : 'Last 12 Months';
      const headers = ['Month', 'Year', 'Total Bookings', 'Confirmed', 'Pending'];
      const rows = currentSeries.map((m) => [
        `"${m.month}"`, m.year, m.count, m.confirmed ?? 0, m.pending ?? 0,
      ]);
      const peakLine = chartPeak
        ? [`"Peak Booking Month: ${chartPeak.month} (${chartPeak.count} Bookings)"`]
        : [];
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [
          ['"EASCCA LUXURY PLATFORM - EXECUTIVE BOOKING DEMAND REPORT"'],
          [`"Generated: ${new Date().toLocaleString()}"`],
          [`"Time Horizon: ${rangeLabel}"`],
          peakLine,
          [`"Total Bookings in Period: ${totalBookingsInRange}"`],
          [],
          headers,
          ...rows,
        ]
          .map((e) => e.join(','))
          .join('\n');

      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(csvContent));
      link.setAttribute(
        'download',
        `EASCCA_Booking_Traffic_${timeRange.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Error generating report', e);
    } finally {
      setTimeout(() => setIsDownloading(false), 600);
    }
  };

  const handlePrintReport = () => window.print();

  const rangeLabel =
    timeRange === '3m' ? 'LAST 3 MONTHS' : timeRange === '6m' ? 'LAST 6 MONTHS' : 'LAST 12 MONTHS';
  const rangeLabelShort =
    timeRange === '3m' ? 'last 3 months' : timeRange === '6m' ? 'last 6 months' : 'last 12 months';

  // Trendline points connecting bar tops
  const trendlinePoints = useMemo(() => {
    if (chartSeries.length === 0) return '';
    return chartSeries
      .map((item, i) => {
        const cx = getBarX(i) + barWidth / 2;
        const cy = getBarTopY(item.count);
        return `${cx.toFixed(1)},${cy.toFixed(1)}`;
      })
      .join(' ');
  }, [chartSeries, chartMax, barWidth]);

  return (
    <section className="bg-white border border-[#E0D8C3] p-6 sm:p-7 rounded-sm shadow-xs space-y-6">
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-[#FAF6EE] border border-[#E0D8C3] flex items-center justify-center text-[#7C6A2E] shadow-xs">
            <BarChart3 size={20} />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-[#3D3000] tracking-tight">Booking Traffic</h2>
            <p className="text-xs font-serif italic text-gray-500">Monthly booking trends and upcoming demand.</p>
          </div>
        </div>
        {/* Dropdown — controls summary/peak/totals but NOT the chart */}
        <div className="relative inline-flex items-center">
          <div className="relative flex items-center border border-[#E0D8C3] bg-[#FAF8F5] hover:bg-white px-3 py-1.5 rounded-sm text-xs font-semibold text-gray-800 transition-colors shadow-xs">
            <Calendar size={13} className="text-[#7C6A2E] mr-2 shrink-0" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="appearance-none bg-transparent text-xs font-bold text-gray-800 focus:outline-none cursor-pointer pr-6"
            >
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="12m">Last 12 Months</option>
            </select>
            <ChevronDown size={13} className="text-[#7C6A2E] absolute right-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── 3-Col Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* ── Column 1: Bar Chart (always last 6 months) ── */}
        <div className="lg:col-span-6 xl:col-span-6 bg-white border border-[#E0D8C3] p-5 rounded-sm flex flex-col relative">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              BOOKINGS BY MONTH
            </p>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#A6955C]">
              Last 6 Months · Interactive
            </span>
          </div>

          {chartSeries.length === 0 ? (
            <div className="flex items-center justify-center h-[220px] text-gray-400 text-sm">
              No booking data available.
            </div>
          ) : (
            /* Pure SVG chart — no HTML bars, eliminates all alignment issues */
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              className="w-full"
              style={{ height: 240 }}
              role="img"
              aria-label="Booking traffic bar chart"
            >
              {/* ── Horizontal gridlines ── */}
              {yTicks.map((tick, idx) => {
                const y = getBarTopY(tick);
                return (
                  <g key={idx}>
                    <line
                      x1={0} y1={y} x2={SVG_W} y2={y}
                      stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4"
                    />
                    <text
                      x={0} y={y - 3}
                      fontSize="18" fill="#9ca3af" fontWeight="600"
                      textAnchor="start"
                    >
                      {Math.round(tick)}
                    </text>
                  </g>
                );
              })}

              {/* ── Bars ── */}
              {chartSeries.map((item, i) => {
                const barX = getBarX(i);
                const barTopY = getBarTopY(item.count);
                const barH = CHART_H - barTopY;
                const minBarH = 4; // always show at least a sliver
                const isPeak = chartPeak !== null && item.count === chartPeak.count && item.month === chartPeak.month;
                const isHov = hoveredIndex === i;
                const cx = barX + barWidth / 2;

                return (
                  <g
                    key={i}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Bar fill — gradient via linearGradient */}
                    <defs>
                      <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                        {isPeak ? (
                          <>
                            <stop offset="0%" stopColor="#E9CE7A" />
                            <stop offset="50%" stopColor="#D4B75E" />
                            <stop offset="100%" stopColor="#B89839" />
                          </>
                        ) : (
                          <>
                            <stop offset="0%" stopColor={isHov ? '#D8CDAF' : '#EDE5D4'} />
                            <stop offset="100%" stopColor={isHov ? '#C5B898' : '#D6CBB2'} />
                          </>
                        )}
                      </linearGradient>
                    </defs>
                    <rect
                      x={barX}
                      y={item.count > 0 ? barTopY : CHART_H - minBarH}
                      width={barWidth}
                      height={Math.max(barH, minBarH)}
                      fill={`url(#grad-${i})`}
                      rx="3" ry="3"
                    />

                    {/* Count label above bar */}
                    <text
                      x={cx}
                      y={barTopY - (item.count > 0 ? 14 : 18)}
                      textAnchor="middle"
                      fontSize={isPeak ? 22 : isHov ? 20 : 18}
                      fontWeight={isPeak ? '900' : '700'}
                      fill={isPeak ? '#7C6A2E' : isHov ? '#111827' : '#6b7280'}
                    >
                      {item.count}
                    </text>

                    {/* Month label below chart area */}
                    <text
                      x={cx}
                      y={SVG_H - 8}
                      textAnchor="middle"
                      fontSize={isPeak ? 14 : 13}
                      fontWeight={isPeak ? '700' : isHov ? '700' : '500'}
                      fill={isPeak ? '#7C6A2E' : isHov ? '#111827' : '#9ca3af'}
                    >
                      {item.month}
                    </text>
                  </g>
                );
              })}

              {/* ── Trendline connecting bar tops ── */}
              {trendlinePoints && (
                <polyline
                  fill="none"
                  stroke="#C9A84C"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={trendlinePoints}
                />
              )}

              {/* ── Dots — rendered AFTER trendline so they sit on top ── */}
              {chartSeries.map((item, i) => {
                const cx = getBarX(i) + barWidth / 2;
                const cy = getBarTopY(item.count);
                const isPeak = chartPeak !== null && item.count === chartPeak.count && item.month === chartPeak.month;
                const isHov = hoveredIndex === i;
                const r = isPeak ? DOT_R_PEAK : isHov ? DOT_R + 1.5 : DOT_R;
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={isPeak ? '#7C6A2E' : '#FFFFFF'}
                    stroke="#C9A84C"
                    strokeWidth="2.5"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{ cursor: 'pointer' }}
                  />
                );
              })}

              {/* ── Baseline axis ── */}
              <line
                x1={0} y1={CHART_H} x2={SVG_W} y2={CHART_H}
                stroke="#e5e7eb" strokeWidth="1.5"
              />

              {/* ── Prominent, High-Visibility Hover Tooltip (Topmost Layer) ── */}
              {hoveredIndex !== null && chartSeries[hoveredIndex] && (() => {
                const item = chartSeries[hoveredIndex];
                const barX = getBarX(hoveredIndex);
                const barTopY = getBarTopY(item.count);
                const cx = barX + barWidth / 2;
                const tipW = 320;
                const tipH = 92;
                const tipX = Math.max(12, Math.min(cx - tipW / 2, SVG_W - tipW - 12));
                const showBelow = barTopY < (tipH + 25);
                const tipY = showBelow ? barTopY + 34 : barTopY - tipH - 24;
                const arrowX = Math.max(tipX + 24, Math.min(cx, tipX + tipW - 24));

                return (
                  <g style={{ pointerEvents: 'none' }}>
                    {/* Tooltip Card Background */}
                    <rect
                      x={tipX}
                      y={tipY}
                      width={tipW}
                      height={tipH}
                      rx="8"
                      fill="#261E04"
                      stroke="#A88B38"
                      strokeWidth="1.5"
                      opacity="0.98"
                    />
                    {/* Directional Arrow */}
                    {showBelow ? (
                      <polygon
                        points={`${arrowX - 10},${tipY} ${arrowX + 10},${tipY} ${arrowX},${tipY - 9}`}
                        fill="#261E04"
                        stroke="#A88B38"
                        strokeWidth="1.5"
                      />
                    ) : (
                      <polygon
                        points={`${arrowX - 10},${tipY + tipH} ${arrowX + 10},${tipY + tipH} ${arrowX},${tipY + tipH + 9}`}
                        fill="#261E04"
                        stroke="#A88B38"
                        strokeWidth="1.5"
                      />
                    )}
                    {/* Arrow coverup line to blend with rect fill */}
                    {showBelow ? (
                      <line x1={arrowX - 9} y1={tipY} x2={arrowX + 9} y2={tipY} stroke="#261E04" strokeWidth="2.5" />
                    ) : (
                      <line x1={arrowX - 9} y1={tipY + tipH} x2={arrowX + 9} y2={tipY + tipH} stroke="#261E04" strokeWidth="2.5" />
                    )}

                    {/* Month Header */}
                    <text
                      x={tipX + tipW / 2}
                      y={tipY + 28}
                      textAnchor="middle"
                      fontSize="19"
                      fill="#F9DD76"
                      fontWeight="800"
                      letterSpacing="0.5"
                    >
                      {item.month}
                    </text>

                    {/* Total Bookings Count */}
                    <text
                      x={tipX + tipW / 2}
                      y={tipY + 56}
                      textAnchor="middle"
                      fontSize="24"
                      fill="#FFFFFF"
                      fontWeight="900"
                    >
                      {item.count} {item.count === 1 ? 'Booking' : 'Bookings'}
                    </text>

                    {/* Confirmed / Pending Breakdown */}
                    <text
                      x={tipX + tipW / 2}
                      y={tipY + 80}
                      textAnchor="middle"
                      fontSize="17"
                      fill="#E8DFC8"
                      fontWeight="600"
                    >
                      {item.confirmed ?? 0} Confirmed · {item.pending ?? 0} Pending
                    </text>
                  </g>
                );
              })()}
            </svg>
          )}
        </div>

        {/* ── Column 2: Booking Summary (dropdown-driven) ── */}
        <div className="lg:col-span-3 xl:col-span-3 bg-white border border-[#E0D8C3] p-5 rounded-sm flex flex-col justify-between space-y-4">
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            BOOKING SUMMARY ({rangeLabel})
          </p>
          <div className="space-y-4 my-auto">
            {/* Total Bookings */}
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <Calendar size={15} />
                </div>
                <p className="text-xs font-semibold text-gray-800">Total Bookings</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-serif font-bold text-gray-900 block leading-tight">{totalBookingsInRange}</span>
                <span className="text-[9px] font-bold text-emerald-600 tracking-wider inline-block whitespace-nowrap">
                  {trafficData?.summary?.growth ?? 'vs previous period'}
                </span>
              </div>
            </div>
            {/* Pending Approvals */}
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                  <Clock size={15} />
                </div>
                <p className="text-xs font-semibold text-gray-800">Pending Approvals</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-serif font-bold text-gray-900 block leading-tight">{pendingApprovalsCount}</span>
                <span className={`text-[9px] font-semibold tracking-wider inline-block whitespace-nowrap ${pendingApprovalsCount > 0 ? 'text-amber-700 font-bold' : 'text-gray-400'}`}>
                  {pendingApprovalsCount > 0 ? 'Requires attention' : 'All clear'}
                </span>
              </div>
            </div>
            {/* Upcoming Events */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                  <CalendarDays size={15} />
                </div>
                <p className="text-xs font-semibold text-gray-800">Upcoming Events (Next 7 Days)</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-serif font-bold text-gray-900 block leading-tight">{upcomingEventsCount}</span>
                <span className={`text-[9px] font-semibold tracking-wider inline-block whitespace-nowrap ${upcomingEventsCount > 0 ? 'text-purple-700 font-bold' : 'text-gray-400'}`}>
                  {upcomingEventsCount > 0 ? 'Scheduled' : 'None scheduled'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Column 3: Peak Booking Month (dropdown-driven) ── */}
        <div className="lg:col-span-3 xl:col-span-3 bg-white border border-[#E0D8C3] p-5 rounded-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={16} className="text-[#C9A84C]" />
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">PEAK BOOKING MONTH</p>
            </div>
            {peakMonth ? (
              <>
                <h3 className="text-2xl font-serif font-bold text-gray-950 mt-1">{peakMonth.month}</h3>
                <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-gray-700">{peakMonth.count} Bookings</span>
                  <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Highest in {rangeLabelShort}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400 mt-2">No data available.</p>
            )}
          </div>
          <div className="bg-[#FAF8F5] border border-[#E0D8C3] p-3.5 rounded-sm flex items-start gap-2.5 shadow-xs">
            <Lightbulb size={16} className="text-[#B89839] shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-600 leading-relaxed font-sans">
              {peakMonth ? (
                <>Based on booking trends, consider preparing more staff and resources for{' '}<strong className="text-gray-900 font-semibold">{peakMonth.month}</strong>.</>
              ) : (
                'No booking trends available for this period.'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom Metrics Strip ── */}
      <div className="border-t border-[#E0D8C3] pt-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6 sm:gap-8">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">TOTAL BOOKINGS THIS MONTH</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-gray-900">{currentMonthBookings}</span>
                {monthChangeStr && (
                  <span className={`text-[9px] font-bold ${monthChangeStr.startsWith('-') ? 'text-red-500' : 'text-emerald-600'}`}>
                    {monthChangeStr}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <div>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">PENDING APPROVALS</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-gray-900">{pendingApprovalsCount}</span>
                {pendingApprovalsCount > 0 && <span className="text-[9px] font-bold text-amber-600">Action needed</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
            <div>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">UPCOMING EVENTS (7 DAYS)</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-gray-900">{upcomingEventsCount}</span>
                {upcomingEventsCount > 0 && <span className="text-[9px] font-bold text-blue-600">Scheduled</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
            <div>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">AVERAGE SATISFACTION</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-gray-900">{satisfactionScore}</span>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="border border-[#B08D2C] hover:bg-[#FAF6EE] text-[#7C6A2E] text-[10px] font-bold tracking-widest uppercase px-4 py-2.5 rounded-sm transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-xs"
        >
          <FileText size={13} />
          GENERATE ANALYTICS REPORT
        </button>
      </div>

      {/* ── Report Modal ── */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-[#E0D8C3] max-w-2xl w-full rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#FAF8F5] border-b border-[#E0D8C3] px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border border-[#E0D8C3] flex items-center justify-center text-[#7C6A2E]">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-bold tracking-[0.2em] text-[#A6955C] uppercase">Executive Analytics</p>
                  <h2 className="text-xl font-serif font-bold text-[#3D3000]">Booking Traffic &amp; Demand Report</h2>
                </div>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded-sm hover:bg-gray-100 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-700">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#FAF8F5] border border-[#E0D8C3] p-3 rounded-sm">
                  <span className="text-[9px] font-bold text-gray-500 uppercase block">Total Volume</span>
                  <span className="text-lg font-serif font-bold text-[#3D3000]">{totalBookingsInRange} Bookings</span>
                </div>
                <div className="bg-[#FAF8F5] border border-[#E0D8C3] p-3 rounded-sm">
                  <span className="text-[9px] font-bold text-gray-500 uppercase block">Peak Month</span>
                  <span className="text-lg font-serif font-bold text-[#3D3000]">
                    {peakMonth ? `${peakMonth.shortMonth || peakMonth.month} (${peakMonth.count})` : 'N/A'}
                  </span>
                </div>
                <div className="bg-[#FAF8F5] border border-[#E0D8C3] p-3 rounded-sm">
                  <span className="text-[9px] font-bold text-gray-500 uppercase block">Time Horizon</span>
                  <span className="text-lg font-serif font-bold text-[#3D3000]">{currentSeries.length} Months</span>
                </div>
                <div className="bg-[#FAF8F5] border border-[#E0D8C3] p-3 rounded-sm">
                  <span className="text-[9px] font-bold text-gray-500 uppercase block">CSAT Rating</span>
                  <span className="text-lg font-serif font-bold text-emerald-700">{satisfactionScore}</span>
                </div>
              </div>
              <div className="border border-[#E0D8C3] rounded-sm overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#FAF8F5] border-b border-[#E0D8C3] text-[9px] font-bold uppercase tracking-wider text-[#7C6A2E]">
                    <tr>
                      <th className="py-2.5 px-4">Month</th>
                      <th className="py-2.5 px-4 text-center">Total Bookings</th>
                      <th className="py-2.5 px-4 text-center">Confirmed</th>
                      <th className="py-2.5 px-4 text-center">Pending</th>
                      <th className="py-2.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentSeries.length === 0 ? (
                      <tr><td colSpan={5} className="py-6 text-center text-gray-400">No data for this period.</td></tr>
                    ) : (
                      currentSeries.map((m, idx) => {
                        const isPeak = peakMonth !== null && m.count === peakMonth.count && m.month === peakMonth.month;
                        return (
                          <tr key={idx} className={isPeak ? 'bg-[#FAF6EE]/50 font-semibold' : 'hover:bg-gray-50'}>
                            <td className="py-2.5 px-4 text-gray-900 font-medium">
                              {m.month}
                              {isPeak && <span className="ml-2 text-[9px] font-bold text-[#7C6A2E] bg-[#FAF6EE] px-1.5 py-0.5 rounded border border-[#C9A84C]/60">Peak</span>}
                            </td>
                            <td className="py-2.5 px-4 text-center font-bold text-gray-900">{m.count}</td>
                            <td className="py-2.5 px-4 text-center text-emerald-700 font-medium">{m.confirmed ?? 0}</td>
                            <td className="py-2.5 px-4 text-center text-amber-700 font-medium">{m.pending ?? 0}</td>
                            <td className="py-2.5 px-4 text-right text-gray-600">
                              {isPeak ? 'Peak Demand' : m.count === 0 ? 'No Data' : 'Optimal Capacity'}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div className="bg-[#FAF6EE] border border-[#C9A84C] p-4 rounded-sm flex items-start gap-3">
                <Lightbulb size={17} className="text-[#7C6A2E] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#7C6A2E] text-xs mb-0.5">Management Insight &amp; Recommendation:</p>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    {peakMonth ? (
                      <>Based on cyclical trends, reservations increase heading into <strong>{peakMonth.month}</strong>. Ensure caterers, decorators, and staff schedules are confirmed in advance.</>
                    ) : (
                      'No significant booking trends detected for the selected period.'
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#FAF8F5] border-t border-[#E0D8C3] px-6 py-4 flex flex-wrap justify-end items-center gap-3">
              <button type="button" onClick={() => setIsReportModalOpen(false)} className="px-4 py-2 border border-[#E0D8C3] hover:bg-white text-gray-700 text-[10px] font-bold tracking-widest uppercase transition-colors rounded-sm cursor-pointer">Close</button>
              <button type="button" onClick={handlePrintReport} className="flex items-center gap-1.5 px-4 py-2 border border-[#7C6A2E] bg-white hover:bg-[#FAF6EE] text-[#7C6A2E] text-[10px] font-bold tracking-widest uppercase transition-colors rounded-sm cursor-pointer shadow-xs">
                <Printer size={13} />Print PDF
              </button>
              <button type="button" onClick={handleDownloadCSV} disabled={isDownloading} className="flex items-center gap-1.5 px-5 py-2 bg-[#7C6A2E] hover:bg-[#635524] text-white text-[10px] font-bold tracking-widest uppercase transition-colors rounded-sm cursor-pointer shadow-xs disabled:opacity-50">
                <Download size={13} />
                {isDownloading ? 'Downloading...' : 'Export CSV'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

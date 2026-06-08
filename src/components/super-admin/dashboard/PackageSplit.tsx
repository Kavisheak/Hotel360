import React from 'react';

const packages = [
  { label: 'Grand Gala', count: 42, color: '#B08D2C' },
  { label: 'Private Soirée', count: 18, color: '#4258AF' },
  { label: 'Elite Minimal', count: 8, color: '#AAAAAA' },
];

const total = packages.reduce((sum, p) => sum + p.count, 0);
const topPkg = packages[0];
const topPct = Math.round((topPkg.count / total) * 100);

// SVG donut chart
const DonutChart = () => {
  const radius = 60;
  const cx = 80;
  const cy = 80;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = packages.map((pkg) => {
    const pct = pkg.count / total;
    const dash = circumference * pct;
    const gap = circumference - dash;
    const seg = { ...pkg, dash, gap, offset, pct };
    offset += dash;
    return seg;
  });

  return (
    <svg viewBox="0 0 160 160" className="w-40 h-40">
      {segments.map((seg, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={seg.color}
          strokeWidth="28"
          strokeDasharray={`${seg.dash} ${seg.gap}`}
          strokeDashoffset={-seg.offset + circumference / 4}
          className="transition-all duration-500"
        />
      ))}
      {/* Center label */}
      <text x={cx} y={cy - 6} textAnchor="middle" className="font-bold" fontSize="18" fill="#3D3000" fontFamily="serif">
        {topPct}%
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="7" fill="#A6955C" fontFamily="sans-serif" fontWeight="700" letterSpacing="1">
        {topPkg.label.toUpperCase()}
      </text>
    </svg>
  );
};

const PackageSplit = () => {
  return (
    <div className="bg-white border border-[#E0D8C3] p-6 sm:p-8">
      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-6">
        Package Split
      </p>
      <div className="flex flex-col items-center gap-6">
        <DonutChart />
        <div className="space-y-2 w-full">
          {packages.map((pkg) => (
            <div key={pkg.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: pkg.color }} />
                <span className="text-xs font-semibold text-gray-600">{pkg.label}</span>
              </div>
              <span className="text-xs font-bold text-gray-800">{String(pkg.count).padStart(2, '0')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackageSplit;

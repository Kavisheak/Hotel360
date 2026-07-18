import React from 'react';

const predefinedColors = ['#B08D2C', '#4258AF', '#AAAAAA', '#A37B73', '#688B7D'];

// SVG donut chart
const DonutChart = ({ packages, total, topPct, topPkg }: any) => {
  const radius = 60;
  const cx = 80;
  const cy = 80;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = packages.map((pkg: any) => {
    const pct = total > 0 ? pkg.count / total : 0;
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
        {total > 0 ? topPct : 0}%
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="7" fill="#A6955C" fontFamily="sans-serif" fontWeight="700" letterSpacing="1">
        {topPkg ? topPkg.label.toUpperCase() : "NO DATA"}
      </text>
    </svg>
  );
};

const PackageSplit = ({ packages = [] }: { packages: any[] }) => {
  // Format packages with colors
  const formattedPackages = packages.map((p, i) => ({
    label: p.name || 'Unknown',
    count: p.count,
    color: predefinedColors[i % predefinedColors.length]
  }));

  const total = formattedPackages.reduce((sum, p) => sum + p.count, 0);
  const topPkg = formattedPackages[0] || null;
  const topPct = topPkg && total > 0 ? Math.round((topPkg.count / total) * 100) : 0;

  return (
    <div className="bg-white border border-[#E0D8C3] p-6 sm:p-8">
      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-6">
        Package Split
      </p>
      <div className="flex flex-col items-center gap-6">
        <DonutChart packages={formattedPackages} total={total} topPct={topPct} topPkg={topPkg} />
        <div className="space-y-2 w-full">
          {formattedPackages.length > 0 ? (
            formattedPackages.map((pkg) => (
              <div key={pkg.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: pkg.color }} />
                  <span className="text-xs font-semibold text-gray-600">{pkg.label}</span>
                </div>
                <span className="text-xs font-bold text-gray-800">{String(pkg.count).padStart(2, '0')}</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500 italic text-center">No package data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageSplit;

'use client';

import { SEVERITY_CONFIG } from '@/types/flood';
import { Info } from 'lucide-react';

export default function MapLegend() {
  const severities = Object.entries(SEVERITY_CONFIG) as [
    string,
    (typeof SEVERITY_CONFIG)[keyof typeof SEVERITY_CONFIG]
  ][];

  return (
    <div className="absolute bottom-6 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Info className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
          Severity
        </span>
      </div>
      <div className="space-y-1.5">
        {severities.map(([key, config]) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full border-2 border-white shadow-sm flex-shrink-0"
              style={{ backgroundColor: config.markerColor }}
            />
            <span className="text-xs text-slate-600">{config.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

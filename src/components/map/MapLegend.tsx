'use client';

import { SEVERITY_CONFIG } from '@/types/flood';

export default function MapLegend() {
  const severities = Object.entries(SEVERITY_CONFIG) as [
    string,
    (typeof SEVERITY_CONFIG)[keyof typeof SEVERITY_CONFIG]
  ][];

  return (
    <div className="absolute bottom-4 sm:bottom-6 left-3 sm:left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-2.5 sm:p-3">
      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
        Road Conditions
      </span>
      <div className="space-y-2">
        {severities.map(([key, config]) => (
          <div key={key} className="flex items-center gap-2.5">
            <div
              className="w-8 h-1 rounded-full"
              style={{ backgroundColor: config.markerColor }}
            />
            <span className="text-xs text-slate-600">{config.label}</span>
          </div>
        ))}
        {/* Prediction line */}
        <div className="flex items-center gap-2.5 pt-1 border-t border-slate-100">
          <div className="w-8 h-1 rounded-full" style={{
            background: 'repeating-linear-gradient(90deg, #9333ea 0, #9333ea 4px, transparent 4px, transparent 7px)',
          }} />
          <span className="text-xs text-slate-600">Predicted Risk</span>
        </div>
        {/* Evacuation */}
        <div className="flex items-center gap-2.5">
          <span className="text-sm">🏠</span>
          <span className="text-xs text-slate-600">Evacuation Center</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import { FloodTrend, TREND_CONFIG } from '@/types/flood';

interface Props {
  value: FloodTrend | '';
  onChange: (trend: FloodTrend) => void;
}

export default function FloodTrendSelector({ value, onChange }: Props) {
  const options = Object.entries(TREND_CONFIG) as [FloodTrend, typeof TREND_CONFIG[FloodTrend]][];

  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map(([key, config]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
            value === key
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <span className="text-lg">{config.icon}</span>
          <span className="text-xs">{config.label}</span>
        </button>
      ))}
    </div>
  );
}

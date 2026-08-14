'use client';

import { WaterDepth, WATER_DEPTH_LABELS } from '@/types/flood';

interface Props {
  value: WaterDepth | '';
  onChange: (depth: WaterDepth) => void;
}

export default function WaterDepthSelector({ value, onChange }: Props) {
  const options = Object.entries(WATER_DEPTH_LABELS) as [WaterDepth, string][];

  return (
    <div className="space-y-1.5">
      {options.map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`w-full text-left px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
            value === key
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

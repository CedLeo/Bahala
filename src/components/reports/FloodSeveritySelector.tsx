'use client';

import { FloodSeverity, SEVERITY_CONFIG } from '@/types/flood';

interface Props {
  value: FloodSeverity | '';
  onChange: (severity: FloodSeverity) => void;
}

export default function FloodSeveritySelector({ value, onChange }: Props) {
  const options = Object.entries(SEVERITY_CONFIG) as [FloodSeverity, typeof SEVERITY_CONFIG[FloodSeverity]][];

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map(([key, config]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`flex items-center gap-2 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
            value === key
              ? `${config.borderColor} ${config.bgColor} ${config.color}`
              : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: config.markerColor }}
          />
          {config.label}
        </button>
      ))}
    </div>
  );
}

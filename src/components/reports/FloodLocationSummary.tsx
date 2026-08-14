'use client';

import { LatLng } from '@/types/flood';
import { MapPin, RotateCcw } from 'lucide-react';

interface Props {
  roadName: string;
  pointA: LatLng;
  pointB: LatLng;
  distanceMeters: number;
  onReset: () => void;
}

export default function FloodLocationSummary({
  roadName,
  pointA,
  pointB,
  distanceMeters,
  onReset,
}: Props) {
  const formatDistance = (meters: number): string => {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${meters} m`;
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Flooded Area</p>
          <p className="text-base font-bold text-slate-900 mt-0.5">{roadName}</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Change
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <div>
            <p className="text-xs text-slate-500">Start</p>
            <p className="text-xs font-mono text-slate-700">{pointA[0].toFixed(4)}, {pointA[1].toFixed(4)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">B</span>
          </div>
          <div>
            <p className="text-xs text-slate-500">End</p>
            <p className="text-xs font-mono text-slate-700">{pointB[0].toFixed(4)}, {pointB[1].toFixed(4)}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-blue-200 flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-blue-500" />
        <p className="text-xs text-slate-600">
          Estimated affected section: <strong>{formatDistance(distanceMeters)}</strong>
        </p>
      </div>
    </div>
  );
}

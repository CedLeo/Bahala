'use client';

import dynamic from 'next/dynamic';
import type { SelectionState } from './FloodReportMap';
import { LatLng, FloodSeverity } from '@/types/flood';

const FloodReportMap = dynamic(() => import('./FloodReportMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 animate-pulse rounded-xl">
      <p className="text-sm text-slate-500">Loading map...</p>
    </div>
  ),
});

interface Props {
  selectionState: SelectionState;
  pointA: LatLng | null;
  pointB: LatLng | null;
  roadGeometry: LatLng[] | null;
  severity: FloodSeverity | '';
  onMapClick: (latlng: LatLng) => void;
  onReset: () => void;
}

export default function DynamicFloodReportMap(props: Props) {
  return <FloodReportMap {...props} />;
}

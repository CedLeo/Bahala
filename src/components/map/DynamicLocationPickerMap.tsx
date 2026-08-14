'use client';

import dynamic from 'next/dynamic';

const LocationPickerMap = dynamic(() => import('./LocationPickerMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 sm:h-80 rounded-xl bg-slate-100 animate-pulse flex items-center justify-center border border-slate-200">
      <p className="text-sm text-slate-500">Loading map...</p>
    </div>
  ),
});

interface Props {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedPosition: [number, number] | null;
  center?: [number, number];
  zoom?: number;
}

export default function DynamicLocationPickerMap(props: Props) {
  return <LocationPickerMap {...props} />;
}

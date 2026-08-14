'use client';

import dynamic from 'next/dynamic';

const LocationPickerMap = dynamic(() => import('./LocationPickerMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-xl bg-slate-100 animate-pulse flex items-center justify-center border border-slate-200" style={{ height: '320px' }}>
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

'use client';

import dynamic from 'next/dynamic';
import { FloodReport } from '@/types/flood';

const FloodMap = dynamic(() => import('./FloodMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-xl animate-pulse">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-3 bg-slate-200 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <p className="text-sm text-slate-500">Loading map...</p>
      </div>
    </div>
  ),
});

interface Props {
  reports: FloodReport[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  showLegend?: boolean;
}

export default function DynamicFloodMap(props: Props) {
  return <FloodMap {...props} />;
}

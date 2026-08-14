'use client';

import { useFloodStore } from '@/lib/store';
import DynamicFloodMap from '@/components/map/DynamicFloodMap';
import { AlertTriangle, Droplets, TrendingUp, Users } from 'lucide-react';

export default function HomePage() {
  const { reports } = useFloodStore();

  const severeCount = reports.filter((r) => r.severity === 'severe').length;
  const activeCount = reports.length;
  const totalConfirmations = reports.reduce((sum, r) => sum + r.confirmations, 0);
  const risingCount = reports.filter((r) => r.trend === 'rising').length;

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Quick Stats Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center gap-4 sm:gap-6 overflow-x-auto text-sm">
          <div className="flex items-center gap-1.5 text-slate-600 whitespace-nowrap">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-slate-900">{activeCount}</span>
            <span>active reports</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 whitespace-nowrap">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="font-semibold text-red-600">{severeCount}</span>
            <span>severe</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 whitespace-nowrap">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span className="font-semibold text-orange-600">{risingCount}</span>
            <span>rising</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 whitespace-nowrap">
            <Users className="w-4 h-4 text-green-500" />
            <span className="font-semibold text-slate-900">{totalConfirmations}</span>
            <span>confirmations</span>
          </div>
        </div>
      </div>

      {/* Full-screen Map */}
      <div className="flex-1 relative min-h-[calc(100vh-8rem)]">
        <DynamicFloodMap reports={reports} showLegend={true} />
      </div>
    </div>
  );
}

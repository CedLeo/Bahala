'use client';

import { useFloodStore } from '@/lib/store';
import { EvacuationCenter, EVACUATION_STATUS_CONFIG } from '@/types/evacuation';
import Card from '@/components/ui/Card';
import { Home, MapPin, Phone, Users, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EvacuationPage() {
  const { evacuationCenters } = useFloodStore();

  const openCount = evacuationCenters.filter((c) => c.status === 'open').length;
  const totalCapacity = evacuationCenters.reduce((sum, c) => sum + c.capacity, 0);
  const totalOccupancy = evacuationCenters.reduce((sum, c) => sum + c.currentOccupancy, 0);

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Evacuation Centers</h1>
        <p className="text-slate-500 mt-1">
          Find nearby evacuation centers with capacity and facility information.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{openCount}</p>
          <p className="text-xs text-green-600 font-medium">Open Centers</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{totalCapacity.toLocaleString()}</p>
          <p className="text-xs text-blue-600 font-medium">Total Capacity</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-orange-700">{totalOccupancy.toLocaleString()}</p>
          <p className="text-xs text-orange-600 font-medium">Current Occupancy</p>
        </div>
      </div>

      {/* Centers list */}
      <div className="space-y-4">
        {evacuationCenters.map((center, index) => (
          <EvacuationCard key={center.id} center={center} index={index} />
        ))}
      </div>
    </div>
  );
}

function EvacuationCard({ center, index }: { center: EvacuationCenter; index: number }) {
  const statusConfig = EVACUATION_STATUS_CONFIG[center.status];
  const occupancyPct = Math.round((center.currentOccupancy / center.capacity) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Home className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">{center.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3 h-3" />
                {center.address}
              </div>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.color}`}
          >
            {statusConfig.label}
          </span>
        </div>

        {/* Capacity bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {center.currentOccupancy} / {center.capacity} people
            </span>
            <span className="font-semibold">{occupancyPct}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                occupancyPct >= 90 ? 'bg-red-500' : occupancyPct >= 70 ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${occupancyPct}%` }}
            />
          </div>
        </div>

        {/* Facilities */}
        <div className="mb-3">
          <p className="text-xs font-medium text-slate-500 mb-1.5">Facilities</p>
          <div className="flex flex-wrap gap-1.5">
            {center.facilities.map((facility) => (
              <span
                key={facility}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600"
              >
                <CheckCircle className="w-3 h-3 text-green-500" />
                {facility}
              </span>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <Phone className="w-3 h-3" />
          <span>{center.contact}</span>
        </div>
      </Card>
    </motion.div>
  );
}

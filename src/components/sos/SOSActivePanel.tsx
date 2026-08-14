'use client';

import { SOSAlert } from '@/types/sos';
import { useFloodStore } from '@/lib/store';
import { getTimeAgo } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { MapPin, Navigation, X } from 'lucide-react';

interface Props {
  sosAlert: SOSAlert;
  onCancel: () => void;
}

export default function SOSActivePanel({ sosAlert, onCancel }: Props) {
  const { evacuationCenters } = useFloodStore();

  // Find nearest evacuation center
  const nearest = evacuationCenters
    .filter((c) => c.isOpen)
    .map((center) => {
      const dist = getDistance(sosAlert.latitude, sosAlert.longitude, center.latitude, center.longitude);
      return { ...center, distance: dist };
    })
    .sort((a, b) => a.distance - b.distance)[0];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1000] p-4 sm:bottom-6 sm:right-6 sm:left-auto sm:max-w-sm">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-red-200 overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-bold">SOS ACTIVE</span>
          </div>
          <span className="text-xs opacity-80">{getTimeAgo(sosAlert.activatedAt)}</span>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Location shared */}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-900">Location Shared</p>
              <p className="text-xs text-slate-500">
                {sosAlert.latitude.toFixed(4)}, {sosAlert.longitude.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Nearest evacuation center */}
          {nearest && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Navigation className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-green-700 font-semibold">Nearest Evacuation Center</p>
                  <p className="text-sm font-medium text-slate-900 mt-0.5">{nearest.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{nearest.distance.toFixed(1)} km away</p>
                </div>
              </div>
            </div>
          )}

          {/* Emergency contacts */}
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-slate-600 mb-1.5">Emergency Contacts</p>
            <div className="space-y-1 text-xs text-slate-600">
              <p>🚨 National Emergency: <strong>911</strong></p>
              <p>🚒 Fire: <strong>160</strong></p>
              <p>🔴 Red Cross: <strong>143</strong></p>
            </div>
          </div>

          {/* Cancel */}
          <Button variant="secondary" onClick={onCancel} className="w-full">
            <X className="w-4 h-4" />
            Cancel SOS
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Simple Haversine distance in km */
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

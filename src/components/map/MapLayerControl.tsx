'use client';

import { Layers, Droplets, Home, MapPin, Brain } from 'lucide-react';
import { useState } from 'react';

export interface MapLayers {
  floodedRoads: boolean;
  evacuationCenters: boolean;
  myLocation: boolean;
  aiPrediction: boolean;
}

interface Props {
  layers: MapLayers;
  onToggle: (layer: keyof MapLayers) => void;
}

export default function MapLayerControl({ layers, onToggle }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const layerItems = [
    { key: 'floodedRoads' as const, label: 'Flooded Roads', icon: Droplets, color: 'text-blue-600' },
    { key: 'evacuationCenters' as const, label: 'Evacuation Centers', icon: Home, color: 'text-green-600' },
    { key: 'aiPrediction' as const, label: 'AI Flood Prediction', icon: Brain, color: 'text-purple-600' },
    { key: 'myLocation' as const, label: 'My Location', icon: MapPin, color: 'text-red-600' },
  ];

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-white rounded-lg shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
        aria-label="Map layers"
      >
        <Layers className="w-5 h-5 text-slate-600" />
      </button>

      {/* Layer panel */}
      {isOpen && (
        <div className="absolute top-12 right-0 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-3 w-56">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">
            Map Layers
          </p>
          <div className="space-y-1">
            {layerItems.map((item) => {
              const Icon = item.icon;
              const isActive = layers[item.key];
              return (
                <button
                  key={item.key}
                  onClick={() => onToggle(item.key)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-slate-800'
                      : 'text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    isActive ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                  }`}>
                    {isActive && (
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10 3L4.5 8.5 2 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <Icon className={`w-4 h-4 ${isActive ? item.color : 'text-slate-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

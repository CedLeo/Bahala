'use client';

import { useMapEvents, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useState } from 'react';

interface Props {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedPosition: [number, number] | null;
}

const pickerIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width: 24px;
      height: 24px;
      background-color: #3b82f6;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 2px 12px rgba(59,130,246,0.5);
      position: relative;
    ">
      <div style="
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 8px solid white;
      "></div>
    </div>
  `,
  iconSize: [24, 32],
  iconAnchor: [12, 32],
});

export default function LocationPicker({ onLocationSelect, selectedPosition }: Props) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  if (!selectedPosition) return null;

  return <Marker position={selectedPosition} icon={pickerIcon} />;
}

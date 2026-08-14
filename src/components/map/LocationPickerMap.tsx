'use client';

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';

interface Props {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedPosition: [number, number] | null;
  center?: [number, number];
  zoom?: number;
}

const DEFAULT_CENTER: [number, number] = [14.5995, 120.9842];

export default function LocationPickerMap({
  onLocationSelect,
  selectedPosition,
  center = DEFAULT_CENTER,
  zoom = 13,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onLocationSelectRef = useRef(onLocationSelect);
  onLocationSelectRef.current = onLocationSelect;

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      onLocationSelectRef.current(e.latlng.lat, e.latlng.lng);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update marker when selectedPosition changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    if (selectedPosition) {
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width: 24px;
          height: 24px;
          background-color: #3b82f6;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 2px 12px rgba(59,130,246,0.5);
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      markerRef.current = L.marker(selectedPosition, { icon }).addTo(mapInstanceRef.current);
    }
  }, [selectedPosition]);

  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-200">
      <div ref={mapContainerRef} style={{ width: '100%', height: '320px' }} />
    </div>
  );
}

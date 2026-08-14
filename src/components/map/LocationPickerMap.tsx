'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import LocationPicker from './LocationPicker';
import 'leaflet/dist/leaflet.css';

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
  return (
    <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-slate-200">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationPicker
          onLocationSelect={onLocationSelect}
          selectedPosition={selectedPosition}
        />
      </MapContainer>
    </div>
  );
}

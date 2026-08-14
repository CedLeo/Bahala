'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import { FloodReport } from '@/types/flood';
import FloodMarker from './FloodMarker';
import MapLegend from './MapLegend';
import 'leaflet/dist/leaflet.css';

interface Props {
  reports: FloodReport[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  showLegend?: boolean;
}

// Default center: Metro Manila, Philippines
const DEFAULT_CENTER: [number, number] = [14.5995, 120.9842];
const DEFAULT_ZOOM = 12;

export default function FloodMap({
  reports,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  className = '',
  showLegend = true,
}: Props) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full rounded-xl"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {reports.map((report) => (
          <FloodMarker key={report.id} report={report} />
        ))}
      </MapContainer>

      {showLegend && <MapLegend />}
    </div>
  );
}

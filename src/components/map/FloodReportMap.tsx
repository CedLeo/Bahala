'use client';

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { LatLng, FloodSeverity, SEVERITY_CONFIG } from '@/types/flood';
import { Navigation, RotateCcw } from 'lucide-react';

export type SelectionState = 'idle' | 'selecting-a' | 'selecting-b' | 'complete';

interface Props {
  selectionState: SelectionState;
  pointA: LatLng | null;
  pointB: LatLng | null;
  roadGeometry: LatLng[] | null;
  severity: FloodSeverity | '';
  onMapClick: (latlng: LatLng) => void;
  onReset: () => void;
}

const DEFAULT_CENTER: [number, number] = [14.5995, 120.9842];
const DEFAULT_ZOOM = 13;

export default function FloodReportMap({
  selectionState,
  pointA,
  pointB,
  roadGeometry,
  severity,
  onMapClick,
  onReset,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerARef = useRef<L.Marker | null>(null);
  const markerBRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const onMapClickRef = useRef(onMapClick);
  onMapClickRef.current = onMapClick;

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      onMapClickRef.current([e.latlng.lat, e.latlng.lng]);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update cursor style based on selection state
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const container = mapContainerRef.current;
    if (selectionState === 'selecting-a' || selectionState === 'selecting-b') {
      container.style.cursor = 'crosshair';
    } else {
      container.style.cursor = '';
    }
  }, [selectionState]);

  // Update Point A marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (markerARef.current) {
      markerARef.current.remove();
      markerARef.current = null;
    }

    if (pointA) {
      const icon = createPointIcon('A', '#2563eb');
      markerARef.current = L.marker(pointA, { icon, interactive: false }).addTo(mapInstanceRef.current);
    }
  }, [pointA]);

  // Update Point B marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (markerBRef.current) {
      markerBRef.current.remove();
      markerBRef.current = null;
    }

    if (pointB) {
      const icon = createPointIcon('B', '#dc2626');
      markerBRef.current = L.marker(pointB, { icon, interactive: false }).addTo(mapInstanceRef.current);
    }
  }, [pointB]);

  // Update road polyline
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (roadGeometry && roadGeometry.length >= 2) {
      const color = severity ? SEVERITY_CONFIG[severity].markerColor : '#3b82f6';
      polylineRef.current = L.polyline(roadGeometry, {
        color,
        weight: 8,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(mapInstanceRef.current);

      // Fit map to the polyline bounds
      const bounds = polylineRef.current.getBounds();
      mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [roadGeometry, severity]);

  const handleLocateMe = useCallback(() => {
    if (!mapInstanceRef.current) return;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          mapInstanceRef.current?.setView([pos.coords.latitude, pos.coords.longitude], 15);
        },
        () => {}
      );
    }
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Map container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Instructions Overlay */}
      <MapInstructions selectionState={selectionState} />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={handleLocateMe}
          className="w-9 h-9 bg-white rounded-lg shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
          aria-label="Locate me"
          title="Center on my location"
        >
          <Navigation className="w-4 h-4 text-slate-600" />
        </button>
        {(pointA || pointB) && (
          <button
            onClick={onReset}
            className="w-9 h-9 bg-white rounded-lg shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
            aria-label="Reset selection"
            title="Reset selection"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Map Instructions Component ──────────────────────────────────────────────

function MapInstructions({ selectionState }: { selectionState: SelectionState }) {
  const config: Record<SelectionState, { text: string; step: string; color: string }> = {
    idle: {
      text: 'Click the map to select the beginning of the flooded area.',
      step: 'Step 1 of 2',
      color: 'bg-blue-600',
    },
    'selecting-a': {
      text: 'Click the map to select the beginning of the flooded area.',
      step: 'Step 1 of 2',
      color: 'bg-blue-600',
    },
    'selecting-b': {
      text: 'Now click where the flooding ends.',
      step: 'Step 2 of 2',
      color: 'bg-orange-600',
    },
    complete: {
      text: 'Flooded road selected. Review the details and submit your report.',
      step: 'Complete',
      color: 'bg-green-600',
    },
  };

  const current = config[selectionState];

  return (
    <div className="absolute top-4 left-4 right-14 z-[1000]">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 px-4 py-3 flex items-center gap-3">
        <span className={`px-2 py-0.5 rounded text-xs font-bold text-white flex-shrink-0 ${current.color}`}>
          {current.step}
        </span>
        <p className="text-sm text-slate-700 font-medium">{current.text}</p>
      </div>
    </div>
  );
}

// ─── Helper: Create Point A/B marker icons ───────────────────────────────────

function createPointIcon(label: string, color: string): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="
      display:flex;align-items:center;justify-content:center;
      width:28px;height:28px;
      background:${color};
      border-radius:50%;
      border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      color:white;
      font-size:12px;
      font-weight:800;
      font-family:system-ui,sans-serif;
    ">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { FloodReport, SEVERITY_CONFIG, WATER_DEPTH_LABELS } from '@/types/flood';
import { EvacuationCenter, EVACUATION_STATUS_CONFIG } from '@/types/evacuation';
import { FloodPrediction } from '@/types/prediction';
import { SOSAlert } from '@/types/sos';
import { getFreshnessOpacity, getTimeAgo, calculateConfidence } from '@/lib/utils';
import MapLegend from './MapLegend';
import MapLayerControl, { MapLayers } from './MapLayerControl';

interface Props {
  reports: FloodReport[];
  evacuationCenters: EvacuationCenter[];
  predictions: FloodPrediction[];
  sosAlert: SOSAlert | null;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const DEFAULT_CENTER: [number, number] = [14.5995, 120.9842];
const DEFAULT_ZOOM = 12;

export default function FloodMap({
  reports,
  evacuationCenters,
  predictions,
  sosAlert,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  className = '',
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const floodLayerRef = useRef<L.LayerGroup | null>(null);
  const evacLayerRef = useRef<L.LayerGroup | null>(null);
  const predictionLayerRef = useRef<L.LayerGroup | null>(null);
  const sosMarkerRef = useRef<L.Marker | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [layers, setLayers] = useState<MapLayers>({
    floodedRoads: true,
    evacuationCenters: true,
    myLocation: true,
    aiPrediction: false,
  });

  const handleLayerToggle = useCallback((layer: keyof MapLayers) => {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  }, []);

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Create layer groups
    floodLayerRef.current = L.layerGroup().addTo(map);
    evacLayerRef.current = L.layerGroup().addTo(map);
    predictionLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    setIsReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      floodLayerRef.current = null;
      evacLayerRef.current = null;
      predictionLayerRef.current = null;
      setIsReady(false);
    };
  }, []);

  // Draw flooded roads as polylines
  useEffect(() => {
    if (!isReady || !floodLayerRef.current) return;
    const layerGroup = floodLayerRef.current;
    layerGroup.clearLayers();

    if (!layers.floodedRoads) return;

    reports.forEach((report) => {
      if (report.roadGeometry.length < 2) return;

      const config = SEVERITY_CONFIG[report.severity];
      const opacity = getFreshnessOpacity(report.reportedAt);
      const weight = report.severity === 'severe' ? 8 : report.severity === 'moderate' ? 6 : 5;

      const polyline = L.polyline(report.roadGeometry, {
        color: config.markerColor,
        weight,
        opacity,
        lineCap: 'round',
        lineJoin: 'round',
      });

      const confidence = calculateConfidence(report.confirmations, report.disputes);
      const trendIcons: Record<string, string> = { rising: '⬆️ Rising', same: '➡️ Same level', receding: '⬇️ Receding' };

      polyline.bindPopup(
        `<div style="min-width:240px;font-family:system-ui,sans-serif;padding:4px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${config.markerColor}"></span>
            <strong style="font-size:12px;color:${config.markerColor};">${config.label}</strong>
          </div>
          <h3 style="font-size:14px;font-weight:700;color:#0f172a;margin:0 0 10px;">${report.road}</h3>
          <div style="font-size:12px;color:#334155;line-height:2;">
            <div><strong>Water Level:</strong> ${WATER_DEPTH_LABELS[report.waterDepth]}</div>
            <div><strong>Trend:</strong> ${trendIcons[report.trend]}</div>
            <div><strong>Confidence:</strong> ${confidence}% (${report.confirmations} confirmed)</div>
            <div><strong>Updated:</strong> ${getTimeAgo(report.reportedAt)}</div>
          </div>
          ${report.description ? `<p style="font-size:11px;color:#64748b;margin:8px 0 0;line-height:1.5;border-top:1px solid #e2e8f0;padding-top:8px;">${report.description.slice(0, 120)}${report.description.length > 120 ? '...' : ''}</p>` : ''}
          <a href="/reports/${report.id}" style="display:block;text-align:center;background:#2563eb;color:white;padding:7px 12px;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none;margin-top:10px;">View Full Report</a>
        </div>`,
        { maxWidth: 300 }
      );

      polyline.addTo(layerGroup);
    });
  }, [reports, isReady, layers.floodedRoads]);

  // Draw evacuation center markers
  useEffect(() => {
    if (!isReady || !evacLayerRef.current) return;
    const layerGroup = evacLayerRef.current;
    layerGroup.clearLayers();

    if (!layers.evacuationCenters) return;

    evacuationCenters.forEach((center) => {
      const statusConfig = EVACUATION_STATUS_CONFIG[center.status];
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          display:flex;align-items:center;justify-content:center;
          width:32px;height:32px;
          background:white;
          border-radius:8px;
          border:2px solid ${statusConfig.dotColor};
          box-shadow:0 2px 8px rgba(0,0,0,0.2);
          font-size:16px;
        ">🏠</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -20],
      });

      const marker = L.marker([center.latitude, center.longitude], { icon });

      const occupancyPct = Math.round((center.currentOccupancy / center.capacity) * 100);

      marker.bindPopup(
        `<div style="min-width:220px;font-family:system-ui,sans-serif;padding:4px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
            <span style="font-size:16px;">🏠</span>
            <span style="font-size:11px;font-weight:600;padding:2px 8px;border-radius:10px;background:${statusConfig.dotColor}20;color:${statusConfig.dotColor};">${statusConfig.label}</span>
          </div>
          <h3 style="font-size:14px;font-weight:700;color:#0f172a;margin:0 0 8px;">${center.name}</h3>
          <div style="font-size:12px;color:#334155;line-height:2;">
            <div>📍 ${center.address}</div>
            <div>👥 ${center.currentOccupancy}/${center.capacity} people (${occupancyPct}%)</div>
            <div>📞 ${center.contact}</div>
          </div>
          <div style="margin-top:8px;padding-top:8px;border-top:1px solid #e2e8f0;">
            <p style="font-size:11px;color:#64748b;margin:0 0 4px;font-weight:600;">Facilities:</p>
            <p style="font-size:11px;color:#64748b;margin:0;">${center.facilities.join(' · ')}</p>
          </div>
          <a href="/evacuation" style="display:block;text-align:center;background:#16a34a;color:white;padding:7px 12px;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none;margin-top:10px;">View All Centers</a>
        </div>`,
        { maxWidth: 300 }
      );

      marker.addTo(layerGroup);
    });
  }, [evacuationCenters, isReady, layers.evacuationCenters]);

  // Draw AI prediction layer (dashed polylines)
  useEffect(() => {
    if (!isReady || !predictionLayerRef.current) return;
    const layerGroup = predictionLayerRef.current;
    layerGroup.clearLayers();

    if (!layers.aiPrediction) return;

    predictions.forEach((prediction) => {
      if (prediction.roadGeometry.length < 2) return;

      const config = SEVERITY_CONFIG[prediction.predictedRisk];

      const polyline = L.polyline(prediction.roadGeometry, {
        color: '#9333ea', // Purple for predictions
        weight: 6,
        opacity: 0.7,
        dashArray: '12, 8',
        lineCap: 'round',
        lineJoin: 'round',
      });

      const trendLabels: Record<string, string> = { increasing: '⬆️ Increasing', stable: '➡️ Stable', decreasing: '⬇️ Decreasing' };

      polyline.bindPopup(
        `<div style="min-width:240px;font-family:system-ui,sans-serif;padding:4px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
            <span style="font-size:14px;">🧠</span>
            <strong style="font-size:11px;color:#7c3aed;text-transform:uppercase;letter-spacing:0.5px;">AI Flood Prediction</strong>
          </div>
          <h3 style="font-size:14px;font-weight:700;color:#0f172a;margin:0 0 10px;">${prediction.road}</h3>
          <div style="font-size:12px;color:#334155;line-height:2;">
            <div><strong>Current Risk:</strong> ${SEVERITY_CONFIG[prediction.currentRisk].label}</div>
            <div><strong>Predicted Risk:</strong> <span style="color:${config.markerColor};font-weight:700;">${config.label}</span></div>
            <div><strong>Trend:</strong> ${trendLabels[prediction.trend]}</div>
            <div><strong>Confidence:</strong> ${prediction.confidence}%</div>
            <div><strong>Estimated:</strong> ${prediction.estimatedTime}</div>
          </div>
          <p style="font-size:10px;color:#94a3b8;margin:8px 0 0;line-height:1.4;border-top:1px solid #e2e8f0;padding-top:8px;font-style:italic;">⚠️ Prediction is an estimate and may not reflect actual flood conditions.</p>
        </div>`,
        { maxWidth: 300 }
      );

      polyline.addTo(layerGroup);
    });
  }, [predictions, isReady, layers.aiPrediction]);

  // SOS marker
  useEffect(() => {
    if (!isReady || !mapInstanceRef.current) return;

    if (sosMarkerRef.current) {
      sosMarkerRef.current.remove();
      sosMarkerRef.current = null;
    }

    if (sosAlert && sosAlert.status === 'active') {
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          display:flex;align-items:center;justify-content:center;
          width:44px;height:44px;
          background:#dc2626;
          border-radius:50%;
          border:4px solid white;
          box-shadow:0 0 0 4px rgba(220,38,38,0.3), 0 4px 12px rgba(0,0,0,0.3);
          color:white;
          font-size:12px;
          font-weight:900;
          animation: pulse-severe 1.5s infinite;
        ">SOS</div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      sosMarkerRef.current = L.marker([sosAlert.latitude, sosAlert.longitude], { icon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`<div style="text-align:center;font-family:system-ui,sans-serif;">
          <strong style="color:#dc2626;font-size:14px;">🔴 Emergency SOS Active</strong>
          <p style="font-size:12px;color:#475569;margin:6px 0 0;">Location shared with community</p>
        </div>`);
    }
  }, [sosAlert, isReady]);

  // User location marker
  useEffect(() => {
    if (!isReady || !mapInstanceRef.current) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (!layers.myLocation) return;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!mapInstanceRef.current) return;
          const { latitude, longitude } = position.coords;
          const icon = L.divIcon({
            className: '',
            html: `<div style="
              width:16px;height:16px;
              background:#3b82f6;
              border-radius:50%;
              border:3px solid white;
              box-shadow:0 0 0 3px rgba(59,130,246,0.3), 0 2px 6px rgba(0,0,0,0.2);
            "></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          });
          userMarkerRef.current = L.marker([latitude, longitude], { icon })
            .addTo(mapInstanceRef.current!)
            .bindPopup('<strong style="font-family:system-ui;">📍 Your Location</strong>');
        },
        () => {
          // Geolocation unavailable — silently fail
        }
      );
    }
  }, [isReady, layers.myLocation]);

  return (
    <div className={`relative w-full h-full ${className}`} style={{ minHeight: '500px' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: '500px' }} />
      <MapLegend />
      <MapLayerControl layers={layers} onToggle={handleLayerToggle} />
    </div>
  );
}

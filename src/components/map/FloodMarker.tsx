'use client';

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FloodReport, SEVERITY_CONFIG, WATER_DEPTH_LABELS } from '@/types/flood';
import { getFreshnessOpacity, getTimeAgo, calculateConfidence } from '@/lib/utils';
import FloodSeverityBadge from '@/components/reports/FloodSeverityBadge';
import FloodTrendBadge from '@/components/reports/FloodTrendBadge';
import CommunityConfidence from '@/components/reports/CommunityConfidence';
import Link from 'next/link';

interface Props {
  report: FloodReport;
}

function createFloodIcon(severity: FloodReport['severity'], reportedAt: string): L.DivIcon {
  const config = SEVERITY_CONFIG[severity];
  const opacity = getFreshnessOpacity(reportedAt);
  const isSevere = severity === 'severe';
  const size = isSevere ? 20 : 16;

  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${config.markerColor};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        opacity: ${opacity};
        ${isSevere ? 'animation: pulse-severe 2s infinite;' : ''}
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

export default function FloodMarker({ report }: Props) {
  const icon = createFloodIcon(report.severity, report.reportedAt);

  return (
    <Marker position={[report.latitude, report.longitude]} icon={icon}>
      <Popup className="flood-popup" maxWidth={300} minWidth={240}>
        <div className="p-1">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <FloodSeverityBadge severity={report.severity} size="sm" />
          </div>

          {/* Location */}
          <h3 className="font-semibold text-slate-900 text-sm mb-2">{report.location}</h3>

          {/* Flood Pulse Info */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-blue-500">🌊</span>
              <span className="text-slate-700 font-medium">
                {WATER_DEPTH_LABELS[report.waterDepth]}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FloodTrendBadge trend={report.trend} />
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>👥</span>
              <span>{report.confirmations} confirmed</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>🕐</span>
              <span>Updated {getTimeAgo(report.reportedAt)}</span>
            </div>
          </div>

          {/* Confidence */}
          <div className="mb-3">
            <CommunityConfidence
              confirmations={report.confirmations}
              disputes={report.disputes}
            />
          </div>

          {/* Description preview */}
          {report.description && (
            <p className="text-xs text-slate-500 mb-3 line-clamp-2">
              {report.description}
            </p>
          )}

          {/* Action */}
          <Link
            href={`/reports/${report.id}`}
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 px-3 rounded-md transition-colors"
          >
            View Full Report
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}

import { Fragment, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Polyline,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { SEVERITY, DEFAULT_CENTER, DEFAULT_ZOOM } from "../config";

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

function timeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function formatLength(meters) {
  if (meters >= 1000) return `${(meters / 1000).toFixed(2)} km`;
  return `${Math.round(meters)} m`;
}

export default function MapView({
  reports,
  draftStart,
  draftEnd,
  onMapClick,
  onConfirm,
  onDispute,
  onAlertAuthorities,
}) {
  const [busyId, setBusyId] = useState(null);

  async function handleAction(id, action) {
    setBusyId(id);
    try {
      await action(id);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      className="map-container"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onMapClick={onMapClick} />

      {draftStart && (
        <CircleMarker
          center={draftStart}
          radius={9}
          pathOptions={{
            color: "#3b82f6",
            fillColor: "#3b82f6",
            fillOpacity: 0.8,
          }}
        />
      )}
      {draftStart && draftEnd && (
        <>
          <Polyline
            positions={[draftStart, draftEnd]}
            pathOptions={{
              color: "#3b82f6",
              weight: 6,
              opacity: 0.7,
              dashArray: "8 6",
            }}
          />
          <CircleMarker
            center={draftEnd}
            radius={9}
            pathOptions={{
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.8,
            }}
          />
        </>
      )}

      {reports.map((report) => {
        const severity = SEVERITY[report.severity] || SEVERITY.ankle;
        const startPos = [report.start.lat, report.start.lng];
        const endPos = [report.end.lat, report.end.lng];
        const midPos = [
          (report.start.lat + report.end.lat) / 2,
          (report.start.lng + report.end.lng) / 2,
        ];

        return (
          <Fragment key={report.id}>
            <Polyline
              positions={[startPos, endPos]}
              pathOptions={{
                color: severity.color,
                weight: 7,
                opacity: report.isStale ? 0.35 : 0.85,
                lineCap: "round",
              }}
            />
            {/* Endpoint markers make the segment's extent easy to grab visually */}
            <CircleMarker
              center={startPos}
              radius={5}
              pathOptions={{
                color: severity.color,
                fillColor: severity.color,
                fillOpacity: report.isStale ? 0.35 : 0.9,
              }}
            />
            <CircleMarker
              center={endPos}
              radius={5}
              pathOptions={{
                color: severity.color,
                fillColor: severity.color,
                fillOpacity: report.isStale ? 0.35 : 0.9,
              }}
            />
            {/* Invisible larger marker at the midpoint carries the popup so it's
                easy to tap on touch devices without hitting the thin line exactly */}
            <CircleMarker
              center={midPos}
              radius={14}
              pathOptions={{ opacity: 0, fillOpacity: 0 }}
            >
              <Popup>
                <div className="report-popup">
                  <div className="report-popup-header">
                    <span
                      className="severity-dot"
                      style={{ backgroundColor: severity.color }}
                    />
                    <strong>{severity.label}</strong>
                    {report.isStale && (
                      <span className="stale-badge">may be outdated</span>
                    )}
                  </div>

                  {report.streetName && (
                    <p className="street-name">{report.streetName}</p>
                  )}
                  <p className="report-meta">
                    Flooded stretch: ~{formatLength(report.lengthMeters)}
                  </p>
                  {report.description && <p>{report.description}</p>}

                  <p className="report-meta">
                    Reported by {report.reporterName} &middot;{" "}
                    {timeAgo(report.createdAt)}
                  </p>
                  <p className="report-meta">
                    {report.confirmCount} confirmed &middot;{" "}
                    {report.disputeCount} disputed
                  </p>

                  <div className="popup-actions">
                    <button
                      type="button"
                      className="btn btn-small btn-confirm"
                      disabled={busyId === report.id}
                      onClick={() => handleAction(report.id, onConfirm)}
                    >
                      Still flooded
                    </button>
                    <button
                      type="button"
                      className="btn btn-small btn-dispute"
                      disabled={busyId === report.id}
                      onClick={() => handleAction(report.id, onDispute)}
                    >
                      Cleared up
                    </button>
                  </div>

                  <button
                    type="button"
                    className="btn btn-small btn-alert"
                    disabled={busyId === report.id || report.authorityAlerted}
                    onClick={() => handleAction(report.id, onAlertAuthorities)}
                  >
                    {report.authorityAlerted
                      ? "Authorities alerted"
                      : "Alert authorities"}
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          </Fragment>
        );
      })}
    </MapContainer>
  );
}

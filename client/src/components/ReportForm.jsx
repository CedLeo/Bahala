import { useState } from "react";
import { SEVERITY, SEVERITY_ORDER } from "../config";

// Haversine distance in meters, mirrors server/geo.js so the form can show
// a live length estimate before the report is even submitted.
function distanceMeters(a, b) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function formatLength(meters) {
  if (meters >= 1000) return `${(meters / 1000).toFixed(2)} km`;
  return `${Math.round(meters)} m`;
}

export default function ReportForm({
  start,
  end,
  onSubmit,
  onCancel,
  submitting,
}) {
  const [streetName, setStreetName] = useState("");
  const [severity, setSeverity] = useState("ankle");
  const [description, setDescription] = useState("");
  const [reporterName, setReporterName] = useState("");

  const length = distanceMeters(start, end);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      start: { lat: start.lat, lng: start.lng },
      end: { lat: end.lat, lng: end.lng },
      streetName,
      severity,
      description,
      reporterName,
    });
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-form-title"
    >
      <div className="modal">
        <h2 id="report-form-title">Report flooding</h2>
        <p className="modal-subtitle">
          Flooded stretch: ~{formatLength(length)}
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="streetName">Street / road name</label>
          <input
            id="streetName"
            type="text"
            placeholder="e.g. Katipunan Ave."
            value={streetName}
            onChange={(e) => setStreetName(e.target.value)}
            maxLength={120}
          />

          <label htmlFor="severity">Severity</label>
          <div
            className="severity-options"
            role="radiogroup"
            aria-labelledby="severity"
          >
            {SEVERITY_ORDER.map((key) => (
              <label
                key={key}
                className={`severity-chip ${severity === key ? "selected" : ""}`}
                style={{ "--chip-color": SEVERITY[key].color }}
              >
                <input
                  type="radio"
                  name="severity"
                  value={key}
                  checked={severity === key}
                  onChange={() => setSeverity(key)}
                />
                {SEVERITY[key].label}
              </label>
            ))}
          </div>

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="What are you seeing? Water level, traffic, closed lanes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={3}
          />

          <label htmlFor="reporterName">Your name (optional)</label>
          <input
            id="reporterName"
            type="text"
            placeholder="Anonymous"
            value={reporterName}
            onChange={(e) => setReporterName(e.target.value)}
            maxLength={60}
          />

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

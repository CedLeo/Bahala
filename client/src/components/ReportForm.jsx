import { useState } from "react";
import { SEVERITY, SEVERITY_ORDER } from "../config";

function formatLength(meters) {
  if (meters == null) return "unknown";
  if (meters >= 1000) return `${(meters / 1000).toFixed(2)} km`;
  return `${Math.round(meters)} m`;
}

export default function ReportForm({ route, onSubmit, onCancel, submitting }) {
  // Pre-fill with the street name OSRM matched, if any - user can still edit it.
  const [streetName, setStreetName] = useState(route.streetName || "");
  const [severity, setSeverity] = useState("ankle");
  const [description, setDescription] = useState("");
  const [reporterName, setReporterName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      path: route.path,
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
          Flooded stretch: ~{formatLength(route.distanceMeters)}
          {!route.snapped && " (straight-line estimate — road match not found)"}
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

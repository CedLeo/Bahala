import { useCallback, useEffect, useState } from "react";
import MapView from "./components/MapView";
import ReportForm from "./components/ReportForm";
import Legend from "./components/Legend";
import { api } from "./api";
import "./App.css";

const POLL_INTERVAL_MS = 15000;

function App() {
  const [reports, setReports] = useState([]);
  // Two-click segment drafting: first click sets draftStart, second click
  // sets draftEnd and opens the report form. Both are Leaflet LatLng-like
  // objects ({ lat, lng }).
  const [draftStart, setDraftStart] = useState(null);
  const [draftEnd, setDraftEnd] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const formOpen = Boolean(draftStart && draftEnd);

  const loadReports = useCallback(async () => {
    try {
      const data = await api.getReports();
      setReports(data);
      setError(null);
    } catch {
      setError(
        "Couldn't reach the server. Is the backend running on port 4000?",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll for updates. The initial load is a separate effect so this one's
  // cleanup/interval logic stays independent of the "run once on mount" fetch.
  useEffect(() => {
    const interval = setInterval(loadReports, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadReports]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional initial fetch on mount
    loadReports();
  }, [loadReports]);

  function handleMapClick(latlng) {
    if (formOpen) return; // form is open, ignore further map clicks until resolved

    if (!draftStart) {
      setDraftStart(latlng);
    } else {
      setDraftEnd(latlng);
    }
  }

  function resetDraft() {
    setDraftStart(null);
    setDraftEnd(null);
  }

  async function handleSubmitReport(payload) {
    setSubmitting(true);
    try {
      await api.createReport(payload);
      resetDraft();
      await loadReports();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirm(id) {
    await api.confirmReport(id);
    await loadReports();
  }

  async function handleDispute(id) {
    await api.disputeReport(id);
    await loadReports();
  }

  async function handleAlertAuthorities(id) {
    await api.alertAuthorities(id);
    await loadReports();
  }

  let banner = "Click a point on the map to start marking a flooded stretch.";
  if (draftStart && !draftEnd) {
    banner = "Now click the other end of the flooded stretch.";
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌊 Bahala</h1>
        <p>Community-based flood awareness map</p>
      </header>

      {error && <div className="banner banner-error">{error}</div>}
      {!error && (
        <div className="banner banner-info">
          {banner}
          {draftStart && !draftEnd && (
            <button type="button" className="banner-link" onClick={resetDraft}>
              Cancel
            </button>
          )}
        </div>
      )}

      <main className="map-wrapper">
        {loading ? (
          <div className="map-loading">Loading map...</div>
        ) : (
          <MapView
            reports={reports}
            draftStart={draftStart}
            draftEnd={draftEnd}
            onMapClick={handleMapClick}
            onConfirm={handleConfirm}
            onDispute={handleDispute}
            onAlertAuthorities={handleAlertAuthorities}
          />
        )}
        <Legend />
      </main>

      {formOpen && (
        <ReportForm
          start={draftStart}
          end={draftEnd}
          onSubmit={handleSubmitReport}
          onCancel={resetDraft}
          submitting={submitting}
        />
      )}
    </div>
  );
}

export default App;

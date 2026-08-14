import { useCallback, useEffect, useState } from "react";
import MapView from "./components/MapView";
import ReportForm from "./components/ReportForm";
import Legend from "./components/Legend";
import { api } from "./api";
import { getRoadRoute } from "./osrm";
import "./App.css";

const POLL_INTERVAL_MS = 15000;

function App() {
  const [reports, setReports] = useState([]);
  // Two-click segment drafting: first click sets draftStart, second click
  // sets draftEnd and triggers a road-route lookup. Once that resolves,
  // draftRoute holds the road-snapped path and the report form opens.
  const [draftStart, setDraftStart] = useState(null);
  const [draftEnd, setDraftEnd] = useState(null);
  const [draftRoute, setDraftRoute] = useState(null);
  const [routing, setRouting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const formOpen = Boolean(draftRoute);

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

  async function handleMapClick(latlng) {
    if (formOpen || routing) return; // busy resolving or form already open

    if (!draftStart) {
      setDraftStart(latlng);
      return;
    }

    setDraftEnd(latlng);
    setRouting(true);
    try {
      const route = await getRoadRoute(draftStart, latlng);
      setDraftRoute(route);
    } catch {
      // getRoadRoute already falls back internally, but guard against
      // unexpected throws so a flaky network doesn't strand the user.
      setDraftRoute({
        path: [draftStart, latlng],
        distanceMeters: null,
        streetName: "",
        snapped: false,
      });
    } finally {
      setRouting(false);
    }
  }

  function resetDraft() {
    setDraftStart(null);
    setDraftEnd(null);
    setDraftRoute(null);
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
  } else if (routing) {
    banner = "Finding the road between those points...";
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
          {draftStart && !formOpen && (
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
            draftPath={draftRoute?.path}
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
          route={draftRoute}
          onSubmit={handleSubmitReport}
          onCancel={resetDraft}
          submitting={submitting}
        />
      )}
    </div>
  );
}

export default App;

# Bahala — Community Flood Awareness Map

A hackathon MVP for a crowdsourced, real-time flood reporting map. Click anywhere
on the map to report flooding, see reports from other users, confirm/dispute
existing reports, and alert authorities.

## Stack

- **client/** — React + Vite, Leaflet (OpenStreetMap tiles, no API key needed)
- **server/** — Express + JSON-file storage (swap for a real DB post-hackathon)

## Running locally

Open two terminals.

**Terminal 1 — backend:**

```powershell
cd server
npm install
npm start
```

Runs on http://localhost:4000

**Terminal 2 — frontend:**

```powershell
cd client
npm install
npm run dev
```

Runs on http://localhost:5173

Open http://localhost:5173 in your browser. The client is pre-configured to
talk to the backend at `http://localhost:4000` (override via `VITE_API_URL`
in a `.env` file inside `client/` if needed).

## Features implemented

- Two-click segment reporting: click one end of the flooded stretch, then
  the other. The app looks up the actual road between those two points
  (via OSRM's public routing API) and highlights that road geometry, not
  just a straight line — so the report reflects the real street shape and
  gives a sense of how far the flooding stretches.
- Auto-fills the street name field from the matched road, editable by the user
- Falls back to a straight line between the two points if road-matching
  fails (offline, no road found, or the match seems like an unrelated detour)
- Severity levels (passable / ankle-deep / knee-deep / impassable) with
  color-coded segments on the map
- Description, street name, and reporter name fields
- Community verification: "Still flooded" / "Cleared up" buttons on each
  report, with auto-resolve once disputes clearly outweigh confirmations
- "Alert authorities" action per report
- Reports auto-flagged as stale after 6 hours without reconfirmation (faded
  on the map)
- Polling refresh every 15s so the map stays live across users

## Not implemented (good next steps / talking points for judges)

- Road-snapping relies on the free public OSRM demo server
  (router.project-osrm.org) — no API key needed, but it's rate-limited and
  not meant for heavy/production traffic. A self-hosted OSRM instance or a
  paid routing API (Mapbox, Google Roads API) would be the production move.
- OSRM routes for _driving_, so on a one-way street or a road with a
  divider, the snapped path could differ slightly from the exact lane the
  user meant.
- Persistent accounts / auth
- Push notifications for nearby or route-based flooding
- Real integration with local disaster-response agencies (currently just
  marks a report as "alerted")
- Offline/SMS fallback for when connectivity drops during a storm
- Historical flood heatmap
- A real database instead of a JSON file

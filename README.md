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
  the other. The app draws a line between them and calculates the length
  (via the haversine formula), so reports convey how far the flooding
  extends, not just a single point.
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

- Segments are drawn as straight lines between two clicked points, not
  snapped to the actual road geometry (no OSM road-network/routing data
  wired in, so a curved road would show as a straight chord)
- Persistent accounts / auth
- Push notifications for nearby or route-based flooding
- Real integration with local disaster-response agencies (currently just
  marks a report as "alerted")
- Offline/SMS fallback for when connectivity drops during a storm
- Historical flood heatmap
- A real database instead of a JSON file

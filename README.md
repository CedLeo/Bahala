# Bahala — Community Flood Awareness Map


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



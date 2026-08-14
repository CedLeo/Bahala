// Severity levels shared across the map, modal, and legend.
// Keys must match the server's SEVERITY_LEVELS in server/index.js.
export const SEVERITY = {
  passable: { label: "Passable (minor)", color: "#22c55e" },
  ankle: { label: "Ankle-deep", color: "#eab308" },
  knee: { label: "Knee-deep", color: "#f97316" },
  impassable: { label: "Impassable", color: "#ef4444" },
};

export const SEVERITY_ORDER = ["passable", "ankle", "knee", "impassable"];

// Default map center: Quezon City, Metro Manila.
export const DEFAULT_CENTER = [14.676, 121.0437];
export const DEFAULT_ZOOM = 13;

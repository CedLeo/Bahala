// Road-snapping via OSRM's public routing API (no API key required).
// Given two points, returns the actual road geometry between them instead
// of a straight line, so a flood report follows the street it's on.
//
// Public demo server: https://project-osrm.org/ - fine for a hackathon demo,
// but it's rate-limited and not meant for production traffic. Swap for a
// self-hosted OSRM instance or a paid routing API before shipping for real.
const OSRM_BASE = "https://router.project-osrm.org";

// If the routed distance is much longer than the straight-line distance
// between the two clicked points, the "road route" likely detoured around
// a one-way street or routing quirk rather than tracing the road the user
// meant. Past this ratio we fall back to a straight line instead.
const MAX_DETOUR_RATIO = 2.5;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function haversineMeters(a, b) {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

/**
 * Fetch the road-snapped path between two points.
 * @param {{lat:number, lng:number}} start
 * @param {{lat:number, lng:number}} end
 * @returns {Promise<{ path: {lat:number, lng:number}[], distanceMeters: number, streetName: string, snapped: boolean }>}
 */
export async function getRoadRoute(start, end) {
  const straightLineMeters = haversineMeters(start, end);
  const fallback = {
    path: [start, end],
    distanceMeters: straightLineMeters,
    streetName: "",
    snapped: false,
  };

  const url =
    `${OSRM_BASE}/route/v1/driving/` +
    `${start.lng},${start.lat};${end.lng},${end.lat}` +
    `?overview=full&geometries=geojson&steps=true`;

  let data;
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    data = await res.json();
  } catch {
    return fallback; // offline / network error - degrade gracefully
  }

  if (data.code !== "Ok" || !data.routes?.length) return fallback;

  const route = data.routes[0];
  if (route.distance > straightLineMeters * MAX_DETOUR_RATIO) {
    return fallback; // routed path detoured too far from what the user pointed at
  }

  const path = route.geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));

  // Pull the most prominent street name out of the route's turn-by-turn steps.
  const names = (route.legs || [])
    .flatMap((leg) => leg.steps || [])
    .map((step) => step.name)
    .filter(Boolean);
  const streetName = names[0] || "";

  return {
    path,
    distanceMeters: route.distance,
    streetName,
    snapped: true,
  };
}

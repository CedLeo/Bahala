import { LatLng } from '@/types/flood';

/**
 * Road segment result from the road-matching service.
 */
export interface RoadSegmentResult {
  /** Identified road/street name */
  roadName: string;
  /** The polyline geometry that follows the actual road between start and end */
  geometry: LatLng[];
  /** Estimated distance in meters */
  distanceMeters: number;
  /** Whether the result was matched to an actual road */
  isExactMatch: boolean;
}

/**
 * Get the road segment geometry between two points.
 *
 * Uses the public OSRM (Open Source Routing Machine) demo server
 * to get actual road-snapped geometry. This means the polyline
 * follows the real road shape — highways, curves, intersections.
 *
 * To use a self-hosted OSRM instance or a different provider,
 * just change the base URL.
 */
export async function getRoadSegmentBetweenPoints(
  pointA: LatLng,
  pointB: LatLng
): Promise<RoadSegmentResult> {
  try {
    // OSRM expects coordinates as lng,lat (not lat,lng)
    const coordsStr = `${pointA[1]},${pointA[0]};${pointB[1]},${pointB[0]}`;
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson&steps=true`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OSRM returned ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error('No route found');
    }

    const route = data.routes[0];
    const geoJsonCoords: [number, number][] = route.geometry.coordinates;

    // GeoJSON is [lng, lat] — convert to [lat, lng] for Leaflet
    const geometry: LatLng[] = geoJsonCoords.map(
      ([lng, lat]) => [lat, lng] as LatLng
    );

    // Try to extract road name from steps
    const roadName = extractRoadName(data.routes[0].legs);

    const distanceMeters = Math.round(route.distance);

    return {
      roadName,
      geometry,
      distanceMeters,
      isExactMatch: true,
    };
  } catch (error) {
    // Fallback: if OSRM is unavailable, use a simple interpolation
    console.warn('OSRM routing failed, using fallback:', error);
    return generateFallbackSegment(pointA, pointB);
  }
}

/**
 * Extract the most prominent road name from OSRM route legs/steps.
 */
function extractRoadName(legs: any[]): string {
  if (!legs || legs.length === 0) return 'Unknown Road';

  // Collect all road names from steps, find the longest segment
  const nameDistances: Record<string, number> = {};

  for (const leg of legs) {
    if (!leg.steps) continue;
    for (const step of leg.steps) {
      const name = step.name;
      if (name && name.trim() !== '') {
        nameDistances[name] = (nameDistances[name] || 0) + (step.distance || 0);
      }
    }
  }

  // Return the road name with the longest distance
  let bestName = 'Unknown Road';
  let bestDist = 0;
  for (const [name, dist] of Object.entries(nameDistances)) {
    if (dist > bestDist) {
      bestDist = dist;
      bestName = name;
    }
  }

  return bestName;
}

/**
 * Attempt to identify the nearest road name to a given point
 * using Nominatim reverse geocoding.
 */
export async function getRoadNameAtPoint(point: LatLng): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${point[0]}&lon=${point[1]}&format=json&zoom=17`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'BahalaFloodApp/1.0' },
    });
    const data = await response.json();
    return data.address?.road || data.display_name?.split(',')[0] || 'Unknown Road';
  } catch {
    return 'Unknown Road';
  }
}

/**
 * Calculate distance between two points using Haversine formula.
 */
export function calculateDistance(pointA: LatLng, pointB: LatLng): number {
  const R = 6371000;
  const dLat = ((pointB[0] - pointA[0]) * Math.PI) / 180;
  const dLon = ((pointB[1] - pointA[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((pointA[0] * Math.PI) / 180) *
      Math.cos((pointB[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ─── FALLBACK (when OSRM is unreachable) ─────────────────────────────────────

function generateFallbackSegment(pointA: LatLng, pointB: LatLng): RoadSegmentResult {
  // Simple linear interpolation with enough points for smooth rendering
  const numPoints = 10;
  const geometry: LatLng[] = [];

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    geometry.push([
      pointA[0] + (pointB[0] - pointA[0]) * t,
      pointA[1] + (pointB[1] - pointA[1]) * t,
    ]);
  }

  return {
    roadName: 'Road location selected',
    geometry,
    distanceMeters: Math.round(calculateDistance(pointA, pointB)),
    isExactMatch: false,
  };
}

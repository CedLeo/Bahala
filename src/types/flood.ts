export type FloodSeverity = 'passable' | 'minor' | 'moderate' | 'severe';

export type WaterDepth =
  | 'no-standing-water'
  | 'ankle-deep'
  | 'knee-deep'
  | 'waist-deep'
  | 'above-waist';

export type FloodTrend = 'rising' | 'same' | 'receding';

export type ReportStatus = 'active' | 'aging' | 'outdated';

export type ReportFreshnessLevel = 'fresh' | 'aging' | 'outdated';

/** A coordinate pair [latitude, longitude] */
export type LatLng = [number, number];

export interface FloodReport {
  id: string;
  latitude: number;
  longitude: number;
  location: string;
  /** Road/street name for display */
  road: string;
  /** Polyline coordinates representing the affected road segment */
  roadGeometry: LatLng[];
  severity: FloodSeverity;
  waterDepth: WaterDepth;
  trend: FloodTrend;
  description: string;
  image?: string;
  reportedAt: string; // ISO date string
  confirmations: number;
  disputes: number;
  status: ReportStatus;
}

export interface FloodReportFormData {
  latitude: number;
  longitude: number;
  location: string;
  road: string;
  /** Optional pre-computed road geometry from Point A → B selection */
  roadGeometry?: LatLng[];
  severity: FloodSeverity;
  waterDepth: WaterDepth;
  trend: FloodTrend;
  description: string;
  image?: File | null;
}

// Display helpers
export const SEVERITY_CONFIG: Record<
  FloodSeverity,
  { label: string; color: string; bgColor: string; borderColor: string; markerColor: string }
> = {
  passable: {
    label: 'Passable',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    markerColor: '#22c55e',
  },
  minor: {
    label: 'Minor Flooding',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
    markerColor: '#eab308',
  },
  moderate: {
    label: 'Moderate Flooding',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
    markerColor: '#f97316',
  },
  severe: {
    label: 'Severe Flooding',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    markerColor: '#ef4444',
  },
};

export const WATER_DEPTH_LABELS: Record<WaterDepth, string> = {
  'no-standing-water': 'No standing water',
  'ankle-deep': 'Ankle-deep',
  'knee-deep': 'Knee-deep',
  'waist-deep': 'Waist-deep',
  'above-waist': 'Above waist',
};

export const TREND_CONFIG: Record<
  FloodTrend,
  { label: string; icon: string; color: string }
> = {
  rising: { label: 'Rising', icon: '⬆️', color: 'text-red-600' },
  same: { label: 'Same level', icon: '➡️', color: 'text-yellow-600' },
  receding: { label: 'Receding', icon: '⬇️', color: 'text-green-600' },
};

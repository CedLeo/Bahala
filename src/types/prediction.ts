import { FloodSeverity, LatLng } from './flood';

export type PredictionConfidence = 'low' | 'moderate' | 'high';

export interface FloodPrediction {
  id: string;
  road: string;
  location: string;
  latitude: number;
  longitude: number;
  /** Predicted road segment geometry (dashed line on map) */
  roadGeometry: LatLng[];
  currentRisk: FloodSeverity;
  predictedRisk: FloodSeverity;
  trend: 'increasing' | 'stable' | 'decreasing';
  confidence: number; // 0-100
  estimatedTime: string; // e.g. "Next 2 hours"
  basedOn: string; // explanation of prediction basis
}

export const PREDICTION_TREND_CONFIG: Record<
  FloodPrediction['trend'],
  { label: string; icon: string; color: string }
> = {
  increasing: { label: 'Increasing', icon: '⬆️', color: 'text-red-600' },
  stable: { label: 'Stable', icon: '➡️', color: 'text-yellow-600' },
  decreasing: { label: 'Decreasing', icon: '⬇️', color: 'text-green-600' },
};

import { WaterDepth } from '@/types/flood';

export { getFreshnessOpacity, getTimeAgo, calculateConfidence } from './utils';

export const WATER_DEPTH_LABELS_MAP: Record<WaterDepth, string> = {
  'no-standing-water': 'No standing water',
  'ankle-deep': 'Ankle-deep',
  'knee-deep': 'Knee-deep',
  'waist-deep': 'Waist-deep',
  'above-waist': 'Above waist',
};

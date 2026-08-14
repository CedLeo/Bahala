'use client';

import { createContext, useContext } from 'react';
import { FloodReport, FloodReportFormData } from '@/types/flood';
import { EvacuationCenter } from '@/types/evacuation';
import { FloodPrediction } from '@/types/prediction';
import { SOSAlert, SOSStatus } from '@/types/sos';
import { generateId } from './utils';

export interface FloodStore {
  reports: FloodReport[];
  evacuationCenters: EvacuationCenter[];
  predictions: FloodPrediction[];
  sosAlert: SOSAlert | null;
  addReport: (data: FloodReportFormData) => void;
  confirmReport: (id: string) => void;
  disputeReport: (id: string) => void;
  getReportById: (id: string) => FloodReport | undefined;
  activateSOS: (lat: number, lng: number) => void;
  cancelSOS: () => void;
}

export const FloodStoreContext = createContext<FloodStore | null>(null);

export function useFloodStore(): FloodStore {
  const store = useContext(FloodStoreContext);
  if (!store) {
    throw new Error('useFloodStore must be used within a FloodStoreProvider');
  }
  return store;
}

/**
 * Create a new FloodReport from form data.
 */
export function createReportFromFormData(data: FloodReportFormData): FloodReport {
  const lat = data.latitude;
  const lng = data.longitude;

  // Generate a simple road geometry line (short segment around the point)
  const offset = 0.002;
  const roadGeometry: [number, number][] = [
    [lat, lng - offset],
    [lat, lng - offset / 2],
    [lat, lng],
    [lat, lng + offset / 2],
    [lat, lng + offset],
  ];

  return {
    id: generateId(),
    latitude: lat,
    longitude: lng,
    location: data.location,
    road: data.road || data.location,
    roadGeometry,
    severity: data.severity,
    waterDepth: data.waterDepth,
    trend: data.trend,
    description: data.description,
    image: data.image ? URL.createObjectURL(data.image) : undefined,
    reportedAt: new Date().toISOString(),
    confirmations: 1,
    disputes: 0,
    status: 'active',
  };
}

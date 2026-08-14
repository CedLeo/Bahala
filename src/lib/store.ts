'use client';

/**
 * Simple client-side store for managing flood reports in the MVP.
 * This uses React context + state so it can easily be replaced
 * with a real backend later.
 */

import { createContext, useContext } from 'react';
import { FloodReport, FloodReportFormData } from '@/types/flood';
import { generateId } from './utils';

export interface FloodStore {
  reports: FloodReport[];
  addReport: (data: FloodReportFormData) => void;
  confirmReport: (id: string) => void;
  disputeReport: (id: string) => void;
  getReportById: (id: string) => FloodReport | undefined;
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
  return {
    id: generateId(),
    latitude: data.latitude,
    longitude: data.longitude,
    location: data.location,
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

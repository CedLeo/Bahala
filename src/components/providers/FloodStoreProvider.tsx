'use client';

import { useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { FloodStoreContext, createReportFromFormData } from '@/lib/store';
import { FloodReport, FloodReportFormData } from '@/types/flood';
import { EvacuationCenter } from '@/types/evacuation';
import { SOSAlert } from '@/types/sos';
import { mockReports } from '@/data/mockReports';
import { mockEvacuationCenters } from '@/data/mockEvacuationCenters';
import { mockPredictions } from '@/data/mockPredictions';
import { generateId } from '@/lib/utils';
import {
  fetchFloodReports,
  insertFloodReport,
  confirmFloodReport as confirmReportDb,
  disputeFloodReport as disputeReportDb,
  fetchEvacuationCenters,
  createSOSAlert,
  cancelSOSAlert,
  uploadReportImage,
} from '@/lib/supabaseService';

interface Props {
  children: ReactNode;
}

/**
 * Check if Supabase is configured (env vars are set to real values).
 */
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(
    url &&
    key &&
    url !== 'your-supabase-url-here' &&
    key !== 'your-supabase-anon-key-here'
  );
}

export default function FloodStoreProvider({ children }: Props) {
  const [reports, setReports] = useState<FloodReport[]>(mockReports);
  const [evacuationCenters, setEvacuationCenters] = useState<EvacuationCenter[]>(mockEvacuationCenters);
  const [sosAlert, setSOSAlert] = useState<SOSAlert | null>(null);
  const [isDbConnected, setIsDbConnected] = useState(false);

  // Load data from Supabase on mount (if configured)
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    async function loadFromSupabase() {
      try {
        const [dbReports, dbEvacCenters] = await Promise.all([
          fetchFloodReports(),
          fetchEvacuationCenters(),
        ]);

        if (dbReports.length > 0) {
          setReports(dbReports);
        }
        if (dbEvacCenters.length > 0) {
          setEvacuationCenters(dbEvacCenters);
        }

        setIsDbConnected(true);
      } catch (err) {
        console.warn('Supabase not available, using mock data:', err);
      }
    }

    loadFromSupabase();
  }, []);

  const addReport = useCallback(
    async (data: FloodReportFormData) => {
      // Create local report immediately (optimistic update)
      const newReport = createReportFromFormData(data);
      setReports((prev) => [newReport, ...prev]);

      // Persist to Supabase if connected
      if (isSupabaseConfigured()) {
        try {
          const geometry = data.roadGeometry || newReport.roadGeometry;
          const dbReport = await insertFloodReport(data, geometry);

          if (dbReport) {
            // Upload image if provided
            if (data.image) {
              const imageUrl = await uploadReportImage(data.image, dbReport.id);
              if (imageUrl) {
                dbReport.image = imageUrl;
              }
            }

            // Replace optimistic report with DB version (has real UUID)
            setReports((prev) =>
              prev.map((r) => (r.id === newReport.id ? dbReport : r))
            );
          }
        } catch (err) {
          console.warn('Failed to persist report to Supabase:', err);
          // Optimistic report remains in local state
        }
      }
    },
    []
  );

  const confirmReport = useCallback((id: string) => {
    // Optimistic update
    setReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? { ...report, confirmations: report.confirmations + 1 }
          : report
      )
    );

    // Persist to DB
    if (isSupabaseConfigured()) {
      confirmReportDb(id).catch((err) =>
        console.warn('Failed to confirm report in DB:', err)
      );
    }
  }, []);

  const disputeReport = useCallback((id: string) => {
    // Optimistic update
    setReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? { ...report, disputes: report.disputes + 1 }
          : report
      )
    );

    // Persist to DB
    if (isSupabaseConfigured()) {
      disputeReportDb(id).catch((err) =>
        console.warn('Failed to dispute report in DB:', err)
      );
    }
  }, []);

  const getReportById = useCallback(
    (id: string) => reports.find((r) => r.id === id),
    [reports]
  );

  const activateSOS = useCallback(async (lat: number, lng: number) => {
    const localAlert: SOSAlert = {
      id: generateId(),
      latitude: lat,
      longitude: lng,
      activatedAt: new Date().toISOString(),
      status: 'active',
    };
    setSOSAlert(localAlert);

    if (isSupabaseConfigured()) {
      try {
        const dbAlert = await createSOSAlert(lat, lng);
        if (dbAlert) {
          setSOSAlert(dbAlert);
        }
      } catch (err) {
        console.warn('Failed to create SOS in DB:', err);
      }
    }
  }, []);

  const cancelSOS = useCallback(() => {
    if (sosAlert && isSupabaseConfigured()) {
      cancelSOSAlert(sosAlert.id).catch((err) =>
        console.warn('Failed to cancel SOS in DB:', err)
      );
    }
    setSOSAlert(null);
  }, [sosAlert]);

  const store = useMemo(
    () => ({
      reports,
      evacuationCenters,
      predictions: mockPredictions,
      sosAlert,
      addReport,
      confirmReport,
      disputeReport,
      getReportById,
      activateSOS,
      cancelSOS,
    }),
    [reports, evacuationCenters, sosAlert, addReport, confirmReport, disputeReport, getReportById, activateSOS, cancelSOS]
  );

  return (
    <FloodStoreContext.Provider value={store}>
      {children}
    </FloodStoreContext.Provider>
  );
}

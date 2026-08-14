'use client';

import { useState, useCallback, useMemo, useEffect, useRef, ReactNode } from 'react';
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

const STORAGE_KEY = 'bahala_reports';

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(url && key && !url.includes('your-supabase'));
}

/**
 * Load reports from localStorage (fallback persistence).
 */
function loadLocalReports(): FloodReport[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

/**
 * Save reports to localStorage.
 */
function saveLocalReports(reports: FloodReport[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch {}
}

export default function FloodStoreProvider({ children }: Props) {
  const [reports, setReports] = useState<FloodReport[]>(mockReports);
  const [evacuationCenters, setEvacuationCenters] = useState<EvacuationCenter[]>(mockEvacuationCenters);
  const [sosAlert, setSOSAlert] = useState<SOSAlert | null>(null);
  const initialized = useRef(false);

  // On mount: load from localStorage first (instant), then try Supabase
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // 1. Load from localStorage for instant display
    const localReports = loadLocalReports();
    if (localReports && localReports.length > 0) {
      setReports(localReports);
    }

    // 2. If Supabase is configured, fetch from DB (overrides local)
    if (isSupabaseConfigured()) {
      fetchFloodReports().then((dbReports) => {
        if (dbReports.length > 0) {
          setReports(dbReports);
          saveLocalReports(dbReports);
        }
      }).catch(() => {});

      fetchEvacuationCenters().then((dbCenters) => {
        if (dbCenters.length > 0) {
          setEvacuationCenters(dbCenters);
        }
      }).catch(() => {});
    }
  }, []);

  // Save to localStorage whenever reports change
  useEffect(() => {
    if (initialized.current) {
      saveLocalReports(reports);
    }
  }, [reports]);

  const addReport = useCallback((data: FloodReportFormData) => {
    // Create report and add to state immediately (synchronous)
    const newReport = createReportFromFormData(data);
    setReports((prev) => [newReport, ...prev]);

    // Persist to Supabase in the background (non-blocking)
    if (isSupabaseConfigured()) {
      const geometry = data.roadGeometry || newReport.roadGeometry;
      insertFloodReport(data, geometry).then(async (dbReport) => {
        if (dbReport) {
          // Upload image if provided
          if (data.image) {
            const imageUrl = await uploadReportImage(data.image, dbReport.id);
            if (imageUrl) {
              dbReport.image = imageUrl;
              // Update the image_url in supabase
              const { supabase: sb } = await import('@/lib/supabase');
              if (sb) {
                await sb
                  .from('flood_reports')
                  .update({ image_url: imageUrl })
                  .eq('id', dbReport.id);
              }
            }
          }
          // Replace optimistic report with DB version
          setReports((prev) =>
            prev.map((r) => (r.id === newReport.id ? dbReport : r))
          );
        }
      }).catch((err) => {
        console.warn('Failed to persist report:', err);
      });
    }
  }, []);

  const confirmReport = useCallback((id: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? { ...report, confirmations: report.confirmations + 1 }
          : report
      )
    );
    if (isSupabaseConfigured()) {
      confirmReportDb(id).catch(() => {});
    }
  }, []);

  const disputeReport = useCallback((id: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? { ...report, disputes: report.disputes + 1 }
          : report
      )
    );
    if (isSupabaseConfigured()) {
      disputeReportDb(id).catch(() => {});
    }
  }, []);

  const getReportById = useCallback(
    (id: string) => reports.find((r) => r.id === id),
    [reports]
  );

  const activateSOS = useCallback((lat: number, lng: number) => {
    const localAlert: SOSAlert = {
      id: generateId(),
      latitude: lat,
      longitude: lng,
      activatedAt: new Date().toISOString(),
      status: 'active',
    };
    setSOSAlert(localAlert);

    if (isSupabaseConfigured()) {
      createSOSAlert(lat, lng).then((dbAlert) => {
        if (dbAlert) setSOSAlert(dbAlert);
      }).catch(() => {});
    }
  }, []);

  const cancelSOS = useCallback(() => {
    if (sosAlert && isSupabaseConfigured()) {
      cancelSOSAlert(sosAlert.id).catch(() => {});
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

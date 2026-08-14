'use client';

import { useState, useCallback, useMemo, ReactNode } from 'react';
import { FloodStoreContext, createReportFromFormData } from '@/lib/store';
import { FloodReport, FloodReportFormData } from '@/types/flood';
import { SOSAlert } from '@/types/sos';
import { mockReports } from '@/data/mockReports';
import { mockEvacuationCenters } from '@/data/mockEvacuationCenters';
import { mockPredictions } from '@/data/mockPredictions';
import { generateId } from '@/lib/utils';

interface Props {
  children: ReactNode;
}

export default function FloodStoreProvider({ children }: Props) {
  const [reports, setReports] = useState<FloodReport[]>(mockReports);
  const [sosAlert, setSOSAlert] = useState<SOSAlert | null>(null);

  const addReport = useCallback((data: FloodReportFormData) => {
    const newReport = createReportFromFormData(data);
    setReports((prev) => [newReport, ...prev]);
  }, []);

  const confirmReport = useCallback((id: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? { ...report, confirmations: report.confirmations + 1 }
          : report
      )
    );
  }, []);

  const disputeReport = useCallback((id: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? { ...report, disputes: report.disputes + 1 }
          : report
      )
    );
  }, []);

  const getReportById = useCallback(
    (id: string) => reports.find((r) => r.id === id),
    [reports]
  );

  const activateSOS = useCallback((lat: number, lng: number) => {
    setSOSAlert({
      id: generateId(),
      latitude: lat,
      longitude: lng,
      activatedAt: new Date().toISOString(),
      status: 'active',
    });
  }, []);

  const cancelSOS = useCallback(() => {
    setSOSAlert(null);
  }, []);

  const store = useMemo(
    () => ({
      reports,
      evacuationCenters: mockEvacuationCenters,
      predictions: mockPredictions,
      sosAlert,
      addReport,
      confirmReport,
      disputeReport,
      getReportById,
      activateSOS,
      cancelSOS,
    }),
    [reports, sosAlert, addReport, confirmReport, disputeReport, getReportById, activateSOS, cancelSOS]
  );

  return (
    <FloodStoreContext.Provider value={store}>
      {children}
    </FloodStoreContext.Provider>
  );
}

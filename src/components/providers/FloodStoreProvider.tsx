'use client';

import { useState, useCallback, useMemo, ReactNode } from 'react';
import { FloodStoreContext, createReportFromFormData } from '@/lib/store';
import { FloodReport, FloodReportFormData } from '@/types/flood';
import { mockReports } from '@/data/mockReports';

interface Props {
  children: ReactNode;
}

export default function FloodStoreProvider({ children }: Props) {
  const [reports, setReports] = useState<FloodReport[]>(mockReports);

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

  const store = useMemo(
    () => ({ reports, addReport, confirmReport, disputeReport, getReportById }),
    [reports, addReport, confirmReport, disputeReport, getReportById]
  );

  return (
    <FloodStoreContext.Provider value={store}>
      {children}
    </FloodStoreContext.Provider>
  );
}

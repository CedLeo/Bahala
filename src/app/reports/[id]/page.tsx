'use client';

import { use } from 'react';
import ReportDetailView from '@/components/reports/ReportDetailView';

export default function ReportDetailPage(props: PageProps<'/reports/[id]'>) {
  const { id } = use(props.params);
  return <ReportDetailView reportId={id} />;
}

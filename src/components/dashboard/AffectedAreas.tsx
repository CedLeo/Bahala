'use client';

import { FloodReport, SEVERITY_CONFIG } from '@/types/flood';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface Props {
  reports: FloodReport[];
}

export default function AffectedAreas({ reports }: Props) {
  // Extract city/area from location and count reports
  const areaCounts = getAreaData(reports);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Most Affected Areas</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={areaCounts} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="area"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              width={100}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Reports">
              {areaCounts.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.maxSeverity)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function getAreaData(reports: FloodReport[]) {
  const areaMap: Record<string, { count: number; maxSeverity: string }> = {};

  reports.forEach((report) => {
    // Extract city from location (after last comma, or the whole thing)
    const parts = report.location.split(',');
    const area = parts.length > 1 ? parts[parts.length - 1].trim() : parts[0].trim();

    if (!areaMap[area]) {
      areaMap[area] = { count: 0, maxSeverity: 'passable' };
    }
    areaMap[area].count++;

    // Track worst severity
    const severityOrder = ['passable', 'minor', 'moderate', 'severe'];
    const currentIdx = severityOrder.indexOf(areaMap[area].maxSeverity);
    const newIdx = severityOrder.indexOf(report.severity);
    if (newIdx > currentIdx) {
      areaMap[area].maxSeverity = report.severity;
    }
  });

  return Object.entries(areaMap)
    .map(([area, data]) => ({ area, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

function getBarColor(severity: string): string {
  return SEVERITY_CONFIG[severity as keyof typeof SEVERITY_CONFIG]?.markerColor || '#94a3b8';
}

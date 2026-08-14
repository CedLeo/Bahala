'use client';

import { FloodReport, SEVERITY_CONFIG, FloodSeverity } from '@/types/flood';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

interface Props {
  reports: FloodReport[];
}

export default function ReportsBySeverity({ reports }: Props) {
  const severityCounts = (Object.keys(SEVERITY_CONFIG) as FloodSeverity[]).map((severity) => ({
    name: SEVERITY_CONFIG[severity].label,
    value: reports.filter((r) => r.severity === severity).length,
    color: SEVERITY_CONFIG[severity].markerColor,
  }));

  // Filter out zero-value entries
  const data = severityCounts.filter((d) => d.value > 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Reports by Severity</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={10}
              formatter={(value) => (
                <span className="text-xs text-slate-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

'use client';

import { FloodReport } from '@/types/flood';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  reports: FloodReport[];
}

export default function ReportsOverTime({ reports }: Props) {
  // Group reports by hour for a timeline view
  const hourlyData = getHourlyData(reports);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Reports Over Time (Today)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6, fill: '#2563eb' }}
              name="Reports"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function getHourlyData(reports: FloodReport[]) {
  const now = new Date();
  const hoursBack = 12;
  const hourlyMap: Record<string, number> = {};

  // Initialize hours
  for (let i = hoursBack; i >= 0; i--) {
    const hour = new Date(now);
    hour.setHours(hour.getHours() - i);
    const key = hour.toLocaleTimeString('en-PH', { hour: 'numeric', hour12: true });
    hourlyMap[key] = 0;
  }

  // Count reports per hour
  reports.forEach((report) => {
    const reportDate = new Date(report.reportedAt);
    const diffHours = (now.getTime() - reportDate.getTime()) / (1000 * 60 * 60);
    if (diffHours <= hoursBack) {
      const key = reportDate.toLocaleTimeString('en-PH', { hour: 'numeric', hour12: true });
      if (hourlyMap[key] !== undefined) {
        hourlyMap[key]++;
      }
    }
  });

  return Object.entries(hourlyMap).map(([hour, count]) => ({
    hour,
    count,
  }));
}

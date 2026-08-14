'use client';

import { useFloodStore } from '@/lib/store';
import StatCard from '@/components/dashboard/StatCard';
import ReportsBySeverity from '@/components/dashboard/ReportsBySeverity';
import ReportsOverTime from '@/components/dashboard/ReportsOverTime';
import AffectedAreas from '@/components/dashboard/AffectedAreas';
import { AlertTriangle, FileText, TrendingUp, MapPin } from 'lucide-react';

export default function DashboardPage() {
  const { reports } = useFloodStore();

  const activeReports = reports.length;
  const severeReports = reports.filter((r) => r.severity === 'severe').length;
  const risingReports = reports.filter((r) => r.trend === 'rising').length;

  // Count unique areas
  const uniqueAreas = new Set(
    reports.map((r) => {
      const parts = r.location.split(',');
      return parts.length > 1 ? parts[parts.length - 1].trim() : parts[0].trim();
    })
  ).size;

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Flood Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Overview of current flood conditions and community reports.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Active Reports"
          value={activeReports}
          icon={<FileText className="w-5 h-5 text-blue-600" />}
          color="bg-blue-50"
          subtitle="Total flood reports"
        />
        <StatCard
          title="Severe Flooding"
          value={severeReports}
          icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
          color="bg-red-50"
          subtitle="Requires immediate attention"
        />
        <StatCard
          title="Rising Waters"
          value={risingReports}
          icon={<TrendingUp className="w-5 h-5 text-orange-600" />}
          color="bg-orange-50"
          subtitle="Conditions worsening"
        />
        <StatCard
          title="Areas Affected"
          value={uniqueAreas}
          icon={<MapPin className="w-5 h-5 text-purple-600" />}
          color="bg-purple-50"
          subtitle="Unique locations reported"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ReportsBySeverity reports={reports} />
        <ReportsOverTime reports={reports} />
      </div>

      {/* Affected Areas - Full width */}
      <AffectedAreas reports={reports} />
    </div>
  );
}

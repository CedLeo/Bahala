'use client';

import { useFloodStore } from '@/lib/store';
import StatCard from '@/components/dashboard/StatCard';
import ReportsBySeverity from '@/components/dashboard/ReportsBySeverity';
import ReportsOverTime from '@/components/dashboard/ReportsOverTime';
import AffectedAreas from '@/components/dashboard/AffectedAreas';
import { AlertTriangle, FileText, TrendingUp, MapPin, Home, Siren, Brain } from 'lucide-react';
import FloodPredictionCard from '@/components/prediction/FloodPredictionCard';

export default function DashboardPage() {
  const { reports, evacuationCenters, predictions, sosAlert } = useFloodStore();

  const activeReports = reports.length;
  const severeReports = reports.filter((r) => r.severity === 'severe').length;
  const risingReports = reports.filter((r) => r.trend === 'rising').length;
  const openEvacCenters = evacuationCenters.filter((c) => c.status === 'open').length;

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
          Overview of current flood conditions, evacuation resources, and community reports.
        </p>
      </div>

      {/* Active SOS Alert */}
      {sosAlert && sosAlert.status === 'active' && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-red-700">Active SOS Alert in progress</span>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard
          title="Flooded Roads"
          value={activeReports}
          icon={<FileText className="w-5 h-5 text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          title="Severe"
          value={severeReports}
          icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
          color="bg-red-50"
        />
        <StatCard
          title="Rising Waters"
          value={risingReports}
          icon={<TrendingUp className="w-5 h-5 text-orange-600" />}
          color="bg-orange-50"
        />
        <StatCard
          title="Areas Affected"
          value={uniqueAreas}
          icon={<MapPin className="w-5 h-5 text-purple-600" />}
          color="bg-purple-50"
        />
        <StatCard
          title="Open Shelters"
          value={openEvacCenters}
          icon={<Home className="w-5 h-5 text-green-600" />}
          color="bg-green-50"
        />
        <StatCard
          title="Active SOS"
          value={sosAlert ? 1 : 0}
          icon={<Siren className="w-5 h-5 text-red-600" />}
          color="bg-red-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ReportsBySeverity reports={reports} />
        <ReportsOverTime reports={reports} />
      </div>

      {/* Affected Areas */}
      <AffectedAreas reports={reports} />

      {/* AI Predictions Section */}
      {predictions.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-slate-900">AI Flood Risk Predictions</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            AI-assisted flood risk estimates based on community reports, water level trends, and historical patterns.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {predictions.map((prediction, idx) => (
              <FloodPredictionCard key={prediction.id} prediction={prediction} index={idx} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

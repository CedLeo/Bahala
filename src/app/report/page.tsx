'use client';

import FloodReportForm from '@/components/reports/FloodReportForm';
import Card from '@/components/ui/Card';
import { AlertTriangle } from 'lucide-react';

export default function ReportPage() {
  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Report Flooding</h1>
        <p className="text-slate-500 mt-1">
          Help your community by reporting current flood conditions in your area.
        </p>
      </div>

      {/* Safety Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-6">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Safety First</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Only report if it is safe to do so. Do not enter floodwaters to take photos or verify conditions.
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <FloodReportForm />
      </Card>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { FloodReport, WATER_DEPTH_LABELS } from '@/types/flood';
import FloodSeverityBadge from './FloodSeverityBadge';
import FloodTrendBadge from './FloodTrendBadge';
import ReportFreshness from './ReportFreshness';
import CommunityConfidence from './CommunityConfidence';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  report: FloodReport;
  index?: number;
}

export default function FloodReportCard({ report, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/reports/${report.id}`} className="block group">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all p-4 sm:p-5">
          <div className="flex gap-4">
            {/* Image thumbnail */}
            {report.image && (
              <div className="hidden sm:block w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="text-2xl">🌊</span>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header row */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <FloodSeverityBadge severity={report.severity} size="sm" />
                <ReportFreshness reportedAt={report.reportedAt} showLabel={false} />
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 mb-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <h3 className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                  {report.road}
                  <span className="text-xs font-normal text-slate-400 ml-1.5">{report.location}</span>
                </h3>
              </div>

              {/* Flood Pulse Row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mb-3">
                <span className="text-slate-600">
                  🌊 {WATER_DEPTH_LABELS[report.waterDepth]}
                </span>
                <FloodTrendBadge trend={report.trend} />
              </div>

              {/* Confidence */}
              <CommunityConfidence
                confirmations={report.confirmations}
                disputes={report.disputes}
                compact
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

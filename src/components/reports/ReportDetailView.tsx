'use client';

import { useFloodStore } from '@/lib/store';
import { WATER_DEPTH_LABELS, SEVERITY_CONFIG } from '@/types/flood';
import { getTimeAgo, calculateConfidence, formatReportDate } from '@/lib/utils';
import FloodSeverityBadge from './FloodSeverityBadge';
import FloodTrendBadge from './FloodTrendBadge';
import ReportFreshness from './ReportFreshness';
import CommunityConfidence from './CommunityConfidence';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import { MapPin, ArrowLeft, ThumbsUp, ThumbsDown, Droplets } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  reportId: string;
}

export default function ReportDetailView({ reportId }: Props) {
  const { getReportById, confirmReport, disputeReport } = useFloodStore();
  const report = getReportById(reportId);
  const [hasVoted, setHasVoted] = useState<'confirm' | 'dispute' | null>(null);

  if (!report) {
    return (
      <div className="max-w-2xl mx-auto w-full px-4 py-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">❓</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Report Not Found</h1>
        <p className="text-slate-500 mb-4">This flood report may have been removed or doesn&apos;t exist.</p>
        <Link href="/reports">
          <Button variant="secondary">
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </Button>
        </Link>
      </div>
    );
  }

  const handleConfirm = () => {
    if (hasVoted) return;
    confirmReport(report.id);
    setHasVoted('confirm');
  };

  const handleDispute = () => {
    if (hasVoted) return;
    disputeReport(report.id);
    setHasVoted('dispute');
  };

  const severityConfig = SEVERITY_CONFIG[report.severity];

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8">
      {/* Back link */}
      <Link
        href="/reports"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Reports
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Hero/Image area */}
        {report.image && (
          <div className="w-full h-48 sm:h-64 rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <div className="text-center">
              <span className="text-5xl">🌊</span>
              <p className="text-sm text-blue-600 mt-2 font-medium">Flood photo</p>
            </div>
          </div>
        )}

        {/* Main info card */}
        <Card className="mb-4">
          {/* Severity header */}
          <div
            className={`-mx-4 -mt-4 sm:-mx-6 sm:-mt-6 px-4 sm:px-6 py-4 rounded-t-xl border-b ${severityConfig.bgColor} ${severityConfig.borderColor}`}
          >
            <div className="flex items-center justify-between">
              <FloodSeverityBadge severity={report.severity} size="lg" />
              <ReportFreshness reportedAt={report.reportedAt} />
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 mt-4 mb-4">
            <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <h1 className="text-lg font-bold text-slate-900">{report.location}</h1>
              <p className="text-xs text-slate-400">
                {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Flood Pulse */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-slate-500 font-medium">Water Level</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">
                {WATER_DEPTH_LABELS[report.waterDepth]}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm">📈</span>
                <span className="text-xs text-slate-500 font-medium">Trend</span>
              </div>
              <FloodTrendBadge trend={report.trend} />
            </div>
          </div>

          {/* Description */}
          {report.description && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-1">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{report.description}</p>
            </div>
          )}

          {/* Reported time */}
          <div className="text-xs text-slate-400 border-t border-slate-100 pt-3">
            Reported on {formatReportDate(report.reportedAt)}
          </div>
        </Card>

        {/* Community Verification Card */}
        <Card className="mb-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Community Verification</h3>

          <CommunityConfidence
            confirmations={report.confirmations}
            disputes={report.disputes}
          />

          {/* Vote buttons */}
          <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
            <Button
              variant={hasVoted === 'confirm' ? 'success' : 'secondary'}
              onClick={handleConfirm}
              disabled={hasVoted !== null}
              className="flex-1"
            >
              <ThumbsUp className="w-4 h-4" />
              {hasVoted === 'confirm' ? 'Confirmed!' : 'Confirm'}
            </Button>
            <Button
              variant={hasVoted === 'dispute' ? 'danger' : 'secondary'}
              onClick={handleDispute}
              disabled={hasVoted !== null}
              className="flex-1"
            >
              <ThumbsDown className="w-4 h-4" />
              {hasVoted === 'dispute' ? 'Disputed' : 'Dispute'}
            </Button>
          </div>

          {hasVoted && (
            <p className="text-xs text-slate-400 text-center mt-2">
              Thank you for helping verify this report.
            </p>
          )}
        </Card>
      </motion.div>
    </div>
  );
}

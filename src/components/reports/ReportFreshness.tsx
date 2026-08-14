import { getReportFreshness, getTimeAgo } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface Props {
  reportedAt: string;
  showLabel?: boolean;
}

export default function ReportFreshness({ reportedAt, showLabel = true }: Props) {
  const freshness = getReportFreshness(reportedAt);
  const timeAgo = getTimeAgo(reportedAt);

  const freshnessConfig = {
    fresh: {
      label: 'Fresh',
      dotColor: 'bg-green-500',
      textColor: 'text-green-600',
    },
    aging: {
      label: 'Aging',
      dotColor: 'bg-yellow-500',
      textColor: 'text-yellow-600',
    },
    outdated: {
      label: 'Outdated',
      dotColor: 'bg-slate-400',
      textColor: 'text-slate-500',
    },
  };

  const config = freshnessConfig[freshness];

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <Clock className="w-3.5 h-3.5 text-slate-400" />
      {showLabel && (
        <span className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
          <span className={`text-xs font-medium ${config.textColor}`}>
            {config.label}
          </span>
          <span className="text-slate-400">·</span>
        </span>
      )}
      <span className="text-slate-500">{timeAgo}</span>
    </div>
  );
}

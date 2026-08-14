import { calculateConfidence } from '@/lib/utils';
import { Users } from 'lucide-react';

interface Props {
  confirmations: number;
  disputes: number;
  showBar?: boolean;
  compact?: boolean;
}

export default function CommunityConfidence({
  confirmations,
  disputes,
  showBar = true,
  compact = false,
}: Props) {
  const confidence = calculateConfidence(confirmations, disputes);

  const getConfidenceColor = () => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBarColor = () => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-sm text-slate-600">
        <Users className="w-3.5 h-3.5" />
        <span>{confirmations} confirmed</span>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Community Confidence
        </span>
        <span className={`text-sm font-bold ${getConfidenceColor()}`}>
          {confidence}%
        </span>
      </div>
      {showBar && (
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      )}
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Users className="w-3 h-3" />
        <span>{confirmations} confirmed</span>
        {disputes > 0 && (
          <span className="text-red-500">· {disputes} disputed</span>
        )}
      </div>
    </div>
  );
}

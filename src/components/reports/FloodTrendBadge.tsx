import { FloodTrend, TREND_CONFIG } from '@/types/flood';

interface Props {
  trend: FloodTrend;
}

export default function FloodTrendBadge({ trend }: Props) {
  const config = TREND_CONFIG[trend];

  return (
    <span className={`inline-flex items-center gap-1 text-sm font-medium ${config.color}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}

import { FloodSeverity, SEVERITY_CONFIG } from '@/types/flood';

interface Props {
  severity: FloodSeverity;
  size?: 'sm' | 'md' | 'lg';
}

export default function FloodSeverityBadge({ severity, size = 'md' }: Props) {
  const config = SEVERITY_CONFIG[severity];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${config.bgColor} ${config.color} ${config.borderColor} ${sizeClasses[size]}`}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: config.markerColor }}
      />
      {config.label}
    </span>
  );
}

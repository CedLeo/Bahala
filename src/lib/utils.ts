import { ReportFreshnessLevel, FloodReport } from '@/types/flood';

/**
 * Calculate how fresh a report is based on when it was reported.
 */
export function getReportFreshness(reportedAt: string): ReportFreshnessLevel {
  const now = new Date();
  const reported = new Date(reportedAt);
  const diffMinutes = (now.getTime() - reported.getTime()) / (1000 * 60);

  if (diffMinutes <= 30) return 'fresh';
  if (diffMinutes <= 120) return 'aging';
  return 'outdated';
}

/**
 * Get a human-readable "time ago" string.
 */
export function getTimeAgo(reportedAt: string): string {
  const now = new Date();
  const reported = new Date(reportedAt);
  const diffMs = now.getTime() - reported.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

/**
 * Calculate community confidence based on confirmations and disputes.
 * Returns a percentage (0-100).
 */
export function calculateConfidence(confirmations: number, disputes: number): number {
  const total = confirmations + disputes;
  if (total === 0) return 50; // No votes = neutral
  return Math.round((confirmations / total) * 100);
}

/**
 * Get the freshness opacity for map markers.
 * Older reports appear more transparent.
 */
export function getFreshnessOpacity(reportedAt: string): number {
  const freshness = getReportFreshness(reportedAt);
  switch (freshness) {
    case 'fresh':
      return 1;
    case 'aging':
      return 0.7;
    case 'outdated':
      return 0.4;
  }
}

/**
 * Format a date for display.
 */
export function formatReportDate(reportedAt: string): string {
  const date = new Date(reportedAt);
  return date.toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Generate a simple ID for mock purposes.
 */
export function generateId(): string {
  return `report-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Get a sorted list of reports by various criteria.
 */
export function sortReports(
  reports: FloodReport[],
  sortBy: 'recent' | 'confirmed'
): FloodReport[] {
  return [...reports].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
    }
    return b.confirmations - a.confirmations;
  });
}

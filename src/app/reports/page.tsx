'use client';

import { useState, useMemo } from 'react';
import { useFloodStore } from '@/lib/store';
import { FloodSeverity } from '@/types/flood';
import { sortReports } from '@/lib/utils';
import FloodReportCard from '@/components/reports/FloodReportCard';
import { Filter, ArrowUpDown } from 'lucide-react';

type FilterOption = 'all' | FloodSeverity;
type SortOption = 'recent' | 'confirmed';

const filterOptions: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'severe', label: 'Severe' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'minor', label: 'Minor' },
  { value: 'passable', label: 'Passable' },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'confirmed', label: 'Most Confirmed' },
];

export default function ReportsPage() {
  const { reports } = useFloodStore();
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [activeSort, setActiveSort] = useState<SortOption>('recent');

  const filteredAndSorted = useMemo(() => {
    let filtered = reports;
    if (activeFilter !== 'all') {
      filtered = reports.filter((r) => r.severity === activeFilter);
    }
    return sortReports(filtered, activeSort);
  }, [reports, activeFilter, activeSort]);

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Community Flood Feed</h1>
        <p className="text-slate-500 mt-1">
          Recent flood reports from the community. Stay informed about conditions in your area.
        </p>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        {/* Filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400 mr-1" />
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeFilter === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <select
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value as SortOption)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 mb-4">
        Showing {filteredAndSorted.length} report{filteredAndSorted.length !== 1 ? 's' : ''}
      </p>

      {/* Report list */}
      <div className="space-y-3">
        {filteredAndSorted.length > 0 ? (
          filteredAndSorted.map((report, index) => (
            <FloodReportCard key={report.id} report={report} index={index} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌤️</span>
            </div>
            <p className="text-slate-500 font-medium">No reports match your filters</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

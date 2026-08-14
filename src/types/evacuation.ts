export type EvacuationStatus = 'open' | 'full' | 'closed';

export interface EvacuationCenter {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  capacity: number;
  currentOccupancy: number;
  status: EvacuationStatus;
  facilities: string[];
  contact: string;
  isOpen: boolean;
}

export const EVACUATION_STATUS_CONFIG: Record<
  EvacuationStatus,
  { label: string; color: string; bgColor: string; dotColor: string }
> = {
  open: {
    label: 'Open',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    dotColor: '#22c55e',
  },
  full: {
    label: 'Full',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    dotColor: '#f97316',
  },
  closed: {
    label: 'Closed',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100',
    dotColor: '#64748b',
  },
};

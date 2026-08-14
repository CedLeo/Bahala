export type SOSStatus = 'inactive' | 'confirming' | 'active' | 'cancelled';

export interface SOSAlert {
  id: string;
  latitude: number;
  longitude: number;
  activatedAt: string; // ISO date string
  status: SOSStatus;
  nearestEvacuationCenterId?: string;
}

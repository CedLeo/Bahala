import { supabase } from './supabase';
import { FloodReport, FloodReportFormData, LatLng } from '@/types/flood';
import { EvacuationCenter } from '@/types/evacuation';
import { SOSAlert } from '@/types/sos';

// =============================================================================
// FLOOD REPORTS
// =============================================================================

export async function fetchFloodReports(): Promise<FloodReport[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('flood_reports')
    .select('*')
    .order('reported_at', { ascending: false });

  if (error) {
    console.error('Error fetching flood reports:', error);
    return [];
  }

  return (data || []).map(mapDbReportToFloodReport);
}

export async function insertFloodReport(
  formData: FloodReportFormData,
  roadGeometry: LatLng[]
): Promise<FloodReport | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('flood_reports')
    .insert([
      {
        latitude: formData.latitude,
        longitude: formData.longitude,
        location: formData.location,
        road: formData.road,
        road_geometry: JSON.stringify(roadGeometry),
        severity: formData.severity,
        water_depth: formData.waterDepth,
        trend: formData.trend,
        description: formData.description || '',
        image_url: null,
        confirmations: 1,
        disputes: 0,
        status: 'active',
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error inserting flood report:', error);
    return null;
  }

  return mapDbReportToFloodReport(data);
}

export async function confirmFloodReport(id: string): Promise<boolean> {
  if (!supabase) return false;

  const { data } = await supabase
    .from('flood_reports')
    .select('confirmations')
    .eq('id', id)
    .single();

  if (data) {
    const { error } = await supabase
      .from('flood_reports')
      .update({ confirmations: (data as any).confirmations + 1 })
      .eq('id', id);
    return !error;
  }
  return false;
}

export async function disputeFloodReport(id: string): Promise<boolean> {
  if (!supabase) return false;

  const { data } = await supabase
    .from('flood_reports')
    .select('disputes')
    .eq('id', id)
    .single();

  if (data) {
    const { error } = await supabase
      .from('flood_reports')
      .update({ disputes: (data as any).disputes + 1 })
      .eq('id', id);
    return !error;
  }
  return false;
}

export async function uploadReportImage(
  file: File,
  reportId: string
): Promise<string | null> {
  if (!supabase) return null;

  const fileExt = file.name.split('.').pop();
  const filePath = `flood-reports/${reportId}.${fileExt}`;

  const { error } = await supabase.storage
    .from('images')
    .upload(filePath, file, { upsert: true });

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  const { data } = supabase.storage.from('images').getPublicUrl(filePath);
  return data.publicUrl;
}

// =============================================================================
// EVACUATION CENTERS
// =============================================================================

export async function fetchEvacuationCenters(): Promise<EvacuationCenter[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('evacuation_centers')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching evacuation centers:', error);
    return [];
  }

  return (data || []).map(mapDbEvacToEvacuationCenter);
}

// =============================================================================
// SOS ALERTS
// =============================================================================

export async function createSOSAlert(
  latitude: number,
  longitude: number
): Promise<SOSAlert | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('sos_alerts')
    .insert([{ latitude, longitude, status: 'active' }])
    .select()
    .single();

  if (error) {
    console.error('Error creating SOS alert:', error);
    return null;
  }

  const row = data as any;
  return {
    id: row.id,
    latitude: row.latitude,
    longitude: row.longitude,
    activatedAt: row.activated_at || row.created_at,
    status: row.status,
  };
}

export async function cancelSOSAlert(id: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase
    .from('sos_alerts')
    .update({ status: 'cancelled' })
    .eq('id', id);
  return !error;
}

// =============================================================================
// MAPPERS
// =============================================================================

function mapDbReportToFloodReport(row: any): FloodReport {
  let geometry = row.road_geometry || [];
  if (typeof geometry === 'string') {
    try { geometry = JSON.parse(geometry); } catch { geometry = []; }
  }

  return {
    id: row.id,
    latitude: row.latitude,
    longitude: row.longitude,
    location: row.location,
    road: row.road,
    roadGeometry: geometry,
    severity: row.severity,
    waterDepth: row.water_depth,
    trend: row.trend,
    description: row.description || '',
    image: row.image_url || undefined,
    reportedAt: row.reported_at || row.created_at,
    confirmations: row.confirmations || 0,
    disputes: row.disputes || 0,
    status: row.status || 'active',
  };
}

function mapDbEvacToEvacuationCenter(row: any): EvacuationCenter {
  return {
    id: row.id,
    name: row.name,
    latitude: row.latitude,
    longitude: row.longitude,
    address: row.address,
    capacity: row.capacity,
    currentOccupancy: row.current_occupancy || 0,
    status: row.status || 'open',
    facilities: row.facilities || [],
    contact: row.contact || '',
    isOpen: row.is_open ?? true,
  };
}

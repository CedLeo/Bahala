import { supabase } from './supabase';
import { FloodReport, FloodReportFormData, LatLng } from '@/types/flood';
import { EvacuationCenter } from '@/types/evacuation';
import { SOSAlert } from '@/types/sos';

// =============================================================================
// FLOOD REPORTS
// =============================================================================

/**
 * Fetch all active flood reports from Supabase.
 */
export async function fetchFloodReports(): Promise<FloodReport[]> {
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

/**
 * Insert a new flood report into Supabase.
 */
export async function insertFloodReport(
  formData: FloodReportFormData,
  roadGeometry: LatLng[]
): Promise<FloodReport | null> {
  const { data, error } = await supabase
    .from('flood_reports')
    .insert({
      latitude: formData.latitude,
      longitude: formData.longitude,
      location: formData.location,
      road: formData.road,
      road_geometry: roadGeometry as any,
      severity: formData.severity,
      water_depth: formData.waterDepth,
      trend: formData.trend,
      description: formData.description || '',
      image_url: null, // Image upload handled separately via Supabase Storage
      confirmations: 1,
      disputes: 0,
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('Error inserting flood report:', error);
    return null;
  }

  return mapDbReportToFloodReport(data);
}

/**
 * Increment confirmations for a report.
 */
export async function confirmFloodReport(id: string): Promise<boolean> {
  const { error } = await supabase.rpc('increment_confirmations', { report_id: id });

  // Fallback if RPC doesn't exist: fetch current value and update
  if (error) {
    const { data } = await supabase
      .from('flood_reports')
      .select('confirmations')
      .eq('id', id)
      .single();

    if (data) {
      await supabase
        .from('flood_reports')
        .update({ confirmations: data.confirmations + 1 })
        .eq('id', id);
    }
  }

  return !error;
}

/**
 * Increment disputes for a report.
 */
export async function disputeFloodReport(id: string): Promise<boolean> {
  const { data } = await supabase
    .from('flood_reports')
    .select('disputes')
    .eq('id', id)
    .single();

  if (data) {
    await supabase
      .from('flood_reports')
      .update({ disputes: data.disputes + 1 })
      .eq('id', id);
    return true;
  }

  return false;
}

/**
 * Upload a flood report image to Supabase Storage.
 * Returns the public URL of the uploaded image.
 */
export async function uploadReportImage(
  file: File,
  reportId: string
): Promise<string | null> {
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

/**
 * Fetch all evacuation centers.
 */
export async function fetchEvacuationCenters(): Promise<EvacuationCenter[]> {
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

/**
 * Create an SOS alert.
 */
export async function createSOSAlert(
  latitude: number,
  longitude: number
): Promise<SOSAlert | null> {
  const { data, error } = await supabase
    .from('sos_alerts')
    .insert({
      latitude,
      longitude,
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating SOS alert:', error);
    return null;
  }

  return {
    id: data.id,
    latitude: data.latitude,
    longitude: data.longitude,
    activatedAt: data.activated_at,
    status: data.status as SOSAlert['status'],
  };
}

/**
 * Cancel an active SOS alert.
 */
export async function cancelSOSAlert(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('sos_alerts')
    .update({ status: 'cancelled' })
    .eq('id', id);

  return !error;
}

// =============================================================================
// MAPPERS (DB row → App type)
// =============================================================================

function mapDbReportToFloodReport(row: any): FloodReport {
  return {
    id: row.id,
    latitude: row.latitude,
    longitude: row.longitude,
    location: row.location,
    road: row.road,
    roadGeometry: row.road_geometry || [],
    severity: row.severity,
    waterDepth: row.water_depth,
    trend: row.trend,
    description: row.description || '',
    image: row.image_url || undefined,
    reportedAt: row.reported_at,
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

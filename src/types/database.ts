/**
 * Supabase Database type definitions.
 * These map directly to the tables in your Supabase project.
 *
 * Run the SQL in supabase/schema.sql to create these tables.
 */

export interface Database {
  public: {
    Tables: {
      flood_reports: {
        Row: {
          id: string;
          latitude: number;
          longitude: number;
          location: string;
          road: string;
          road_geometry: [number, number][];
          severity: 'passable' | 'minor' | 'moderate' | 'severe';
          water_depth: 'no-standing-water' | 'ankle-deep' | 'knee-deep' | 'waist-deep' | 'above-waist';
          trend: 'rising' | 'same' | 'receding';
          description: string;
          image_url: string | null;
          reported_at: string;
          confirmations: number;
          disputes: number;
          status: 'active' | 'aging' | 'outdated';
          created_at: string;
        };
        Insert: {
          id?: string;
          latitude: number;
          longitude: number;
          location: string;
          road: string;
          road_geometry: [number, number][];
          severity: 'passable' | 'minor' | 'moderate' | 'severe';
          water_depth: 'no-standing-water' | 'ankle-deep' | 'knee-deep' | 'waist-deep' | 'above-waist';
          trend: 'rising' | 'same' | 'receding';
          description?: string;
          image_url?: string | null;
          reported_at?: string;
          confirmations?: number;
          disputes?: number;
          status?: 'active' | 'aging' | 'outdated';
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['flood_reports']['Insert']>;
      };
      evacuation_centers: {
        Row: {
          id: string;
          name: string;
          latitude: number;
          longitude: number;
          address: string;
          capacity: number;
          current_occupancy: number;
          status: 'open' | 'full' | 'closed';
          facilities: string[];
          contact: string;
          is_open: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          latitude: number;
          longitude: number;
          address: string;
          capacity: number;
          current_occupancy?: number;
          status?: 'open' | 'full' | 'closed';
          facilities?: string[];
          contact: string;
          is_open?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['evacuation_centers']['Insert']>;
      };
      sos_alerts: {
        Row: {
          id: string;
          latitude: number;
          longitude: number;
          activated_at: string;
          status: 'active' | 'cancelled' | 'resolved';
          nearest_evacuation_center_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          latitude: number;
          longitude: number;
          activated_at?: string;
          status?: 'active' | 'cancelled' | 'resolved';
          nearest_evacuation_center_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['sos_alerts']['Insert']>;
      };
    };
  };
}

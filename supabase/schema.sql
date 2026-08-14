-- =============================================================================
-- Bahala — Community Flood Awareness Map
-- Supabase Database Schema
-- =============================================================================
-- Run this SQL in your Supabase SQL Editor:
-- https://supabase.com/dashboard → SQL Editor → New Query
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- FLOOD REPORTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS flood_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location TEXT NOT NULL,
  road TEXT NOT NULL,
  road_geometry JSONB NOT NULL DEFAULT '[]',
  severity TEXT NOT NULL CHECK (severity IN ('passable', 'minor', 'moderate', 'severe')),
  water_depth TEXT NOT NULL CHECK (water_depth IN ('no-standing-water', 'ankle-deep', 'knee-deep', 'waist-deep', 'above-waist')),
  trend TEXT NOT NULL CHECK (trend IN ('rising', 'same', 'receding')),
  description TEXT DEFAULT '',
  image_url TEXT,
  reported_at TIMESTAMPTZ DEFAULT NOW(),
  confirmations INTEGER DEFAULT 0,
  disputes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'aging', 'outdated')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_flood_reports_status ON flood_reports(status);
CREATE INDEX IF NOT EXISTS idx_flood_reports_severity ON flood_reports(severity);
CREATE INDEX IF NOT EXISTS idx_flood_reports_reported_at ON flood_reports(reported_at DESC);

-- =============================================================================
-- EVACUATION CENTERS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS evacuation_centers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 0,
  current_occupancy INTEGER DEFAULT 0,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'full', 'closed')),
  facilities TEXT[] DEFAULT '{}',
  contact TEXT DEFAULT '',
  is_open BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- SOS ALERTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS sos_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  activated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'resolved')),
  nearest_evacuation_center_id UUID REFERENCES evacuation_centers(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sos_alerts_status ON sos_alerts(status);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================
-- Enable RLS on all tables
ALTER TABLE flood_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE evacuation_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_alerts ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (anyone can view flood data)
CREATE POLICY "Public read access" ON flood_reports
  FOR SELECT USING (true);

CREATE POLICY "Public insert access" ON flood_reports
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update access" ON flood_reports
  FOR UPDATE USING (true);

CREATE POLICY "Public read access" ON evacuation_centers
  FOR SELECT USING (true);

CREATE POLICY "Public insert access" ON evacuation_centers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access" ON sos_alerts
  FOR SELECT USING (true);

CREATE POLICY "Public insert access" ON sos_alerts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update access" ON sos_alerts
  FOR UPDATE USING (true);

-- =============================================================================
-- REALTIME (optional — enable for live updates)
-- =============================================================================
-- Uncomment these to enable Supabase Realtime on these tables:
-- ALTER PUBLICATION supabase_realtime ADD TABLE flood_reports;
-- ALTER PUBLICATION supabase_realtime ADD TABLE sos_alerts;

-- =============================================================================
-- SEED DATA (optional — uncomment to pre-populate evacuation centers)
-- =============================================================================
-- INSERT INTO evacuation_centers (name, latitude, longitude, address, capacity, current_occupancy, status, facilities, contact, is_open) VALUES
-- ('Carmen Evacuation Center', 14.5910, 120.9790, 'Brgy. Carmen, Tondo, Manila', 350, 210, 'open', ARRAY['Restrooms', 'Water', 'First aid', 'Charging station', 'Sleeping mats'], '(02) 8123-4567', true),
-- ('Marikina Sports Center', 14.6310, 121.0580, 'Shoe Avenue, Sto. Nino, Marikina City', 800, 560, 'open', ARRAY['Restrooms', 'Water', 'First aid', 'Kitchen', 'Medical station', 'Charging station'], '(02) 8682-1234', true),
-- ('Quezon City Memorial Circle Shelter', 14.6517, 121.0497, 'Elliptical Road, Diliman, Quezon City', 500, 125, 'open', ARRAY['Restrooms', 'Water', 'First aid', 'Sleeping mats', 'Baby care area'], '(02) 8988-7654', true);

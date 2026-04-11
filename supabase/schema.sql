-- ═══════════════════════════════════════════════════════════════
-- BreatheSafe — Database Schema
-- Normalized PostgreSQL schema for Supabase
-- ═══════════════════════════════════════════════════════════════

-- 1. City
CREATE TABLE IF NOT EXISTS city (
  city_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_name  TEXT NOT NULL,
  state      TEXT NOT NULL,
  country    TEXT NOT NULL DEFAULT 'India'
);

-- 2. Monitoring Station
CREATE TABLE IF NOT EXISTS monitoring_station (
  station_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_name TEXT NOT NULL,
  latitude     DOUBLE PRECISION NOT NULL,
  longitude    DOUBLE PRECISION NOT NULL,
  city_id      UUID NOT NULL REFERENCES city(city_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_station_city ON monitoring_station(city_id);

-- 3. Health Advisory
CREATE TABLE IF NOT EXISTS health_advisory (
  advisory_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aqi_category      TEXT UNIQUE NOT NULL,
  health_risk       TEXT NOT NULL,
  precaution_message TEXT NOT NULL,
  color_code        TEXT NOT NULL
);

-- 4. AQI Record
CREATE TABLE IF NOT EXISTS aqi_record (
  aqi_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_date   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  aqi_value     INTEGER NOT NULL CHECK (aqi_value >= 0 AND aqi_value <= 500),
  aqi_category  TEXT NOT NULL REFERENCES health_advisory(aqi_category),
  station_id    UUID NOT NULL REFERENCES monitoring_station(station_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_aqi_station ON aqi_record(station_id);
CREATE INDEX IF NOT EXISTS idx_aqi_date    ON aqi_record(record_date DESC);
CREATE INDEX IF NOT EXISTS idx_aqi_category ON aqi_record(aqi_category);

-- 5. Pollutant
CREATE TABLE IF NOT EXISTS pollutant (
  pollutant_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pollutant_name TEXT NOT NULL UNIQUE,
  unit           TEXT NOT NULL
);

-- 6. Pollutant Measurement (junction: AQI Record ↔ Pollutant)
CREATE TABLE IF NOT EXISTS pollutant_measurement (
  measurement_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pollutant_value DECIMAL(10, 2) NOT NULL,
  aqi_id          UUID NOT NULL REFERENCES aqi_record(aqi_id) ON DELETE CASCADE,
  pollutant_id    UUID NOT NULL REFERENCES pollutant(pollutant_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_measurement_aqi ON pollutant_measurement(aqi_id);
CREATE INDEX IF NOT EXISTS idx_measurement_pollutant ON pollutant_measurement(pollutant_id);

-- 7. Fun Fact
CREATE TABLE IF NOT EXISTS fun_fact (
  fact_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  min_aqi   INTEGER NOT NULL,
  max_aqi   INTEGER NOT NULL,
  fact_text TEXT NOT NULL,
  CHECK (min_aqi <= max_aqi)
);

-- ═══════════════════════════════════════════════════════════════
-- Row Level Security (read-only for anon)
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE city ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_station ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_advisory ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqi_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE pollutant ENABLE ROW LEVEL SECURITY;
ALTER TABLE pollutant_measurement ENABLE ROW LEVEL SECURITY;
ALTER TABLE fun_fact ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access" ON city FOR SELECT USING (true);
CREATE POLICY "Public read access" ON monitoring_station FOR SELECT USING (true);
CREATE POLICY "Public read access" ON health_advisory FOR SELECT USING (true);
CREATE POLICY "Public read access" ON aqi_record FOR SELECT USING (true);
CREATE POLICY "Public read access" ON pollutant FOR SELECT USING (true);
CREATE POLICY "Public read access" ON pollutant_measurement FOR SELECT USING (true);
CREATE POLICY "Public read access" ON fun_fact FOR SELECT USING (true);

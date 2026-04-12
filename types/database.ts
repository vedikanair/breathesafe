// ─── Base table types ───────────────────────────────────────────

export interface City {
  city_id: number;
  city_name: string;
  state: string;
  country: string;
}

export interface MonitoringStation {
  station_id: number;
  station_name: string;
  latitude: number;
  longitude: number;
  city_id: number;
}

export interface AQIRecord {
  aqi_id: number;
  record_date: string;
  aqi_value: number;
  aqi_category: string;
  station_id: number;
}

export interface Pollutant {
  pollutant_id: number;
  pollutant_name: string;
  unit: string;
}

export interface PollutantMeasurement {
  measurement_id: number;
  pollutant_value: number;
  aqi_id: number;
  pollutant_id: number;
}

export interface HealthAdvisory {
  advisory_id: number;
  aqi_category: string;
  health_risk: string;
  precaution_message: string;
  color_code: string;
}

// Matches table name: fun_facts
export interface FunFact {
  id: number;
  min_aqi: number;
  max_aqi: number;
  fact_text: string;
}

// ─── View types ─────────────────────────────────────────────────

// View: vw_city_aqi_summary
export interface VwCityAQISummary {
  city_id: number;
  city_name: string;
  state: string;
  country: string;
  avg_aqi: number;
  max_aqi: number;
  lowest_aqi: number;
  dominant_category: string;
  active_stations: number;
  stations: StationWithAQI[];
}

// View: vw_danger_zones
export interface VwDangerZone {
  station_id: number;
  station_name: string;
  city_id: number;
  city_name: string;
  latitude: number;
  longitude: number;
  aqi_value: number;
  aqi_category: string;
  record_date: string;
  precaution_message: string;
}

// View: vw_pollutant_city_avg
export interface VwPollutantCityAvg {
  city_name: string;
  pollutant_name: string;
  unit: string;
  avg_value: number;
  peak_value: number;
}

// View: vw_aqi_summary
export interface VwAQISummary {
  aqi_category: AQICategory;
  total: number;
}

// ─── Composite / joined types ───────────────────────────────────

export interface StationWithAQI extends MonitoringStation {
  latest_aqi: number | null;
  latest_category: string | null;
  latest_record_date: string | null;
}

export interface CityWithAQI extends City {
  stations: StationWithAQI[];
  station_count: number;
  avg_aqi: number;
  max_aqi: number;
  dominant_category: string;
}

export interface StateAQI {
  state_name: string;
  avg_aqi: number;
  max_aqi: number;
  dominant_category: string;
  station_count: number;
}

export interface PollutantReading {
  pollutant_name: string;
  pollutant_value: number;
  unit: string;
}

export interface StationDetail extends MonitoringStation {
  city: City;
  latest_record: AQIRecord | null;
  pollutant_readings: PollutantReading[];
  advisory: HealthAdvisory | null;
}

export interface AQIHistoryPoint {
  date: string;
  aqi_value: number;
  category: string;
}

export type AQICategory =
  | "Good"
  | "Satisfactory"
  | "Moderate"
  | "Poor"
  | "Very Poor"
  | "Severe";
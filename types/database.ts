// ─── Base table types ───────────────────────────────────────────

export interface City {
  city_id: string;
  city_name: string;
  state: string;
  country: string;
}

export interface MonitoringStation {
  station_id: string;
  station_name: string;
  latitude: number;
  longitude: number;
  city_id: string;
}

export interface AQIRecord {
  aqi_id: string;
  record_date: string;
  aqi_value: number;
  aqi_category: string;
  station_id: string;
}

export interface Pollutant {
  pollutant_id: string;
  pollutant_name: string;
  unit: string;
}

export interface PollutantMeasurement {
  measurement_id: string;
  pollutant_value: number;
  aqi_id: string;
  pollutant_id: string;
}

export interface HealthAdvisory {
  advisory_id: string;
  aqi_category: string;
  health_risk: string;
  precaution_message: string;
  color_code: string;
}

export interface FunFact {
  fact_id: string;
  min_aqi: number;
  max_aqi: number;
  fact_text: string;
}

// ─── Composite / joined types ───────────────────────────────────

export interface StationWithAQI extends MonitoringStation {
  latest_aqi: number | null;
  latest_category: string | null;
  latest_record_date: string | null;
}

export interface CityWithAQI extends City {
  stations: StationWithAQI[];
  avg_aqi: number;
  max_aqi: number;
  dominant_category: string;
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

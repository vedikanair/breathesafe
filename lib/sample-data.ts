/*
 * Sample data for BreatheSafe.
 * Used as fallback when Supabase is not configured.
 * All data mirrors realistic Indian AQI monitoring data.
 */

import {
  City,
  MonitoringStation,
  AQIRecord,
  Pollutant,
  PollutantMeasurement,
  HealthAdvisory,
  FunFact,
  CityWithAQI,
  StationWithAQI,
  PollutantReading,
  AQIHistoryPoint,
  StationDetail,
} from "@/types/database";

// ─── Cities ─────────────────────────────────────────────────────

export const SAMPLE_CITIES: City[] = [
  { city_id: "c1", city_name: "Delhi", state: "Delhi", country: "India" },
  { city_id: "c2", city_name: "Mumbai", state: "Maharashtra", country: "India" },
  { city_id: "c3", city_name: "Bangalore", state: "Karnataka", country: "India" },
  { city_id: "c4", city_name: "Chennai", state: "Tamil Nadu", country: "India" },
  { city_id: "c5", city_name: "Kolkata", state: "West Bengal", country: "India" },
  { city_id: "c6", city_name: "Hyderabad", state: "Telangana", country: "India" },
  { city_id: "c7", city_name: "Pune", state: "Maharashtra", country: "India" },
  { city_id: "c8", city_name: "Ahmedabad", state: "Gujarat", country: "India" },
  { city_id: "c9", city_name: "Jaipur", state: "Rajasthan", country: "India" },
  { city_id: "c10", city_name: "Lucknow", state: "Uttar Pradesh", country: "India" },
];

// ─── Monitoring Stations ────────────────────────────────────────

export const SAMPLE_STATIONS: MonitoringStation[] = [
  { station_id: "s1", station_name: "ITO", latitude: 28.6289, longitude: 77.2413, city_id: "c1" },
  { station_id: "s2", station_name: "Anand Vihar", latitude: 28.6469, longitude: 77.3164, city_id: "c1" },
  { station_id: "s3", station_name: "R K Puram", latitude: 28.5631, longitude: 77.1726, city_id: "c1" },
  { station_id: "s4", station_name: "Bandra Kurla Complex", latitude: 19.0596, longitude: 72.8656, city_id: "c2" },
  { station_id: "s5", station_name: "Worli", latitude: 19.0178, longitude: 72.8150, city_id: "c2" },
  { station_id: "s6", station_name: "Colaba", latitude: 18.9067, longitude: 72.8147, city_id: "c2" },
  { station_id: "s7", station_name: "BTM Layout", latitude: 12.9166, longitude: 77.6101, city_id: "c3" },
  { station_id: "s8", station_name: "Peenya", latitude: 13.0298, longitude: 77.5193, city_id: "c3" },
  { station_id: "s9", station_name: "Silk Board", latitude: 12.9177, longitude: 77.6238, city_id: "c3" },
  { station_id: "s10", station_name: "Alandur", latitude: 13.0025, longitude: 80.2006, city_id: "c4" },
  { station_id: "s11", station_name: "Velachery", latitude: 12.9815, longitude: 80.2180, city_id: "c4" },
  { station_id: "s12", station_name: "Victoria Memorial", latitude: 22.5449, longitude: 88.3426, city_id: "c5" },
  { station_id: "s13", station_name: "Jadavpur", latitude: 22.4990, longitude: 88.3714, city_id: "c5" },
  { station_id: "s14", station_name: "Rabindra Bharati", latitude: 22.5958, longitude: 88.3773, city_id: "c5" },
  { station_id: "s15", station_name: "Bollaram", latitude: 17.5400, longitude: 78.3500, city_id: "c6" },
  { station_id: "s16", station_name: "Zoo Park", latitude: 17.3500, longitude: 78.4510, city_id: "c6" },
  { station_id: "s17", station_name: "Pashan", latitude: 18.5308, longitude: 73.7985, city_id: "c7" },
  { station_id: "s18", station_name: "Katraj", latitude: 18.4575, longitude: 73.8679, city_id: "c7" },
  { station_id: "s19", station_name: "Maninagar", latitude: 23.0070, longitude: 72.6015, city_id: "c8" },
  { station_id: "s20", station_name: "Bopal", latitude: 23.0272, longitude: 72.4641, city_id: "c8" },
  { station_id: "s21", station_name: "Adarsh Nagar", latitude: 26.9454, longitude: 75.7963, city_id: "c9" },
  { station_id: "s22", station_name: "Moti Doongri", latitude: 26.8891, longitude: 75.8089, city_id: "c9" },
  { station_id: "s23", station_name: "Talkatora", latitude: 26.8553, longitude: 80.9378, city_id: "c10" },
  { station_id: "s24", station_name: "Lalbagh", latitude: 26.8467, longitude: 80.9462, city_id: "c10" },
  { station_id: "s25", station_name: "Gomti Nagar", latitude: 26.8563, longitude: 80.9950, city_id: "c10" },
];

// ─── Health Advisories ──────────────────────────────────────────

export const SAMPLE_ADVISORIES: HealthAdvisory[] = [
  {
    advisory_id: "ha1",
    aqi_category: "Good",
    health_risk: "Minimal impact on health",
    precaution_message: "Enjoy outdoor activities freely. Air quality is ideal for all.",
    color_code: "#93B4B2",
  },
  {
    advisory_id: "ha2",
    aqi_category: "Satisfactory",
    health_risk: "Minor breathing discomfort to sensitive people",
    precaution_message: "Generally safe. Sensitive individuals should limit prolonged outdoor exertion.",
    color_code: "#557257",
  },
  {
    advisory_id: "ha3",
    aqi_category: "Moderate",
    health_risk: "Breathing discomfort to people with lung disease, asthma, and heart conditions",
    precaution_message: "Reduce prolonged outdoor exertion. Keep windows closed during peak pollution hours.",
    color_code: "#A76F28",
  },
  {
    advisory_id: "ha4",
    aqi_category: "Poor",
    health_risk: "Breathing discomfort to most people on prolonged exposure",
    precaution_message: "Avoid prolonged outdoor activities. Use air purifiers indoors. Wear N95 masks outside.",
    color_code: "#A44104",
  },
  {
    advisory_id: "ha5",
    aqi_category: "Very Poor",
    health_risk: "Respiratory illness on prolonged exposure",
    precaution_message: "Avoid all outdoor physical activities. Keep doors and windows shut. Use air purifiers.",
    color_code: "#830750",
  },
  {
    advisory_id: "ha6",
    aqi_category: "Severe",
    health_risk: "Affects healthy people and seriously impacts those with existing conditions",
    precaution_message: "Stay indoors. Avoid any physical activity outdoors. Seek medical help if experiencing distress.",
    color_code: "#5e0539",
  },
];

// ─── Pollutants ─────────────────────────────────────────────────

export const SAMPLE_POLLUTANTS: Pollutant[] = [
  { pollutant_id: "p1", pollutant_name: "PM2.5", unit: "µg/m³" },
  { pollutant_id: "p2", pollutant_name: "PM10", unit: "µg/m³" },
  { pollutant_id: "p3", pollutant_name: "NO2", unit: "µg/m³" },
  { pollutant_id: "p4", pollutant_name: "SO2", unit: "µg/m³" },
  { pollutant_id: "p5", pollutant_name: "CO", unit: "mg/m³" },
  { pollutant_id: "p6", pollutant_name: "O3", unit: "µg/m³" },
];

// ─── Fun Facts ──────────────────────────────────────────────────

export const SAMPLE_FUN_FACTS: FunFact[] = [
  { fact_id: "f1", min_aqi: 0, max_aqi: 50, fact_text: "At this AQI level, air quality is equivalent to a pristine forest. Deep breaths are literally good for you!" },
  { fact_id: "f2", min_aqi: 0, max_aqi: 50, fact_text: "Trees in urban areas can reduce street-level particulate matter by up to 60%. Green cities breathe easier." },
  { fact_id: "f3", min_aqi: 51, max_aqi: 100, fact_text: "Indoor plants like spider plants and peace lilies can absorb common pollutants and improve your home's air quality." },
  { fact_id: "f4", min_aqi: 51, max_aqi: 100, fact_text: "Morning hours between 6-8 AM typically have the cleanest air in Indian cities due to reduced traffic." },
  { fact_id: "f5", min_aqi: 101, max_aqi: 200, fact_text: "Cooking with biomass fuels contributes to nearly 25% of India's total PM2.5 emissions." },
  { fact_id: "f6", min_aqi: 101, max_aqi: 200, fact_text: "Wearing an N95 mask can filter out 95% of airborne particles, offering significant protection at this pollution level." },
  { fact_id: "f7", min_aqi: 201, max_aqi: 300, fact_text: "At this AQI level, one day of exposure equals smoking approximately 10 cigarettes." },
  { fact_id: "f8", min_aqi: 201, max_aqi: 300, fact_text: "Vehicle emissions contribute to nearly 40% of air pollution in major Indian cities." },
  { fact_id: "f9", min_aqi: 301, max_aqi: 400, fact_text: "This air quality level can reduce visibility to under 1 kilometer and significantly impacts aviation safety." },
  { fact_id: "f10", min_aqi: 301, max_aqi: 400, fact_text: "Prolonged exposure at this AQI can reduce life expectancy by 2-3 years, according to WHO studies." },
  { fact_id: "f11", min_aqi: 401, max_aqi: 500, fact_text: "At severe AQI levels, even healthy adults can experience respiratory symptoms within hours of exposure." },
  { fact_id: "f12", min_aqi: 401, max_aqi: 500, fact_text: "Cities hitting 400+ AQI often see emergency hospital admissions rise by 30-40% within 48 hours." },
];

// ─── Helper: generate AQI history for a station ─────────────────

function generateHistory(stationId: string, baseAqi: number, days: number = 30): AQIHistoryPoint[] {
  const history: AQIHistoryPoint[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const variation = Math.sin(i * 0.3) * 40 + (Math.random() - 0.5) * 60;
    const aqi = Math.max(10, Math.min(500, Math.round(baseAqi + variation)));
    const category =
      aqi <= 50 ? "Good" :
      aqi <= 100 ? "Satisfactory" :
      aqi <= 200 ? "Moderate" :
      aqi <= 300 ? "Poor" :
      aqi <= 400 ? "Very Poor" : "Severe";
    history.push({
      date: date.toISOString(),
      aqi_value: aqi,
      category,
    });
  }
  return history;
}

// ─── Helper: generate pollutant readings ────────────────────────

function generatePollutants(aqiValue: number): PollutantReading[] {
  const scale = aqiValue / 200;
  return [
    { pollutant_name: "PM2.5", pollutant_value: Math.round(30 * scale + Math.random() * 20), unit: "µg/m³" },
    { pollutant_name: "PM10", pollutant_value: Math.round(80 * scale + Math.random() * 40), unit: "µg/m³" },
    { pollutant_name: "NO2", pollutant_value: Math.round(25 * scale + Math.random() * 15), unit: "µg/m³" },
    { pollutant_name: "SO2", pollutant_value: Math.round(12 * scale + Math.random() * 8), unit: "µg/m³" },
    { pollutant_name: "CO", pollutant_value: +(1.2 * scale + Math.random() * 0.8).toFixed(1), unit: "mg/m³" },
    { pollutant_name: "O3", pollutant_value: Math.round(35 * scale + Math.random() * 20), unit: "µg/m³" },
  ];
}

// ─── Pre-computed latest AQI values per station ─────────────────

const STATION_AQI: Record<string, number> = {
  s1: 312, s2: 387, s3: 278,    // Delhi — high
  s4: 142, s5: 118, s6: 95,     // Mumbai — moderate
  s7: 72,  s8: 88,  s9: 102,    // Bangalore — good/satisfactory
  s10: 87, s11: 105,             // Chennai
  s12: 198, s13: 221, s14: 175,  // Kolkata
  s15: 134, s16: 110,            // Hyderabad
  s17: 68,  s18: 91,             // Pune
  s19: 157, s20: 125,            // Ahmedabad
  s21: 203, s22: 178,            // Jaipur
  s23: 267, s24: 298, s25: 245,  // Lucknow — high
};

// ─── Exported data-access functions (used as Supabase fallback) ─

export function getSampleCitiesWithAQI(): CityWithAQI[] {
  return SAMPLE_CITIES.map((city) => {
    const cityStations = SAMPLE_STATIONS.filter((s) => s.city_id === city.city_id);
    const stationsWithAQI: StationWithAQI[] = cityStations.map((s) => {
      const aqi = STATION_AQI[s.station_id] ?? 100;
      const cat =
        aqi <= 50 ? "Good" :
        aqi <= 100 ? "Satisfactory" :
        aqi <= 200 ? "Moderate" :
        aqi <= 300 ? "Poor" :
        aqi <= 400 ? "Very Poor" : "Severe";
      return {
        ...s,
        latest_aqi: aqi,
        latest_category: cat,
        latest_record_date: new Date().toISOString(),
      };
    });

    const aqiValues = stationsWithAQI
      .map((s) => s.latest_aqi)
      .filter((v): v is number => v !== null);
    const avg = aqiValues.length > 0
      ? Math.round(aqiValues.reduce((a, b) => a + b, 0) / aqiValues.length)
      : 0;
    const max = aqiValues.length > 0 ? Math.max(...aqiValues) : 0;
    const catForAvg =
      avg <= 50 ? "Good" :
      avg <= 100 ? "Satisfactory" :
      avg <= 200 ? "Moderate" :
      avg <= 300 ? "Poor" :
      avg <= 400 ? "Very Poor" : "Severe";

    return {
      ...city,
      stations: stationsWithAQI,
      avg_aqi: avg,
      max_aqi: max,
      dominant_category: catForAvg,
    };
  }).sort((a, b) => b.avg_aqi - a.avg_aqi);
}

export function getSampleStationDetail(stationId: string): StationDetail | null {
  const station = SAMPLE_STATIONS.find((s) => s.station_id === stationId);
  if (!station) return null;

  const city = SAMPLE_CITIES.find((c) => c.city_id === station.city_id)!;
  const aqi = STATION_AQI[stationId] ?? 100;
  const cat =
    aqi <= 50 ? "Good" :
    aqi <= 100 ? "Satisfactory" :
    aqi <= 200 ? "Moderate" :
    aqi <= 300 ? "Poor" :
    aqi <= 400 ? "Very Poor" : "Severe";

  const advisory = SAMPLE_ADVISORIES.find((a) => a.aqi_category === cat) ?? null;

  return {
    ...station,
    city,
    latest_record: {
      aqi_id: `aqi-${stationId}`,
      record_date: new Date().toISOString(),
      aqi_value: aqi,
      aqi_category: cat,
      station_id: stationId,
    },
    pollutant_readings: generatePollutants(aqi),
    advisory,
  };
}

export function getSampleStationHistory(stationId: string): AQIHistoryPoint[] {
  const baseAqi = STATION_AQI[stationId] ?? 100;
  return generateHistory(stationId, baseAqi, 30);
}

export function getSampleFunFact(aqiValue: number): FunFact | null {
  const matching = SAMPLE_FUN_FACTS.filter(
    (f) => aqiValue >= f.min_aqi && aqiValue <= f.max_aqi
  );
  return matching.length > 0
    ? matching[Math.floor(Math.random() * matching.length)]
    : null;
}

export function getSampleTopStations(limit: number = 5): StationWithAQI[] {
  return SAMPLE_STATIONS.map((s) => {
    const aqi = STATION_AQI[s.station_id] ?? 100;
    const cat =
      aqi <= 50 ? "Good" :
      aqi <= 100 ? "Satisfactory" :
      aqi <= 200 ? "Moderate" :
      aqi <= 300 ? "Poor" :
      aqi <= 400 ? "Very Poor" : "Severe";
    return {
      ...s,
      latest_aqi: aqi,
      latest_category: cat,
      latest_record_date: new Date().toISOString(),
    };
  })
    .sort((a, b) => (b.latest_aqi ?? 0) - (a.latest_aqi ?? 0))
    .slice(0, limit);
}

export function getSamplePollutantComparison(): { city: string; "PM2.5": number; PM10: number; NO2: number; SO2: number; CO: number; O3: number }[] {
  return SAMPLE_CITIES.map((city) => {
    const stationIds = SAMPLE_STATIONS.filter((s) => s.city_id === city.city_id).map((s) => s.station_id);
    const avgAqi = stationIds.reduce((sum, id) => sum + (STATION_AQI[id] ?? 100), 0) / stationIds.length;
    const readings = generatePollutants(avgAqi);
    const result: Record<string, number | string> = { city: city.city_name };
    readings.forEach((r) => {
      result[r.pollutant_name] = r.pollutant_value;
    });
    return result as { city: string; "PM2.5": number; PM10: number; NO2: number; SO2: number; CO: number; O3: number };
  });
}

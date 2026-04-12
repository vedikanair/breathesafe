import { createServerClient } from "./server";
import {
  getSampleCitiesWithAQI,
  getSampleStationDetail,
  getSampleStationHistory,
  getSampleFunFact,
  getSampleTopStations,
  getSamplePollutantComparison,
} from "../sample-data";
import type {
  CityWithAQI,
  StationDetail,
  AQIHistoryPoint,
  FunFact,
  StationWithAQI,
  StateAQI,
} from "@/types/database";

/*
 * All query functions attempt Supabase first, then fall back to sample data.
 * This allows the app to work beautifully before Supabase is configured.
 */

// ─── Cities with latest AQI ────────────────────────────────────

export async function fetchCitiesWithLatestAQI(): Promise<CityWithAQI[]> {
  const supabase = createServerClient();
  if (!supabase) return getSampleCitiesWithAQI();

  try {
    const { data, error } = await supabase
      .from("vw_city_aqi_summary")
      .select("*")
      .order("avg_aqi", { ascending: false });

    if (error || !data) return getSampleCitiesWithAQI();

    return (data as Record<string, unknown>[]).map((row) => ({
      city_id: row.city_id as number,
      city_name: row.city_name as string,
      state: row.state as string,
      country: row.country as string,
      stations: (row.stations as StationWithAQI[]) ?? [],
      station_count: row.active_stations as number,
      avg_aqi: row.avg_aqi as number,
      max_aqi: row.max_aqi as number,
      dominant_category: row.dominant_category as string,
    }));
  } catch {
    return getSampleCitiesWithAQI();
  }
}

// ─── Station detail ─────────────────────────────────────────────

export async function fetchStationDetail(stationId: number): Promise<StationDetail | null> {
  const supabase = createServerClient();
  if (!supabase) return getSampleStationDetail(String(stationId));

  try {
    const { data: station, error } = await supabase
      .from("monitoring_station")
      .select(`
        *,
        city (*),
        aqi_record (
          *,
          pollutant_measurement (
            *,
            pollutant (*)
          )
        )
      `)
      .eq("station_id", stationId)
      .single();

    if (error || !station) return getSampleStationDetail(String(stationId));

    const records = ((station.aqi_record as Record<string, unknown>[]) || []).sort(
      (a: Record<string, unknown>, b: Record<string, unknown>) =>
        new Date(b.record_date as string).getTime() - new Date(a.record_date as string).getTime()
    );
    const latestRecord = records[0] || null;

    let pollutantReadings: { pollutant_name: string; pollutant_value: number; unit: string }[] = [];
    let advisory = null;

    if (latestRecord) {
      const measurements = (latestRecord.pollutant_measurement as Record<string, unknown>[]) || [];
      pollutantReadings = measurements.map((m: Record<string, unknown>) => {
        const p = m.pollutant as Record<string, unknown>;
        return {
          pollutant_name: p.pollutant_name as string,
          pollutant_value: m.pollutant_value as number,
          unit: p.unit as string,
        };
      });

      const { data: adv } = await supabase
        .from("health_advisory")
        .select("*")
        .eq("aqi_category", latestRecord.aqi_category)
        .single();
      advisory = adv;
    }

    const city = station.city as Record<string, unknown>;

    return {
      station_id: station.station_id as number,
      station_name: station.station_name as string,
      latitude: station.latitude as number,
      longitude: station.longitude as number,
      city_id: station.city_id as number,
      city: {
        city_id: city.city_id as number,
        city_name: city.city_name as string,
        state: city.state as string,
        country: city.country as string,
      },
      latest_record: latestRecord
        ? {
            aqi_id: latestRecord.aqi_id as number,
            record_date: latestRecord.record_date as string,
            aqi_value: latestRecord.aqi_value as number,
            aqi_category: latestRecord.aqi_category as string,
            station_id: station.station_id as number,
          }
        : null,
      pollutant_readings: pollutantReadings,
      advisory,
    };
  } catch {
    return getSampleStationDetail(String(stationId));
  }
}

// ─── Station AQI history ────────────────────────────────────────

export async function fetchStationHistory(stationId: number): Promise<AQIHistoryPoint[]> {
  const supabase = createServerClient();
  if (!supabase) return getSampleStationHistory(String(stationId));

  try {
    const { data, error } = await supabase
      .from("aqi_record")
      .select("record_date, aqi_value, aqi_category")
      .eq("station_id", stationId)
      .order("record_date", { ascending: true })
      .limit(90);

    if (error || !data) return getSampleStationHistory(String(stationId));

    return data.map((r: Record<string, unknown>) => ({
      date: r.record_date as string,
      aqi_value: r.aqi_value as number,
      category: r.aqi_category as string,
    }));
  } catch {
    return getSampleStationHistory(String(stationId));
  }
}

// ─── Fun fact ───────────────────────────────────────────────────

export async function fetchFunFact(aqiValue: number): Promise<FunFact | null> {
  const supabase = createServerClient();
  if (!supabase) return getSampleFunFact(aqiValue);

  try {
    const { data, error } = await supabase
      .from("fun_facts")
      .select("*")
      .lte("min_aqi", aqiValue)
      .gte("max_aqi", aqiValue);

    if (error || !data || data.length === 0) return getSampleFunFact(aqiValue);
    return data[Math.floor(Math.random() * data.length)] as FunFact;
  } catch {
    return getSampleFunFact(aqiValue);
  }
}

// ─── Top polluted stations ──────────────────────────────────────

export async function fetchTopStations(limit: number = 5): Promise<StationWithAQI[]> {
  const supabase = createServerClient();
  if (!supabase) return getSampleTopStations(limit);

  try {
    const { data, error } = await supabase
      .from("vw_danger_zones")
      .select("station_id, station_name, city_name, latitude, longitude, city_id, aqi_value, aqi_category, record_date, precaution_message")
      .order("aqi_value", { ascending: false })
      .limit(limit);

    if (error || !data) return getSampleTopStations(limit);

    return (data as Record<string, unknown>[]).map((row) => ({
      station_id: row.station_id as number,
      station_name: row.station_name as string,
      latitude: row.latitude as number,
      longitude: row.longitude as number,
      city_id: row.city_id as number,
      latest_aqi: row.aqi_value as number,
      latest_category: row.aqi_category as string,
      latest_record_date: row.record_date as string,
      city_name: row.city_name as string,
      precaution_message: row.precaution_message as string,
    }));
  } catch {
    return getSampleTopStations(limit);
  }
}

// ─── India Map Aggregates ──────────────────────────────────────

export async function fetchIndiaMapData(): Promise<StateAQI[]> {
  const cities = await fetchCitiesWithLatestAQI();

  const stateMap = new Map<string, { aqiSum: number; stationCount: number; maxAqi: number }>();

  cities.forEach(city => {
    const state = city.state;
    if (!stateMap.has(state)) {
      stateMap.set(state, { aqiSum: 0, stationCount: 0, maxAqi: 0 });
    }
    const current = stateMap.get(state)!;

    city.stations.forEach(s => {
      if (s.latest_aqi !== null) {
        current.aqiSum += s.latest_aqi;
        current.stationCount += 1;
        if (s.latest_aqi > current.maxAqi) current.maxAqi = s.latest_aqi;
      }
    });
  });

  return Array.from(stateMap.entries()).map(([stateName, data]) => {
    const avg = data.stationCount > 0 ? Math.round(data.aqiSum / data.stationCount) : 0;
    const cat =
      avg <= 50 ? "Good" :
      avg <= 100 ? "Satisfactory" :
      avg <= 200 ? "Moderate" :
      avg <= 300 ? "Poor" :
      avg <= 400 ? "Very Poor" : "Severe";

    return {
      state_name: stateName,
      avg_aqi: avg,
      max_aqi: data.maxAqi,
      dominant_category: cat,
      station_count: data.stationCount,
    };
  });
}

// ─── Pollutant comparison across cities ─────────────────────────

export async function fetchPollutantComparison() {
  const supabase = createServerClient();
  if (!supabase) return getSamplePollutantComparison();

  try {
    const { data, error } = await supabase
      .from("vw_pollutant_city_avg")
      .select("city_name, pollutant_name, unit, avg_value, peak_value");

    if (error || !data || data.length === 0) return getSamplePollutantComparison();

    return data as {
      city_name: string;
      pollutant_name: string;
      unit: string;
      avg_value: number;
      peak_value: number;
    }[];
  } catch {
    return getSamplePollutantComparison();
  }
}
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
    const { data: cities, error } = await supabase
      .from("city")
      .select(`
        *,
        monitoring_station (
          *,
          aqi_record (
            aqi_id,
            record_date,
            aqi_value,
            aqi_category,
            station_id
          )
        )
      `)
      .order("city_name");

    if (error || !cities) return getSampleCitiesWithAQI();

    return cities.map((city: Record<string, unknown>) => {
      const stations = (city.monitoring_station as Record<string, unknown>[]) || [];
      const stationsWithAQI: StationWithAQI[] = stations.map((s: Record<string, unknown>) => {
        const records = ((s.aqi_record as Record<string, unknown>[]) || []).sort(
          (a: Record<string, unknown>, b: Record<string, unknown>) =>
            new Date(b.record_date as string).getTime() - new Date(a.record_date as string).getTime()
        );
        const latest = records[0];
        return {
          station_id: s.station_id as string,
          station_name: s.station_name as string,
          latitude: s.latitude as number,
          longitude: s.longitude as number,
          city_id: s.city_id as string,
          latest_aqi: latest ? (latest.aqi_value as number) : null,
          latest_category: latest ? (latest.aqi_category as string) : null,
          latest_record_date: latest ? (latest.record_date as string) : null,
        };
      });

      const aqiValues = stationsWithAQI
        .map((s) => s.latest_aqi)
        .filter((v): v is number => v !== null);
      const avg =
        aqiValues.length > 0
          ? Math.round(aqiValues.reduce((a, b) => a + b, 0) / aqiValues.length)
          : 0;
      const max = aqiValues.length > 0 ? Math.max(...aqiValues) : 0;
      const cat =
        avg <= 50 ? "Good" :
        avg <= 100 ? "Satisfactory" :
        avg <= 200 ? "Moderate" :
        avg <= 300 ? "Poor" :
        avg <= 400 ? "Very Poor" : "Severe";

      return {
        city_id: city.city_id as string,
        city_name: city.city_name as string,
        state: city.state as string,
        country: city.country as string,
        stations: stationsWithAQI,
        avg_aqi: avg,
        max_aqi: max,
        dominant_category: cat,
      };
    }).sort((a: CityWithAQI, b: CityWithAQI) => b.avg_aqi - a.avg_aqi);
  } catch {
    return getSampleCitiesWithAQI();
  }
}

// ─── Station detail ─────────────────────────────────────────────

export async function fetchStationDetail(stationId: string): Promise<StationDetail | null> {
  const supabase = createServerClient();
  if (!supabase) return getSampleStationDetail(stationId);

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

    if (error || !station) return getSampleStationDetail(stationId);

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
      station_id: station.station_id as string,
      station_name: station.station_name as string,
      latitude: station.latitude as number,
      longitude: station.longitude as number,
      city_id: station.city_id as string,
      city: {
        city_id: city.city_id as string,
        city_name: city.city_name as string,
        state: city.state as string,
        country: city.country as string,
      },
      latest_record: latestRecord
        ? {
            aqi_id: latestRecord.aqi_id as string,
            record_date: latestRecord.record_date as string,
            aqi_value: latestRecord.aqi_value as number,
            aqi_category: latestRecord.aqi_category as string,
            station_id: stationId,
          }
        : null,
      pollutant_readings: pollutantReadings,
      advisory,
    };
  } catch {
    return getSampleStationDetail(stationId);
  }
}

// ─── Station AQI history ────────────────────────────────────────

export async function fetchStationHistory(stationId: string): Promise<AQIHistoryPoint[]> {
  const supabase = createServerClient();
  if (!supabase) return getSampleStationHistory(stationId);

  try {
    const { data, error } = await supabase
      .from("aqi_record")
      .select("record_date, aqi_value, aqi_category")
      .eq("station_id", stationId)
      .order("record_date", { ascending: true })
      .limit(90);

    if (error || !data) return getSampleStationHistory(stationId);

    return data.map((r: Record<string, unknown>) => ({
      date: r.record_date as string,
      aqi_value: r.aqi_value as number,
      category: r.aqi_category as string,
    }));
  } catch {
    return getSampleStationHistory(stationId);
  }
}

// ─── Fun fact ───────────────────────────────────────────────────

export async function fetchFunFact(aqiValue: number): Promise<FunFact | null> {
  const supabase = createServerClient();
  if (!supabase) return getSampleFunFact(aqiValue);

  try {
    const { data, error } = await supabase
      .from("fun_fact")
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
    // Use a manual approach: fetch latest record per station
    const { data, error } = await supabase
      .from("aqi_record")
      .select(`
        aqi_value,
        aqi_category,
        record_date,
        station_id,
        monitoring_station (*)
      `)
      .order("record_date", { ascending: false })
      .limit(100);

    if (error || !data) return getSampleTopStations(limit);

    // Group by station, take latest
    const byStation = new Map<string, StationWithAQI>();
    for (const record of data as Record<string, unknown>[]) {
      const sid = record.station_id as string;
      if (!byStation.has(sid)) {
        const s = record.monitoring_station as Record<string, unknown>;
        byStation.set(sid, {
          station_id: sid,
          station_name: s.station_name as string,
          latitude: s.latitude as number,
          longitude: s.longitude as number,
          city_id: s.city_id as string,
          latest_aqi: record.aqi_value as number,
          latest_category: record.aqi_category as string,
          latest_record_date: record.record_date as string,
        });
      }
    }

    return Array.from(byStation.values())
      .sort((a, b) => (b.latest_aqi ?? 0) - (a.latest_aqi ?? 0))
      .slice(0, limit);
  } catch {
    return getSampleTopStations(limit);
  }
}

// ─── Pollutant comparison across cities ─────────────────────────

export async function fetchPollutantComparison() {
  // Complex aggregation — use sample data for now
  // In production this would be a Supabase RPC or view
  return getSamplePollutantComparison();
}

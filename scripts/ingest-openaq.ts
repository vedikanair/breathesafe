import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const OPENAQ_API_KEY = process.env.OPENAQ_API_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Only fetch data for cities already in your DB
const CITY_MAP: Record<string, { city_id: number; state: string }> = {
  "Delhi":     { city_id: 1, state: "Delhi" },
  "Mumbai":    { city_id: 2, state: "Maharashtra" },
  "Chennai":   { city_id: 3, state: "Tamil Nadu" },
  "Kolkata":   { city_id: 4, state: "West Bengal" },
  "Bengaluru": { city_id: 5, state: "Karnataka" },
  "Hyderabad": { city_id: 6, state: "Telangana" },
  "Pune":      { city_id: 7, state: "Maharashtra" },
  "Ahmedabad": { city_id: 8, state: "Gujarat" },
  "Jaipur":    { city_id: 9, state: "Rajasthan" },
};

// India country_id in OpenAQ v3 is 9
const INDIA_COUNTRY_ID = 9;

async function fetchIndiaLocations() {
  console.log("Fetching Indian monitoring locations from OpenAQ...");
  const res = await fetch(
    `https://api.openaq.org/v3/locations?country_id=${INDIA_COUNTRY_ID}&limit=200`,
    { headers: { "X-API-Key": OPENAQ_API_KEY } }
  );
  const data = await res.json();
  return data.results as any[];
}

async function fetchLatestMeasurements(locationId: number) {
  const res = await fetch(
    `https://api.openaq.org/v3/locations/${locationId}/latest`,
    { headers: { "X-API-Key": OPENAQ_API_KEY } }
  );
  const data = await res.json();
  return (data.results as any[]) ?? [];
}

// Convert PM2.5 µg/m³ to Indian AQI scale
function pm25ToAQI(pm25: number): number {
  if (pm25 <= 30)  return Math.round((50 / 30) * pm25);
  if (pm25 <= 60)  return Math.round(50 + ((pm25 - 30) / 30) * 50);
  if (pm25 <= 90)  return Math.round(100 + ((pm25 - 60) / 30) * 100);
  if (pm25 <= 120) return Math.round(200 + ((pm25 - 90) / 30) * 100);
  if (pm25 <= 250) return Math.round(300 + ((pm25 - 120) / 130) * 100);
  return Math.round(Math.min(400 + ((pm25 - 250) / 130) * 100, 500));
}

function aqiToCategory(aqi: number): string {
  if (aqi <= 50)  return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 200) return "Moderate";
  if (aqi <= 300) return "Poor";
  if (aqi <= 400) return "Very Poor";
  return "Severe";
}

async function ensureStation(
  location: any,
  city_id: number
): Promise<number | null> {
  // Check if station already exists
  const { data: existing } = await supabase
    .from("monitoring_station")
    .select("station_id")
    .eq("station_name", location.name)
    .eq("city_id", city_id)
    .single();

  if (existing) return existing.station_id;

  // Insert new station
  const { data, error } = await supabase
    .from("monitoring_station")
    .insert({
      station_name: location.name,
      latitude: location.coordinates.latitude,
      longitude: location.coordinates.longitude,
      city_id,
    })
    .select("station_id")
    .single();

  if (error) {
    console.error(`Failed to insert station ${location.name}:`, error.message);
    return null;
  }

  console.log(`  Created station: ${location.name}`);
  return data.station_id;
}

async function ensurePollutant(name: string, unit: string): Promise<number | null> {
  const { data: existing } = await supabase
    .from("pollutant")
    .select("pollutant_id")
    .eq("pollutant_name", name)
    .single();

  if (existing) return existing.pollutant_id;

  const { data, error } = await supabase
    .from("pollutant")
    .insert({ pollutant_name: name, unit })
    .select("pollutant_id")
    .single();

  if (error) {
    console.error(`Failed to insert pollutant ${name}:`, error.message);
    return null;
  }

  return data.pollutant_id;
}

async function ingest() {
  const today = new Date().toISOString().split("T")[0];
  const locations = await fetchIndiaLocations();
  console.log(`Found ${locations.length} Indian locations`);

  for (const location of locations) {
    // Match location to a city in our DB
    const cityEntry = Object.entries(CITY_MAP).find(([cityName]) =>
      location.locality?.toLowerCase().includes(cityName.toLowerCase()) ||
      location.name?.toLowerCase().includes(cityName.toLowerCase())
    );

    if (!cityEntry) continue;
    const [cityName, { city_id }] = cityEntry;
    console.log(`\nProcessing: ${location.name} (${cityName})`);

    const station_id = await ensureStation(location, city_id);
    if (!station_id) continue;

    // Check if we already have a record for today
    const { data: existingRecord } = await supabase
      .from("aqi_record")
      .select("aqi_id")
      .eq("station_id", station_id)
      .eq("record_date", today)
      .single();

    if (existingRecord) {
      console.log(`  Already have record for today, skipping`);
      continue;
    }

    // Fetch latest measurements
    const measurements = await fetchLatestMeasurements(location.id);
    if (!measurements.length) {
      console.log(`  No measurements available`);
      continue;
    }

    // Find PM2.5 reading to calculate AQI
    const pm25Reading = measurements.find(
      (m: any) => m.parameter?.name === "pm25"
    );

    if (!pm25Reading) {
      console.log(`  No PM2.5 reading, skipping`);
      continue;
    }

    const aqi_value = pm25ToAQI(pm25Reading.value);
    const aqi_category = aqiToCategory(aqi_value);
    console.log(`  AQI: ${aqi_value} (${aqi_category})`);

    // Insert AQI record
    const { data: record, error: recordError } = await supabase
      .from("aqi_record")
      .insert({ station_id, record_date: today, aqi_value, aqi_category })
      .select("aqi_id")
      .single();

    if (recordError) {
      console.error(`  Failed to insert AQI record:`, recordError.message);
      continue;
    }

    // Insert pollutant measurements
    for (const m of measurements) {
      if (!m.parameter?.name || m.value === null) continue;
      const pollutant_id = await ensurePollutant(
        m.parameter.name,
        m.parameter.units ?? "µg/m³"
      );
      if (!pollutant_id) continue;

      await supabase.from("pollutant_measurement").insert({
        aqi_id: record.aqi_id,
        pollutant_id,
        pollutant_value: m.value,
      });
    }

    console.log(`  Inserted ${measurements.length} pollutant readings`);
  }

  console.log("\nIngestion complete!");
}

ingest().catch(console.error);
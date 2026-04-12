import { 
  fetchCitiesWithLatestAQI, 
  fetchTopStations, 
  fetchPollutantComparison,
  fetchIndiaMapData 
} from "@/lib/supabase/queries";
import { getSampleFunFact } from "@/lib/sample-data";
import LandingClient from "./LandingClient";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function HomePage() {
  const [cities, topStations, rawPollutantData, mapData] = await Promise.all([
    fetchCitiesWithLatestAQI(),
    fetchTopStations(5),
    fetchPollutantComparison(),
    fetchIndiaMapData(),
  ]);

  const pollutantData = Object.values(
    rawPollutantData.reduce((acc, row) => {
      if (!acc[row.city_name]) {
        acc[row.city_name] = { city: row.city_name, "PM2.5": 0, PM10: 0, NO2: 0, SO2: 0, CO: 0, O3: 0 };
      }
      (acc[row.city_name] as any)[row.pollutant_name] = row.avg_value;
      return acc;
    }, {} as Record<string, any>)
  );

  const nationalAvg = cities.length > 0
    ? Math.round(cities.reduce((sum, c) => sum + c.avg_aqi, 0) / cities.length)
    : 150;

  const funFact = getSampleFunFact(nationalAvg);

  return (
    <LandingClient
      cities={cities}
      topStations={topStations}
      pollutantData={pollutantData}
      mapData={mapData}
      funFact={funFact}
    />
  );
}
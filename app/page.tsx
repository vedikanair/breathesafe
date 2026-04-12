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
  const [cities, topStations, pollutantData, mapData] = await Promise.all([
    fetchCitiesWithLatestAQI(),
    fetchTopStations(5),
    fetchPollutantComparison(),
    fetchIndiaMapData(),
  ]);

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

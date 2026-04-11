import { fetchCitiesWithLatestAQI } from "@/lib/supabase/queries";
import ExploreClient from "./ExploreClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Explore Cities — BreatheSafe",
  description:
    "Explore air quality data across major Indian cities. Filter by AQI category, sort by pollution levels, and dive into station-level details.",
};

export default async function ExplorePage() {
  const cities = await fetchCitiesWithLatestAQI();

  return <ExploreClient cities={cities} />;
}

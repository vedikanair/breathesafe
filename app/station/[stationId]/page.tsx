import { fetchStationDetail, fetchStationHistory, fetchFunFact } from "@/lib/supabase/queries";
import { SAMPLE_STATIONS } from "@/lib/sample-data";
import StationClient from "./StationClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 60;

interface PageProps {
  params: Promise<{ stationId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { stationId } = await params;
  const station = await fetchStationDetail(stationId);
  if (!station) {
    return { title: "Station Not Found — BreatheSafe" };
  }
  return {
    title: `${station.station_name}, ${station.city.city_name} — BreatheSafe`,
    description: `Current AQI: ${station.latest_record?.aqi_value ?? "N/A"}. View pollutant breakdown, health advisory, and historical trends for ${station.station_name}.`,
  };
}

export async function generateStaticParams() {
  return SAMPLE_STATIONS.map((s) => ({ stationId: s.station_id }));
}

export default async function StationPage({ params }: PageProps) {
  const { stationId } = await params;

  const [station, history] = await Promise.all([
    fetchStationDetail(stationId),
    fetchStationHistory(stationId),
  ]);

  if (!station) {
    notFound();
  }

  const funFact = station.latest_record
    ? await fetchFunFact(station.latest_record.aqi_value)
    : null;

  return (
    <StationClient station={station} history={history} funFact={funFact} />
  );
}

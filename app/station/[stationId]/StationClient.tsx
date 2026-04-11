"use client";

import FloatingNav from "@/components/layout/FloatingNav";
import StationHeader from "@/components/station/StationHeader";
import AQITrendChart from "@/components/station/AQITrendChart";
import PollutantRadial from "@/components/station/PollutantRadial";
import HealthAdvisory from "@/components/station/HealthAdvisory";
import FunFactBanner from "@/components/insights/FunFactBanner";
import { getAQIColor } from "@/lib/utils";
import Link from "next/link";
import type { StationDetail, AQIHistoryPoint, FunFact } from "@/types/database";

interface StationClientProps {
  station: StationDetail;
  history: AQIHistoryPoint[];
  funFact: FunFact | null;
}

export default function StationClient({
  station,
  history,
  funFact,
}: StationClientProps) {
  const aqi = station.latest_record?.aqi_value ?? 0;
  const color = getAQIColor(aqi);
  const ambientClass =
    aqi <= 50
      ? "ambient-good"
      : aqi <= 100
      ? "ambient-satisfactory"
      : aqi <= 200
      ? "ambient-moderate"
      : aqi <= 300
      ? "ambient-poor"
      : aqi <= 400
      ? "ambient-very-poor"
      : "ambient-severe";

  return (
    <main
      className={`relative min-h-screen ${ambientClass}`}
    >
      <FloatingNav />

      {/* Ambient top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${color}08, transparent)`,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-8 pb-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-8">
          <Link href="/" className="hover:text-white/70 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/explore" className="hover:text-white/70 transition-colors">
            Explore
          </Link>
          <span>/</span>
          <span className="text-[var(--text-secondary)]">
            {station.city.city_name}
          </span>
          <span>/</span>
          <span className="text-white">{station.station_name}</span>
        </nav>

        {/* Station header */}
        <StationHeader station={station} />

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          {/* Left: Charts (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <AQITrendChart data={history} />
            <PollutantRadial readings={station.pollutant_readings} />
          </div>

          {/* Right: Advisory + insights (1 col) */}
          <div className="space-y-6">
            {station.advisory && (
              <HealthAdvisory advisory={station.advisory} />
            )}
            {funFact && <FunFactBanner fact={funFact} />}

            {/* Quick stats card */}
            <div className="glass p-5">
              <h3 className="text-sm font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                {history.length > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-muted)]">30-day Avg</span>
                      <span
                        className="font-semibold"
                        style={{
                          color: getAQIColor(
                            Math.round(
                              history.reduce((s, h) => s + h.aqi_value, 0) /
                                history.length
                            )
                          ),
                        }}
                      >
                        {Math.round(
                          history.reduce((s, h) => s + h.aqi_value, 0) /
                            history.length
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-muted)]">30-day Max</span>
                      <span
                        className="font-semibold"
                        style={{
                          color: getAQIColor(
                            Math.max(...history.map((h) => h.aqi_value))
                          ),
                        }}
                      >
                        {Math.max(...history.map((h) => h.aqi_value))}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-muted)]">30-day Min</span>
                      <span
                        className="font-semibold"
                        style={{
                          color: getAQIColor(
                            Math.min(...history.map((h) => h.aqi_value))
                          ),
                        }}
                      >
                        {Math.min(...history.map((h) => h.aqi_value))}
                      </span>
                    </div>
                  </>
                )}
                <hr className="border-white/5" />
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Pollutants</span>
                  <span className="font-semibold">
                    {station.pollutant_readings.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Latitude</span>
                  <span className="font-mono text-xs">
                    {station.latitude.toFixed(4)}°
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Longitude</span>
                  <span className="font-mono text-xs">
                    {station.longitude.toFixed(4)}°
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

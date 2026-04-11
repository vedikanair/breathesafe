"use client";

import AnimatedNumber from "@/components/ui/AnimatedNumber";
import AQIBadge from "@/components/ui/AQIBadge";
import { getAQIColor } from "@/lib/utils";
import type { StationDetail } from "@/types/database";

interface StationHeaderProps {
  station: StationDetail;
}

export default function StationHeader({ station }: StationHeaderProps) {
  const aqi = station.latest_record?.aqi_value ?? 0;
  const color = getAQIColor(aqi);
  const category = station.latest_record?.aqi_category ?? "Unknown";

  return (
    <div id="station-header" className="relative">
      {/* Large AQI display */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 mb-6">
        <div>
          <div
            className="text-8xl sm:text-9xl font-black leading-none tracking-tighter"
            style={{ color }}
          >
            <AnimatedNumber value={aqi} duration={1500} />
          </div>
          <div className="mt-2">
            <AQIBadge value={aqi} size="lg" />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold mb-1">
            {station.station_name}
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            {station.city.city_name}, {station.city.state}
          </p>
          <div className="flex items-center gap-4 mt-3 text-xs text-[var(--text-muted)]">
            <span>
              📍 {station.latitude.toFixed(4)}°N, {station.longitude.toFixed(4)}°E
            </span>
            {station.latest_record && (
              <span>
                🕐 Updated{" "}
                {new Date(station.latest_record.record_date).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Ambient glow behind the AQI number */}
      <div
        className="absolute -top-20 -left-20 w-60 h-60 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: `${color}15` }}
      />
    </div>
  );
}

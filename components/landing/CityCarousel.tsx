"use client";

import { useRef } from "react";
import Link from "next/link";
import AQIBadge from "@/components/ui/AQIBadge";
import { getAQIColor } from "@/lib/utils";
import type { CityWithAQI } from "@/types/database";

interface CityCarouselProps {
  cities: CityWithAQI[];
}

export default function CityCarousel({ cities }: CityCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="city-carousel" className="relative py-20 px-6">
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">City Overview</h2>
        <p className="text-[var(--text-secondary)]">
          Live AQI readings from {cities.length} cities across India
        </p>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 px-6 max-w-7xl mx-auto"
      >
        {cities.map((city, idx) => {
          const color = getAQIColor(city.avg_aqi);
          return (
            <Link
              key={city.city_name}
              href={`/explore?city=${city.city_id}`}
              className={`
                flex-shrink-0 w-[260px] glass-sm p-5
                transition-all duration-500 hover:scale-[1.03]
                hover:border-white/15
                opacity-0 animate-fade-in-up
                stagger-${idx + 1}
                group
              `}
              style={{
                animationFillMode: "forwards",
                borderColor: `${color}20`,
              }}
            >
              {/* Top glow line */}
              <div
                className="absolute top-0 left-4 right-4 h-px"
                style={{
                  background: `linear-gradient(to right, transparent, ${color}40, transparent)`,
                }}
              />

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-base group-hover:text-white transition-colors">
                    {city.city_name}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">{city.state}</p>
                </div>
                <AQIBadge value={city.avg_aqi} size="sm" showCategory={false} />
              </div>

              {/* Mini bar chart - station AQI levels */}
              <div className="flex items-end gap-1 h-12 mb-3">
                {city.stations.map((station) => {
                  const aqi = station.latest_aqi ?? 0;
                  const height = Math.max(4, (aqi / 500) * 100);
                  const stColor = getAQIColor(aqi);
                  return (
                    <div
                      key={station.station_id}
                      className="flex-1 rounded-t-sm transition-all duration-300 group-hover:opacity-100 opacity-60"
                      style={{
                        height: `${height}%`,
                        backgroundColor: `${stColor}80`,
                        minWidth: 6,
                      }}
                      title={`${station.station_name}: ${aqi}`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>{city.stations.length} stations</span>
                <span>Max: {city.max_aqi}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
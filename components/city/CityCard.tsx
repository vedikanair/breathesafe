"use client";

import GlassCard from "@/components/ui/GlassCard";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { getAQIColor } from "@/lib/utils";
import type { CityWithAQI } from "@/types/database";

interface CityCardProps {
  city: CityWithAQI;
}

export default function CityCard({ city }: CityCardProps) {
  const color = getAQIColor(city.avg_aqi);

  return (
    <GlassCard
      glowColor={color}
      hoverable
      className="group"
      onClick={() => window.location.href = `/explore?city=${city.city_id}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-10">
          <div className="flex flex-col">
             <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mb-1">
              Location
            </span>
            <h3 className="text-xl font-bold tracking-tighter text-white opacity-95 group-hover:text-white transition-colors">
              {city.city_name}
            </h3>
            <span className="text-[10px] text-white/20 font-medium">{city.state}</span>
          </div>
          
          <div className="text-right">
            <div 
              className="text-3xl font-bold tracking-tighter tabular-nums mb-1 transition-transform group-hover:scale-110 duration-500"
              style={{ color }}
            >
              <AnimatedNumber value={city.avg_aqi} />
            </div>
            <div className="text-[10px] uppercase tracking-[0.1em] text-white/20 font-bold">
              Avg AQI
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/[0.04]">
          <div className="flex gap-4">
             <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-white/20">Stations</span>
              <span className="text-xs font-medium tabular-nums text-white/60">{city.stations.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-white/20">Status</span>
              <span className="text-xs font-medium text-white/60 uppercase tracking-wider" style={{ color: `${color}cc` }}>
                {city.dominant_category}
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
            <span className="text-sm">→</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

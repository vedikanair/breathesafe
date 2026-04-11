"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { CITY_COORDINATES } from "@/lib/constants";
import { getAQIColor } from "@/lib/utils";
import type { CityWithAQI } from "@/types/database";

interface HeroSectionProps {
  cities: CityWithAQI[];
}

export default function HeroSection({ cities }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nationalAvg = useMemo(() => {
    if (cities.length === 0) return 0;
    return Math.round(
      cities.reduce((sum, c) => sum + c.avg_aqi, 0) / cities.length
    );
  }, [cities]);

  const worstCity = useMemo(
    () => cities.reduce((max, c) => (c.avg_aqi > max.avg_aqi ? c : max), cities[0]),
    [cities]
  );

  const bestCity = useMemo(
    () => cities.reduce((min, c) => (c.avg_aqi < min.avg_aqi ? c : min), cities[0]),
    [cities]
  );

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* Tonal background with light leaks */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, var(--accent-deep)08, transparent 40%),
            radial-gradient(circle at 80% 70%, var(--accent-highlight)05, transparent 40%),
            var(--bg-primary)
          `,
        }}
      />

      {/* India map silhouette - more subtle and offset */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 translate-x-[10%] translate-y-[-5%] scale-110">
        <div className="relative w-full max-w-2xl h-full max-h-[800px]">
          {cities.map((city) => {
            const coords = CITY_COORDINATES[city.city_name];
            if (!coords) return null;
            const color = getAQIColor(city.avg_aqi);
            return (
              <div
                key={city.city_id}
                className="absolute"
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                }}
              >
                <div
                  className="w-1 h-1 rounded-full animate-dot-pulse"
                  style={{ backgroundColor: color }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <div
          className={`
            opacity-0 translate-y-4
            ${mounted ? "animate-fade-in-up" : ""}
          `}
          style={{ animationFillMode: "forwards" }}
        >
          {/* Subtle eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-white/20" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">
              Environmental Intelligence
            </span>
          </div>

          <h1 className="text-[clamp(3rem,10vw,6rem)] font-bold tracking-tighter leading-[0.9] mb-12 max-w-4xl">
            <span className="block text-white opacity-95">BreatheSafe.</span>
            <span className="block text-white/40">Air Quality</span>
            <span className="block text-white/20">Refined for India.</span>
          </h1>
        </div>

        {/* Stats row - Asymmetric and minimalist */}
        <div
          className={`
            grid grid-cols-2 sm:grid-cols-4 gap-x-12 gap-y-8
            opacity-0 translate-y-4
            ${mounted ? "animate-fade-in-up" : ""}
          `}
          style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
        >
          <div>
            <div className="text-3xl font-medium tabular-nums mb-1">
              <AnimatedNumber value={nationalAvg} />
            </div>
            <div className="text-[10px] uppercase tracking-[0.1em] text-white/30 font-medium">
              National Avg
            </div>
          </div>

          <div>
            <div 
              className="text-3xl font-medium tabular-nums mb-1"
              style={{ color: getAQIColor(worstCity?.avg_aqi ?? 0) }}
            >
              <AnimatedNumber value={worstCity?.avg_aqi ?? 0} />
            </div>
            <div className="text-[10px] uppercase tracking-[0.1em] text-white/30 font-medium truncate">
              Peak: {worstCity?.city_name}
            </div>
          </div>

          <div className="sm:col-start-4">
             <Link
              href="/explore"
              className="inline-flex items-center gap-2 group"
            >
              <span className="text-xs font-medium text-white/60 group-hover:text-white transition-colors">
                Explore Dataset
              </span>
              <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-all group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating oversized digit in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-[60%] -translate-y-1/2 text-[30vw] font-black text-white/[0.02] select-none pointer-events-none tracking-tighter tabular-nums z-0">
        <AnimatedNumber value={nationalAvg} duration={2000} />
      </div>

      {/* Scroll prompt */}
      <div
        className={`
          absolute bottom-12 right-12
          flex flex-col items-end gap-3
          opacity-0 ${mounted ? "animate-fade-in" : ""}
        `}
        style={{ animationDelay: "1s", animationFillMode: "forwards" }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-medium rotate-[-90deg] translate-y-[-100%] translate-x-[50%]">
          Scroll
        </span>
        <div className="h-16 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />
      </div>
    </section>
  );
}

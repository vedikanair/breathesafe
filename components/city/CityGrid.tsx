"use client";

import { useState } from "react";
import CityCard from "./CityCard";
import type { CityWithAQI } from "@/types/database";

interface CityGridProps {
  cities: CityWithAQI[];
}

export default function CityGrid({ cities }: CityGridProps) {
  const [filter, setFilter] = useState<string>("All");

  const filteredCities = cities.filter((city) => {
    if (filter === "All") return true;
    return city.dominant_category === filter;
  });

  return (
    <div className="space-y-16">
      {/* Search/Filter Row - Tonal and Minimalist */}
      <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-white/[0.05]">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/20">
          Filter Index
        </span>
        <div className="flex items-center gap-2 p-1 bg-white/[0.03] rounded-xl border border-white/[0.05]">
          {["All", "Good", "Satisfactory", "Moderate", "Poor", "Very Poor"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`
                  px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer
                  ${
                    filter === cat
                      ? "bg-white/[0.08] text-white"
                      : "text-white/30 hover:text-white/60"
                  }
                `}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Asymmetric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
        {filteredCities.map((city, idx) => (
          <div
            key={city.city_name}
            className={`
              transition-all duration-1000 ease-in-out
              ${idx % 3 === 1 ? "lg:translate-y-12" : ""}
              ${idx % 3 === 2 ? "lg:translate-y-24" : ""}
            `}
          >
            <CityCard city={city} />
          </div>
        ))}
      </div>

      {filteredCities.length === 0 && (
        <div className="text-center py-24 border border-dashed border-white/5 rounded-[2rem]">
          <p className="text-white/20 text-sm font-bold tracking-widest uppercase">
            No entries found in this quadrant
          </p>
          <button
            onClick={() => setFilter("All")}
            className="mt-4 text-[10px] uppercase tracking-widest font-bold text-white hover:text-[var(--accent-highlight)] transition-colors"
          >
            Reset Dataset
          </button>
        </div>
      )}
    </div>
  );
}
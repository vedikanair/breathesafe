"use client";

import { motion } from "framer-motion";
import FloatingNav from "@/components/layout/FloatingNav";
import CityGrid from "@/components/city/CityGrid";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { getAQIColor } from "@/lib/utils";
import type { CityWithAQI } from "@/types/database";

interface ExploreClientProps {
  cities: CityWithAQI[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function ExploreClient({ cities }: ExploreClientProps) {
  const totalStations = cities.reduce((sum, c) => sum + c.stations.length, 0);
  const nationalAvg = cities.length > 0
    ? Math.round(cities.reduce((sum, c) => sum + c.avg_aqi, 0) / cities.length)
    : 0;

  return (
    <motion.main 
      variants={container}
      initial="hidden"
      animate="show"
      className="relative min-h-screen selection:bg-[var(--accent-highlight)] selection:text-white"
    >
      <FloatingNav />

      {/* Editorial Header */}
      <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-baseline justify-between gap-12 mb-24">
          <div className="max-w-2xl">
            <motion.h1 variants={item} className="text-[clamp(2.5rem,8vw,5rem)] font-bold tracking-tighter leading-[0.95] mb-8">
              <span className="text-white">Explore.</span>
              <span className="block text-white/30">Atmospheric Data Across India.</span>
            </motion.h1>
            <motion.p variants={item} className="text-lg text-white/40 leading-relaxed max-w-md">
              A comprehensive analytical layer aggregating real-time monitoring data from {cities.length} urban centers and {totalStations} individual sensors.
            </motion.p>
          </div>

          <motion.div variants={item} className="flex gap-16 border-t border-white/[0.05] pt-8 lg:pt-0 lg:border-0">
             <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/20 mb-3">National Index</span>
              <div 
                className="text-5xl font-bold tabular-nums tracking-tighter"
                style={{ color: getAQIColor(nationalAvg) }}
              >
                <AnimatedNumber value={nationalAvg} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/20 mb-3">Active Sensors</span>
              <div className="text-5xl font-bold tabular-nums tracking-tighter text-white opacity-95">
                <AnimatedNumber value={totalStations} />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div variants={item}>
          <CityGrid cities={cities} />
        </motion.div>
      </div>

      <div className="h-32" />
    </motion.main>
  );
}

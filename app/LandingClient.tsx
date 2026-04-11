"use client";

import { motion } from "framer-motion";
import FloatingNav from "@/components/layout/FloatingNav";
import HeroSection from "@/components/landing/HeroSection";
import CityCarousel from "@/components/landing/CityCarousel";
import FunFactBanner from "@/components/insights/FunFactBanner";
import PollutantCompare from "@/components/insights/PollutantCompare";
import { getAQIColor } from "@/lib/utils";
import Link from "next/link";
import type { CityWithAQI, StationWithAQI, FunFact } from "@/types/database";

interface LandingClientProps {
  cities: CityWithAQI[];
  topStations: StationWithAQI[];
  pollutantData: {
    city: string;
    "PM2.5": number;
    PM10: number;
    NO2: number;
    SO2: number;
    CO: number;
    O3: number;
  }[];
  funFact: FunFact | null;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 1 } },
};

export default function LandingClient({
  cities,
  topStations,
  pollutantData,
  funFact,
}: LandingClientProps) {
  return (
    <motion.main 
      variants={container}
      initial="hidden"
      animate="show"
      className="relative selection:bg-[var(--accent-deep)] selection:text-white"
    >
      <FloatingNav />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <motion.div variants={item}>
        <HeroSection cities={cities} />
      </motion.div>

      {/* ── City Carousel (Shifted) ────────────────────────── */}
      <motion.section variants={item} className="relative z-10 -mt-20">
        <CityCarousel cities={cities} />
      </motion.section>

      {/* ── Hotspots (Analytical Layer) ─────────────────────── */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 mb-20">
          <motion.div variants={item}>
            <h2 className="text-4xl font-bold tracking-tighter mb-4">
              Real-time Hotspots.
            </h2>
            <p className="text-[var(--text-secondary)] max-w-md text-lg leading-relaxed">
              Monitoring stations currently reporting the highest atmospheric pressure and pollutant concentrations across the network.
            </p>
          </motion.div>
          <motion.div variants={item}>
            <Link
              href="/explore"
              className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 hover:text-white transition-colors flex items-center gap-4"
            >
              Full Dataset <span>→</span>
            </Link>
          </motion.div>
        </div>

        <motion.div 
          variants={item}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/[0.05] border border-white/[0.05] rounded-[2rem] overflow-hidden"
        >
          {topStations.map((station, idx) => {
            const color = getAQIColor(station.latest_aqi ?? 0);
            return (
              <Link
                key={station.station_id}
                href={`/station/${station.station_id}`}
                className="group bg-black p-8 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex items-center justify-between mb-12">
                  <span className="text-[10px] font-bold tabular-nums opacity-20 group-hover:opacity-100 transition-opacity">
                    0{idx + 1}
                  </span>
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>

                <div className="mb-2">
                   <div
                    className="text-4xl font-bold tracking-tighter tabular-nums mb-1"
                  >
                    {station.latest_aqi}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.1em] text-white/40 font-medium truncate">
                    {station.station_name}
                  </div>
                </div>
                
                <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>
                    {station.latest_category}
                  </span>
                </div>
              </Link>
            );
          })}
        </motion.div>
      </section>

      {/* ── Visual Analysis Layer ───────────────────────────── */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <motion.div variants={item} className="mb-16">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-medium">
            Pollutant Distribution
          </span>
        </motion.div>
        <motion.div variants={item}>
          <PollutantCompare data={pollutantData} />
        </motion.div>
      </section>

      {/* ── Contextual Fun Fact ──────────────────────────────── */}
      {funFact && (
        <motion.section variants={item} className="py-20 px-6 max-w-xl mx-auto border-t border-white/[0.05]">
          <FunFactBanner fact={funFact} />
        </motion.section>
      )}

      {/* Footer */}
      <motion.footer variants={item} className="py-24 px-6 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/20">
            © 2026 BreatheSafe / Env. Intelligence
          </div>
          <div className="flex gap-8">
            {["Exploration", "Insights", "Stations"].map((link) => (
              <span key={link} className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/20 hover:text-white cursor-pointer transition-colors">
                {link}
              </span>
            ))}
          </div>
        </div>
      </motion.footer>
    </motion.main>
  );
}

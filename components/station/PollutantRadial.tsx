"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import GlassCard from "@/components/ui/GlassCard";
import type { PollutantReading } from "@/types/database";

interface PollutantRadialProps {
  readings: PollutantReading[];
}

const COLORS = ["#830750", "#A44104", "#A76F28", "#557257", "#93B4B2", "#646b72"];

export default function PollutantRadial({ readings }: PollutantRadialProps) {
  if (readings.length === 0) {
    return (
      <GlassCard className="p-8 text-center text-white/20">
        No pollutant data available
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-8 h-[400px]">
       <div className="flex flex-col sm:flex-row h-full gap-8">
        {/* Left: Metadata */}
        <div className="flex flex-col justify-between py-2">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">
              Atmospheric Mix
            </h3>
            <p className="text-xl font-bold tracking-tighter mb-4 text-white opacity-95">Compound Breakdown</p>
          </div>
          
          <div className="space-y-3">
            {readings.map((r, i) => (
              <div key={r.pollutant_name} className="flex items-center gap-4 text-[11px]">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="font-bold w-12 text-white/80">{r.pollutant_name}</span>
                <span className="text-white/30 tabular-nums">{r.pollutant_value} {r.unit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Chart */}
        <div className="flex-1 min-h-[250px] relative pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={readings}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis dataKey="pollutant_name" tick={false} />
              <Radar
                name="Pollutants"
                dataKey="pollutant_value"
                stroke="var(--accent-highlight)"
                fill="var(--accent-highlight)"
                fillOpacity={0.05}
                strokeWidth={1.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </GlassCard>
  );
}

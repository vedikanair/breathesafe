"use client";

import type { HealthAdvisory as HealthAdvisoryType } from "@/types/database";

interface HealthAdvisoryProps {
  advisory: HealthAdvisoryType;
}

export default function HealthAdvisory({ advisory }: HealthAdvisoryProps) {
  const color = advisory.color_code;

  return (
    <div
      id="health-advisory"
      className="glass relative overflow-hidden p-6"
    >
      {/* Colored top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: color }}
      />

      {/* Ambient background glow */}
      <div
        className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: `${color}10` }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style={{
              backgroundColor: `${color}20`,
              border: `1px solid ${color}30`,
            }}
          >
            🛡️
          </div>
          <div>
            <h3 className="text-lg font-semibold">Health Advisory</h3>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${color}20`,
                color: color,
              }}
            >
              {advisory.aqi_category}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Health Risk
            </h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {advisory.health_risk}
            </p>
          </div>

          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: `${color}08`,
              border: `1px solid ${color}15`,
            }}
          >
            <h4 className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Recommended Precautions
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: `${color}dd` }}>
              {advisory.precaution_message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

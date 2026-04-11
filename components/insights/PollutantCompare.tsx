"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { POLLUTANT_COLORS, POLLUTANT_LABELS } from "@/lib/constants";

interface PollutantCompareProps {
  data: {
    city: string;
    "PM2.5": number;
    PM10: number;
    NO2: number;
    SO2: number;
    CO: number;
    O3: number;
  }[];
}

export default function PollutantCompare({ data }: PollutantCompareProps) {
  const pollutants = ["PM2.5", "PM10", "NO2", "SO2", "CO", "O3"] as const;

  return (
    <div id="pollutant-compare" className="glass p-6">
      <h3 className="text-lg font-semibold mb-1">Pollutant Comparison</h3>
      <p className="text-xs text-[var(--text-muted)] mb-6">
        Average concentrations across cities
      </p>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, bottom: 5, left: -10 }}
          >
            <XAxis
              dataKey="city"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              angle={-30}
              textAnchor="end"
              height={60}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="glass-sm px-4 py-3 shadow-xl">
                    <div className="text-sm font-semibold mb-2">{label}</div>
                    {payload.map((entry) => (
                      <div
                        key={entry.dataKey as string}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: entry.color as string }}
                        />
                        <span className="text-[var(--text-secondary)]">
                          {(POLLUTANT_LABELS[entry.dataKey as string] as string) || (entry.dataKey as string)}:
                        </span>
                        <span className="font-medium">{entry.value as number}</span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, color: "var(--text-muted)" }}
              formatter={(value: string) => POLLUTANT_LABELS[value] || value}
            />
            {pollutants.map((p) => (
              <Bar
                key={p}
                dataKey={p}
                fill={POLLUTANT_COLORS[p]}
                radius={[3, 3, 0, 0]}
                barSize={8}
                opacity={0.8}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { getAQIColor, getAQICategory, formatDate } from "@/lib/utils";
import { AQI_BREAKPOINTS } from "@/lib/constants";
import type { AQIHistoryPoint } from "@/types/database";

interface AQITrendChartProps {
  data: AQIHistoryPoint[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: AQIHistoryPoint }> }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const color = getAQIColor(point.aqi_value);

  return (
    <div className="glass-sm px-4 py-3 shadow-xl">
      <div className="text-xs text-[var(--text-muted)] mb-1">
        {formatDate(point.date)}
      </div>
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-lg font-bold" style={{ color }}>
          {point.aqi_value}
        </span>
        <span className="text-xs text-[var(--text-secondary)]">
          {point.category}
        </span>
      </div>
    </div>
  );
}

export default function AQITrendChart({ data }: AQITrendChartProps) {
  const gradientStops = useMemo(() => {
    if (data.length === 0) return [];
    const maxAqi = Math.max(...data.map((d) => d.aqi_value));
    return AQI_BREAKPOINTS.map((bp) => ({
      offset: `${Math.min(100, (bp.max / Math.max(maxAqi, 1)) * 100)}%`,
      color: bp.color,
    })).reverse();
  }, [data]);

  const chartData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        dateLabel: new Date(d.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        }),
      })),
    [data]
  );

  if (data.length === 0) {
    return (
      <div className="glass p-8 text-center text-[var(--text-muted)]">
        No historical data available
      </div>
    );
  }

  return (
    <div id="aqi-trend-chart" className="glass p-6">
      <h3 className="text-lg font-semibold mb-1">AQI Trend</h3>
      <p className="text-xs text-[var(--text-muted)] mb-6">
        Last {data.length} days
      </p>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-deep)" stopOpacity={0.1} />
                <stop offset="95%" stopColor="var(--accent-deep)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tickFormatter={(str) => {
                const date = new Date(str);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
              minTickGap={30}
              dy={10}
            />
            <YAxis hide domain={[0, "dataMax + 40"]} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-xl shadow-2xl">
                      <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
                        {new Date(payload[0].payload.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                      })}
                      </div>
                      <div
                        className="text-2xl font-bold tabular-nums"
                        style={{ color: getAQIColor(payload[0].value as number) }}
                      >
                        {payload[0].value}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="aqi_value"
              stroke="var(--accent-deep)"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorAqi)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

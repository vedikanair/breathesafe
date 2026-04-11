"use client";

import { getAQIColor, getAQICategory } from "@/lib/utils";

interface AQIBadgeProps {
  value: number;
  size?: "sm" | "md" | "lg";
  showCategory?: boolean;
  pulse?: boolean;
}

export default function AQIBadge({
  value,
  size = "md",
  showCategory = true,
  pulse = false,
}: AQIBadgeProps) {
  const color = getAQIColor(value);
  const category = getAQICategory(value);
  const shouldPulse = pulse || value > 300;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] tracking-tight gap-1",
    md: "px-2.5 py-1 text-xs tracking-tight gap-1.5",
    lg: "px-4 py-1.5 text-sm tracking-tight gap-2",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium tabular-nums
        ${sizeClasses[size]}
        ${shouldPulse ? "animate-dot-pulse" : ""}
      `}
      style={{
        backgroundColor: `${color}12`,
        color: color,
        border: `1px solid ${color}20`,
      }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span>{value}</span>
      {showCategory && (
        <span className="opacity-60 font-normal uppercase text-[0.8em] tracking-widest">
          {category}
        </span>
      )}
    </span>
  );
}

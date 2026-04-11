import { AQI_BREAKPOINTS } from "./constants";
import { AQICategory } from "@/types/database";

export function getAQIBreakpoint(value: number) {
  return (
    AQI_BREAKPOINTS.find((b) => value >= b.min && value <= b.max) ??
    AQI_BREAKPOINTS[AQI_BREAKPOINTS.length - 1]
  );
}

export function getAQIColor(value: number): string {
  return getAQIBreakpoint(value).color;
}

export function getAQICategory(value: number): AQICategory {
  return getAQIBreakpoint(value).category;
}

export function getAQIGradient(value: number): string {
  return getAQIBreakpoint(value).bgGradient;
}

export function getAQIGlow(value: number): string {
  return getAQIBreakpoint(value).glowColor;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function categoryToSeverityIndex(category: string): number {
  const map: Record<string, number> = {
    Good: 0,
    Satisfactory: 1,
    Moderate: 2,
    Poor: 3,
    "Very Poor": 4,
    Severe: 5,
  };
  return map[category] ?? 0;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

import { AQICategory } from "@/types/database";

// ─── Indian AQI breakpoints ────────────────────────────────────

export const AQI_BREAKPOINTS: {
  category: AQICategory;
  min: number;
  max: number;
  color: string;
  bgGradient: string;
  glowColor: string;
  label: string;
}[] = [
  {
    category: "Good",
    min: 0,
    max: 50,
    color: "#93B4B2",
    bgGradient: "from-[#93B4B2]/20 to-[#93B4B2]/5",
    glowColor: "rgba(147, 180, 178, 0.3)",
    label: "Good",
  },
  {
    category: "Satisfactory",
    min: 51,
    max: 100,
    color: "#557257",
    bgGradient: "from-[#557257]/20 to-[#557257]/5",
    glowColor: "rgba(85, 114, 87, 0.3)",
    label: "Satisfactory",
  },
  {
    category: "Moderate",
    min: 101,
    max: 200,
    color: "#A76F28",
    bgGradient: "from-[#A76F28]/20 to-[#A76F28]/5",
    glowColor: "rgba(167, 111, 40, 0.3)",
    label: "Moderate",
  },
  {
    category: "Poor",
    min: 201,
    max: 300,
    color: "#A44104",
    bgGradient: "from-[#A44104]/20 to-[#A44104]/5",
    glowColor: "rgba(164, 65, 4, 0.3)",
    label: "Poor",
  },
  {
    category: "Very Poor",
    min: 301,
    max: 400,
    color: "#830750",
    bgGradient: "from-[#830750]/20 to-[#830750]/5",
    glowColor: "rgba(131, 7, 80, 0.3)",
    label: "Very Poor",
  },
  {
    category: "Severe",
    min: 401,
    max: 500,
    color: "#5e0539", // Slightly darker version of the Very Poor color
    bgGradient: "from-[#5e0539]/30 to-[#5e0539]/10",
    glowColor: "rgba(94, 5, 57, 0.4)",
    label: "Severe",
  },
];

// ─── Pollutant metadata ─────────────────────────────────────────

export const POLLUTANT_COLORS: Record<string, string> = {
  "PM2.5": "#a78bfa",
  PM10: "#60a5fa",
  NO2: "#f472b6",
  SO2: "#facc15",
  CO: "#fb923c",
  O3: "#34d399",
};

export const POLLUTANT_LABELS: Record<string, string> = {
  "PM2.5": "PM₂.₅",
  PM10: "PM₁₀",
  NO2: "NO₂",
  SO2: "SO₂",
  CO: "CO",
  O3: "O₃",
};

// ─── Indian cities with coordinates (for landing map) ───────────

export const CITY_COORDINATES: Record<string, { x: number; y: number }> = {
  Delhi: { x: 55, y: 22 },
  Mumbai: { x: 38, y: 52 },
  Bangalore: { x: 45, y: 72 },
  Chennai: { x: 55, y: 70 },
  Kolkata: { x: 72, y: 38 },
  Hyderabad: { x: 50, y: 58 },
  Pune: { x: 40, y: 55 },
  Ahmedabad: { x: 35, y: 38 },
  Jaipur: { x: 44, y: 28 },
  Lucknow: { x: 58, y: 28 },
};

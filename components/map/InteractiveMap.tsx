"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as d3 from "d3-geo";
import { PROJECTED_WIDTH, PROJECTED_HEIGHT, getIndiaProjection } from "@/lib/map-utils";
import StateLayer from "./StateLayer";
import StationLayer from "./StationLayer";
import MapTooltip from "./MapTooltip";
import type { StateAQI, CityWithAQI, StationWithAQI } from "@/types/database";

interface InteractiveMapProps {
  stateAggregates: StateAQI[];
  cities: CityWithAQI[];
  onStationSelect?: (stationId: number) => void;
}

export default function InteractiveMap({
  stateAggregates,
  cities,
  onStationSelect,
}: InteractiveMapProps) {
  const [geoData, setGeoData] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<{ title: string; value?: string | number; subValue?: string } | null>(null);
  const [viewBox, setViewBox] = useState(`0 0 ${PROJECTED_WIDTH} ${PROJECTED_HEIGHT}`);

  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Load GeoJSON data - Optimized 128KB source
  useEffect(() => {
    fetch("/data/india-states-optimized.json")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Error loading map data:", err));
  }, []);

  // Optimized Mouse Tracking logic using requestAnimationFrame for 60fps performance
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (tooltipRef.current) {
        const x = e.clientX;
        const y = e.clientY;
        tooltipRef.current.style.transform = `translate(${x}px, ${y - 10}px)`;
      }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  // Filter stations for selected state
  const stateStations = useMemo(() => {
    if (!selectedState) return [];
    const stateCities = cities.filter(c => c.state === selectedState);
    return stateCities.flatMap(c => c.stations);
  }, [selectedState, cities]);

  // Zoom handling
  useEffect(() => {
    if (!selectedState || !geoData) {
      setViewBox(`0 0 ${PROJECTED_WIDTH} ${PROJECTED_HEIGHT}`);
      return;
    }

    const projection = getIndiaProjection();
    const path = d3.geoPath().projection(projection);
    const feature = geoData.features.find((f: any) => {
        const nameMap: Record<string, string> = {
            "NCT of Delhi": "Delhi",
            "Arunanchal Pradesh": "Arunachal Pradesh",
            "Andaman & Nicobar Island": "Andaman and Nicobar Islands",
            "Dadara & Nagar Havelli": "Dadra and Nagar Haveli and Daman and Diu",
            "Daman & Diu": "Dadra and Nagar Haveli and Daman and Diu",
          };
        const normalized = nameMap[f.properties.st_nm] || f.properties.st_nm;
        return normalized === selectedState;
    });

    if (feature) {
      const bounds = path.bounds(feature);
      const dx = bounds[1][0] - bounds[0][0];
      const dy = bounds[1][1] - bounds[0][1];
      const x = (bounds[0][0] + bounds[1][0]) / 2;
      const y = (bounds[0][1] + bounds[1][1]) / 2;
      const scale = 0.8 / Math.max(dx / PROJECTED_WIDTH, dy / PROJECTED_HEIGHT);
      
      const width = PROJECTED_WIDTH / scale;
      const height = PROJECTED_HEIGHT / scale;
      const minX = x - width / 2;
      const minY = y - height / 2;
      
      setViewBox(`${minX} ${minY} ${width} ${height}`);
    }
  }, [selectedState, geoData]);

  const handleStateHover = (name: string | null) => {
    if (!name) {
      setHoveredItem(null);
      return;
    }
    const data = stateAggregates.find(s => s.state_name === name);
    setHoveredItem({
      title: name,
      value: data?.avg_aqi ?? "N/A",
      subValue: data?.dominant_category || "No Data",
    });
  };

  const handleStationHover = (name: string | null, aqi: number | null) => {
    if (!name) {
      setHoveredItem(null);
      return;
    }
    setHoveredItem({
      title: name,
      value: aqi ?? "N/A",
      subValue: "AQI",
    });
  };

  if (!geoData) {
    return (
      <div className="w-full aspect-[4/5] sm:aspect-square flex items-center justify-center text-white/20 uppercase tracking-widest text-[10px] font-bold border border-white/[0.05] rounded-[2rem] bg-black">
        Initializing Intelligence...
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto py-12 px-6">
      {/* Map Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter">Geographic Explorer.</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">
            {selectedState ? `Viewing ${selectedState}` : "India Atmospheric Overview"}
          </p>
        </div>
        
        <AnimatePresence>
          {selectedState && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={() => setSelectedState(null)}
              className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10"
            >
              Back to Overview
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Main SVG Container */}
      <div className="relative aspect-[4/5] sm:aspect-square bg-transparent rounded-[2rem] overflow-hidden">
        <motion.svg
          ref={svgRef}
          animate={{ viewBox }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full"
        >
          <StateLayer
            geoData={geoData}
            stateAggregates={stateAggregates}
            selectedState={selectedState}
            onStateClick={(name) => setSelectedState(name)}
            onHover={handleStateHover}
          />
          
          <StationLayer
            stations={stateStations}
            visible={!!selectedState}
            onStationClick={(id) => onStationSelect?.(id)}
            onHover={handleStationHover}
          />
        </motion.svg>
      </div>

      <div ref={tooltipRef} className="fixed top-0 left-0 z-[100] pointer-events-none will-change-transform">
        <MapTooltip content={hoveredItem} x={0} y={0} />
      </div>
      
      {/* Visual Legend */}
      <div className="mt-8 flex flex-wrap gap-8 justify-center opacity-40">
        {[
          { label: "Good", color: "#93B4B2" },
          { label: "Moderate", color: "#A76F28" },
          { label: "Severe", color: "#5e0539" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] uppercase tracking-widest font-bold">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

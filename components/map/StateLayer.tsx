import { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { getPathGenerator } from "@/lib/map-utils";
import { getAQIColor } from "@/lib/utils";
import type { StateAQI } from "@/types/database";

interface StateLayerProps {
  geoData: any;
  stateAggregates: StateAQI[];
  selectedState: string | null;
  onStateClick: (stateName: string) => void;
  onHover: (stateName: string | null) => void;
}

// Normalize state names between GeoJSON and our Database/Sample Data
const STATE_NAME_MAP: Record<string, string> = {
  "NCT of Delhi": "Delhi",
  "Arunanchal Pradesh": "Arunachal Pradesh",
  "Andaman & Nicobar Island": "Andaman and Nicobar Islands",
  "Dadara & Nagar Havelli": "Dadra and Nagar Haveli and Daman and Diu",
  "Daman & Diu": "Dadra and Nagar Haveli and Daman and Diu",
};

const StateLayer = memo(function StateLayer({
  geoData,
  stateAggregates,
  selectedState,
  onStateClick,
  onHover,
}: StateLayerProps) {
  const pathGenerator = useMemo(() => getPathGenerator(), []);

  const stateDataMap = useMemo(() => {
    const map = new Map<string, StateAQI>();
    stateAggregates.forEach((s) => map.set(s.state_name, s));
    return map;
  }, [stateAggregates]);

  return (
    <g className="state-layer">
      {geoData.features.map((feature: any) => {
        const geoName = feature.properties.st_nm;
        const normalizedName = STATE_NAME_MAP[geoName] || geoName;
        const data = stateDataMap.get(normalizedName);
        const aqi = data?.avg_aqi ?? 0;
        const color = aqi > 0 ? getAQIColor(aqi) : "rgba(255, 255, 255, 0.03)";
        const isActive = selectedState === normalizedName;

        return (
          <motion.path
            key={feature.properties.cartodb_id || geoName}
            d={pathGenerator(feature) || ""}
            fill={color}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={isActive ? 2 : 0.5}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              stroke: isActive ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.1)"
            }}
            whileHover={{ 
              fillOpacity: 0.8,
              stroke: "rgba(255, 255, 255, 0.5)",
              transition: { duration: 0.2 }
            }}
            className="cursor-pointer outline-none"
            onClick={() => onStateClick(normalizedName)}
            onMouseEnter={() => onHover(normalizedName)}
            onMouseLeave={() => onHover(null)}
          />
        );
      })}
    </g>
  );
});

export default StateLayer;

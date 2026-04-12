import { useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getIndiaProjection } from "@/lib/map-utils";
import { getAQIColor } from "@/lib/utils";
import type { StationWithAQI } from "@/types/database";

interface StationLayerProps {
  stations: StationWithAQI[];
  visible: boolean;
  onStationClick: (stationId: string) => void;
  onHover: (stationName: string | null, aqi: number | null) => void;
}

const StationLayer = memo(function StationLayer({
  stations,
  visible,
  onStationClick,
  onHover,
}: StationLayerProps) {
  const projection = useMemo(() => getIndiaProjection(), []);

  return (
    <g className="station-layer">
      <AnimatePresence>
        {visible &&
          stations.map((station) => {
            const coords = projection([station.longitude, station.latitude]);
            if (!coords) return null;
            const [cx, cy] = coords;
            const aqi = station.latest_aqi ?? 0;
            const color = getAQIColor(aqi);

            return (
              <motion.g
                key={station.station_id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 300 }}
                className="cursor-pointer"
                onClick={() => onStationClick(station.station_id)}
                onMouseEnter={() => onHover(station.station_name, aqi)}
                onMouseLeave={() => onHover(null, null)}
              >
                {/* Glow Effect */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill={color}
                  className="opacity-40 blur-[2px]"
                />
                {/* Core Dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={2}
                  fill="white"
                />
                {/* Pulsing Outer Ring (for high AQI) */}
                {aqi > 200 && (
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    stroke={color}
                    strokeWidth={1}
                    fill="none"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}
              </motion.g>
            );
          })}
      </AnimatePresence>
    </g>
  );
});

export default StationLayer;

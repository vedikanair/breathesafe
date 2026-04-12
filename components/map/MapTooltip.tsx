"use client";

import { motion, AnimatePresence } from "framer-motion";

interface MapTooltipProps {
  content: {
    title: string;
    value?: string | number;
    subValue?: string;
  } | null;
  x: number;
  y: number;
}

export default function MapTooltip({ content, x, y }: MapTooltipProps) {
  if (!content) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="pointer-events-none"
      >
        <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-3 -translate-x-1/2 -translate-y-full shadow-2xl">
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">
            {content.title}
          </div>
          {content.value !== undefined && (
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tighter">
                {content.value}
              </span>
              {content.subValue && (
                <span className="text-[10px] uppercase font-medium text-white/60">
                  {content.subValue}
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

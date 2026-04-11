"use client";

import { useState, useEffect } from "react";
import type { FunFact } from "@/types/database";

interface FunFactBannerProps {
  fact: FunFact | null;
}

export default function FunFactBanner({ fact }: FunFactBannerProps) {
  const [visible, setVisible] = useState(false);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (!fact) return;
    setVisible(true);

    // Typewriter effect
    let i = 0;
    setDisplayText("");
    const interval = setInterval(() => {
      if (i < fact.fact_text.length) {
        setDisplayText(fact.fact_text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [fact]);

  if (!fact || !visible) return null;

  return (
    <div
      id="fun-fact-banner"
      className="glass-sm p-5 animate-fade-in-up relative overflow-hidden"
      style={{ animationFillMode: "forwards" }}
    >
      {/* Decorative shimmer */}
      <div className="absolute inset-0 animate-shimmer pointer-events-none" />

      <div className="relative z-10 flex items-start gap-3">
        <span className="text-2xl flex-shrink-0 mt-0.5">💡</span>
        <div>
          <h4 className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1.5 font-medium">
            Did you know?
          </h4>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {displayText}
            <span className="inline-block w-0.5 h-4 bg-white/40 ml-0.5 animate-pulse align-middle" />
          </p>
          <p className="text-[10px] text-[var(--text-muted)] mt-2">
            AQI range: {fact.min_aqi}–{fact.max_aqi}
          </p>
        </div>
      </div>
    </div>
  );
}

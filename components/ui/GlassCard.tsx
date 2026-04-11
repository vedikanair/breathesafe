"use client";

import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  hoverable?: boolean;
  id?: string;
}

export default function GlassCard({
  children,
  className = "",
  glowColor,
  onClick,
  hoverable = false,
  id,
}: GlassCardProps) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-white/[0.02] border border-white/[0.06] rounded-[2rem]
        transition-all duration-500 ease-in-out
        ${hoverable ? "cursor-pointer hover:bg-white/[0.04] hover:border-white/[0.12] hover:translate-y-[-2px]" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      style={
        glowColor
          ? {
              boxShadow: `0 0 40px ${glowColor}10`,
            }
          : undefined
      }
    >
      {/* Precision top highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
      {children}
    </div>
  );
}

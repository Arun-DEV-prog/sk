// @ts-nocheck
import React from "react";
import CasinoChip from "./CasinoChip";

export type ZoneColor = "purple" | "red" | "blue";

interface Props {
  zoneKey: "A" | "B" | "C";
  color: ZoneColor;
  myBet: number;
  totalBet: number;
  multiplier?: string;
  isWinner?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const ZONE_THEMES = {
  purple: {
    headerBg: "bg-[#9333ea]/80 border-[#c084fc]/50",
    bodyBg: "from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9]",
    bodyBorder: "border-[#a855f7]/60",
    patternColor: "#c084fc",
    glow: "shadow-[0_0_25px_rgba(168,85,247,0.8)] ring-4 ring-yellow-300",
    chipColor: 10000,
  },
  red: {
    headerBg: "bg-[#dc2626]/80 border-[#f87171]/50",
    bodyBg: "from-[#ef4444] via-[#dc2626] to-[#b91c1c]",
    bodyBorder: "border-[#f87171]/60",
    patternColor: "#fca5a5",
    glow: "shadow-[0_0_25px_rgba(239,68,68,0.8)] ring-4 ring-yellow-300",
    chipColor: 100000,
  },
  blue: {
    headerBg: "bg-[#2563eb]/80 border-[#60a5fa]/50",
    bodyBg: "from-[#3b82f6] via-[#2563eb] to-[#1d4ed8]",
    bodyBorder: "border-[#60a5fa]/60",
    patternColor: "#93c5fd",
    glow: "shadow-[0_0_25px_rgba(59,130,246,0.8)] ring-4 ring-yellow-300",
    chipColor: 1000,
  },
};

export default function BetZone({
  zoneKey,
  color,
  myBet = 0,
  totalBet = 0,
  multiplier = "2.9x",
  isWinner = false,
  disabled = false,
  onClick,
  className = "",
}: Props) {
  const theme = ZONE_THEMES[color] || ZONE_THEMES.red;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative flex flex-col w-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 select-none group border-2 ${
        isWinner
          ? `${theme.glow} scale-[1.03] z-20`
          : `${theme.bodyBorder} hover:scale-[1.01] active:scale-[0.98]`
      } ${disabled ? "cursor-default opacity-90" : ""} ${className}`}
    >
      {/* 1. Header Bar with MyBet / TotalBet */}
      <div
        className={`w-full py-1 px-2 border-b flex items-center justify-center font-bold text-[11px] tracking-wide backdrop-blur-sm ${theme.headerBg}`}
      >
        <span className="text-yellow-300 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {myBet}
        </span>
        <span className="text-white/90 font-mono">/{totalBet}</span>
      </div>

      {/* 2. Main Box Body with Diamond/Argyle Pattern */}
      <div
        className={`relative w-full flex-1 flex flex-col items-center justify-center py-4 px-2 min-h-[90px] bg-gradient-to-b ${theme.bodyBg}`}
      >
        {/* Subtle Diamond Argyle Pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
          viewBox="0 0 40 60"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id={`argyle-${color}`} width="12" height="18" patternUnits="userSpaceOnUse">
              <path
                d="M 6,0 L 12,9 L 6,18 L 0,9 Z"
                fill="none"
                stroke={theme.patternColor}
                strokeWidth="0.8"
              />
              <path
                d="M 0,0 L 12,18 M 12,0 L 0,18"
                stroke={theme.patternColor}
                strokeWidth="0.4"
                strokeDasharray="1 1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#argyle-${color})`} />
        </svg>

        {/* Placed Chip Indicators (if bet > 0 or simulated pot > 0) */}
        <div className="absolute top-2 left-2 flex items-center gap-1">
          {myBet > 0 && (
            <div className="animate-bounce">
              <CasinoChip value={myBet >= 100000 ? 100000 : myBet >= 10000 ? 10000 : myBet >= 1000 ? 1000 : 100} size="sm" />
            </div>
          )}
          {myBet === 0 && totalBet > 0 && (
            <div className="opacity-90">
              <CasinoChip value={theme.chipColor} size="sm" />
            </div>
          )}
        </div>

        {/* Multiplier in Big Bold White */}
        <div className="relative z-10 text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          {multiplier}
        </div>

        {/* Winner Highlight Crown / Badge */}
        {isWinner && (
          <div className="absolute -top-3 right-1 z-30 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-black font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg border border-yellow-100 uppercase animate-pulse flex items-center gap-1">
            <span>👑 WIN</span>
          </div>
        )}
      </div>
    </button>
  );
}

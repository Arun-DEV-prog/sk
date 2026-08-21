// @ts-nocheck
import React from "react";

export type ChipValue = 100 | 1000 | 10000 | 100000;

interface Props {
  value: number;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  as?: "button" | "div";
}

// Colors matched directly against the reference screenshot:
// 1K = copper/orange, 10K = olive green, 100K = royal blue, 1000K = dark maroon (NOT pink).
export const CHIP_CONFIGS: Record<number, { label: string; bg: string; border: string; textColor: string; textShadow: string; badgeBg: string }> = {
  100: {
    label: "1K",
    bg: "radial-gradient(circle at 35% 28%, #f0a04b 0%, #c9711f 40%, #7a3f0c 78%, #a85a19 100%)",
    border: "#ffd9a0",
    textColor: "#ffffff",
    textShadow: "0 1px 2px #4a1f00",
    badgeBg: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(122,63,12,0.55) 100%)",
  },
  1000: {
    label: "10K",
    bg: "radial-gradient(circle at 35% 28%, #b9c96a 0%, #74821f 40%, #3c4610 78%, #5c6b18 100%)",
    border: "#e4ecac",
    textColor: "#ffffff",
    textShadow: "0 1px 2px #1f2608",
    badgeBg: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(60,70,16,0.55) 100%)",
  },
  10000: {
    label: "100K",
    bg: "radial-gradient(circle at 35% 28%, #5f9dfb 0%, #2054c2 40%, #0e2564 78%, #1a3a92 100%)",
    border: "#bcd8ff",
    textColor: "#ffffff",
    textShadow: "0 1px 2px #071433",
    badgeBg: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(14,37,100,0.55) 100%)",
  },
  100000: {
    label: "1000K",
    bg: "radial-gradient(circle at 35% 28%, #d9707f 0%, #8b1e33 40%, #430c17 78%, #6b1826 100%)",
    border: "#f0b7c0",
    textColor: "#ffffff",
    textShadow: "0 1px 2px #300810",
    badgeBg: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(67,12,23,0.55) 100%)",
  },
};

// Bowtie/hourglass edge pips — six positions evenly spaced around the rim,
// matching the small paired-triangle marks visible in the reference chips.
function EdgePips({ color }: { color: string }) {
  const positions = [0, 60, 120, 180, 240, 300];
  return (
    <>
      {positions.map((deg) => (
        <g key={deg} transform={`rotate(${deg} 22 22)`}>
          <polygon points="22,4.5 24.4,7.5 19.6,7.5" fill={color} opacity="0.95" />
          <polygon points="22,8.8 24.4,5.8 19.6,5.8" fill={color} opacity="0.6" />
        </g>
      ))}
    </>
  );
}

export default function CasinoChip({
  value,
  selected = false,
  onClick,
  size = "md",
  className = "",
  as,
}: Props) {
  const cfg = CHIP_CONFIGS[value] || CHIP_CONFIGS[100];

  const sizeClasses = {
    sm: "w-7 h-7 text-[9px]",
    md: "w-11 h-11 text-xs",
    lg: "w-13 h-13 text-sm",
  }[size];

  const isButton = as === "button" || (as === undefined && typeof onClick === "function");
  const Component = isButton ? "button" : "div";

  return (
    <Component
      type={isButton ? "button" : undefined}
      onClick={onClick}
      aria-pressed={isButton ? selected : undefined}
      title={selected ? `Holding ${cfg.label} — tap again to release` : `Hold ${cfg.label} to bet`}
      className={`relative group rounded-full ${sizeClasses} transition-all duration-200 flex items-center justify-center select-none ${
        isButton ? "cursor-pointer active:scale-90" : "pointer-events-none"
      } ${
        selected
          ? "scale-110 -translate-y-1 shadow-[0_0_15px_rgba(250,204,21,0.9)] ring-2 ring-yellow-300 ring-offset-2 ring-offset-[#1b4e64]"
          : "hover:scale-105 shadow-[0_3px_5px_rgba(0,0,0,0.55)]"
      } ${className}`}
      style={{
        background: cfg.bg,
        border: `1.5px solid ${cfg.border}`,
      }}
    >
      {/* Edge pip marks + inner rim */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 44 44">
        <EdgePips color="#ffffff" />
        <circle cx="22" cy="22" r="15" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.35" />
      </svg>

      {/* Subtle top-to-bottom shading band behind the label, like the reference chips */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: cfg.badgeBg }}
      />

      {/* Center value text */}
      <span
        className="relative z-10 font-black tracking-tight font-sans drop-shadow leading-none"
        style={{
          color: cfg.textColor,
          textShadow: cfg.textShadow,
        }}
      >
        {cfg.label}
      </span>
    </Component>
  );
}
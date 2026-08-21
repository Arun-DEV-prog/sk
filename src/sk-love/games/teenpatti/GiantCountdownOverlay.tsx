// @ts-nocheck
import React, { useEffect, useState } from "react";

interface Props {
  seconds: number;
  show: boolean;
}

export default function GiantCountdownOverlay({ seconds, show }: Props) {
  const [pop, setPop] = useState(false);
  const [wave, setWave] = useState(false);

  useEffect(() => {
    setPop(true);
    setWave(true);
    const t1 = setTimeout(() => setPop(false), 320);
    const t2 = setTimeout(() => setWave(false), 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [seconds]);

  if (!show || seconds <= 0) return null;

  return (
    <div className="absolute inset-x-0 top-0 h-[48%] z-15 pointer-events-none flex items-center justify-center select-none overflow-visible">
      {/* 1. Rotating Sunburst Rays around upper middle */}
      <div
        className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] opacity-45 animate-spin"
        style={{ animationDuration: "18s" }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <radialGradient id="sunburstGrad2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#4ade80" stopOpacity="0.4" />
              <stop offset="80%" stopColor="#38bdf8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>
          </defs>
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <polygon
              key={deg}
              points="100,100 86,0 114,0"
              transform={`rotate(${deg} 100 100)`}
              fill="url(#sunburstGrad2)"
            />
          ))}
        </svg>
      </div>

      {/* 2. Expanding Energy Shockwave Ring on each second */}
      {wave && (
        <div
          className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-yellow-300/70 animate-ping pointer-events-none"
          style={{ animationDuration: "550ms" }}
        />
      )}

      {/* 3. Radiant Aura Glow */}
      <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-gradient-to-r from-yellow-300/25 via-emerald-400/20 to-cyan-400/25 blur-2xl animate-pulse" />

      {/* 4. GIANT HOLOGRAPHIC 3D NUMBER POSITIONED UPPER ON MIDDLE TEXT */}
      <div
        className={`absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 flex items-center justify-center ${
          pop ? "scale-120 drop-shadow-[0_0_35px_rgba(250,204,21,0.9)]" : "scale-100 drop-shadow-[0_8px_25px_rgba(0,0,0,0.5)]"
        }`}
      >
        <span
          className="font-sans font-black text-[150px] md:text-[180px] leading-none tracking-tighter"
          style={{
            background: "linear-gradient(180deg, #4ade80 0%, #facc15 35%, #f472b6 70%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            WebkitTextStroke: "3.5px rgba(255, 255, 255, 0.75)",
            opacity: 0.85,
          }}
        >
          {seconds}
        </span>
      </div>
    </div>
  );
}

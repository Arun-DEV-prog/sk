// @ts-nocheck
import React, { useEffect, useState } from "react";

interface Props {
  seconds: number;
  showCountdown: boolean;
  totalPot: number;
  userBet: number;
  heldChip?: number | null;
}

export default function CenterMultiplierWithCountdown({
  seconds,
  showCountdown = true,
  totalPot = 173000,
  userBet = 0,
  heldChip = null,
}: Props) {
  const [pop, setPop] = useState(false);
  const [wave, setWave] = useState(false);
  const heldChipLabel = heldChip === 100 ? "1K" : heldChip === 1000 ? "10K" : heldChip === 10000 ? "100K" : "1000K";
  const heldChipColor = heldChip === 1000
    ? "bg-[radial-gradient(circle_at_35%_30%,#e8f48c_0%,#8caa18_45%,#40590c_100%)]"
    : heldChip === 10000
    ? "bg-[radial-gradient(circle_at_35%_30%,#78bfff_0%,#2b60ba_45%,#152d7c_100%)]"
    : heldChip === 100000
    ? "bg-[radial-gradient(circle_at_35%_30%,#fb8eba_0%,#b42f70_45%,#631336_100%)]"
    : "bg-[radial-gradient(circle_at_35%_30%,#ffd85a_0%,#d58a16_45%,#70400b_100%)]";

  const isBigCountdown = false;

  useEffect(() => {
    setPop(true);
    if (isBigCountdown) setWave(true);
    const t1 = setTimeout(() => setPop(false), 300);
    const t2 = setTimeout(() => setWave(false), 550);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [seconds, isBigCountdown]);

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full max-w-[280px] mx-auto min-h-[112px]">
      {/* 1. GIANT 3D HOLOGRAPHIC COUNTDOWN (ONLY FOR 3, 2, 1) */}
      {showCountdown && isBigCountdown && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-0">
          {/* Rotating Sunburst Rays */}
          <div
            className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] opacity-50 animate-spin"
            style={{ animationDuration: "14s" }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <radialGradient id="sunburstGradBig" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
                  <stop offset="35%" stopColor="#4ade80" stopOpacity="0.5" />
                  <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </radialGradient>
              </defs>
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <polygon
                  key={deg}
                  points="100,100 86,0 114,0"
                  transform={`rotate(${deg} 100 100)`}
                  fill="url(#sunburstGradBig)"
                />
              ))}
            </svg>
          </div>

          {/* Shockwave expanding ring */}
          {wave && (
            <div
              className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-3 border-yellow-300 animate-ping"
              style={{ animationDuration: "500ms" }}
            />
          )}

          {/* Radiant Aura */}
          <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full bg-gradient-to-r from-yellow-300/35 via-emerald-400/25 to-cyan-400/35 blur-2xl animate-pulse" />

          {/* GIANT 3D NUMBER (3, 2, 1) */}
          <div
            className={`absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-250 ${
              pop ? "scale-125" : "scale-100"
            }`}
          >
            <span
              className="font-sans font-black text-[190px] md:text-[220px] leading-none tracking-tighter filter drop-shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
              style={{
                background: "linear-gradient(180deg, #4ade80 0%, #facc15 35%, #f472b6 68%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                WebkitTextStroke: "4px rgba(255, 255, 255, 0.8)",
                opacity: 0.9,
              }}
            >
              {seconds}
            </span>
          </div>
        </div>
      )}

      {/* 2. SMALL COMPACT COUNTDOWN TIMER (FOR SECONDS > 3) */}
      {showCountdown && !isBigCountdown && seconds > 0 && (
        <div className="absolute -bottom-1 right-3 z-30 flex items-center justify-center pointer-events-none">
          <div
            className={`flex items-center justify-center bg-[#1d6482] border-2 border-[#84b7cb] rounded-full w-8 h-8 shadow-[0_2px_4px_rgba(0,0,0,.45)] transition-transform ${
              pop ? "scale-110" : "scale-100"
            }`}
          >
            <span className="text-[13px] font-black text-white font-mono tracking-tight">
              {seconds}
            </span>
          </div>
        </div>
      )}

      {/* 3. CROWN (Positioned on top border of the small card) */}
      <div className="relative -mb-3 z-20 filter drop-shadow-[0_2px_8px_rgba(250,204,21,0.95)]">
        <svg viewBox="0 0 80 50" className="w-12 h-8" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="crownGoldUnified2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="30%" stopColor="#fde047" />
              <stop offset="60%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <radialGradient id="crownCapUnified2" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="60%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </radialGradient>
          </defs>

          {/* Red Velvet Inner Cap */}
          <path d="M 22,35 Q 26,16 40,14 Q 54,16 58,35 Z" fill="url(#crownCapUnified2)" />

          {/* Crown Base & Spikes */}
          <path
            d="M 12,38 
               L 16,18 L 28,28 L 40,8 L 52,28 L 64,18 L 68,38 
               Q 40,44 12,38 Z"
            fill="url(#crownGoldUnified2)"
            stroke="#78350f"
            strokeWidth="1"
          />

          {/* Jewels on Spike Tips */}
          <circle cx="16" cy="18" r="2.5" fill="#ffffff" stroke="#eab308" strokeWidth="0.8" />
          <circle cx="40" cy="8" r="3.2" fill="#60a5fa" stroke="#ffffff" strokeWidth="0.8" />
          <circle cx="64" cy="18" r="2.5" fill="#ffffff" stroke="#eab308" strokeWidth="0.8" />

          {/* Crown Base Rim with Rubies */}
          <rect x="14" y="36" width="52" height="5" rx="2" fill="url(#crownGoldUnified2)" stroke="#78350f" strokeWidth="0.8" />
          <circle cx="24" cy="38.5" r="1.5" fill="#ef4444" />
          <circle cx="40" cy="38.5" r="1.8" fill="#3b82f6" />
          <circle cx="56" cy="38.5" r="1.5" fill="#ef4444" />
        </svg>
      </div>

      {/* 4. SMALL TRANSLUCENT FROSTED GLASS MULTIPLIER CARD */}
      <div className="relative z-10 w-[184px] bg-[#2b667c]/65 backdrop-blur-md border border-[#8bb6c5]/70 rounded-b-lg rounded-t-[9px] pt-3 pb-1 px-2 text-center shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
        {/* Multipliers List */}
        <div className="space-y-0 text-[9px] font-extrabold tracking-wide text-white drop-shadow">
          <div className="flex items-center justify-between px-1">
            <span>FLUSH <span className="text-yellow-300 font-mono">x4</span></span>
            <span>STRAIGHT <span className="text-yellow-300 font-mono">x2</span></span>
          </div>
          <div>
            <span>STRAIGHT FLUSH <span className="text-yellow-300 font-mono">x10</span></span>
          </div>
          <div>
            <span className="text-pink-400 font-black drop-shadow-[0_0_6px_rgba(244,114,182,0.9)]">
              THREE OF A KIND <span className="text-yellow-300 font-mono">x25</span>
            </span>
          </div>
        </div>

        {/* Bottom Pot / Mine Split Bar */}
        <div className="mt-1 pt-0.5 border-t border-cyan-400/25 flex items-center justify-center font-mono font-bold text-[9px]">
          <span className="text-white drop-shadow">{totalPot.toLocaleString()}</span>
          <span className="text-slate-400 mx-1">/</span>
          <span className="text-yellow-300 drop-shadow">{userBet.toLocaleString()}</span>
        </div>
        {heldChip && (
          <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-yellow-200/70 bg-[#123d4f] px-2 py-0.5 shadow-[0_2px_7px_rgba(0,0,0,.45)] animate-in fade-in zoom-in-90 duration-150">
            <span className={`h-3 w-3 rounded-full border border-[#fff0a0] ${heldChipColor} shadow-[0_0_5px_rgba(255,214,62,.8)]`} />
            <span className="text-[8px] font-black tracking-wide text-[#ffe76a]">HOLDING {heldChipLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// @ts-nocheck
import React from "react";

interface Props {
  totalPot: number;
  userBet: number;
  className?: string;
}

export default function CrownMultiplierCard({ totalPot = 173000, userBet = 0, className = "" }: Props) {
  return (
    <div className={`relative flex flex-col items-center justify-center select-none w-full max-w-[210px] mx-auto z-20 ${className}`}>
      {/* 👑 Golden Royal Crown (Compact) */}
      <div className="relative -mb-3.5 z-20 filter drop-shadow-[0_2px_8px_rgba(250,204,21,0.9)]">
        <svg viewBox="0 0 80 50" className="w-12 h-8" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="crownGoldSmall" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="30%" stopColor="#fde047" />
              <stop offset="60%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <radialGradient id="crownCapSmall" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="60%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </radialGradient>
          </defs>

          {/* Red Velvet Inner Cap */}
          <path d="M 22,35 Q 26,16 40,14 Q 54,16 58,35 Z" fill="url(#crownCapSmall)" />

          {/* Crown Base & Spikes */}
          <path
            d="M 12,38 
               L 16,18 L 28,28 L 40,8 L 52,28 L 64,18 L 68,38 
               Q 40,44 12,38 Z"
            fill="url(#crownGoldSmall)"
            stroke="#78350f"
            strokeWidth="1"
          />

          {/* Jewels on Spike Tips */}
          <circle cx="16" cy="18" r="2.5" fill="#ffffff" stroke="#eab308" strokeWidth="0.8" />
          <circle cx="40" cy="8" r="3.2" fill="#60a5fa" stroke="#ffffff" strokeWidth="0.8" />
          <circle cx="64" cy="18" r="2.5" fill="#ffffff" stroke="#eab308" strokeWidth="0.8" />

          {/* Crown Base Rim with Rubies */}
          <rect x="14" y="36" width="52" height="5" rx="2" fill="url(#crownGoldSmall)" stroke="#78350f" strokeWidth="0.8" />
          <circle cx="24" cy="38.5" r="1.5" fill="#ef4444" />
          <circle cx="40" cy="38.5" r="1.8" fill="#3b82f6" />
          <circle cx="56" cy="38.5" r="1.5" fill="#ef4444" />
        </svg>
      </div>

      {/* 🪟 Small / Compact Translucent Frosted Glass Multiplier Card */}
      <div className="w-full bg-[#1b4e64]/65 backdrop-blur-md border border-[#38bdf8]/35 rounded-xl pt-3.5 pb-1 px-2.5 text-center shadow-[0_6px_16px_rgba(0,0,0,0.35)]">
        {/* Multipliers List (Compact size) */}
        <div className="space-y-0 text-[9.5px] font-extrabold tracking-wide text-white drop-shadow">
          <div className="flex items-center justify-center gap-3">
            <span>Straight <span className="text-yellow-300 font-mono">x2</span></span>
            <span>Flush <span className="text-yellow-300 font-mono">x4</span></span>
          </div>
          <div>
            <span>Straight Flush <span className="text-yellow-300 font-mono">x10</span></span>
          </div>
          <div>
            <span className="text-pink-400 font-black drop-shadow-[0_0_6px_rgba(244,114,182,0.9)]">
              Leopard <span className="text-yellow-300 font-mono">x25</span>
            </span>
          </div>
        </div>

        {/* Bottom Pot / Mine Split Bar (Compact) */}
        <div className="mt-1 pt-0.5 border-t border-cyan-400/25 flex items-center justify-center font-mono font-bold text-[9.5px]">
          <span className="text-white drop-shadow">{totalPot.toLocaleString()}</span>
          <span className="text-slate-400 mx-1">/</span>
          <span className="text-yellow-300 drop-shadow">{userBet.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

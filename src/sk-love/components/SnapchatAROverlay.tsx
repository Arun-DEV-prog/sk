import React, { useMemo } from "react";

export type SnapchatLensId =
  | "none"
  | "cat-ears"
  | "angel-halo"
  | "butterfly-crown"
  | "bunny-ears"
  | "heart-glasses"
  | "royal-crown"
  | "star-glitter"
  | "ring-light";

export interface SnapchatBeautyParams {
  whiteTone: number; // 0 - 100
  brightness: number; // 0 - 100
  smoothness: number; // 0 - 100
  pinkBlush: number; // 0 - 100
  rosyGlow: number; // 0 - 100
  skinTonePreset?: string; // "natural" | "glass-skin" | "warm-peach" | "porcelain" | "bronze" | "rose-glow"
}

export const DEFAULT_BEAUTY_PARAMS: SnapchatBeautyParams = {
  whiteTone: 25,
  brightness: 20,
  smoothness: 40,
  pinkBlush: 30,
  rosyGlow: 25,
  skinTonePreset: "glass-skin",
};

interface SnapchatAROverlayProps {
  lensId: SnapchatLensId | string;
  beautyParams?: SnapchatBeautyParams;
  compareOriginal?: boolean;
  className?: string;
}

export const SNAPCHAT_LENSES = [
  {
    id: "none" as SnapchatLensId,
    name: "Natural / Off",
    banglaName: "অরিজিনাল (স্বাভাবিক)",
    icon: "✨",
    color: "#64748b",
  },
  {
    id: "cat-ears" as SnapchatLensId,
    name: "Cute Kitty",
    banglaName: "বিড়াল কান ও গোঁফ",
    icon: "🐱",
    color: "#f472b6",
  },
  {
    id: "angel-halo" as SnapchatLensId,
    name: "Angel Halo",
    banglaName: "এঞ্জেল হ্যালো",
    icon: "😇",
    color: "#fbbf24",
  },
  {
    id: "butterfly-crown" as SnapchatLensId,
    name: "Butterflies",
    banglaName: "প্রজাপতি মুকুট",
    icon: "🦋",
    color: "#38bdf8",
  },
  {
    id: "bunny-ears" as SnapchatLensId,
    name: "Sweet Bunny",
    banglaName: "খরগোশ কান",
    icon: "🐰",
    color: "#fb7185",
  },
  {
    id: "heart-glasses" as SnapchatLensId,
    name: "Heart Glasses",
    banglaName: "হার্ট সানগ্লাস",
    icon: "🕶️",
    color: "#ec4899",
  },
  {
    id: "royal-crown" as SnapchatLensId,
    name: "Royal Crown",
    banglaName: "রয়্যাল ক্রাউন",
    icon: "👑",
    color: "#eab308",
  },
  {
    id: "star-glitter" as SnapchatLensId,
    name: "Star Glitter",
    banglaName: "স্টার গ্লিটার",
    icon: "⭐",
    color: "#a855f7",
  },
  {
    id: "ring-light" as SnapchatLensId,
    name: "Studio Ring Light",
    banglaName: "রিং লাইট ওভারলে",
    icon: "💡",
    color: "#67e8f9",
  },
];

export const SnapchatAROverlay: React.FC<SnapchatAROverlayProps> = ({
  lensId,
  beautyParams = DEFAULT_BEAUTY_PARAMS,
  compareOriginal = false,
  className = "",
}) => {
  if (compareOriginal) {
    return null;
  }

  // Calculate CSS Filter styling for pro beauty tone & smoothness
  const computedFilter = useMemo(() => {
    const wt = (beautyParams.whiteTone || 0) / 100;
    const br = (beautyParams.brightness || 0) / 100;
    const sm = (beautyParams.smoothness || 0) / 100;
    const pb = (beautyParams.pinkBlush || 0) / 100;

    const brightnessVal = 1 + br * 0.22 + wt * 0.15;
    const contrastVal = 1.02 + wt * 0.08 - sm * 0.04;
    const saturateVal = 1.05 + pb * 0.25;

    return `brightness(${brightnessVal.toFixed(2)}) contrast(${contrastVal.toFixed(2)}) saturate(${saturateVal.toFixed(2)})`;
  }, [beautyParams]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-20 overflow-hidden select-none ${className}`}
      style={{
        filter: computedFilter,
      }}
    >
      {/* 🌟 1. SKIN TONE & GLOW TINT OVERLAYS */}
      {beautyParams.pinkBlush > 0 && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-soft-light transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(ellipse at 50% 45%, rgba(251, 113, 133, 0.25) 0%, rgba(244, 114, 182, 0.15) 35%, transparent 70%)",
            opacity: Math.min(1, (beautyParams.pinkBlush / 100) * 1.2),
          }}
        />
      )}

      {beautyParams.whiteTone > 0 && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(255, 255, 255, 0.18) 0%, rgba(240, 249, 255, 0.08) 45%, transparent 75%)",
            opacity: Math.min(1, (beautyParams.whiteTone / 100) * 1.1),
          }}
        />
      )}

      {beautyParams.rosyGlow > 0 && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle at 50% 35%, rgba(253, 164, 175, 0.2) 0%, rgba(251, 207, 232, 0.1) 40%, transparent 80%)",
            opacity: Math.min(1, (beautyParams.rosyGlow / 100) * 1.3),
          }}
        />
      )}

      {/* 🐱 2. CAT EARS & WHISKERS (বিড়াল কান ও গোঁফ) */}
      {lensId === "cat-ears" && (
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[12%] animate-fadeIn">
          {/* Animated Cat Ears */}
          <div className="relative w-64 h-24 flex justify-between px-2">
            {/* Left Ear */}
            <div className="relative animate-bounce" style={{ animationDuration: "2.4s" }}>
              <svg width="84" height="84" viewBox="0 0 100 100" className="drop-shadow-[0_0_12px_rgba(244,114,182,0.8)]">
                <polygon points="10,90 40,10 90,80" fill="#f472b6" stroke="#fdf2f8" strokeWidth="4" strokeLinejoin="round" />
                <polygon points="25,82 42,26 78,75" fill="#fbcfe8" />
                <circle cx="45" cy="50" r="4" fill="#fb7185" />
              </svg>
            </div>

            {/* Right Ear */}
            <div className="relative animate-bounce" style={{ animationDuration: "2.4s", animationDelay: "0.2s" }}>
              <svg width="84" height="84" viewBox="0 0 100 100" className="drop-shadow-[0_0_12px_rgba(244,114,182,0.8)]">
                <polygon points="90,90 60,10 10,80" fill="#f472b6" stroke="#fdf2f8" strokeWidth="4" strokeLinejoin="round" />
                <polygon points="75,82 58,26 22,75" fill="#fbcfe8" />
                <circle cx="55" cy="50" r="4" fill="#fb7185" />
              </svg>
            </div>
          </div>

          {/* Cute Cat Whiskers and Heart Nose */}
          <div className="relative w-60 mt-14 flex items-center justify-center">
            {/* Left Whiskers */}
            <div className="flex flex-col gap-2.5 mr-6 items-end drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">
              <div className="w-16 h-1 rounded-full bg-white rotate-[-6deg] shadow-lg" />
              <div className="w-20 h-1 rounded-full bg-white shadow-lg" />
              <div className="w-16 h-1 rounded-full bg-white rotate-[6deg] shadow-lg" />
            </div>

            {/* Center Cat Nose & Mouth */}
            <div className="flex flex-col items-center">
              <div className="w-5 h-4 bg-pink-400 rounded-b-xl rounded-t-sm shadow-[0_0_10px_rgba(244,114,182,0.9)] animate-pulse" />
              <svg width="28" height="16" viewBox="0 0 40 20" className="mt-0.5">
                <path d="M 10 5 Q 20 18 20 2 M 20 2 Q 20 18 30 5" fill="none" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>

            {/* Right Whiskers */}
            <div className="flex flex-col gap-2.5 ml-6 items-start drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">
              <div className="w-16 h-1 rounded-full bg-white rotate-[6deg] shadow-lg" />
              <div className="w-20 h-1 rounded-full bg-white shadow-lg" />
              <div className="w-16 h-1 rounded-full bg-white rotate-[-6deg] shadow-lg" />
            </div>
          </div>

          {/* Cheeks Blush Stamp */}
          <div className="w-72 mt-2 flex justify-between px-4">
            <div className="w-10 h-7 rounded-full bg-pink-400/40 blur-sm animate-pulse" />
            <div className="w-10 h-7 rounded-full bg-pink-400/40 blur-sm animate-pulse" />
          </div>
        </div>
      )}

      {/* 😇 3. ANGEL HALO & SPARKLES (এঞ্জেল হ্যালো) */}
      {lensId === "angel-halo" && (
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[8%] animate-fadeIn">
          {/* Floating Glowing Halo */}
          <div className="relative flex items-center justify-center animate-pulse" style={{ animationDuration: "2s" }}>
            <div
              className="w-52 h-14 rounded-full border-[6px] border-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.9),inset_0_0_20px_rgba(254,240,138,0.8)] rotate-[-4deg]"
              style={{
                background: "radial-gradient(ellipse at center, rgba(254, 240, 138, 0.4) 0%, transparent 70%)",
              }}
            />
            {/* Sparkle Gems on Halo */}
            <span className="absolute -top-2 left-10 text-xl animate-spin" style={{ animationDuration: "6s" }}>✨</span>
            <span className="absolute -bottom-2 right-12 text-xl animate-spin" style={{ animationDuration: "7s" }}>✨</span>
            <span className="absolute top-0 right-4 text-sm animate-ping">🌟</span>
          </div>

          {/* Shimmer Angelic Aura & Stars */}
          <div className="w-full flex justify-between px-10 mt-12">
            <div className="text-2xl animate-bounce" style={{ animationDuration: "3s" }}>✨</div>
            <div className="text-3xl animate-pulse text-amber-200" style={{ animationDuration: "1.8s" }}>💫</div>
            <div className="text-2xl animate-bounce" style={{ animationDuration: "2.5s" }}>✨</div>
          </div>
        </div>
      )}

      {/* 🦋 4. BUTTERFLY CROWN (প্রজাপতি মুকুট) */}
      {lensId === "butterfly-crown" && (
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[10%] animate-fadeIn">
          {/* Arc of fluttering colorful butterflies */}
          <div className="relative w-80 h-28 flex items-center justify-around">
            <div className="text-3xl animate-bounce drop-shadow-[0_0_15px_rgba(56,189,248,0.9)]" style={{ animationDuration: "1.8s", animationDelay: "0s" }}>
              🦋
            </div>
            <div className="text-4xl -mt-6 animate-bounce drop-shadow-[0_0_18px_rgba(244,114,182,0.9)]" style={{ animationDuration: "2.2s", animationDelay: "0.3s" }}>
              🌸
            </div>
            <div className="text-5xl -mt-10 animate-pulse drop-shadow-[0_0_25px_rgba(168,85,247,0.9)]" style={{ animationDuration: "1.5s" }}>
              🦋
            </div>
            <div className="text-4xl -mt-6 animate-bounce drop-shadow-[0_0_18px_rgba(244,114,182,0.9)]" style={{ animationDuration: "2.2s", animationDelay: "0.5s" }}>
              🌸
            </div>
            <div className="text-3xl animate-bounce drop-shadow-[0_0_15px_rgba(56,189,248,0.9)]" style={{ animationDuration: "1.9s", animationDelay: "0.2s" }}>
              🦋
            </div>
          </div>

          {/* Floating magical sparkles and petals */}
          <div className="w-72 flex justify-between mt-10 px-4">
            <span className="text-lg animate-ping">✨</span>
            <span className="text-sm animate-pulse text-cyan-300">💠</span>
            <span className="text-lg animate-ping" style={{ animationDelay: "0.4s" }}>✨</span>
          </div>
        </div>
      )}

      {/* 🐰 5. SWEET BUNNY EARS (খরগোশ কান) */}
      {lensId === "bunny-ears" && (
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[4%] animate-fadeIn">
          {/* Tall Fluffy Bunny Ears */}
          <div className="relative w-64 h-36 flex justify-between px-6">
            {/* Left Ear */}
            <div className="relative animate-bounce" style={{ animationDuration: "3s" }}>
              <div className="w-14 h-36 rounded-t-full bg-white border-4 border-rose-200 flex items-center justify-center shadow-[0_0_20px_rgba(254,205,211,0.8)] rotate-[-12deg]">
                <div className="w-7 h-28 rounded-t-full bg-pink-300" />
              </div>
            </div>

            {/* Right Ear (Bent/Cute) */}
            <div className="relative animate-bounce" style={{ animationDuration: "3s", animationDelay: "0.3s" }}>
              <div className="w-14 h-36 rounded-t-full bg-white border-4 border-rose-200 flex items-center justify-center shadow-[0_0_20px_rgba(254,205,211,0.8)] rotate-[12deg]">
                <div className="w-7 h-28 rounded-t-full bg-pink-300" />
              </div>
            </div>
          </div>

          {/* Bunny Nose & Whiskers */}
          <div className="relative w-56 mt-20 flex items-center justify-center">
            <div className="flex flex-col gap-2 mr-4">
              <div className="w-12 h-0.5 bg-rose-300 rounded-full rotate-[-4deg]" />
              <div className="w-14 h-0.5 bg-rose-300 rounded-full" />
            </div>

            <div className="w-6 h-5 bg-pink-400 rounded-full shadow-[0_0_10px_rgba(244,114,182,0.9)] flex items-center justify-center text-[10px]">
              💖
            </div>

            <div className="flex flex-col gap-2 ml-4">
              <div className="w-12 h-0.5 bg-rose-300 rounded-full rotate-[4deg]" />
              <div className="w-14 h-0.5 bg-rose-300 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* 🕶️ 6. HEART SUNGLASSES (হার্ট সানগ্লাস) */}
      {lensId === "heart-glasses" && (
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[26%] animate-fadeIn">
          {/* Retro Neon Heart Sunglasses */}
          <div className="relative flex items-center justify-center filter drop-shadow-[0_0_20px_rgba(236,72,153,0.9)]">
            <svg width="260" height="90" viewBox="0 0 300 100">
              {/* Bridge */}
              <line x1="120" y1="42" x2="180" y2="42" stroke="#f472b6" strokeWidth="6" strokeLinecap="round" />
              
              {/* Left Heart Glass */}
              <path
                d="M 70,20 C 35,0 0,30 20,65 C 40,90 70,100 70,100 C 70,100 100,90 120,65 C 140,30 105,0 70,20 Z"
                fill="rgba(244, 63, 94, 0.75)"
                stroke="#fda4af"
                strokeWidth="5"
              />
              {/* Left Reflection Highlight */}
              <path d="M 45,35 Q 65,30 75,45" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3.5" strokeLinecap="round" />

              {/* Right Heart Glass */}
              <path
                d="M 230,20 C 195,0 160,30 180,65 C 200,90 230,100 230,100 C 230,100 260,90 280,65 C 300,30 265,0 230,20 Z"
                fill="rgba(244, 63, 94, 0.75)"
                stroke="#fda4af"
                strokeWidth="5"
              />
              {/* Right Reflection Highlight */}
              <path d="M 205,35 Q 225,30 235,45" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3.5" strokeLinecap="round" />
            </svg>

            {/* Sparkle Glint */}
            <span className="absolute top-1 left-8 text-xl text-white animate-ping">✨</span>
            <span className="absolute top-1 right-8 text-xl text-white animate-ping" style={{ animationDelay: "0.5s" }}>✨</span>
          </div>
        </div>
      )}

      {/* 👑 7. ROYAL CROWN (রয়্যাল ক্রাউন) */}
      {lensId === "royal-crown" && (
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[10%] animate-fadeIn">
          {/* Majestic Golden Crown */}
          <div className="relative flex items-center justify-center drop-shadow-[0_0_25px_rgba(234,179,8,0.9)] animate-pulse" style={{ animationDuration: "2.5s" }}>
            <svg width="220" height="110" viewBox="0 0 240 120">
              {/* Crown Base & Spikes */}
              <polygon
                points="10,100 230,100 220,30 170,70 120,10 70,70 20,30"
                fill="url(#goldGradient)"
                stroke="#fef08a"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              
              {/* Jewels & Gems */}
              <circle cx="120" cy="15" r="10" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="20" cy="35" r="8" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
              <circle cx="220" cy="35" r="8" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
              <circle cx="70" cy="75" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <circle cx="170" cy="75" r="7" fill="#a855f7" stroke="#ffffff" strokeWidth="2" />

              {/* Bottom Headband */}
              <rect x="15" y="86" width="210" height="14" rx="7" fill="#ca8a04" stroke="#fef08a" strokeWidth="2" />
              <circle cx="50" cy="93" r="3" fill="#ffffff" />
              <circle cx="95" cy="93" r="3" fill="#ffffff" />
              <circle cx="145" cy="93" r="3" fill="#ffffff" />
              <circle cx="190" cy="93" r="3" fill="#ffffff" />

              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
              </defs>
            </svg>

            {/* Sparkle Glint on Top Gem */}
            <span className="absolute -top-3 text-2xl animate-spin" style={{ animationDuration: "4s" }}>✨</span>
          </div>

          {/* Golden confetti dots */}
          <div className="w-80 flex justify-between px-6 mt-8">
            <span className="text-yellow-300 text-lg animate-bounce">🪙</span>
            <span className="text-amber-200 text-xl animate-pulse">💎</span>
            <span className="text-yellow-300 text-lg animate-bounce">🪙</span>
          </div>
        </div>
      )}

      {/* ⭐ 8. STAR GLITTER (স্টার গ্লিটার) */}
      {lensId === "star-glitter" && (
        <div className="absolute inset-0 flex flex-col justify-between p-6 animate-fadeIn">
          {/* Shimmering Multi-Color Galaxy Stars */}
          <div className="flex justify-around items-center pt-8">
            <span className="text-2xl animate-ping text-purple-300" style={{ animationDuration: "2s" }}>✨</span>
            <span className="text-4xl animate-pulse text-pink-300" style={{ animationDuration: "1.5s" }}>⭐</span>
            <span className="text-3xl animate-bounce text-cyan-200" style={{ animationDuration: "2.4s" }}>🌟</span>
            <span className="text-2xl animate-ping text-yellow-300" style={{ animationDuration: "1.8s", animationDelay: "0.4s" }}>✨</span>
          </div>

          {/* Mid Face Shimmer & Cheek Freckle Stars */}
          <div className="flex justify-between px-10">
            <div className="flex flex-col gap-1 items-center">
              <span className="text-xs text-yellow-200 animate-pulse">✦</span>
              <span className="text-sm text-pink-300 animate-bounce">✨</span>
              <span className="text-xs text-cyan-200 animate-pulse">✦</span>
            </div>
            <div className="flex flex-col gap-1 items-center">
              <span className="text-xs text-pink-200 animate-pulse">✦</span>
              <span className="text-sm text-yellow-300 animate-bounce">✨</span>
              <span className="text-xs text-purple-200 animate-pulse">✦</span>
            </div>
          </div>

          {/* Bottom Floating Sparkles */}
          <div className="flex justify-around items-center pb-12">
            <span className="text-xl animate-bounce text-fuchsia-300">🌟</span>
            <span className="text-2xl animate-pulse text-amber-200">✨</span>
            <span className="text-xl animate-bounce text-sky-200">⭐</span>
          </div>
        </div>
      )}

      {/* 💡 9. STUDIO RING LIGHT (রিং লাইট ওভারলে) */}
      {lensId === "ring-light" && (
        <div className="absolute inset-0 flex flex-col items-center justify-between p-4 animate-fadeIn">
          {/* Subtle Ring Light Halo around the frame */}
          <div
            className="absolute inset-2 rounded-3xl border-2 border-cyan-300/40 pointer-events-none shadow-[inset_0_0_50px_rgba(103,232,249,0.3),0_0_30px_rgba(103,232,249,0.4)]"
          />

          {/* Dual Catchlight Eyes Reflection */}
          <div className="w-64 mt-28 flex justify-between px-8">
            {/* Left Eye Ring Catchlight */}
            <div className="w-8 h-8 rounded-full border-2 border-white/90 shadow-[0_0_12px_rgba(255,255,255,0.9)] flex items-center justify-center animate-pulse">
              <div className="w-3 h-3 rounded-full bg-white/40" />
            </div>

            {/* Right Eye Ring Catchlight */}
            <div className="w-8 h-8 rounded-full border-2 border-white/90 shadow-[0_0_12px_rgba(255,255,255,0.9)] flex items-center justify-center animate-pulse">
              <div className="w-3 h-3 rounded-full bg-white/40" />
            </div>
          </div>

          {/* Professional Studio Broadcast Glare badge */}
          <div className="mb-14 flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-400/50 text-cyan-200 text-[9px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>4K STUDIO RING LIGHT ACTIVE</span>
          </div>
        </div>
      )}
    </div>
  );
};

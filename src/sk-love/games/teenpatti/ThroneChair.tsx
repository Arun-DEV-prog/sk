// @ts-nocheck
import React from "react";

interface Props {
  color: "purple" | "red" | "blue";
  className?: string;
}

export default function ThroneChair({ color, className = "" }: Props) {
  const configs = {
    purple: {
      cushion: "from-[#8a2be2] via-[#6a0dad] to-[#4b0082]",
      cushionDark: "#38006b",
      cushionLight: "#b76eff",
      gem: "#d8b4fe",
      trim: "from-[#ffe066] via-[#f59e0b] to-[#b45309]",
      glow: "rgba(168, 85, 247, 0.4)",
    },
    red: {
      cushion: "from-[#ef4444] via-[#dc2626] to-[#991b1b]",
      cushionDark: "#7f1d1d",
      cushionLight: "#f87171",
      gem: "#fca5a5",
      trim: "from-[#ffe066] via-[#f59e0b] to-[#b45309]",
      glow: "rgba(239, 68, 68, 0.4)",
    },
    blue: {
      cushion: "from-[#3b82f6] via-[#1d4ed8] to-[#1e3a8a]",
      cushionDark: "#172554",
      cushionLight: "#60a5fa",
      gem: "#93c5fd",
      trim: "from-[#ffe066] via-[#f59e0b] to-[#b45309]",
      glow: "rgba(59, 130, 246, 0.4)",
    },
  };

  const cfg = configs[color] || configs.red;

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 160 180"
        className="w-full h-full filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gold Trim Gradients */}
          <linearGradient id={`goldGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff2a8" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="75%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          <linearGradient id={`goldLight-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Velvet Cushion Gradients */}
          <radialGradient id={`cushionGrad-${color}`} cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor={cfg.cushionLight} />
            <stop offset="50%" stopColor={color === "purple" ? "#7c3aed" : color === "red" ? "#dc2626" : "#2563eb"} />
            <stop offset="100%" stopColor={cfg.cushionDark} />
          </radialGradient>

          <linearGradient id={`cushionLinear-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={cfg.cushionLight} />
            <stop offset="60%" stopColor={color === "purple" ? "#6d28d9" : color === "red" ? "#b91c1c" : "#1d4ed8"} />
            <stop offset="100%" stopColor={cfg.cushionDark} />
          </linearGradient>
        </defs>

        {/* Back Outer Golden Wings / Flames */}
        <path
          d="M 80,10 
             C 95,15 125,25 135,50 
             C 145,75 140,105 130,125 
             C 120,140 105,145 80,145 
             C 55,145 40,140 30,125 
             C 20,105 15,75 25,50 
             C 35,25 65,15 80,10 Z"
          fill={`url(#goldGrad-${color})`}
          stroke="#78350f"
          strokeWidth="1.5"
        />

        {/* Golden Crown Spikes at the Top */}
        <path
          d="M 68,18 Q 80,2 92,18 Q 80,12 68,18 Z"
          fill="#fef08a"
          stroke="#b45309"
          strokeWidth="1"
        />
        <path
          d="M 45,30 Q 55,15 65,22 Q 55,24 45,30 Z"
          fill="#fde047"
          stroke="#b45309"
          strokeWidth="1"
        />
        <path
          d="M 115,30 Q 105,15 95,22 Q 105,24 115,30 Z"
          fill="#fde047"
          stroke="#b45309"
          strokeWidth="1"
        />

        {/* Wing Carvings Detail */}
        <path
          d="M 28,55 Q 38,40 50,45"
          fill="none"
          stroke="#78350f"
          strokeWidth="1.5"
        />
        <path
          d="M 132,55 Q 122,40 110,45"
          fill="none"
          stroke="#78350f"
          strokeWidth="1.5"
        />
        <path
          d="M 24,75 Q 36,65 48,70"
          fill="none"
          stroke="#78350f"
          strokeWidth="1.5"
        />
        <path
          d="M 136,75 Q 124,65 112,70"
          fill="none"
          stroke="#78350f"
          strokeWidth="1.5"
        />

        {/* Top Jewel / Gem */}
        <polygon
          points="80,16 86,24 80,32 74,24"
          fill={cfg.gem}
          stroke="#ffffff"
          strokeWidth="1"
        />

        {/* Main High Back Cushion */}
        <path
          d="M 80,28 
             C 98,28 115,42 118,65 
             C 120,88 115,108 108,120 
             C 100,128 90,130 80,130 
             C 70,130 60,128 52,120 
             C 45,108 40,88 42,65 
             C 45,42 62,28 80,28 Z"
          fill={`url(#cushionGrad-${color})`}
          stroke={`url(#goldLight-${color})`}
          strokeWidth="2.5"
        />

        {/* Velvet Tufting / Diamond Stitching lines */}
        <path
          d="M 80,38 L 98,62 L 80,88 L 62,62 Z"
          fill="none"
          stroke={cfg.cushionLight}
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        <path
          d="M 80,62 L 98,88 L 80,114 L 62,88 Z"
          fill="none"
          stroke={cfg.cushionLight}
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        <circle cx="80" cy="62" r="2.5" fill={cfg.cushionDark} stroke={cfg.cushionLight} strokeWidth="0.8" />
        <circle cx="62" cy="62" r="2" fill={cfg.cushionDark} stroke={cfg.cushionLight} strokeWidth="0.8" />
        <circle cx="98" cy="62" r="2" fill={cfg.cushionDark} stroke={cfg.cushionLight} strokeWidth="0.8" />
        <circle cx="80" cy="88" r="2.5" fill={cfg.cushionDark} stroke={cfg.cushionLight} strokeWidth="0.8" />

        {/* Golden Baroque Armrests */}
        {/* Left Armrest */}
        <path
          d="M 22,95 
             C 22,80 38,82 45,95 
             C 48,102 48,118 42,128 
             C 36,134 26,130 22,122 
             C 18,114 18,102 22,95 Z"
          fill={`url(#goldGrad-${color})`}
          stroke="#78350f"
          strokeWidth="1.5"
        />
        <circle cx="34" cy="92" r="6" fill={`url(#goldLight-${color})`} stroke="#78350f" strokeWidth="1" />

        {/* Right Armrest */}
        <path
          d="M 138,95 
             C 138,80 122,82 115,95 
             C 112,102 112,118 118,128 
             C 124,134 134,130 138,122 
             C 142,114 142,102 138,95 Z"
          fill={`url(#goldGrad-${color})`}
          stroke="#78350f"
          strokeWidth="1.5"
        />
        <circle cx="126" cy="92" r="6" fill={`url(#goldLight-${color})`} stroke="#78350f" strokeWidth="1" />

        {/* Seat Base Cushion */}
        <ellipse
          cx="80"
          cy="125"
          rx="45"
          ry="15"
          fill={`url(#cushionLinear-${color})`}
          stroke={`url(#goldLight-${color})`}
          strokeWidth="2"
        />

        {/* Bottom Golden Frame & Scroll Legs */}
        <path
          d="M 32,130 
             Q 80,145 128,130 
             Q 135,150 132,165 
             Q 120,160 110,142 
             Q 80,152 50,142 
             Q 40,160 28,165 
             Q 25,150 32,130 Z"
          fill={`url(#goldGrad-${color})`}
          stroke="#78350f"
          strokeWidth="1.5"
        />

        {/* Center Base Jewel */}
        <polygon
          points="80,138 85,145 80,152 75,145"
          fill={cfg.gem}
          stroke="#ffffff"
          strokeWidth="0.8"
        />
      </svg>
    </div>
  );
}

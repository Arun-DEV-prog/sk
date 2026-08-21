// @ts-nocheck
import React from "react";

interface Props {
  seconds: number;
  className?: string;
}

export default function CountdownClock({ seconds, className = "" }: Props) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-14 h-14 md:w-16 md:h-16 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gold Bell & Body Gradient */}
          <linearGradient id="clockGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="30%" stopColor="#fde047" />
            <stop offset="60%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Clock Face Inner Green Gradient */}
          <radialGradient id="clockFaceGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="55%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#052e16" />
          </radialGradient>

          {/* Clock Bell Shimmer */}
          <linearGradient id="bellGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>
        </defs>

        {/* Left Twin Bell */}
        <ellipse
          cx="24"
          cy="24"
          rx="12"
          ry="7"
          transform="rotate(-35 24 24)"
          fill="url(#bellGrad)"
          stroke="#78350f"
          strokeWidth="1.5"
        />
        {/* Left Bell Leg */}
        <line x1="28" y1="28" x2="36" y2="36" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />

        {/* Right Twin Bell */}
        <ellipse
          cx="76"
          cy="24"
          rx="12"
          ry="7"
          transform="rotate(35 76 24)"
          fill="url(#bellGrad)"
          stroke="#78350f"
          strokeWidth="1.5"
        />
        {/* Right Bell Leg */}
        <line x1="72" y1="28" x2="64" y2="36" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />

        {/* Top Center Hammer Pin */}
        <rect x="47" y="14" width="6" height="8" rx="2" fill="#d97706" />

        {/* Bottom Feet */}
        <path d="M 28,82 L 20,94" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
        <path d="M 72,82 L 80,94" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />

        {/* Clock Outer Golden Ring */}
        <circle
          cx="50"
          cy="56"
          r="36"
          fill="url(#clockGoldGrad)"
          stroke="#78350f"
          strokeWidth="2"
        />

        {/* Inner Gold Bevel */}
        <circle
          cx="50"
          cy="56"
          r="31"
          fill="none"
          stroke="#fef08a"
          strokeWidth="1.5"
        />

        {/* Clock Green Face */}
        <circle
          cx="50"
          cy="56"
          r="28"
          fill="url(#clockFaceGrad)"
          stroke="#052e16"
          strokeWidth="1"
        />

        {/* Minute Tick Dots */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <circle
            key={deg}
            cx={50 + 24 * Math.cos((deg * Math.PI) / 180)}
            cy={56 + 24 * Math.sin((deg * Math.PI) / 180)}
            r={deg % 90 === 0 ? "1.5" : "0.9"}
            fill="#86efac"
            opacity="0.8"
          />
        ))}

        {/* Numeric Text */}
        <text
          x="50"
          y="65"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="24"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        >
          {Math.max(0, seconds)}
        </text>
      </svg>
    </div>
  );
}

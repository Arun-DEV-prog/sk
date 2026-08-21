// @ts-nocheck
import React from "react";

export function OrangeCocktailDrink({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 100 120" className="w-full h-full filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="70%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
          </linearGradient>
          <linearGradient id="orangeJuice" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#fbbf24" />
            <stop offset="70%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id="creamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>
          <linearGradient id="orangeSlice" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdba74" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>
        </defs>

        {/* Straw */}
        <path d="M 40,10 L 45,35 L 50,85" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M 40,10 L 32,8" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Orange Slice on Rim */}
        <circle cx="70" cy="32" r="14" fill="url(#orangeSlice)" stroke="#fed7aa" strokeWidth="2" />
        <circle cx="70" cy="32" r="10" fill="#ffedd5" />
        <path d="M 70,22 L 70,42 M 60,32 L 80,32 M 63,25 L 77,39 M 63,39 L 77,25" stroke="#ea580c" strokeWidth="1.2" />

        {/* Tall Hurricane Cocktail Glass Liquid */}
        <path
          d="M 32,40 Q 26,60 36,80 Q 42,92 48,96 L 52,96 Q 58,92 64,80 Q 74,60 68,40 Z"
          fill="url(#orangeJuice)"
        />

        {/* Whipped Cream / Ice on Top */}
        <path
          d="M 30,40 Q 40,28 50,32 Q 60,26 70,40 Z"
          fill="url(#creamGrad)"
        />
        <circle cx="48" cy="30" r="3" fill="#ffffff" />
        <circle cx="58" cy="33" r="2.5" fill="#ffffff" />

        {/* Glass Outer Shell */}
        <path
          d="M 30,36 Q 24,60 34,80 Q 42,94 48,98 L 48,108 L 38,114 L 62,114 L 52,108 L 52,98 Q 58,94 66,80 Q 76,60 70,36 Z"
          fill="url(#glassGrad)"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="1.8"
        />

        {/* Glass Reflection Highlight */}
        <path d="M 33,42 Q 28,60 36,78" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

export function RedCocktailFlanDrink({ className = "w-16 h-14" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 120 120" className="w-full h-full filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="redJuice" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="40%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#881337" />
          </linearGradient>
          <linearGradient id="flanCaramel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="25%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>
          <linearGradient id="flanBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
        </defs>

        {/* Cocktail Garnish: Pineapple wedge & green leaf */}
        <path d="M 28,26 L 16,14 L 30,18 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
        <path d="M 32,28 L 22,8 L 38,18 Z" fill="#16a34a" />
        <polygon points="34,30 22,20 38,14 44,28" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
        {/* Cherry */}
        <circle cx="48" cy="24" r="5" fill="#dc2626" />
        <circle cx="46" cy="22" r="1.5" fill="#ffffff" />
        <path d="M 48,20 Q 52,10 60,12" stroke="#7f1d1d" strokeWidth="1.2" fill="none" />

        {/* Straw */}
        <path d="M 52,24 L 62,6 L 68,8" stroke="#fde047" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Martini Glass Liquid */}
        <polygon points="26,34 50,68 74,34" fill="url(#redJuice)" />

        {/* Martini Glass Body */}
        <polygon points="22,32 50,70 78,32" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8" />
        {/* Glass Stem and Base */}
        <line x1="50" y1="70" x2="50" y2="98" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" />
        <ellipse cx="50" cy="100" rx="16" ry="4" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />

        {/* Plate with Flan / Pudding on the Right */}
        {/* Plate */}
        <ellipse cx="88" cy="92" rx="26" ry="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <ellipse cx="88" cy="90" rx="22" ry="6" fill="#f1f5f9" />
        {/* Caramel syrup pool */}
        <ellipse cx="88" cy="89" rx="18" ry="4.5" fill="#92400e" opacity="0.8" />
        {/* Flan Pudding Body */}
        <path
          d="M 74,86 L 78,68 Q 88,64 98,68 L 102,86 Q 88,90 74,86 Z"
          fill="url(#flanBody)"
          stroke="#ca8a04"
          strokeWidth="1"
        />
        {/* Caramel Topping */}
        <ellipse cx="88" cy="68" rx="10" ry="3.5" fill="#78350f" />
        {/* Whipped Cream & Cherry on Flan */}
        <circle cx="88" cy="64" r="3.5" fill="#ffffff" />
        <circle cx="88" cy="61" r="2.5" fill="#ef4444" />
      </svg>
    </div>
  );
}

export function BeerMugDrink({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 100 120" className="w-full h-full filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="beerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="40%" stopColor="#fbbf24" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="woodCoaster" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a16207" />
            <stop offset="50%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
        </defs>

        {/* Wooden Coaster Plate */}
        <ellipse cx="50" cy="102" rx="38" ry="10" fill="url(#woodCoaster)" stroke="#ca8a04" strokeWidth="2" />
        <ellipse cx="50" cy="100" rx="34" ry="8" fill="#78350f" />
        {/* Grain Ring */}
        <ellipse cx="50" cy="100" rx="26" ry="5.5" fill="none" stroke="#92400e" strokeWidth="1" strokeDasharray="6 3" />

        {/* Hops Leaves & Lemon on Coaster */}
        <ellipse cx="26" cy="98" rx="8" ry="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
        <path d="M 22,96 L 28,102" stroke="#ea580c" strokeWidth="1" />
        <path d="M 28,94 L 20,100" stroke="#ea580c" strokeWidth="1" />
        <ellipse cx="34" cy="102" rx="6" ry="4" fill="#4ade80" stroke="#15803d" strokeWidth="1" />
        <ellipse cx="38" cy="100" rx="5" ry="3.5" fill="#22c55e" />

        {/* Beer Mug Handle */}
        <path
          d="M 68,48 Q 88,48 88,68 Q 88,86 68,86"
          fill="none"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Beer Liquid Inside Glass */}
        <rect x="30" y="44" width="40" height="48" rx="4" fill="url(#beerGrad)" />
        {/* Beer Bubbles */}
        <circle cx="38" cy="70" r="1.5" fill="#ffffff" opacity="0.7" />
        <circle cx="48" cy="80" r="2" fill="#ffffff" opacity="0.6" />
        <circle cx="56" cy="62" r="1.5" fill="#ffffff" opacity="0.8" />
        <circle cx="44" cy="55" r="1.8" fill="#ffffff" opacity="0.7" />

        {/* Glass Vertical Facets */}
        <line x1="38" y1="46" x2="38" y2="90" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        <line x1="50" y1="46" x2="50" y2="90" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" />
        <line x1="62" y1="46" x2="62" y2="90" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />

        {/* Beer Mug Glass Outer Shell */}
        <rect
          x="28"
          y="42"
          width="44"
          height="52"
          rx="6"
          fill="rgba(255,255,255,0.12)"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="2"
        />

        {/* Lush Beer Foam on Top */}
        <path
          d="M 26,44 
             C 24,36 32,30 38,34 
             C 42,26 52,24 58,30 
             C 64,26 74,32 72,44 
             C 74,48 68,52 64,48 
             C 58,54 48,52 44,48 
             C 38,54 28,50 26,44 Z"
          fill="#ffffff"
          stroke="#f1f5f9"
          strokeWidth="1.5"
        />
        {/* Foam Drip */}
        <path d="M 34,44 Q 35,54 38,54 Q 40,54 40,44" fill="#ffffff" />
        <path d="M 60,44 Q 61,56 64,56 Q 66,56 66,44" fill="#ffffff" />
      </svg>
    </div>
  );
}

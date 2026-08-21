// @ts-nocheck
import { useEffect, useState } from "react";

export interface PlayingCard {
  rank: string;
  suit: "♠" | "♥" | "♦" | "♣";
}

interface Props {
  card?: PlayingCard;
  faceUp: boolean;
  delay?: number;
  dealDelay?: number;
  dealOriginX?: number;
  dealOriginY?: number;
  highlight?: boolean;
  size?: "sm" | "md";
}

export default function FlipCard({
  card,
  faceUp,
  delay = 0,
  dealDelay = 0,
  dealOriginX = 0,
  dealOriginY = -145,
  highlight = false,
  size = "sm",
}: Props) {
  const [dealt, setDealt] = useState(false);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDealt(true), dealDelay);
    return () => clearTimeout(t);
  }, [dealDelay]);

  useEffect(() => {
    if (!faceUp) {
      setFlipped(false);
      return;
    }
    const t = setTimeout(() => setFlipped(true), delay);
    return () => clearTimeout(t);
  }, [faceUp, delay]);

  const dims = size === "sm" ? "w-[38px] h-[54px]" : "w-[42px] h-[60px]";
  const isRed = card && (card.suit === "♥" || card.suit === "♦");

  return (
    <div
      className={`relative ${dims} select-none`}
      style={{
        perspective: "800px",
        transform: dealt ? "translate3d(0, 0, 0) rotate(0deg)" : `translate3d(${dealOriginX}px, ${dealOriginY}px, 0) rotate(${dealOriginX / 8}deg) scale(.78)`,
        opacity: dealt ? 1 : 0,
        transition: "transform 680ms cubic-bezier(.12,.8,.2,1.14), opacity 160ms ease-out",
      }}
    >
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 500ms cubic-bezier(.4,.05,.2,1)",
        }}
      >
        {/* BACK - Blue/Cyan Diamond Lattice Card matching reference */}
        <div
          className={`absolute inset-0 rounded-md border border-cyan-200/80 shadow-md flex items-center justify-center bg-gradient-to-br from-[#60a5fa] via-[#3b82f6] to-[#2563eb] overflow-hidden ${
            highlight ? "ring-2 ring-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.8)]" : ""
          }`}
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Cyan/Blue Diamond Lattice Pattern */}
          <div className="absolute inset-[1.5px] rounded border border-white/60 bg-[#3b82f6] overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full opacity-80" viewBox="0 0 30 45" preserveAspectRatio="none">
              <defs>
                <pattern id="blueDiamondGrid" width="6" height="6" patternUnits="userSpaceOnUse">
                  <path d="M 3,0 L 6,3 L 3,6 L 0,3 Z" fill="#93c5fd" stroke="#ffffff" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#blueDiamondGrid)" />
            </svg>
          </div>
        </div>

        {/* FRONT - White Card with Rank and Suit */}
        <div
          className={`absolute inset-0 rounded-md bg-white border border-slate-300 shadow-md flex flex-col items-center justify-between p-0.5 ${
            isRed ? "text-red-600" : "text-slate-900"
          } ${highlight ? "ring-2 ring-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.9)]" : ""}`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {card ? (
            <>
              <div className="w-full flex items-center justify-start text-[11px] font-black leading-none pl-0.5">
                {card.rank}
              </div>
              <div className="text-[16px] leading-none my-auto filter drop-shadow">
                {card.suit}
              </div>
              <div className="w-full flex items-center justify-end text-[9px] font-bold leading-none rotate-180 pr-0.5">
                {card.rank}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// @ts-nocheck
import React from "react";
import FlipCard, { PlayingCard } from "./FlipCard";
import CasinoChip from "./CasinoChip";
import { OrangeCocktailDrink, RedCocktailFlanDrink, BeerMugDrink } from "./DrinkIllustrations";

export type StallDrinkType = "orange" | "cocktail" | "beer";

interface Props {
  stallKey: "A" | "B" | "C";
  drinkType: StallDrinkType;
  cards?: PlayingCard[];
  revealed: boolean;
  pot: number;
  myBet: number;
  isWinner: boolean;
  rank?: 1 | 2 | 3 | null;
  handRank?: string | null;
  coinsWon?: number;
  disabled: boolean;
  onClick: () => void;
  isMiddle?: boolean; // unused now — screenshot shows all 3 stalls at equal height
}

const formatKMB = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`;
  return `${num}`;
};

// Denominations to render as a loose chip cluster, biggest→smallest, capped at 3.
function chipStackFor(amount: number): number[] {
  if (amount <= 0) return [];
  const denominations = [100000, 10000, 1000, 100];
  const stack: number[] = [];
  let remaining = amount;
  for (const d of denominations) {
    while (remaining >= d && stack.length < 3) {
      stack.push(d);
      remaining -= d;
    }
  }
  if (stack.length === 0) stack.push(100);
  return stack;
}

// Hand-placed scatter offsets (percent of the cluster box) matching the loose,
// slightly-overlapping "flower" arrangement seen in the reference screenshot —
// distinct per chip count so 1, 2, 4, and 5-chip clusters each read naturally.
const SCATTER: Record<number, { top: number; left: number }[]> = {
  1: [{ top: 20, left: 50 }],
  2: [{ top: 10, left: 38 }, { top: 22, left: 60 }],
  3: [{ top: 4, left: 30 }, { top: 10, left: 52 }, { top: 30, left: 40 }],
};

export default function DrinkStall({
  stallKey,
  drinkType,
  cards,
  revealed = false,
  pot = 0,
  myBet = 0,
  isWinner = false,
  rank = null,
  handRank = null,
  coinsWon = 0,
  disabled = false,
  onClick,
}: Props) {
  const DrinkComponent =
    drinkType === "orange"
      ? OrangeCocktailDrink
      : drinkType === "cocktail"
      ? RedCocktailFlanDrink
      : BeerMugDrink;
  const dealOriginX = stallKey === "A" ? 132 : stallKey === "C" ? -132 : 0;
  const dealStart = stallKey === "A" ? 0 : stallKey === "B" ? 780 : 1560;

  const chips = chipStackFor(pot);
  const scatter = SCATTER[chips.length] || [];

  const outlineColor = isWinner
    ? "border-[#72ff9d]/95 shadow-[0_0_14px_rgba(68,255,130,0.65)]"
    : rank === 2 && revealed
    ? "border-slate-300/70"
    : rank === 3 && revealed
    ? "border-amber-700/70"
    : "border-[#bfe4f2]/55";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative flex flex-col items-center w-full max-w-[104px] select-none transition-transform duration-200 ${
        disabled ? "cursor-default" : "cursor-pointer active:scale-[0.97]"
      } ${isWinner ? "scale-[1.03] z-20" : ""}`}
    >
      {/* Winner glow */}
      {isWinner && (
        <div className="pointer-events-none absolute -inset-2 z-0 rounded-[28px] border-4 border-[#72ff9d]/90 shadow-[0_0_0_2px_rgba(10,44,18,0.9),0_0_18px_rgba(68,255,130,0.9),0_0_32px_rgba(68,255,130,0.8)] animate-pulse" />
      )}

      {/* NECK / ARCH — narrow rounded dome, open at the bottom so it visually
          fuses with the body panel below it */}
      <div
        className={`relative z-10 w-[54%] h-8 border-2 border-b-0 rounded-t-full ${outlineColor}`}
      />

      {/* Drink illustration, overlapping the arch */}
      <div className="relative -mt-[42px] mb-1 z-20 filter drop-shadow">
        <DrinkComponent className="w-11 h-11 sm:w-12 sm:h-12" />
      </div>

      {/* BODY — one continuous bordered panel: card frame + pot + chips on
          top, a visually distinct footer band ("Mine: X") at the bottom */}
      <div className={`relative z-10 -mt-1 w-full rounded-2xl border-2 overflow-hidden ${outlineColor}`}>
        {/* Card frame */}
        <div className="pt-2.5 px-2 flex justify-center">
          <div className="flex rounded-lg overflow-hidden border-2 border-white/85">
            <FlipCard card={cards?.[0]} faceUp={revealed} delay={0} dealDelay={dealStart} dealOriginX={dealOriginX} size="sm" highlight={isWinner} />
            <FlipCard card={cards?.[1]} faceUp={revealed} delay={900} dealDelay={dealStart + 260} dealOriginX={dealOriginX} size="sm" highlight={isWinner} />
            <FlipCard card={cards?.[2]} faceUp={revealed} delay={1800} dealDelay={dealStart + 520} dealOriginX={dealOriginX} size="sm" highlight={isWinner} />
          </div>
        </div>

        {/* Hand rank ribbon (only once revealed) */}
        {revealed && handRank && (
          <div className={`relative mt-1 mx-auto w-fit px-2 py-0.5 text-center text-[9px] font-black uppercase tracking-wide text-[#6a2600] ${isWinner ? "bg-gradient-to-b from-[#ffb052] to-[#e34b2b]" : "bg-gradient-to-b from-[#ffd84c] to-[#d9a312]"}`}>
            {handRank}
          </div>
        )}

        {/* Pot */}
        <div className="mt-1.5 text-center text-[11px] font-semibold text-[#dceff4] tracking-tight">
          Pot: {formatKMB(pot)}
        </div>

        {/* Scattered chip cluster */}
        <div className="relative h-9 mt-0.5">
          {chips.map((val, i) => {
            const pos = scatter[i] || { top: 10, left: 50 };
            return (
              <div
                key={i}
                className="absolute"
                style={{ top: `${pos.top}%`, left: `${pos.left}%`, transform: "translate(-50%, 0)", zIndex: i }}
              >
                <CasinoChip value={val} size="sm" />
              </div>
            );
          })}
        </div>

        {/* Footer band — distinct fill, thin top divider, matches "Mine: X" */}
        <div className="mt-0.5 py-1 border-t border-white/20 bg-black/10 text-center text-[11px] font-semibold text-[#dceff4]">
          Mine: {formatKMB(myBet)}
        </div>
      </div>
    </button>
  );
}
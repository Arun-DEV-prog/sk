import React from "react";
import { Sparkles } from "lucide-react";
import { BEAUTY_PRESETS } from "../beauty/BeautyPresets";
import type { BeautyPresetId } from "../beauty/beautyTypes";

type BeautyControlsProps = {
  beautyEnabled?: boolean;
  beautyStrength?: number;
  beautyPreset?: BeautyPresetId;
  onBeautyToggle?: (next: boolean) => void;
  onBeautyStrengthChange?: (next: number) => void;
  onBeautyPresetChange?: (next: BeautyPresetId) => void;
};

const presetOrder: BeautyPresetId[] = ["natural", "soft", "glow", "studio", "live beauty"];

export default function BeautyControls({
  beautyEnabled = true,
  beautyStrength = 0.5,
  beautyPreset = "natural",
  onBeautyToggle,
  onBeautyStrengthChange,
  onBeautyPresetChange,
}: BeautyControlsProps) {
  return (
    <div className="mt-4 rounded-2xl border border-pink-500/25 bg-slate-950/85 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-500/20 text-pink-200">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-pink-300">Full Camera Beauty</p>
            <p className="text-[8px] text-slate-400">GPU live enhancement</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onBeautyToggle?.(!beautyEnabled)}
          className={`rounded-full border px-2 py-1 text-[8px] font-black uppercase tracking-[0.18em] transition ${
            beautyEnabled
              ? "border-pink-400 bg-pink-500 text-white"
              : "border-slate-700 bg-slate-900 text-slate-300"
          }`}
        >
          {beautyEnabled ? "On" : "Off"}
        </button>
      </div>

      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.18em] text-slate-300">
          <span>Beauty</span>
          <span>{Math.round(beautyStrength * 100)}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(beautyStrength * 100)}
          onChange={(event) => onBeautyStrengthChange?.(Number(event.target.value) / 100)}
          className="h-2 w-full cursor-pointer accent-pink-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {presetOrder.map((presetKey) => {
          const active = beautyPreset === presetKey;
          return (
            <button
              key={presetKey}
              type="button"
              onClick={() => onBeautyPresetChange?.(presetKey)}
              className={`rounded-xl border px-2 py-1.5 text-left transition ${
                active ? "border-pink-400 bg-pink-500/15 text-pink-100" : "border-slate-800 bg-slate-900/70 text-slate-300"
              }`}
            >
              <div className="text-[8px] font-black uppercase tracking-[0.14em]">{presetKey}</div>
              <div className="mt-0.5 text-[7px] text-slate-400">
                {BEAUTY_PRESETS[presetKey]?.smoothing?.toFixed(2) ?? "0.50"} smooth
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

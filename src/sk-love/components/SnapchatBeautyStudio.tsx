import React, { useState } from "react";
import {
  Sparkles,
  Wand2,
  Sliders,
  Eye,
  RotateCcw,
  X,
  Check,
  Zap,
  Flame,
  Crown,
} from "lucide-react";
import {
  SnapchatLensId,
  SnapchatBeautyParams,
  SNAPCHAT_LENSES,
  DEFAULT_BEAUTY_PARAMS,
} from "./SnapchatAROverlay";

export interface SnapchatBeautyStudioProps {
  isOpen: boolean;
  onClose: () => void;
  currentLens: SnapchatLensId | string;
  onLensChange: (lens: SnapchatLensId) => void;
  beautyParams: SnapchatBeautyParams;
  onBeautyParamsChange: (params: SnapchatBeautyParams) => void;
  onCompareStateChange?: (isComparing: boolean) => void;
}

// 1-Click Pro Makeover Presets
const PRO_MAKEOVER_PRESETS = [
  {
    id: "natural-glow",
    name: "Natural Glow",
    bangla: "ন্যাচারাল গ্লো",
    icon: "✨",
    color: "from-amber-400 to-yellow-500",
    params: {
      whiteTone: 20,
      brightness: 15,
      smoothness: 35,
      pinkBlush: 20,
      rosyGlow: 20,
      skinTonePreset: "natural",
    },
    lens: "none" as SnapchatLensId,
  },
  {
    id: "korean-glass",
    name: "Korean Glass Skin",
    bangla: "কোরিয়ান গ্লাস স্কিন",
    icon: "💎",
    color: "from-cyan-400 to-blue-500",
    params: {
      whiteTone: 45,
      brightness: 30,
      smoothness: 70,
      pinkBlush: 35,
      rosyGlow: 40,
      skinTonePreset: "glass-skin",
    },
    lens: "none" as SnapchatLensId,
  },
  {
    id: "pink-blossom",
    name: "Pink Blossom",
    bangla: "পিঙ্ক ব্লসম",
    icon: "🌸",
    color: "from-pink-400 to-rose-500",
    params: {
      whiteTone: 30,
      brightness: 25,
      smoothness: 55,
      pinkBlush: 65,
      rosyGlow: 50,
      skinTonePreset: "rose-glow",
    },
    lens: "cat-ears" as SnapchatLensId,
  },
  {
    id: "sunset-bronze",
    name: "Sunset Bronze",
    bangla: "সানসেট ব্রোঞ্জ",
    icon: "🌅",
    color: "from-orange-400 to-amber-600",
    params: {
      whiteTone: 10,
      brightness: 20,
      smoothness: 45,
      pinkBlush: 40,
      rosyGlow: 30,
      skinTonePreset: "bronze",
    },
    lens: "none" as SnapchatLensId,
  },
  {
    id: "anime-doll",
    name: "Anime Doll",
    bangla: "অ্যানিমে ডল",
    icon: "🎀",
    color: "from-fuchsia-400 to-pink-600",
    params: {
      whiteTone: 50,
      brightness: 35,
      smoothness: 80,
      pinkBlush: 60,
      rosyGlow: 60,
      skinTonePreset: "porcelain",
    },
    lens: "bunny-ears" as SnapchatLensId,
  },
  {
    id: "studio-glam",
    name: "4K Studio Glam",
    bangla: "স্টুডিও গ্ল্যাম",
    icon: "💡",
    color: "from-teal-400 to-emerald-600",
    params: {
      whiteTone: 35,
      brightness: 30,
      smoothness: 60,
      pinkBlush: 40,
      rosyGlow: 45,
      skinTonePreset: "glass-skin",
    },
    lens: "ring-light" as SnapchatLensId,
  },
  {
    id: "royal-queen",
    name: "Royal Royalty",
    bangla: "রয়্যাল ক্রাউন",
    icon: "👑",
    color: "from-yellow-400 to-amber-500",
    params: {
      whiteTone: 40,
      brightness: 25,
      smoothness: 65,
      pinkBlush: 30,
      rosyGlow: 50,
      skinTonePreset: "glass-skin",
    },
    lens: "royal-crown" as SnapchatLensId,
  },
];

const SKIN_TONES = [
  { id: "natural", name: "Natural", color: "#fcd34d", border: "#f59e0b" },
  { id: "glass-skin", name: "Glass Glow", color: "#bae6fd", border: "#38bdf8" },
  { id: "warm-peach", name: "Warm Peach", color: "#fdba74", border: "#fb923c" },
  { id: "porcelain", name: "Porcelain", color: "#fdf2f8", border: "#f472b6" },
  { id: "rose-glow", name: "Rosy Pink", color: "#fbcfe8", border: "#ec4899" },
  { id: "bronze", name: "Sun Bronze", color: "#d97706", border: "#b45309" },
];

export const SnapchatBeautyStudio: React.FC<SnapchatBeautyStudioProps> = ({
  isOpen,
  onClose,
  currentLens,
  onLensChange,
  beautyParams,
  onBeautyParamsChange,
  onCompareStateChange,
}) => {
  const [activeTab, setActiveTab] = useState<"lenses" | "beauty" | "presets">(
    "lenses"
  );
  const [isComparing, setIsComparing] = useState(false);

  if (!isOpen) return null;

  const handleSliderChange = (
    key: keyof SnapchatBeautyParams,
    value: number
  ) => {
    onBeautyParamsChange({
      ...beautyParams,
      [key]: value,
    });
  };

  const applyPreset = (preset: (typeof PRO_MAKEOVER_PRESETS)[0]) => {
    onBeautyParamsChange(preset.params);
    if (preset.lens) {
      onLensChange(preset.lens);
    }
  };

  const handleReset = () => {
    onBeautyParamsChange(DEFAULT_BEAUTY_PARAMS);
    onLensChange("none");
  };

  const startCompare = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsComparing(true);
    onCompareStateChange?.(true);
  };

  const endCompare = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsComparing(false);
    onCompareStateChange?.(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Tap outside to dismiss backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Main Studio Bottom Sheet Container */}
      <div className="relative w-full max-w-lg mx-auto bg-slate-950/95 border-t border-pink-500/40 rounded-t-3xl shadow-[0_-10px_40px_rgba(244,114,182,0.25)] backdrop-blur-2xl flex flex-col max-h-[82vh] overflow-hidden text-slate-100">
        {/* Top Header & Drag Bar */}
        <div className="pt-2 pb-2 px-4 border-b border-white/10 flex flex-col gap-1">
          <div className="w-12 h-1 bg-white/20 rounded-full mx-auto" />
          
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-pink-500 to-rose-500 text-white shadow-md">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                  <span>Snapchat Pro AR & Beauty</span>
                  <span className="text-[8px] bg-pink-500/30 text-pink-300 border border-pink-400/40 px-1.5 py-0.2 rounded-full font-bold">
                    PRO HD
                  </span>
                </h3>
                <p className="text-[9px] text-slate-400 font-medium">
                  ফেস লেন্স, গ্লাস স্কিন ও মেকওভার স্টুডিও
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Reset Button */}
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[10px] font-bold border border-white/10 transition active:scale-95 cursor-pointer"
                title="Reset to default settings"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="h-7 w-7 rounded-full bg-slate-800/90 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
                aria-label="Close studio"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 gap-1.5 mt-2 bg-slate-900/90 p-1 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setActiveTab("lenses")}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                activeTab === "lenses"
                  ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Crown className="h-3.5 w-3.5" />
              <span>AR Lenses</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("beauty")}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                activeTab === "beauty"
                  ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Pro Sliders</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("presets")}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                activeTab === "presets"
                  ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Wand2 className="h-3.5 w-3.5" />
              <span>Makeover</span>
            </button>
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: AR LENSES */}
          {activeTab === "lenses" && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-pink-300 flex items-center gap-1">
                  <span>🎭 AR ফেস লেন্স সিলেক্ট করুন</span>
                </p>
                <span className="text-[9px] text-slate-400">
                  {SNAPCHAT_LENSES.length} টি লেন্স
                </span>
              </div>

              {/* Grid of Lenses */}
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5">
                {SNAPCHAT_LENSES.map((lens) => {
                  const isSelected = currentLens === lens.id;
                  return (
                    <button
                      key={lens.id}
                      type="button"
                      onClick={() => onLensChange(lens.id)}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all active:scale-95 cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-b from-pink-500/20 to-rose-600/30 border-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.4)]"
                          : "bg-slate-900/80 border-white/10 hover:border-pink-400/40 hover:bg-slate-800"
                      }`}
                    >
                      {/* Active indicator badge */}
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-white text-[8px]">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </span>
                      )}

                      {/* Icon Circle */}
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full text-2xl shadow-inner border mb-1.5"
                        style={{
                          backgroundColor: `${lens.color}25`,
                          borderColor: `${lens.color}60`,
                        }}
                      >
                        {lens.icon}
                      </div>

                      <span className="text-[11px] font-black text-white text-center leading-tight">
                        {lens.name}
                      </span>
                      <span className="text-[9px] text-pink-300/80 text-center font-medium mt-0.5">
                        {lens.banglaName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PRO BEAUTY SLIDERS & TONES */}
          {activeTab === "beauty" && (
            <div className="space-y-4 animate-fadeIn">
              {/* Glass Skin Tone Chooser */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-pink-300 mb-2">
                  ✨ স্কিন গ্লো টোন (Skin Tone)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {SKIN_TONES.map((tone) => {
                    const isSelected =
                      (beautyParams.skinTonePreset || "glass-skin") === tone.id;
                    return (
                      <button
                        key={tone.id}
                        type="button"
                        onClick={() =>
                          onBeautyParamsChange({
                            ...beautyParams,
                            skinTonePreset: tone.id,
                          })
                        }
                        className={`flex items-center gap-2 p-2 rounded-xl border transition active:scale-95 cursor-pointer ${
                          isSelected
                            ? "bg-pink-500/20 border-pink-400 text-white shadow-md"
                            : "bg-slate-900/80 border-white/10 text-slate-300 hover:border-white/20"
                        }`}
                      >
                        <span
                          className="h-4 w-4 rounded-full shadow"
                          style={{
                            backgroundColor: tone.color,
                            border: `2px solid ${tone.border}`,
                          }}
                        />
                        <span className="text-[10px] font-bold truncate">
                          {tone.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="space-y-3 bg-slate-900/60 p-3 rounded-2xl border border-white/5">
                {/* 1. White Tone / Lightening */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-black">
                    <span className="text-slate-200 flex items-center gap-1">
                      <span>💡 হোয়াইট টোন (White Tone)</span>
                    </span>
                    <span className="text-pink-300 font-mono">
                      {beautyParams.whiteTone}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={beautyParams.whiteTone}
                    onChange={(e) =>
                      handleSliderChange("whiteTone", Number(e.target.value))
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                </div>

                {/* 2. Brightness */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-black">
                    <span className="text-slate-200 flex items-center gap-1">
                      <span>☀️ ব্রাইটনেস (Brightness)</span>
                    </span>
                    <span className="text-pink-300 font-mono">
                      {beautyParams.brightness}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={beautyParams.brightness}
                    onChange={(e) =>
                      handleSliderChange("brightness", Number(e.target.value))
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                </div>

                {/* 3. Smoothness */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-black">
                    <span className="text-slate-200 flex items-center gap-1">
                      <span>🌸 স্মুথনেস (Smooth Skin)</span>
                    </span>
                    <span className="text-pink-300 font-mono">
                      {beautyParams.smoothness}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={beautyParams.smoothness}
                    onChange={(e) =>
                      handleSliderChange("smoothness", Number(e.target.value))
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                </div>

                {/* 4. Pink Blush */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-black">
                    <span className="text-slate-200 flex items-center gap-1">
                      <span>💄 পিঙ্ক ব্লাশ (Pink Blush)</span>
                    </span>
                    <span className="text-pink-300 font-mono">
                      {beautyParams.pinkBlush}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={beautyParams.pinkBlush}
                    onChange={(e) =>
                      handleSliderChange("pinkBlush", Number(e.target.value))
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                </div>

                {/* 5. Rosy Glow */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-black">
                    <span className="text-slate-200 flex items-center gap-1">
                      <span>💖 রোজি গ্লো (Rosy Glow)</span>
                    </span>
                    <span className="text-pink-300 font-mono">
                      {beautyParams.rosyGlow}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={beautyParams.rosyGlow}
                    onChange={(e) =>
                      handleSliderChange("rosyGlow", Number(e.target.value))
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 1-CLICK PRO MAKEOVER PRESETS */}
          {activeTab === "presets" && (
            <div className="space-y-3 animate-fadeIn">
              <p className="text-[10px] font-black uppercase tracking-widest text-pink-300">
                🪄 ১-ক্লিক প্রো মেকওভার প্রিসেট
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {PRO_MAKEOVER_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="flex flex-col text-left p-3 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-pink-400/60 hover:bg-slate-800/90 transition active:scale-95 group cursor-pointer shadow-md"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-2xl">{preset.icon}</span>
                      <span className="text-[8px] font-black uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full text-pink-300">
                        Preset
                      </span>
                    </div>
                    <span className="text-xs font-black text-white group-hover:text-pink-300 transition">
                      {preset.name}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">
                      {preset.bangla}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar with "Hold to Compare" Button */}
        <div className="p-3 bg-slate-900/95 border-t border-white/10 flex items-center justify-between gap-3">
          {/* 'Hold to Compare' Button */}
          <button
            type="button"
            onMouseDown={startCompare}
            onMouseUp={endCompare}
            onMouseLeave={endCompare}
            onTouchStart={startCompare}
            onTouchEnd={endCompare}
            onTouchCancel={endCompare}
            className={`flex-1 py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 font-black text-xs transition active:scale-95 select-none cursor-pointer ${
              isComparing
                ? "bg-amber-500 border-amber-300 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.7)]"
                : "bg-slate-800/90 border-white/15 text-slate-200 hover:bg-slate-700 hover:border-pink-400/50"
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>
              {isComparing
                ? "Showing Original Feed..."
                : "Hold to Compare (চেপে ধরুন)"}
            </span>
          </button>

          {/* Done / Apply Button */}
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-black text-xs shadow-lg shadow-pink-500/25 active:scale-95 transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

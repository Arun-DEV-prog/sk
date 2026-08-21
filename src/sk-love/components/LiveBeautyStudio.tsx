import React, { useState } from "react";
import {
  Sparkles,
  Sliders,
  RotateCcw,
  X,
  Check,
  Zap,
  Eye,
  Video,
  ShieldCheck,
} from "lucide-react";
import {
  BeautyParameters,
  DEFAULT_BEAUTY_SETTINGS,
  STREAM_FILTERS,
  StreamFilterPreset,
} from "../lib/streamFilters";

export interface LiveBeautyStudioProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilterId?: string;
  currentFilter?: string;
  onFilterChange?: (filterId: string) => void;
  beautyParams?: BeautyParameters;
  onBeautyParamsChange?: (params: BeautyParameters) => void;
  isBeautyEnabled?: boolean;
  onBeautyToggle?: (enabled: boolean) => void;
  onCompareStateChange?: (isComparing: boolean) => void;
}

export const LiveBeautyStudio: React.FC<LiveBeautyStudioProps> = ({
  isOpen,
  onClose,
  currentFilterId,
  currentFilter,
  onFilterChange,
  beautyParams = DEFAULT_BEAUTY_SETTINGS,
  onBeautyParamsChange,
  isBeautyEnabled = true,
  onBeautyToggle,
  onCompareStateChange,
}) => {
  const [activeTab, setActiveTab] = useState<"filters" | "beauty">("filters");
  const [isComparing, setIsComparing] = useState<boolean>(false);

  if (!isOpen) return null;

  const activeFilterId = currentFilterId || currentFilter || "none";

  const handleSelectFilter = (preset: StreamFilterPreset) => {
    onFilterChange?.(preset.id);
    if (preset.id !== "none") {
      onBeautyToggle?.(true);
      onBeautyParamsChange?.(preset.beautyParams);
    }
  };

  const handleSliderChange = (
    key: keyof BeautyParameters,
    value: number,
  ) => {
    onBeautyParamsChange?.({
      ...beautyParams,
      [key]: value,
    });
  };

  const handleResetAll = () => {
    onFilterChange?.("none");
    onBeautyParamsChange?.(DEFAULT_BEAUTY_SETTINGS);
    onBeautyToggle?.(false);
  };

  const handleCompareMouseDown = () => {
    setIsComparing(true);
    onCompareStateChange?.(true);
  };

  const handleCompareMouseUp = () => {
    setIsComparing(false);
    onCompareStateChange?.(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl border-t border-amber-500/30 bg-gradient-to-b from-slate-900/98 via-slate-950/98 to-black p-4 pb-8 shadow-2xl text-white max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle Bar */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-700/80" />

        {/* Studio Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-[0_0_12px_rgba(244,63,94,0.5)]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white tracking-wide">
                  Live Video & Beauty Filter
                </h3>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                  <ShieldCheck className="h-3 w-3" />
                  Agora Stream
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                হোস্ট ও ভিউয়ার উভয়ের স্ক্রিনে রিয়েল-টাইম ফিল্টার পাস হয়
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mt-3 flex rounded-xl bg-slate-900/90 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("filters")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-black transition ${
              activeTab === "filters"
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>ফিল্টার প্রিসেটস ({STREAM_FILTERS.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("beauty")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-black transition ${
              activeTab === "beauty"
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Agora বিউটি ও গ্লো FX</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-3 flex-1 overflow-y-auto pr-1 space-y-3 max-h-[50vh]">
          {activeTab === "filters" && (
            <div className="grid grid-cols-3 gap-2.5">
              {STREAM_FILTERS.map((filter) => {
                const isSelected = activeFilterId === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => handleSelectFilter(filter)}
                    className={`relative flex flex-col items-center justify-between rounded-2xl p-2.5 transition text-center border active:scale-95 ${
                      isSelected
                        ? "border-pink-400 bg-pink-950/40 shadow-[0_0_15px_rgba(244,114,182,0.4)] ring-2 ring-pink-500/60"
                        : "border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    {/* Badge */}
                    <span
                      className={`absolute top-1.5 right-1.5 rounded-full px-1.5 py-0.2 text-[8px] font-black ${
                        isSelected
                          ? "bg-pink-500 text-white"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {filter.badge}
                    </span>

                    {/* Filter Icon Bubble */}
                    <div
                      className={`my-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${filter.colorGrading} shadow-inner text-xl`}
                    >
                      {filter.icon}
                    </div>

                    {/* Filter Label */}
                    <div className="w-full mt-1">
                      <p className="text-[11px] font-bold text-white truncate">
                        {filter.name}
                      </p>
                      <p className="text-[9px] text-slate-400 truncate">
                        {filter.bangla}
                      </p>
                    </div>

                    {/* Selected Checkmark */}
                    {isSelected && (
                      <div className="absolute top-1.5 left-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-white shadow">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === "beauty" && (
            <div className="space-y-4 rounded-2xl bg-slate-900/70 p-3.5 border border-slate-800">
              {/* Master Beauty Toggle */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-pink-400" />
                  <div>
                    <p className="text-xs font-black text-white">
                      Agora Video Beauty Engine
                    </p>
                    <p className="text-[9.5px] text-slate-400">
                      হার্ডওয়্যার অ্যাক্সিলারেটেড লাইভ বিউটিফাইং
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onBeautyToggle?.(!isBeautyEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isBeautyEnabled ? "bg-pink-600" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isBeautyEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Slider 1: Smoothness */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-200">
                    Skin Smoothness (ত্বকের মসৃণতা)
                  </span>
                  <span className="font-mono text-pink-400 font-bold">
                    {Math.round(beautyParams.smoothnessLevel * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={beautyParams.smoothnessLevel}
                  onChange={(e) =>
                    handleSliderChange("smoothnessLevel", parseFloat(e.target.value))
                  }
                  className="w-full accent-pink-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Slider 2: Brightness / Whitening */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-200">
                    Skin Brightness (উজ্জ্বলতা ও গ্লো)
                  </span>
                  <span className="font-mono text-pink-400 font-bold">
                    {Math.round(beautyParams.lighteningLevel * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={beautyParams.lighteningLevel}
                  onChange={(e) =>
                    handleSliderChange("lighteningLevel", parseFloat(e.target.value))
                  }
                  className="w-full accent-pink-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Slider 3: Rosy Blush */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-200">
                    Rosy Tone (গোলাপি আভা ও ঠোঁটের রঙ)
                  </span>
                  <span className="font-mono text-pink-400 font-bold">
                    {Math.round(beautyParams.rednessLevel * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={beautyParams.rednessLevel}
                  onChange={(e) =>
                    handleSliderChange("rednessLevel", parseFloat(e.target.value))
                  }
                  className="w-full accent-pink-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Segmented Control: Contrast Level */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-200">
                    Contrast Level (ভিডিও কনট্রাস্ট)
                  </span>
                  <span className="font-mono text-pink-400 font-bold">
                    {beautyParams.lighteningContrastLevel === 0
                      ? "Low"
                      : beautyParams.lighteningContrastLevel === 2
                        ? "High"
                        : "Normal"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 0 as const, label: "Low (নরম)" },
                    { val: 1 as const, label: "Normal (স্ট্যান্ডার্ড)" },
                    { val: 2 as const, label: "High (স্পষ্ট)" },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() =>
                        handleSliderChange("lighteningContrastLevel", item.val)
                      }
                      className={`rounded-xl py-1.5 text-[10px] font-bold border transition ${
                        beautyParams.lighteningContrastLevel === item.val
                          ? "bg-pink-600 border-pink-400 text-white shadow-md"
                          : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800/60 flex items-center gap-2 text-[9.5px] text-slate-400">
                <Video className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  Agora RTC প্রসেসিংয়ের মাধ্যমে লাইভ ভিডিও স্বয়ংক্রিয়ভাবে ফিল্টার্ড হয়ে ভিউয়ারদের কাছে পৌঁছে যায়।
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 flex items-center gap-2 border-t border-slate-800/80 pt-3">
          {/* Compare Button */}
          <button
            type="button"
            onMouseDown={handleCompareMouseDown}
            onMouseUp={handleCompareMouseUp}
            onTouchStart={handleCompareMouseDown}
            onTouchEnd={handleCompareMouseUp}
            className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition select-none ${
              isComparing
                ? "bg-amber-500 border-amber-400 text-slate-950 shadow-lg"
                : "bg-slate-800/90 border-slate-700 text-slate-200 hover:bg-slate-700"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{isComparing ? "আসল দেখাচ্ছে" : "আসল দেখুন"}</span>
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleResetAll}
            className="flex items-center justify-center gap-1 rounded-xl bg-slate-800/80 border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>রিসেট</span>
          </button>

          {/* Apply & Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 py-2 text-xs font-black text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:opacity-95 active:scale-95 transition"
          >
            <Check className="h-4 w-4 stroke-[3]" />
            <span>সম্পন্ন করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default LiveBeautyStudio;

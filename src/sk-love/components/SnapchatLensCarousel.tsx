import React from "react";
import { Sparkles, Sliders, Eye, X } from "lucide-react";
import {
  SnapchatLensId,
  SNAPCHAT_LENSES,
} from "./SnapchatAROverlay";

export interface SnapchatLensCarouselProps {
  currentLens: SnapchatLensId | string;
  onSelectLens: (lens: SnapchatLensId) => void;
  onOpenFullStudio: () => void;
  onCompareChange?: (isComparing: boolean) => void;
  onClose?: () => void;
  className?: string;
}

export const SnapchatLensCarousel: React.FC<SnapchatLensCarouselProps> = ({
  currentLens,
  onSelectLens,
  onOpenFullStudio,
  onCompareChange,
  onClose,
  className = "",
}) => {
  const [isComparing, setIsComparing] = React.useState(false);

  const startCompare = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsComparing(true);
    onCompareChange?.(true);
  };

  const endCompare = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsComparing(false);
    onCompareChange?.(false);
  };

  return (
    <div
      className={`relative z-30 w-full flex flex-col items-center gap-2 pointer-events-auto select-none ${className}`}
    >
      {/* Top Floating Mini Controls: Hold to Compare & Studio Button */}
      <div className="flex items-center justify-between w-full px-4">
        {/* Hold to Compare Mini Button */}
        <button
          type="button"
          onMouseDown={startCompare}
          onMouseUp={endCompare}
          onMouseLeave={endCompare}
          onTouchStart={startCompare}
          onTouchEnd={endCompare}
          onTouchCancel={endCompare}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border backdrop-blur-md transition active:scale-95 cursor-pointer shadow-lg ${
            isComparing
              ? "bg-amber-500 border-amber-300 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
              : "bg-black/60 border-white/20 text-slate-200 hover:border-pink-400"
          }`}
          title="Hold to view original camera"
        >
          <Eye className="h-3 w-3" />
          <span>{isComparing ? "Raw Feed" : "Compare"}</span>
        </button>

        {/* Center: Selected Lens Name Badge */}
        <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-950/80 border border-pink-500/30 text-pink-300 text-[10px] font-bold backdrop-blur-md shadow">
          <Sparkles className="h-3 w-3 text-pink-400" />
          <span>
            {SNAPCHAT_LENSES.find((l) => l.id === currentLens)?.name || "Lens"}
          </span>
        </div>

        {/* Right: Studio & Close Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenFullStudio}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 border border-pink-400/50 text-white text-[10px] font-black shadow-lg hover:from-pink-500 hover:to-rose-500 active:scale-95 transition cursor-pointer"
            title="Open Pro Beauty Studio"
          >
            <Sliders className="h-3 w-3" />
            <span>Studio</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="h-6 w-6 rounded-full bg-black/60 border border-white/20 text-slate-300 hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
              title="Close lens carousel"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Snapchat Style Lens Dock */}
      <div className="w-full overflow-x-auto no-scrollbar py-2 px-3">
        <div className="flex items-center gap-2.5 mx-auto w-max px-2">
          {SNAPCHAT_LENSES.map((lens) => {
            const isSelected = currentLens === lens.id;
            return (
              <button
                key={lens.id}
                type="button"
                onClick={() => onSelectLens(lens.id)}
                className={`group relative flex flex-col items-center justify-center shrink-0 transition-all duration-200 active:scale-90 cursor-pointer ${
                  isSelected ? "scale-110" : "opacity-75 hover:opacity-100"
                }`}
              >
                {/* Circular Lens Preview */}
                <div
                  className={`relative flex h-13 w-13 items-center justify-center rounded-full text-2xl backdrop-blur-md transition-all ${
                    isSelected
                      ? "border-2 border-white shadow-[0_0_18px_rgba(244,114,182,0.8)] ring-2 ring-pink-500 ring-offset-2 ring-offset-slate-950"
                      : "border border-white/25 bg-black/50 hover:border-pink-400/60"
                  }`}
                  style={{
                    backgroundColor: isSelected
                      ? `${lens.color}40`
                      : "rgba(15, 23, 42, 0.7)",
                  }}
                >
                  <span>{lens.icon}</span>

                  {/* Active Pulse Point */}
                  {isSelected && (
                    <span className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-pink-400 animate-ping" />
                  )}
                </div>

                {/* Lens Name Label under bubble */}
                <span
                  className={`mt-1 text-[8.5px] font-black tracking-tight whitespace-nowrap transition ${
                    isSelected
                      ? "text-pink-300 drop-shadow-[0_0_6px_rgba(244,114,182,0.8)]"
                      : "text-slate-400 group-hover:text-slate-200"
                  }`}
                >
                  {lens.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

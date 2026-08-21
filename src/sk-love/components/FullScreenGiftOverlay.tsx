import React, { useEffect, useRef, useState } from "react";
import { X, Sparkles, Flame, Crown, Gem, Volume2, VolumeX } from "lucide-react";

export interface FullScreenGiftOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  giftName?: string;
  giftIcon?: string;
  giftVideo?: string | null;
  giftImage?: string | null;
  diamonds?: number | string;
  gifterName?: string;
  gifterAvatar?: string | null;
  receiverName?: string | null;
  comboCount?: number;
}

export default function FullScreenGiftOverlay({
  isOpen,
  onClose,
  giftName = "Special Gift",
  giftIcon = "🎁",
  giftVideo = null,
  giftImage = null,
  diamonds = 1000,
  gifterName = "Gifter",
  gifterAvatar = null,
  receiverName = null,
  comboCount = 1,
}: FullScreenGiftOverlayProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoMuted, setVideoMuted] = useState<boolean>(true);
  const [videoError, setVideoError] = useState<boolean>(false);

  // Reset video error when video source changes
  useEffect(() => {
    setVideoError(false);
  }, [giftVideo]);

  // Attempt unmuted or muted autoplay smoothly on mobile devices
  useEffect(() => {
    if (!isOpen || !giftVideo || videoError) return;

    const vid = videoRef.current;
    if (vid) {
      vid.currentTime = 0;
      // Try playing with sound first; fallback to muted if browser blocks autoplay
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          vid.muted = true;
          setVideoMuted(true);
          vid.play().catch(() => {
            // Ignore if blocked entirely
          });
        });
      }
    }
  }, [isOpen, giftVideo, videoError]);

  if (!isOpen) return null;

  const displayIcon = giftIcon || "🎁";
  const numDiamonds = typeof diamonds === "number" ? diamonds : Number(diamonds) || 0;
  const formattedDiamonds = numDiamonds >= 1000000
    ? `${(numDiamonds / 1000000).toFixed(1)}M`
    : numDiamonds >= 1000
    ? `${(numDiamonds / 1000).toFixed(0)}K`
    : numDiamonds.toLocaleString();

  return (
    <div
      className="fixed inset-0 z-[999999] pointer-events-none flex flex-col justify-between items-center w-full h-[100dvh] max-h-[100dvh] overflow-hidden select-none bg-transparent transition-all duration-300 animate-in fade-in"
      style={{
        paddingTop: "max(12px, env(safe-area-inset-top))",
        paddingBottom: "max(16px, env(safe-area-inset-bottom))",
      }}
    >
      {/* ── TOP ROYAL HEADER BANNER (Floating transparent pill) ── */}
      <div className="relative z-50 pointer-events-auto flex items-center justify-between w-full max-w-[94vw] sm:max-w-[480px] mx-auto px-2 animate-in slide-in-from-top-4 duration-400">
        {/* Luxury Gifter & Gift Pill */}
        <div className="flex items-center gap-2.5 bg-gradient-to-r from-black/80 via-[#1b0a2e]/85 to-black/80 border border-amber-400/70 rounded-full py-1 pl-1.5 pr-4 shadow-[0_0_20px_rgba(245,158,11,0.5)] backdrop-blur-md max-w-[85%] sm:max-w-none">
          {/* Gifter Avatar with Crown */}
          <div className="relative shrink-0 flex items-center justify-center">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full overflow-hidden border-2 border-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.8)] bg-slate-950 flex items-center justify-center text-sm font-black text-amber-200">
              {gifterAvatar ? (
                <img src={gifterAvatar} alt={gifterName} className="h-full w-full object-cover" />
              ) : (
                <span>{gifterName.slice(0, 1).toUpperCase()}</span>
              )}
            </div>
            <div className="absolute -top-1.5 -right-1 bg-amber-400 text-slate-950 p-0.5 rounded-full shadow border border-amber-200">
              <Crown className="w-2.5 h-2.5 fill-current" />
            </div>
          </div>

          {/* Gifter Info & Gift Sent Text */}
          <div className="flex flex-col min-w-0 pr-1">
            <div className="flex items-center gap-1.5 leading-tight truncate">
              <span className="text-[12px] sm:text-[13px] font-black text-amber-300 drop-shadow truncate max-w-[110px] sm:max-w-[140px]">
                {gifterName}
              </span>
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-pink-300 shrink-0">
                SENT
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] sm:text-[12px] font-black text-white truncate max-w-[130px] sm:max-w-[160px]">
                {giftName}
              </span>
              {numDiamonds > 0 && (
                <span className="shrink-0 bg-amber-400/20 border border-amber-400/60 rounded-full px-1.5 py-[1px] text-[9px] font-black text-amber-300 flex items-center gap-0.5">
                  🪙 {formattedDiamonds}
                </span>
              )}
            </div>
          </div>

          {/* Combo Multiplier Tag */}
          {comboCount > 0 && (
            <div className="shrink-0 flex items-center gap-0.5 bg-gradient-to-r from-rose-600 to-amber-500 text-white font-black text-[11px] sm:text-[12px] px-2 py-0.5 rounded-full shadow-lg border border-amber-200/60 animate-pulse">
              <Flame className="w-3 h-3 fill-current text-yellow-200" />
              <span>x{comboCount}</span>
            </div>
          )}
        </div>

        {/* Action Controls: Sound Toggle & Quick Close */}
        <div className="flex items-center gap-1.5 shrink-0">
          {giftVideo && !videoError && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (videoRef.current) {
                  const nextMuted = !videoRef.current.muted;
                  videoRef.current.muted = nextMuted;
                  setVideoMuted(nextMuted);
                }
              }}
              className="h-8 w-8 rounded-full bg-black/70 border border-amber-300/40 text-amber-200 flex items-center justify-center hover:bg-black/90 active:scale-90 transition shadow-lg backdrop-blur-md cursor-pointer"
              title={videoMuted ? "Unmute" : "Mute"}
            >
              {videoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="h-8 w-8 rounded-full bg-black/75 border border-white/30 text-white/90 flex items-center justify-center hover:bg-black hover:text-white active:scale-90 transition shadow-xl backdrop-blur-md cursor-pointer"
            title="Dismiss Gift"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── CENTER STAGE: FULL SCREEN CLEAN FRAMELESS VIDEO / GIFT ANIMATION ── */}
      <div className="relative z-40 flex-1 flex flex-col items-center justify-center w-full h-full max-h-[85dvh] overflow-visible pointer-events-none">
        {/* Video Gift Display: 100% frameless full-screen direct video */}
        {giftVideo && !videoError ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-visible">
            <video
              ref={videoRef}
              src={giftVideo}
              autoPlay
              playsInline
              loop
              muted={videoMuted}
              onError={() => setVideoError(true)}
              className="w-full h-full max-w-full max-h-[85dvh] object-contain select-none pointer-events-none"
            />
          </div>
        ) : (
          /* Non-Video Gift (Image or Big Emoji) 3D Animation */
          <div className="relative flex flex-col items-center justify-center animate-in zoom-in-75 duration-300">
            {/* Sparkle particle icons */}
            <span className="absolute -top-8 -left-8 text-2xl sm:text-3xl animate-bounce delay-75 pointer-events-none">✨</span>
            <span className="absolute -top-10 -right-6 text-2xl sm:text-3xl animate-bounce delay-150 pointer-events-none">🌟</span>
            <span className="absolute -bottom-8 -left-6 text-2xl sm:text-3xl animate-bounce delay-200 pointer-events-none">💎</span>
            <span className="absolute -bottom-10 -right-8 text-2xl sm:text-3xl animate-bounce delay-300 pointer-events-none">👑</span>

            {/* Main Gift Asset */}
            <div className="relative flex items-center justify-center p-4">
              {giftImage ? (
                <img
                  src={giftImage}
                  alt={giftName}
                  className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 object-contain drop-shadow-[0_0_45px_rgba(251,191,36,0.95)] animate-bounce"
                />
              ) : (
                <span className="text-8xl sm:text-9xl md:text-[140px] select-none filter drop-shadow-[0_0_50px_rgba(251,191,36,0.95)] animate-bounce">
                  {displayIcon}
                </span>
              )}
            </div>

            {/* Gift Title Badge */}
            <div className="mt-3 flex flex-col items-center gap-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 drop-shadow-[0_4px_12px_rgba(0,0,0,1)] text-center px-4">
                {giftName}
              </h2>
              {numDiamonds > 0 && (
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs sm:text-sm px-3.5 py-1 rounded-full shadow-xl border border-yellow-200/80">
                  <Gem className="w-3.5 h-3.5 fill-current" />
                  <span>{formattedDiamonds} Diamonds</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM ANNOUNCEMENT PILL ── */}
      <div className="relative z-50 pointer-events-auto flex flex-col items-center justify-center text-center w-full max-w-[94vw] sm:max-w-[460px] mx-auto animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-black/80 via-[#1a0038]/85 to-black/80 border border-amber-400/60 rounded-full px-4 py-1.5 shadow-2xl backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin shrink-0" style={{ animationDuration: "4s" }} />
          <p className="text-[11px] sm:text-[12px] font-extrabold text-white leading-tight truncate">
            <span className="text-amber-300">{gifterName}</span> showered{" "}
            <span className="text-pink-300">{receiverName || "the live stage"}</span> with{" "}
            <span className="text-yellow-200 underline decoration-amber-400/60">{giftName}</span>! 🎉
          </p>
        </div>
      </div>
    </div>
  );
}

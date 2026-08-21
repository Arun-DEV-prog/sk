export interface BeautyParameters {
  smoothnessLevel: number; // 0.0 - 1.0 (skin smoothing)
  lighteningLevel: number; // 0.0 - 1.0 (skin brightening/whitening)
  rednessLevel: number;    // 0.0 - 1.0 (rosy glow)
  lighteningContrastLevel: 0 | 1 | 2; // 0: low, 1: normal, 2: high
}

export interface StreamFilterPreset {
  id: string;
  name: string;
  bangla: string;
  icon: string;
  badge: string;
  colorGrading: string;
  cssFilter: string;
  tailwindClass: string;
  beautyParams: BeautyParameters;
}

export const DEFAULT_BEAUTY_SETTINGS: BeautyParameters = {
  smoothnessLevel: 0.65,
  lighteningLevel: 0.6,
  rednessLevel: 0.25,
  lighteningContrastLevel: 1,
};

export const STREAM_FILTERS: StreamFilterPreset[] = [
  {
    id: "none",
    name: "Original HD",
    bangla: "সাধারণ ক্যামেরা",
    icon: "📹",
    badge: "Natural",
    colorGrading: "from-slate-700 to-slate-900",
    cssFilter: "none",
    tailwindClass: "",
    beautyParams: {
      smoothnessLevel: 0.0,
      lighteningLevel: 0.0,
      rednessLevel: 0.0,
      lighteningContrastLevel: 1,
    },
  },
  {
    id: "natural-glow",
    name: "Natural Glow",
    bangla: "ন্যাচারাল গ্লো",
    icon: "✨",
    badge: "Popular",
    colorGrading: "from-amber-400 to-yellow-500",
    cssFilter: "brightness(1.08) contrast(1.04) saturate(1.1)",
    tailwindClass: "brightness-110 contrast-105 saturate-110",
    beautyParams: {
      smoothnessLevel: 0.7,
      lighteningLevel: 0.65,
      rednessLevel: 0.3,
      lighteningContrastLevel: 1,
    },
  },
  {
    id: "pink-glow",
    name: "Rose Velvet",
    bangla: "রোজ ব্লসম",
    icon: "🌸",
    badge: "Beauty",
    colorGrading: "from-pink-500 to-rose-600",
    cssFilter: "brightness(1.12) contrast(1.08) saturate(1.22) hue-rotate(10deg)",
    tailwindClass: "brightness-115 contrast-110 saturate-125 hue-rotate-10",
    beautyParams: {
      smoothnessLevel: 0.85,
      lighteningLevel: 0.75,
      rednessLevel: 0.55,
      lighteningContrastLevel: 1,
    },
  },
  {
    id: "golden-magic",
    name: "Warm Golden",
    bangla: "গোল্ডেন সানসেট",
    icon: "🌅",
    badge: "Warm",
    colorGrading: "from-amber-500 to-orange-600",
    cssFilter: "brightness(1.1) contrast(1.12) saturate(1.3) sepia(0.18)",
    tailwindClass: "brightness-110 contrast-115 saturate-130 sepia-[0.18]",
    beautyParams: {
      smoothnessLevel: 0.7,
      lighteningLevel: 0.65,
      rednessLevel: 0.4,
      lighteningContrastLevel: 2,
    },
  },
  {
    id: "porcelain-white",
    name: "Porcelain Fair",
    bangla: "হোয়াইট ব্রাইট",
    icon: "💎",
    badge: "Fair",
    colorGrading: "from-cyan-400 to-blue-500",
    cssFilter: "brightness(1.22) contrast(1.08) saturate(1.05)",
    tailwindClass: "brightness-120 contrast-110 saturate-105",
    beautyParams: {
      smoothnessLevel: 0.95,
      lighteningLevel: 0.88,
      rednessLevel: 0.2,
      lighteningContrastLevel: 0,
    },
  },
  {
    id: "studio-glamour",
    name: "Studio Glamour",
    bangla: "স্টুডিও গ্ল্যামার",
    icon: "👑",
    badge: "Pro HD",
    colorGrading: "from-purple-500 to-indigo-600",
    cssFilter: "brightness(1.15) contrast(1.2) saturate(1.3)",
    tailwindClass: "brightness-115 contrast-120 saturate-130",
    beautyParams: {
      smoothnessLevel: 0.8,
      lighteningLevel: 0.75,
      rednessLevel: 0.35,
      lighteningContrastLevel: 2,
    },
  },
  {
    id: "retro-sepia",
    name: "Vintage Cinema",
    bangla: "ভিন্টেজ সিনেমা",
    icon: "📽️",
    badge: "Retro",
    colorGrading: "from-stone-600 to-amber-900",
    cssFilter: "sepia(0.45) contrast(0.95) saturate(1.05) brightness(0.98)",
    tailwindClass: "sepia-[0.45] contrast-95 saturate-105 brightness-95",
    beautyParams: {
      smoothnessLevel: 0.5,
      lighteningLevel: 0.4,
      rednessLevel: 0.2,
      lighteningContrastLevel: 1,
    },
  },
  {
    id: "cyberpunk",
    name: "Cyber Neon",
    bangla: "সাইবার নিয়ন",
    icon: "⚡",
    badge: "Neon",
    colorGrading: "from-fuchsia-600 to-cyan-500",
    cssFilter: "hue-rotate(180deg) brightness(1.12) saturate(1.85)",
    tailwindClass: "hue-rotate-180 brightness-110 saturate-[1.85]",
    beautyParams: {
      smoothnessLevel: 0.6,
      lighteningLevel: 0.6,
      rednessLevel: 0.45,
      lighteningContrastLevel: 2,
    },
  },
  {
    id: "noir-bw",
    name: "Classic Noir",
    bangla: "ব্ল্যাক & হোয়াইট",
    icon: "🎬",
    badge: "B&W",
    colorGrading: "from-zinc-700 to-zinc-950",
    cssFilter: "grayscale(1) contrast(1.25) brightness(1.05)",
    tailwindClass: "grayscale contrast-125 brightness-105",
    beautyParams: {
      smoothnessLevel: 0.7,
      lighteningLevel: 0.6,
      rednessLevel: 0.0,
      lighteningContrastLevel: 2,
    },
  },
];

export function getStreamFilterById(filterId?: string | null): StreamFilterPreset {
  if (!filterId || filterId === "none") return STREAM_FILTERS[0];
  const found = STREAM_FILTERS.find((f) => f.id === filterId);
  return found || STREAM_FILTERS[0];
}

export function getStreamFilterCss(filterId?: string | null): string {
  return getStreamFilterById(filterId).cssFilter;
}

export function getStreamFilterClass(filterId?: string | null): string {
  return getStreamFilterById(filterId).tailwindClass;
}

/**
 * Apply Agora hardware-accelerated video beauty filter directly to an Agora ICameraVideoTrack or ILocalVideoTrack.
 * This directly processes raw video frames inside the WebRTC pipeline so remote viewers receive beautified stream!
 */
export async function applyAgoraBeautyEffect(
  videoTrack: any,
  enabled: boolean,
  beautyParams?: Partial<BeautyParameters>,
): Promise<boolean> {
  if (!videoTrack) return false;
  if (typeof videoTrack.setBeautyEffect !== "function") {
    return false;
  }

  try {
    if (!enabled) {
      await videoTrack.setBeautyEffect(false);
      return true;
    }

    const options = {
      smoothnessLevel: Math.max(0, Math.min(1, beautyParams?.smoothnessLevel ?? 0.65)),
      lighteningLevel: Math.max(0, Math.min(1, beautyParams?.lighteningLevel ?? 0.6)),
      rednessLevel: Math.max(0, Math.min(1, beautyParams?.rednessLevel ?? 0.25)),
      lighteningContrastLevel: (beautyParams?.lighteningContrastLevel ?? 1) as 0 | 1 | 2,
    };

    await videoTrack.setBeautyEffect(true, options);
    return true;
  } catch (err) {
    console.warn("Agora setBeautyEffect execution error:", err);
    return false;
  }
}

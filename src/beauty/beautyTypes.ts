export type BeautyPresetId = "natural" | "soft" | "glow" | "studio" | "live beauty";

export type BeautyMode = "original" | "beauty";

export type BeautySettings = {
  smoothing: number;
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
  exposure: number;
  glow: number;
  highlightReduction: number;
  shadowEnhancement: number;
  noiseReduction: number;
  sharpening: number;
  softness: number;
  faceAware: number;
};

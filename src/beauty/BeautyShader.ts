export const BEAUTY_FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float uStrength;
uniform float uEnabled;
uniform float uSmoothing;
uniform float uBrightness;
uniform float uContrast;
uniform float uSaturation;
uniform float uWarmth;
uniform float uExposure;
uniform float uGlow;
uniform float uHighlightReduction;
uniform float uShadowEnhancement;
uniform float uNoiseReduction;
uniform float uSharpen;
uniform float uSoftness;
uniform float uFaceAware;

vec3 toLinear(vec3 c) {
  return pow(max(c, vec3(0.0)), vec3(2.2));
}

vec3 toGamma(vec3 c) {
  return pow(max(c, vec3(0.0)), vec3(1.0 / 2.2));
}

void main() {
  vec2 uv = vUv;
  vec2 texel = 1.0 / uResolution;

  vec3 base = texture(uTexture, uv).rgb;
  vec3 blurred = vec3(0.0);
  float total = 0.0;

  for (int x = -2; x <= 2; x++) {
    for (int y = -2; y <= 2; y++) {
      vec2 offset = vec2(float(x), float(y)) * texel * (1.5 + uSmoothing * 4.5);
      vec3 sampleColor = texture(uTexture, uv + offset).rgb;
      blurred += sampleColor;
      total += 1.0;
    }
  }
  blurred /= max(total, 1.0);

  float effectStrength = clamp(uStrength, 0.0, 1.0);
  float active = step(0.5, uEnabled);

  vec3 processed = mix(base, blurred, clamp(uSmoothing * 0.7 + uSoftness * 0.35 + effectStrength * 0.2, 0.0, 1.0));
  processed = processed * (1.0 + uBrightness + effectStrength * 0.12);
  processed = (processed - 0.5) * (1.0 + uContrast * 0.85) + 0.5;

  float luminance = dot(processed, vec3(0.299, 0.587, 0.114));
  processed = mix(vec3(luminance), processed, 1.0 + uSaturation * 0.9);

  vec3 warmTint = vec3(1.0, 0.94, 0.88);
  processed = mix(processed, processed * warmTint, uWarmth * 0.22 * effectStrength);

  processed *= 1.0 + uExposure * 0.2 * effectStrength;
  processed = mix(processed, vec3(luminance), clamp(uHighlightReduction * 0.22, 0.0, 0.5));
  processed = mix(processed, vec3(luminance), clamp((1.0 - luminance) * uShadowEnhancement * 0.18, 0.0, 0.35));

  vec2 center = uv - vec2(0.5);
  float faceMask = clamp(1.0 - length(center) * 1.6, 0.0, 1.0);
  float localizedSoftness = clamp(uFaceAware * faceMask * 0.4, 0.0, 0.35);
  vec3 faceSoft = mix(processed, blurred, localizedSoftness);
  processed = mix(processed, faceSoft, active);

  vec3 glow = max(vec3(0.0), processed - vec3(0.72));
  processed += glow * (uGlow * 0.22 * effectStrength);

  float sharpenAmount = clamp(uSharpen * 0.4 * effectStrength, 0.0, 0.4);
  vec3 edge = abs(base - blurred);
  float edgeMix = clamp(dot(edge, vec3(0.333)), 0.0, 1.0) * sharpenAmount;
  processed = mix(processed, base, edgeMix);

  vec3 noise = vec3(fract(sin(dot(uv + vec2(0.13, 0.37), vec2(12.9898, 78.233))) * 43758.5453));
  processed -= noise * uNoiseReduction * 0.05;

  processed = toGamma(toLinear(processed));

  vec3 finalColor = mix(base, processed, active * effectStrength);
  finalColor = mix(finalColor, base, 1.0 - active);

  outColor = vec4(finalColor, 1.0);
}
`;

export const BEAUTY_VERTEX_SHADER = `#version 300 es
precision highp float;

in vec2 aPosition;
out vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

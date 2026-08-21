// @ts-nocheck
/**
 * Professional Ultra-Crisp Web Audio API Sound Engine for Teen Patti.
 * Provides user-friendly, satisfying acoustic feedback and ambient lounge audio.
 */
export class TeenPattiAudioEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private isMusicPlaying = false;
  private musicInterval: any = null;

  private init() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // 1. Soft User-Friendly Button Click
  public playClick() {
    const ctx = this.init();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // 2. Ultra-Satisfying Ceramic Poker Chip Clack
  public playChip() {
    const ctx = this.init();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Resonant clay strike
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(2600, now);
    osc1.frequency.exponentialRampToValueAtTime(750, now + 0.04);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    osc1.connect(gain1).connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.04);

    // Subtle table echo
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1200, now + 0.015);
    osc2.frequency.exponentialRampToValueAtTime(220, now + 0.06);
    gain2.gain.setValueAtTime(0.10, now + 0.015);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start(now + 0.015);
    osc2.stop(now + 0.06);
  }

  // 3. Smooth Clock Pulse Tick
  public playTick() {
    const ctx = this.init();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.025);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.025);
  }

  // 4. Futuristic High-Stakes Countdown Chime (for 3, 2, 1)
  public playWarningBeep(count: number) {
    const ctx = this.init();
    if (!ctx) return;
    const now = ctx.currentTime;

    const pitches = { 3: 880, 2: 1108.73, 1: 1396.91 }; // A5, C#6, F6
    const baseFreq = pitches[count] || 1046.5;

    // Harmonic bell bell sound
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(baseFreq, now);
    gain1.gain.setValueAtTime(0.16, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    osc1.connect(gain1).connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.22);

    // Sparkle octave
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(baseFreq * 1.5, now);
    gain2.gain.setValueAtTime(0.06, now);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.15);
  }

  // 5. Smooth Velvet Card Deal Whoosh
  public playDealCard() {
    const ctx = this.init();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.07);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  // 6. Crisp Air-Friction Card Flip
  public playCardFlip() {
    const ctx = this.init();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.045);

    gain.gain.setValueAtTime(0.10, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.045);
  }

  // 7. Grand Victory Fanfare + Golden Coin Cascade
  public playWin() {
    const ctx = this.init();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Uplifting Major Triad Melody
    const notes = [
      { f: 523.25, t: 0,    d: 0.14 }, // C5
      { f: 659.25, t: 0.09, d: 0.14 }, // E5
      { f: 783.99, t: 0.18, d: 0.16 }, // G5
      { f: 1046.5, t: 0.28, d: 0.35 }, // C6
      { f: 1318.5, t: 0.40, d: 0.45 }, // E6
      { f: 1567.9, t: 0.52, d: 0.60 }, // G6 (Grand finish)
    ];

    notes.forEach(({ f, t, d }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now + t);

      gain.gain.setValueAtTime(0.15, now + t);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + t + d);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now + t);
      osc.stop(now + t + d);
    });

    // Metallic Coin Cascade Chimes
    for (let i = 0; i < 4; i++) {
      const coinTime = now + 0.2 + i * 0.08;
      const coinOsc = ctx.createOscillator();
      const coinGain = ctx.createGain();
      coinOsc.type = "triangle";
      coinOsc.frequency.setValueAtTime(3200 + i * 400, coinTime);
      coinGain.gain.setValueAtTime(0.05, coinTime);
      coinGain.gain.exponentialRampToValueAtTime(0.0001, coinTime + 0.08);
      coinOsc.connect(coinGain).connect(ctx.destination);
      coinOsc.start(coinTime);
      coinOsc.stop(coinTime + 0.08);
    }
  }

  // 8. Gentle Loss Tone
  public playLose() {
    const ctx = this.init();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  // 9. Ambient Chill Lounge BGM
  public toggleBgm(enable: boolean) {
    if (!enable) {
      if (this.musicInterval) {
        clearInterval(this.musicInterval);
        this.musicInterval = null;
      }
      this.isMusicPlaying = false;
      return;
    }

    const ctx = this.init();
    if (!ctx || this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    // Soothing Neo-Soul Chill Chords
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 349.23], // G7
    ];
    let step = 0;

    const playChord = () => {
      if (!this.isMusicPlaying) return;
      const now = ctx.currentTime;
      const current = chords[step % chords.length];
      step++;

      current.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now + idx * 0.04);
        gain.gain.setValueAtTime(0.012, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.9);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + 1.9);
      });
    };

    playChord();
    this.musicInterval = setInterval(playChord, 2200);
  }
}

export const teenPattiAudio = new TeenPattiAudioEngine();

import { BEAUTY_PRESETS, DEFAULT_BEAUTY_PRESET } from "./BeautyPresets";
import { BEAUTY_FRAGMENT_SHADER, BEAUTY_VERTEX_SHADER } from "./BeautyShader";
import type { BeautyMode, BeautyPresetId, BeautySettings } from "./beautyTypes";

export class BeautyRenderer {
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGL2RenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private texture: WebGLTexture | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  private animationFrameId: number | null = null;
  private inputVideo: HTMLVideoElement | null = null;
  private outputTrack: MediaStreamTrack | null = null;
  private sourceTrack: MediaStreamTrack | null = null;
  private preset: BeautyPresetId = DEFAULT_BEAUTY_PRESET;
  private intensity = 0.7;
  private mode: BeautyMode = "beauty";
  private settings: BeautySettings = BEAUTY_PRESETS[DEFAULT_BEAUTY_PRESET];

  setPreset(preset: BeautyPresetId): void {
    this.preset = preset;
    this.settings = BEAUTY_PRESETS[preset] ?? BEAUTY_PRESETS[DEFAULT_BEAUTY_PRESET];
  }

  setStrength(strength: number): void {
    this.intensity = Math.min(Math.max(strength, 0), 1);
  }

  setBeautyEnabled(enabled: boolean): void {
    this.mode = enabled ? "beauty" : "original";
  }

  getOutputTrack(): MediaStreamTrack | null {
    return this.outputTrack;
  }

  async bindInputTrack(track: MediaStreamTrack): Promise<MediaStreamTrack> {
    if (typeof document === "undefined") {
      throw new Error("BeautyRenderer requires a browser document.");
    }

    if (!track) {
      throw new Error("BeautyRenderer requires a valid MediaStreamTrack.");
    }

    this.sourceTrack = track;

    this.teardownRendering();

    this.canvas = document.createElement("canvas");
    this.canvas.width = 640;
    this.canvas.height = 480;

    const gl = this.canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      throw new Error("WebGL2 is required for the beauty pipeline.");
    }

    this.gl = gl;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) {
      throw new Error("Could not create shader programs.");
    }

    gl.shaderSource(vertexShader, BEAUTY_VERTEX_SHADER);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(vertexShader) || "Vertex shader compile failed.");
    }

    gl.shaderSource(fragmentShader, BEAUTY_FRAGMENT_SHADER);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(fragmentShader) || "Fragment shader compile failed.");
    }

    const program = gl.createProgram();
    if (!program) {
      throw new Error("Could not create the beauty shader program.");
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || "Shader program link failed.");
    }

    this.program = program;

    const vao = gl.createVertexArray();
    if (!vao) {
      throw new Error("Could not create a WebGL vertex array.");
    }

    this.vao = vao;
    gl.bindVertexArray(vao);

    const quadVertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    if (!buffer) {
      throw new Error("Could not create the render quad buffer.");
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    if (!texture) {
      throw new Error("Could not allocate the render texture.");
    }

    this.texture = texture;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const stream = new MediaStream([track]);
    const inputVideo = document.createElement("video");
    inputVideo.muted = true;
    inputVideo.playsInline = true;
    inputVideo.autoplay = true;
    inputVideo.srcObject = stream;
    inputVideo.setAttribute("playsinline", "true");
    inputVideo.setAttribute("webkit-playsinline", "true");
    await inputVideo.play().catch(() => undefined);

    this.inputVideo = inputVideo;

    this.outputTrack = this.canvas.captureStream(30).getVideoTracks()[0] ?? null;
    if (!this.outputTrack) {
      throw new Error("Could not generate a beauty video track from the WebGL canvas.");
    }

    this.startRenderLoop();
    return this.outputTrack;
  }

  private startRenderLoop(): void {
    if (!this.gl || !this.canvas || !this.inputVideo || !this.program || !this.texture) {
      return;
    }

    const draw = () => {
      const gl = this.gl;
      const program = this.program;
      const canvas = this.canvas;
      const video = this.inputVideo;
      if (!gl || !canvas || !video || !program || !this.texture) {
        return;
      }

      gl.useProgram(program);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);

      const uniforms = {
        uTexture: gl.getUniformLocation(program, "uTexture"),
        uResolution: gl.getUniformLocation(program, "uResolution"),
        uStrength: gl.getUniformLocation(program, "uStrength"),
        uEnabled: gl.getUniformLocation(program, "uEnabled"),
        uSmoothing: gl.getUniformLocation(program, "uSmoothing"),
        uBrightness: gl.getUniformLocation(program, "uBrightness"),
        uContrast: gl.getUniformLocation(program, "uContrast"),
        uSaturation: gl.getUniformLocation(program, "uSaturation"),
        uWarmth: gl.getUniformLocation(program, "uWarmth"),
        uExposure: gl.getUniformLocation(program, "uExposure"),
        uGlow: gl.getUniformLocation(program, "uGlow"),
        uHighlightReduction: gl.getUniformLocation(program, "uHighlightReduction"),
        uShadowEnhancement: gl.getUniformLocation(program, "uShadowEnhancement"),
        uNoiseReduction: gl.getUniformLocation(program, "uNoiseReduction"),
        uSharpen: gl.getUniformLocation(program, "uSharpen"),
        uSoftness: gl.getUniformLocation(program, "uSoftness"),
        uFaceAware: gl.getUniformLocation(program, "uFaceAware"),
      };

      gl.uniform1i(uniforms.uTexture, 0);
      gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.uStrength, this.intensity);
      gl.uniform1f(uniforms.uEnabled, this.mode === "beauty" ? 1 : 0);
      gl.uniform1f(uniforms.uSmoothing, this.settings.smoothing);
      gl.uniform1f(uniforms.uBrightness, this.settings.brightness);
      gl.uniform1f(uniforms.uContrast, this.settings.contrast);
      gl.uniform1f(uniforms.uSaturation, this.settings.saturation);
      gl.uniform1f(uniforms.uWarmth, this.settings.warmth);
      gl.uniform1f(uniforms.uExposure, this.settings.exposure);
      gl.uniform1f(uniforms.uGlow, this.settings.glow);
      gl.uniform1f(uniforms.uHighlightReduction, this.settings.highlightReduction);
      gl.uniform1f(uniforms.uShadowEnhancement, this.settings.shadowEnhancement);
      gl.uniform1f(uniforms.uNoiseReduction, this.settings.noiseReduction);
      gl.uniform1f(uniforms.uSharpen, this.settings.sharpening);
      gl.uniform1f(uniforms.uSoftness, this.settings.softness);
      gl.uniform1f(uniforms.uFaceAware, this.settings.faceAware);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      this.animationFrameId = requestAnimationFrame(draw);
    };

    this.animationFrameId = requestAnimationFrame(draw);
  }

  destroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.inputVideo) {
      this.inputVideo.pause();
      this.inputVideo.srcObject = null;
      this.inputVideo = null;
    }

    this.sourceTrack?.stop?.();
    this.sourceTrack = null;

    if (this.outputTrack) {
      this.outputTrack.stop?.();
      this.outputTrack = null;
    }

    this.teardownRendering();
  }

  private teardownRendering(): void {
    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
      this.program = null;
    }

    if (this.gl && this.vao) {
      this.gl.deleteVertexArray(this.vao);
      this.vao = null;
    }

    if (this.gl && this.texture) {
      this.gl.deleteTexture(this.texture);
      this.texture = null;
    }

    this.gl = null;
    this.canvas = null;
  }
}

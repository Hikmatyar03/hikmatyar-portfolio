/**
 * asciiShader.ts — Shared ASCII render system.
 *
 * Architecture:
 *   1. buildFontAtlas()   — rasterises a character density ramp onto an
 *                           offscreen canvas, returns a THREE.CanvasTexture.
 *   2. ASCII_FRAG / ASCII_VERT — GLSL sources for the orthographic quad shader.
 *   3. createAsciiMaterial() — factory that wires uniforms + textures into a
 *                              THREE.ShaderMaterial ready for a full-screen plane.
 *
 * Density convention: 0.0 = empty/space, 1.0 = densest glyph (@).
 * The fragment shader samples .a (alpha) from the density source — NOT
 * luminance from .rgb — because the wordmark PNG encodes letterforms
 * exclusively in the alpha channel (flat-white RGB everywhere).
 *
 * UX reason for the shared module: identical rendering fidelity between
 * preloader and cursor layer, no duplicated shader strings, single atlas
 * texture allocation.
 */

import * as THREE from "three";

// ── Character ramp — ordered low → high density ─────────────────────────
// Space is index 0 (empty cell). @ is index 9 (peak density).
export const CHAR_RAMP = " .:-=+*#%@";
export const RAMP_LENGTH = CHAR_RAMP.length;

// Shared monospace font stack — must match between WebGL canvas and DOM cursor
export const ASCII_FONT_FAMILY = '"Courier New", "Consolas", monospace';

// ── Font atlas dimensions ───────────────────────────────────────────────
// Each glyph occupies a square cell in a horizontal 1×N strip.
const ATLAS_CELL_SIZE = 64; // px per glyph cell (enough for crisp rendering)
const ATLAS_FONT = `${ATLAS_CELL_SIZE * 0.72}px ${ASCII_FONT_FAMILY}`;

/**
 * Build a horizontal font-atlas texture from the character ramp.
 * Returns a CanvasTexture where each glyph occupies one ATLAS_CELL_SIZE column.
 */
export function buildFontAtlas(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = ATLAS_CELL_SIZE * RAMP_LENGTH;
  canvas.height = ATLAS_CELL_SIZE;

  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = ATLAS_FONT;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  for (let i = 0; i < RAMP_LENGTH; i++) {
    const x = i * ATLAS_CELL_SIZE + ATLAS_CELL_SIZE / 2;
    const y = ATLAS_CELL_SIZE / 2;
    ctx.fillText(CHAR_RAMP[i], x, y);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

// ── Vertex shader — passthrough for a full-screen quad ──────────────────
export const ASCII_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// ── Fragment shader — the core ASCII rasteriser ─────────────────────────
// Uniforms expected:
//   uDensityTex  — source texture (sample .a for density)
//   uFontAtlas   — horizontal glyph strip from buildFontAtlas()
//   uResolution  — vec2(canvasWidth, canvasHeight) in pixels
//   uCellSize    — float, pixel width/height of each ASCII cell
//   uRampLen     — float, number of characters in the ramp
//   uColor       — vec3, base tint (--text, default #D8D8D8)
//   uAccentColor — vec3, accent tint (#FF4A4A)
//   uProgress    — float 0→1, reveal progress (preloader)
//   uTime        — float, elapsed seconds (for cursor animation)
//   uUseAlpha    — float, 1.0 to sample .a as density, 0.0 to sample luminance
//   uDensityAspect — vec2, aspect correction for object-fit:contain scaling
//   uDensityOffset — vec2, offset for centering the density texture
//   uDensityScale  — vec2, scale factor for object-fit:contain
//   uNoiseEnabled  — float, 1.0 to use noise-based reveal threshold
//   uNoiseTex      — sampler2D, precomputed simplex noise field
//   uAccentMask    — sampler2D, cursor trail density (for cursor layer)
//   uHasAccentMask — float, 1.0 when uAccentMask is bound
//   uBgAlpha       — float, alpha for cells where density ≈ 0 (0.0 = transparent bg)
export const ASCII_FRAG = /* glsl */ `
precision mediump float;

varying vec2 vUv;

uniform sampler2D uDensityTex;
uniform sampler2D uFontAtlas;
uniform sampler2D uNoiseTex;
uniform sampler2D uAccentMask;

uniform vec2 uResolution;
uniform float uCellSize;
uniform float uRampLen;
uniform vec3 uColor;
uniform vec3 uAccentColor;
uniform float uProgress;
uniform float uTime;
uniform float uUseAlpha;
uniform vec2 uDensityScale;
uniform vec2 uDensityOffset;
uniform float uNoiseEnabled;
uniform float uHasAccentMask;
uniform float uBgAlpha;

void main() {
  // Which cell are we in? (integer grid coordinates)
  vec2 cellCoord = floor(gl_FragCoord.xy / uCellSize);
  vec2 totalCells = floor(uResolution / uCellSize);

  // UV at the center of this cell in screen space
  vec2 cellCenterUV = (cellCoord + 0.5) / totalCells;

  // Map to density texture UV with object-fit:contain scaling
  vec2 densityUV = (cellCenterUV - uDensityOffset) / uDensityScale;

  // Sample density — use alpha channel for RGBA wordmarks
  float density = 0.0;
  if (densityUV.x >= 0.0 && densityUV.x <= 1.0 &&
      densityUV.y >= 0.0 && densityUV.y <= 1.0) {
    vec4 texSample = texture2D(uDensityTex, densityUV);
    density = mix(
      dot(texSample.rgb, vec3(0.299, 0.587, 0.114)),
      texSample.a,
      uUseAlpha
    );
  }

  // Noise-based reveal threshold (preloader dissolve)
  if (uNoiseEnabled > 0.5) {
    float noiseVal = texture2D(uNoiseTex, cellCenterUV).r;
    // Remap noise from [-1,1] → [0,1] range (stored as 0→1 in texture)
    if (noiseVal > uProgress) {
      // Cell not yet revealed — render as empty
      if (uBgAlpha < 0.01) {
        discard;
      }
      gl_FragColor = vec4(0.0, 0.0, 0.0, uBgAlpha);
      return;
    }
  }

  // Empty cells (background) — render as transparent or near-transparent
  if (density < 0.02) {
    if (uBgAlpha < 0.01) {
      discard;
    }
    gl_FragColor = vec4(0.0, 0.0, 0.0, uBgAlpha);
    return;
  }

  // Bucket density into ramp index
  float rampIndex = floor(density * (uRampLen - 1.0) + 0.5);
  rampIndex = clamp(rampIndex, 0.0, uRampLen - 1.0);

  // UV within this cell (fractional part), remapped for the atlas lookup
  vec2 cellLocalUV = fract(gl_FragCoord.xy / uCellSize);

  // Atlas lookup: each glyph is 1/uRampLen wide in the strip
  float atlasU = (rampIndex + cellLocalUV.x) / uRampLen;
  // Flip Y since canvas Y is top-down but GL is bottom-up
  float atlasV = 1.0 - cellLocalUV.y;

  float glyphAlpha = texture2D(uFontAtlas, vec2(atlasU, atlasV)).r;

  // Color: blend between base color and accent based on accent mask
  vec3 finalColor = uColor;
  if (uHasAccentMask > 0.5) {
    float accentDensity = texture2D(uAccentMask, cellCenterUV).r;
    finalColor = mix(uColor, uAccentColor, accentDensity);
  }

  // Output: glyph alpha modulated by density (resting cells subtle, bloomed cells punchy)
  float alphaMod = clamp(density * 1.5, 0.15, 1.0);
  float brightness = 0.7 + 0.3 * density;
  gl_FragColor = vec4(finalColor * brightness, glyphAlpha * alphaMod);
}
`;

// ── Simplex noise texture generator ─────────────────────────────────────
// Produces a small texture (e.g. 128×128) of 2D simplex noise values
// mapped to [0, 1] range, used as the reveal threshold field.
export function buildNoiseTexture(
  width = 128,
  height = 128,
  scale = 4.0,
  seed = 42
): THREE.DataTexture {
  const raw = new Float32Array(width * height);
  let minV = Infinity;
  let maxV = -Infinity;

  // Simple seeded hash-based noise (deterministic, same every load)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = (x / width) * scale + seed;
      const ny = (y / height) * scale + seed;
      // Multi-octave value noise approximation
      const v =
        hashNoise(nx, ny) * 0.5 +
        hashNoise(nx * 2.0, ny * 2.0) * 0.25 +
        hashNoise(nx * 4.0, ny * 4.0) * 0.125;
      raw[y * width + x] = v;
      if (v < minV) minV = v;
      if (v > maxV) maxV = v;
    }
  }

  // Normalize to full 0–255 range so noise smoothly dissolves from 0% to 100%
  const range = maxV - minV || 1;
  const data = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const norm = Math.floor(((raw[i] - minV) / range) * 255);
    data[i * 4] = norm;
    data[i * 4 + 1] = norm;
    data[i * 4 + 2] = norm;
    data[i * 4 + 3] = 255;
  }

  const texture = new THREE.DataTexture(
    data,
    width,
    height,
    THREE.RGBAFormat,
    THREE.UnsignedByteType
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/** Deterministic hash-based noise — no permutation table dependency */
function hashNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  // Smooth interpolation
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);

  return lerp(lerp(a, b, ux), lerp(c, d, ux), uy) * 2 - 1;
}

function hash2(x: number, y: number): number {
  let h = x * 374761393 + y * 668265263;
  h = ((h ^ (h >> 13)) * 1274126177) | 0;
  return ((h ^ (h >> 16)) & 0x7fffffff) / 0x7fffffff;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ── ASCII Material factory ──────────────────────────────────────────────
export interface AsciiMaterialOptions {
  /** Source density texture */
  densityTex: THREE.Texture;
  /** Pre-built font atlas */
  fontAtlas: THREE.CanvasTexture;
  /** Noise texture for reveal animation (optional) */
  noiseTex?: THREE.DataTexture;
  /** ASCII cell size in pixels */
  cellSize?: number;
  /** Base color as [r, g, b] normalised 0–1 */
  color?: [number, number, number];
  /** Accent color as [r, g, b] normalised 0–1 */
  accentColor?: [number, number, number];
  /** Use alpha channel as density source (true for the wordmark) */
  useAlpha?: boolean;
  /** Enable noise-based reveal (preloader mode) */
  noiseEnabled?: boolean;
  /** Background alpha for empty cells (0 = transparent) */
  bgAlpha?: number;
}

const DUMMY_TEX = new THREE.DataTexture(
  new Uint8Array([0]),
  1,
  1,
  THREE.RedFormat
);

export function createAsciiMaterial(
  opts: AsciiMaterialOptions
): THREE.ShaderMaterial {
  const {
    densityTex,
    fontAtlas,
    noiseTex,
    cellSize = 10,
    color = [0.847, 0.847, 0.847], // #D8D8D8
    accentColor = [1.0, 0.29, 0.29], // #FF4A4A
    useAlpha = true,
    noiseEnabled = false,
    bgAlpha = 0.0,
  } = opts;

  return new THREE.ShaderMaterial({
    vertexShader: ASCII_VERT,
    fragmentShader: ASCII_FRAG,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uDensityTex: { value: densityTex },
      uFontAtlas: { value: fontAtlas },
      uNoiseTex: { value: noiseTex ?? DUMMY_TEX },
      uAccentMask: { value: DUMMY_TEX },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uCellSize: { value: cellSize },
      uRampLen: { value: RAMP_LENGTH },
      uColor: { value: new THREE.Vector3(...color) },
      uAccentColor: { value: new THREE.Vector3(...accentColor) },
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uUseAlpha: { value: useAlpha ? 1.0 : 0.0 },
      uDensityScale: { value: new THREE.Vector2(1, 1) },
      uDensityOffset: { value: new THREE.Vector2(0, 0) },
      uNoiseEnabled: { value: noiseEnabled ? 1.0 : 0.0 },
      uHasAccentMask: { value: 0.0 },
      uBgAlpha: { value: bgAlpha },
    },
  });
}

/**
 * Compute object-fit:contain scale + offset for a density texture.
 * Adjusts the shader's uDensityScale and uDensityOffset uniforms so the
 * texture is centered and aspect-ratio-preserved within the viewport.
 */
export function computeContainFit(
  texWidth: number,
  texHeight: number,
  viewWidth: number,
  viewHeight: number,
  padding = 0.12
): { scale: [number, number]; offset: [number, number] } {
  const availableW = viewWidth * (1.0 - padding * 2);
  const availableH = viewHeight * (1.0 - padding * 2);

  const texAspect = texWidth / texHeight;
  const availAspect = availableW / availableH;

  let scaleX: number, scaleY: number;
  if (availAspect > texAspect) {
    // Available area is wider than texture — fit to height
    scaleY = 1.0 - padding * 2;
    scaleX = scaleY * (texAspect / (viewWidth / viewHeight));
  } else {
    // Available area is taller — fit to width
    scaleX = 1.0 - padding * 2;
    scaleY = scaleX * ((viewWidth / viewHeight) / texAspect);
  }

  const offsetX = (1.0 - scaleX) / 2.0;
  const offsetY = (1.0 - scaleY) / 2.0;

  return {
    scale: [scaleX, scaleY],
    offset: [offsetX, offsetY],
  };
}

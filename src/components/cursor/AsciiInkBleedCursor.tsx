"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  buildFontAtlas,
  createAsciiMaterial,
} from "@/lib/asciiShader";

/**
 * AsciiInkBleedCursor — ASCII character-density cursor reaction layer.
 *
 * UX reason: Re-expresses the original InkBleedCursor's bloom-then-fade
 * ink dispersion through ASCII character density rather than blurred
 * canvas gradients. Dense glyphs bloom where the cursor moves, then
 * decay back to sparse characters — the trail reads as "ink seeping
 * through paper" in monospaced type.
 *
 * Architecture:
 *   • Full-viewport orthographic Three.js scene behind page content.
 *   • Maintains a density field (Float32Array grid) painted each frame
 *     near the lerped cursor position, decaying over time.
 *   • Sparse resting texture (~2.5% dot density) at idle for subtle page grain.
 *   • Density field is uploaded as a DataTexture to the shared ASCII
 *     shader from asciiShader.ts.
 *   • Color: base #D8D8D8, tinted toward #FF4A4A at peak density,
 *     settling back as it fades — same color behavior as the original.
 *   • Performance: cell size 10–14px (not 1:1 pixel), capped grid res.
 *   • Respects prefers-reduced-motion: static low-density ASCII texture
 *     with no bloom, or fully disabled.
 *
 * Scope: Active only when `enabled` prop is true (hero/landing sections).
 *        Controlled by parent via pathname detection.
 */

export interface AsciiInkBleedCursorProps {
  /** Whether the ASCII layer is active (default: true) */
  enabled?: boolean;
  /** Canvas z-index (default: 25, behind InkBleedCursor's 30) */
  zIndex?: number;
}

// ── Easing functions (matching original InkBleedCursor) ─────────────
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export default function AsciiInkBleedCursor({
  enabled = true,
  zIndex = 25,
}: AsciiInkBleedCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) return;

    // Skip on touch devices
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // ── Cell grid resolution ───────────────────────────────────────
    // Larger cells = fewer shader invocations = better perf
    const CELL_SIZE = width < 640 ? 10 : width < 1024 ? 12 : 14;
    const gridCols = Math.ceil(width / CELL_SIZE);
    const gridRows = Math.ceil(height / CELL_SIZE);
    const gridSize = gridCols * gridRows;

    // Density field: float array, one value per grid cell
    const densityField = new Float32Array(gridSize);
    // Resting density field (sparse subtle editorial texture at idle)
    const restingField = new Float32Array(gridSize);
    // Accent intensity field: tracks peak density for color blending
    const accentField = new Float32Array(gridSize);

    // ── Density data buffers ───────────────────────────────────────
    const densityData = new Uint8Array(gridCols * gridRows);
    const accentData = new Uint8Array(gridCols * gridRows);

    // Seed deterministic resting pattern (~2.5% of cells have subtle dot density)
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const i = r * gridCols + c;
        const hash = ((c * 374761393 + r * 668265263) ^ 0x5bf03635) >>> 0;
        if (hash % 100 < 3) {
          restingField[i] = 0.08 + (hash % 5) * 0.01;
          densityField[i] = restingField[i];
          densityData[i] = Math.floor(restingField[i] * 255);
        }
      }
    }

    // ── Three.js setup ─────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    const scene = new THREE.Scene();

    // Build shared font atlas
    const fontAtlas = buildFontAtlas();

    // Create density data texture (single-channel red)
    const densityTex = new THREE.DataTexture(
      densityData,
      gridCols,
      gridRows,
      THREE.RedFormat,
      THREE.UnsignedByteType
    );
    densityTex.minFilter = THREE.LinearFilter;
    densityTex.magFilter = THREE.NearestFilter;
    densityTex.needsUpdate = true;

    // Accent mask texture (single-channel red for cursor tint)
    const accentTex = new THREE.DataTexture(
      accentData,
      gridCols,
      gridRows,
      THREE.RedFormat,
      THREE.UnsignedByteType
    );
    accentTex.minFilter = THREE.LinearFilter;
    accentTex.magFilter = THREE.NearestFilter;
    accentTex.needsUpdate = true;

    // Create ASCII material — density source is our trail field
    const material = createAsciiMaterial({
      densityTex,
      fontAtlas,
      cellSize: CELL_SIZE * dpr,
      color: [0.847, 0.847, 0.847],    // #D8D8D8
      accentColor: [1.0, 0.29, 0.29],   // #FF4A4A
      useAlpha: false,                    // Density from .r channel
      noiseEnabled: false,
      bgAlpha: 0.0,
    });

    // Set the density scale/offset to identity (1:1 screen mapping)
    material.uniforms.uResolution.value.set(width * dpr, height * dpr);
    material.uniforms.uDensityScale.value.set(1, 1);
    material.uniforms.uDensityOffset.value.set(0, 0);
    material.uniforms.uProgress.value = 1.0; // Always fully revealed
    material.uniforms.uHasAccentMask.value = 1.0;
    material.uniforms.uAccentMask.value = accentTex;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ── Mouse tracking (reuse lerp logic from original) ────────────
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let isMouseActive = false;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isMouseActive) {
        currentX = targetX;
        currentY = targetY;
        isMouseActive = true;
      }
    };

    const onMouseLeave = () => {
      isMouseActive = false;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave, { passive: true });

    // ── Decay & Bloom parameters ──────────────────────────────────
    // Tuned so a full-density mark blooms instantly and fades in ~1.4s
    const DECAY_RATE = 0.016;    // per frame at 60fps
    const BLOOM_RADIUS = width < 640 ? 3 : 4;      // cells radius around cursor (~40-56px)
    const BLOOM_STRENGTH = 0.32; // density added per frame at cursor center
    const MAX_ACTIVE_CELLS = 600; // Enforced cap preventing unbounded density array growth
    const activeIndices = new Set<number>();

    // If reduced motion, render static resting pattern and stop
    if (prefersReducedMotion) {
      renderer.render(scene, camera);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseleave", onMouseLeave);
        material.dispose();
        geometry.dispose();
        fontAtlas.dispose();
        densityTex.dispose();
        accentTex.dispose();
        renderer.dispose();
      };
    }

    // Initial render of resting background
    renderer.render(scene, camera);

    // ── Animation loop ─────────────────────────────────────────────
    let animFrameId: number;
    let lastTime = performance.now();

    const render = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 16.667, 3); // Normalise to 60fps, cap at 3x
      lastTime = now;

      // Lerp cursor position (factor ~0.22, matching original)
      let moved = false;
      if (isMouseActive) {
        const prevX = currentX;
        const prevY = currentY;
        currentX += (targetX - currentX) * 0.22;
        currentY += (targetY - currentY) * 0.22;
        if (Math.abs(currentX - prevX) > 0.05 || Math.abs(currentY - prevY) > 0.05) {
          moved = true;
        }
      }

      // Convert cursor position to grid coordinates
      // Invert Y because DOM clientY is top-down while WebGL Y is bottom-up
      const cursorCol = Math.floor(currentX / CELL_SIZE);
      const cursorRow = Math.max(0, Math.min(gridRows - 1, gridRows - 1 - Math.floor(currentY / CELL_SIZE)));

      // ── Paint density near cursor (bloom) with enforced active cap ──
      if (isMouseActive && moved) {
        for (let dy = -BLOOM_RADIUS; dy <= BLOOM_RADIUS; dy++) {
          for (let dx = -BLOOM_RADIUS; dx <= BLOOM_RADIUS; dx++) {
            const col = cursorCol + dx;
            const row = cursorRow + dy;
            if (col < 0 || col >= gridCols || row < 0 || row >= gridRows) continue;

            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > BLOOM_RADIUS) continue;

            // easeOutCubic falloff from center — same curve as original bloom
            const falloff = easeOutCubic(1 - dist / BLOOM_RADIUS);
            const idx = row * gridCols + col;
            const addAmount = BLOOM_STRENGTH * falloff * dt;

            densityField[idx] = Math.min(1.0, densityField[idx] + addAmount);
            // Track accent: peak density drives accent color blend
            accentField[idx] = Math.min(1.0, accentField[idx] + addAmount * 1.5);

            // Add to active set if within cap
            if (activeIndices.size < MAX_ACTIVE_CELLS || activeIndices.has(idx)) {
              activeIndices.add(idx);
            }
          }
        }
      }

      // ── Decay density field: iterate ONLY active cells, cull faded entries ──
      if (activeIndices.size > 0) {
        const toCull: number[] = [];

        activeIndices.forEach((i) => {
          const rest = restingField[i];
          if (densityField[i] > rest) {
            // easeInOutQuad-style decay — slow start, accelerating fade
            const excess = densityField[i] - rest;
            const decay = DECAY_RATE * dt * (0.5 + 0.5 * easeInOutQuad(excess));
            densityField[i] = Math.max(rest, densityField[i] - decay);
            densityData[i] = Math.floor(densityField[i] * 255);
          } else {
            densityField[i] = rest;
            densityData[i] = Math.floor(rest * 255);
          }

          // Accent field decays faster than density (color returns to base first)
          if (accentField[i] > 0) {
            accentField[i] = Math.max(0, accentField[i] - DECAY_RATE * 1.8 * dt);
            accentData[i] = Math.floor(accentField[i] * 255);
          } else {
            accentData[i] = 0;
          }

          // Cull faded entries from active set when fully returned to rest
          if (densityField[i] <= rest && accentField[i] <= 0) {
            densityField[i] = rest;
            accentField[i] = 0;
            densityData[i] = Math.floor(rest * 255);
            accentData[i] = 0;
            toCull.push(i);
          }
        });

        // Remove culled indices
        for (let c = 0; c < toCull.length; c++) {
          activeIndices.delete(toCull[c]);
        }

        // Upload updated density to GPU only when active entries modified
        densityTex.needsUpdate = true;
        accentTex.needsUpdate = true;
        renderer.render(scene, camera);
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    // ── Resize handler with DPR updates ─────────────────────────────
    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const curDpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setSize(width, height);
      renderer.setPixelRatio(curDpr);
      material.uniforms.uResolution.value.set(
        width * curDpr,
        height * curDpr
      );
      material.uniforms.uCellSize.value = CELL_SIZE * curDpr;
      renderer.render(scene, camera);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      material.dispose();
      geometry.dispose();
      fontAtlas.dispose();
      densityTex.dispose();
      accentTex.dispose();
      renderer.dispose();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex,
        mixBlendMode: "screen",
      }}
      aria-hidden="true"
    />
  );
}

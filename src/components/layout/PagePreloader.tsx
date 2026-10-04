"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import * as THREE from "three";
import {
  buildFontAtlas,
  buildNoiseTexture,
  createAsciiMaterial,
  computeContainFit,
} from "@/lib/asciiShader";

/**
 * PagePreloader — Full-page ASCII wordmark reveal.
 *
 * UX reason: The wordmark dissolves through an organic noise-driven
 * threshold field rather than a flat wipe, giving the reveal a hand-
 * printed, ink-on-paper quality that signals the brand's editorial
 * craft. Cells emerge non-uniformly like type being set.
 *
 * Architecture:
 *   • Full-viewport orthographic Three.js scene, single plane quad.
 *   • Wordmark PNG (alpha-as-density) scaled to object-fit:contain with editorial padding.
 *   • Simplex noise field drives per-cell reveal threshold.
 *   • GSAP animates a single uProgress uniform 0→1 (1.5s power3.out).
 *   • On completion: 350ms hold → GSAP opacity fade → unmount.
 *   • First-visit gating via sessionStorage (same key as before).
 *   • Respects prefers-reduced-motion: skip entirely.
 */
export default function PagePreloader() {
  const [shouldShow, setShouldShow] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isExitingRef = useRef(false);

  // Store Three.js objects for cleanup
  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    material: THREE.ShaderMaterial;
    mesh: THREE.Mesh;
    fontAtlas: THREE.CanvasTexture;
    noiseTex: THREE.DataTexture;
    wordmarkTex: THREE.Texture;
    animFrameId: number;
  } | null>(null);

  const exitPreloader = useCallback(() => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;

    if (containerRef.current) {
      // 400ms fade-out matches PageTransitionWrapper timing convention
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          setShouldShow(false);
          sessionStorage.setItem("preloaded_ascii_v2", "1");
          sessionStorage.setItem("preloaded", "1");

          // Dispose Three.js resources
          if (threeRef.current) {
            cancelAnimationFrame(threeRef.current.animFrameId);
            threeRef.current.material.dispose();
            threeRef.current.mesh.geometry.dispose();
            threeRef.current.fontAtlas.dispose();
            threeRef.current.noiseTex.dispose();
            threeRef.current.wordmarkTex.dispose();
            threeRef.current.renderer.dispose();
            threeRef.current = null;
          }
        },
      });
    } else {
      setShouldShow(false);
      sessionStorage.setItem("preloaded_ascii_v2", "1");
      sessionStorage.setItem("preloaded", "1");
    }
  }, []);

  // ── First visit gating & debug hook ───────────────────────────────────
  useEffect(() => {
    const hasUrlOverride =
      typeof window !== "undefined" &&
      window.location.search.includes("preloader");
    const alreadyPreloaded =
      typeof window !== "undefined" &&
      sessionStorage.getItem("preloaded_ascii_v2");

    if (alreadyPreloaded && !hasUrlOverride) {
      return;
    }

    if (prefersReducedMotion) {
      sessionStorage.setItem("preloaded_ascii_v2", "1");
      sessionStorage.setItem("preloaded", "1");
      return;
    }

    // Expose replay function for debugging / interactive preview
    (window as unknown as { __replayPreloader?: () => void }).__replayPreloader = () => {
      sessionStorage.removeItem("preloaded_ascii_v2");
      sessionStorage.removeItem("preloaded");
      window.location.reload();
    };

    setShouldShow(true);
  }, [prefersReducedMotion]);

  // ── Three.js WebGL ASCII scene initialization ────────────────────────
  useEffect(() => {
    if (!shouldShow) return;

    // Keyboard listener: Escape or Space to skip immediately
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") {
        exitPreloader();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);

    // Orthographic camera (full-screen quad, no perspective)
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    // Scene
    const scene = new THREE.Scene();

    // Build shared assets
    const fontAtlas = buildFontAtlas();
    const noiseTex = buildNoiseTexture(128, 128, 4.0, 42);

    // Responsive cell size — smaller on mobile for readable density
    const cellSize = width < 640 ? 6 : width < 1024 ? 8 : 10;

    // Load wordmark texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/brand/hikmatyar-wordmark.png", (wordmarkTex) => {
      wordmarkTex.minFilter = THREE.LinearFilter;
      wordmarkTex.magFilter = THREE.LinearFilter;

      // Compute object-fit:contain scaling with editorial padding
      const imgW = wordmarkTex.image.width;
      const imgH = wordmarkTex.image.height;
      const padding = width < 640 ? 0.08 : 0.15;
      const fit = computeContainFit(imgW, imgH, width, height, padding);

      // Create ASCII shader material
      const material = createAsciiMaterial({
        densityTex: wordmarkTex,
        fontAtlas,
        noiseTex,
        cellSize: cellSize * dpr,
        color: [0.847, 0.847, 0.847],    // #D8D8D8
        accentColor: [1.0, 0.29, 0.29],   // #FF4A4A
        useAlpha: true,
        noiseEnabled: true,
        bgAlpha: 0.0, // Empty cells are fully transparent (show #0E0E0E bg)
      });

      // Apply contain-fit uniforms
      material.uniforms.uResolution.value.set(width * dpr, height * dpr);
      material.uniforms.uDensityScale.value.set(fit.scale[0], fit.scale[1]);
      material.uniforms.uDensityOffset.value.set(fit.offset[0], fit.offset[1]);

      // Full-screen quad geometry
      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Store refs for cleanup
      threeRef.current = {
        renderer,
        scene,
        camera,
        material,
        mesh,
        fontAtlas,
        noiseTex,
        wordmarkTex,
        animFrameId: 0,
      };

      // ── Render loop ───────────────────────────────────────────────
      const renderLoop = () => {
        if (!threeRef.current) return;
        renderer.render(scene, camera);
        threeRef.current.animFrameId = requestAnimationFrame(renderLoop);
      };
      threeRef.current.animFrameId = requestAnimationFrame(renderLoop);

      // ── GSAP reveal animation ─────────────────────────────────────
      // 1.5s power3.easeOut: organic non-uniform noise dissolve
      const progressObj = { value: 0 };
      gsap.to(progressObj, {
        value: 1.0,
        duration: 1.5,
        ease: "power3.out",
        onUpdate: () => {
          if (threeRef.current) {
            threeRef.current.material.uniforms.uProgress.value = progressObj.value;
          }
        },
        onComplete: () => {
          // Hold at full reveal for 350ms before fading out
          gsap.delayedCall(0.35, () => {
            exitPreloader();
          });
        },
      });
    });

    // ── Handle resize ─────────────────────────────────────────────────
    const onResize = () => {
      if (!threeRef.current) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const d = Math.min(window.devicePixelRatio || 1, 2);
      const responsiveCell = w < 640 ? 6 : w < 1024 ? 8 : 10;
      threeRef.current.renderer.setSize(w, h);
      threeRef.current.renderer.setPixelRatio(d);
      threeRef.current.material.uniforms.uResolution.value.set(w * d, h * d);
      threeRef.current.material.uniforms.uCellSize.value = responsiveCell * d;

      // Recompute contain-fit with padding
      const img = threeRef.current.wordmarkTex.image as HTMLImageElement | undefined;
      if (img && img.width) {
        const imgW = img.width;
        const imgH = img.height;
        const padding = w < 640 ? 0.08 : 0.15;
        const fit = computeContainFit(imgW, imgH, w, h, padding);
        threeRef.current.material.uniforms.uDensityScale.value.set(fit.scale[0], fit.scale[1]);
        threeRef.current.material.uniforms.uDensityOffset.value.set(fit.offset[0], fit.offset[1]);
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", onResize);

      if (threeRef.current) {
        cancelAnimationFrame(threeRef.current.animFrameId);
        threeRef.current.material.dispose();
        threeRef.current.mesh.geometry.dispose();
        threeRef.current.fontAtlas.dispose();
        threeRef.current.noiseTex.dispose();
        threeRef.current.wordmarkTex.dispose();
        threeRef.current.renderer.dispose();
        threeRef.current = null;
      }
    };
  }, [shouldShow, exitPreloader]);

  if (!shouldShow) return null;

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label="Loading Hikmatyar portfolio"
      className="fixed inset-0 z-[9998] flex flex-col justify-between select-none overflow-hidden"
      style={{
        backgroundColor: "#0E0E0E",
        opacity: 1,
        willChange: "opacity",
      }}
    >
      {/* Three.js ASCII canvas — full viewport */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block" }}
        aria-hidden="true"
      />

      {/* ── Top Bar: Brand identifier ── */}
      <header className="relative z-10 w-full flex items-center justify-between px-6 py-6 sm:px-10 sm:py-8 font-mono text-[10px] sm:text-xs tracking-wider">
        <div className="flex items-center gap-3">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--accent)" }}
          />
          <span className="font-semibold uppercase tracking-widest text-[#D8D8D8]">
            Hikmatyar
          </span>
        </div>

        <span className="text-white/40 text-[10px] sm:text-xs font-mono tracking-wider">
          ASCII REVEAL // LOADING
        </span>
      </header>

      {/* ── Bottom Bar: Skip control ── */}
      <footer className="relative z-10 w-full flex items-end justify-end px-6 py-6 sm:px-10 sm:py-8 font-mono text-[10px] sm:text-xs">
        <button
          type="button"
          onClick={exitPreloader}
          className="group flex items-center gap-2 px-3 py-1.5 border border-white/20 hover:border-accent text-white/70 hover:text-white font-mono text-[10px] sm:text-xs uppercase tracking-wider transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <span>[ SKIP / ESC ]</span>
          <span
            style={{ color: "var(--accent)" }}
            className="group-hover:translate-x-0.5 transition-transform duration-150"
          >
            →
          </span>
        </button>
      </footer>

      {/* Screen-reader accessible status */}
      <div className="sr-only">
        Hikmatyar Brand Identity Portfolio is loading.
      </div>
    </div>
  );
}

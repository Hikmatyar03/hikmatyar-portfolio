"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PixelParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  initialSize: number;
  alpha: number;
  maxAlpha: number;
  decay: number;
  rotation: number;
  vRot: number;
  color: string;
  isAccent: boolean;
  active: boolean;
}

/**
 * LiquidPixelCursor
 *
 * High-performance dual-layer cursor system:
 * 1. Precision center dot + smooth glass follower ring that never disappears.
 * 2. Liquid-to-Pixel canvas particle stream.
 * 3. Expands into interactive glass action chip on hoverable elements.
 */
export default function LiquidPixelCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string>("");
  const [active, setActive] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on fine pointer devices without reduced motion
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isFinePointer || reduced) return;

    setMounted(true);

    const canvas = canvasRef.current;
    const ringEl = ringRef.current;
    const dotEl = dotRef.current;
    if (!canvas || !ringEl || !dotEl) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Setup Canvas Resolution
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // GSAP Follower Ring & Dot
    const dotXTo = gsap.quickTo(dotEl, "x", { duration: 0.04, ease: "power2.out" });
    const dotYTo = gsap.quickTo(dotEl, "y", { duration: 0.04, ease: "power2.out" });
    const ringXTo = gsap.quickTo(ringEl, "x", { duration: 0.22, ease: "power3.out" });
    const ringYTo = gsap.quickTo(ringEl, "y", { duration: 0.22, ease: "power3.out" });

    // Particle Pool
    const MAX_PARTICLES = 140;
    const particles: PixelParticle[] = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      particles.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 0,
        initialSize: 0,
        alpha: 0,
        maxAlpha: 0,
        decay: 0,
        rotation: 0,
        vRot: 0,
        color: "#D8D8D8",
        isAccent: false,
        active: false,
      });
    }

    let mouseX = -100;
    let mouseY = -100;
    let lastX = -100;
    let lastY = -100;
    let lastTime = performance.now();
    let isHoveringInteractive = false;
    let hasMovedOnce = false;

    // Spawn a pixel particle from pool
    const spawnParticle = (
      x: number,
      y: number,
      vx: number,
      vy: number,
      baseSize: number,
      accentChance = 0.15
    ) => {
      const p = particles.find((item) => !item.active);
      if (!p) return;

      p.active = true;
      p.x = x + (Math.random() - 0.5) * 6;
      p.y = y + (Math.random() - 0.5) * 6;
      p.vx = vx * 0.35 + (Math.random() - 0.5) * 1.5;
      p.vy = vy * 0.35 + (Math.random() - 0.5) * 1.5;

      const isAcc = Math.random() < accentChance;
      p.isAccent = isAcc;
      p.color = isAcc ? "#FF4A4A" : "#FFFFFF";

      const sz = baseSize * (0.7 + Math.random() * 0.7);
      p.initialSize = sz;
      p.size = sz;
      p.alpha = isAcc ? 0.8 : 0.45;
      p.maxAlpha = p.alpha;
      p.decay = 0.028 + Math.random() * 0.035;
      p.rotation = Math.random() * Math.PI;
      p.vRot = (Math.random() - 0.5) * 0.08;
    };

    // Spawn burst shockwave on click
    const spawnBurst = (x: number, y: number) => {
      const count = 20;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
        const speed = 2 + Math.random() * 3.5;
        spawnParticle(
          x,
          y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          Math.floor(3 + Math.random() * 5),
          0.4
        );
      }
    };

    // Mouse Event Listeners
    const handleMove = (e: MouseEvent) => {
      if (!hasMovedOnce) {
        hasMovedOnce = true;
        document.documentElement.setAttribute("data-cursor-mounted", "");
        setIsVisible(true);
      }

      const now = performance.now();
      const dt = Math.max(now - lastTime, 1);
      lastTime = now;

      mouseX = e.clientX;
      mouseY = e.clientY;

      dotXTo(mouseX);
      dotYTo(mouseY);
      ringXTo(mouseX);
      ringYTo(mouseY);

      if (lastX === -100) {
        lastX = mouseX;
        lastY = mouseY;
        return;
      }

      const dx = mouseX - lastX;
      const dy = mouseY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = dist / dt;

      // Spawn liquid digital pixel stream
      const steps = Math.min(Math.floor(dist / 6) + 1, 6);
      const basePixelSize = isHoveringInteractive ? 4.5 : Math.min(2.5 + speed * 1.2, 7);
      const accentRate = isHoveringInteractive ? 0.3 : 0.1;

      for (let i = 0; i < steps; i++) {
        const interp = i / steps;
        const px = lastX + dx * interp;
        const py = lastY + dy * interp;
        spawnParticle(
          px,
          py,
          (dx / dt) * 3,
          (dy / dt) * 3,
          basePixelSize,
          accentRate
        );
      }

      lastX = mouseX;
      lastY = mouseY;
    };

    const handleOver = (e: MouseEvent) => {
      const target = (e.target as Element).closest<HTMLElement>("[data-cursor], a, button");
      if (target) {
        const customText = target.getAttribute("data-cursor-text") || (target.tagName === "A" ? "Open" : target.tagName === "BUTTON" ? "Select" : "");
        setLabel(customText);
        setActive(true);
        isHoveringInteractive = true;
      }
    };

    const handleOut = (e: MouseEvent) => {
      const target = (e.target as Element).closest<HTMLElement>("[data-cursor], a, button");
      if (target && !target.contains(e.relatedTarget as Node)) {
        setActive(false);
        setLabel("");
        isHoveringInteractive = false;
      }
    };

    const handleDown = (e: MouseEvent) => {
      setClicking(true);
      spawnBurst(e.clientX, e.clientY);
    };

    const handleUp = () => setClicking(false);

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseover", handleOver, { passive: true });
    document.addEventListener("mouseout", handleOut, { passive: true });
    document.addEventListener("mousedown", handleDown, { passive: true });
    document.addEventListener("mouseup", handleUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Animation Loop
    let rafId: number;
    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < MAX_PARTICLES; i++) {
        const p = particles[i];
        if (!p.active) continue;

        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx;
        p.y += p.vy;

        p.rotation += p.vRot;
        p.alpha -= p.decay;

        const life = Math.max(p.alpha / p.maxAlpha, 0);
        p.size = Math.max(p.initialSize * life, 1);

        if (p.alpha <= 0.01) {
          p.active = false;
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;

        const half = p.size / 2;
        ctx.fillRect(-half, -half, p.size, p.size);
        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.documentElement.removeAttribute("data-cursor-mounted");
    };
  }, []);

  if (!mounted) return null;

  const ringClass = [
    "custom-cursor-ring",
    active ? "custom-cursor-ring--active" : "",
    clicking && active ? "custom-cursor-ring--clicking" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.2s ease-out",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      {/* Liquid Digital Pixel Canvas Trail Layer */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9998,
          mixBlendMode: "screen",
        }}
      />

      {/* Smooth Glass Follower Ring with Expanded Label */}
      <div ref={ringRef} className={ringClass}>
        {active && label && (
          <span className="custom-cursor-label">{label}</span>
        )}
      </div>

      {/* Center Precision Glow Dot */}
      <div ref={dotRef} className="custom-cursor-dot" />
    </div>
  );
}

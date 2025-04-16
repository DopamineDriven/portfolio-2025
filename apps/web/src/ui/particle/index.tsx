"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AR_LOGO_PATHS } from "./ar-logo-paths";

export default function ArLogoParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isTouchingRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setIsMobile(window.innerWidth < 768);
    };

    updateCanvasSize();

    let particles: {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      color: string;
      scatteredColor: string;
      life: number;
      pathIndex: number;
    }[] = [];

    let textImageData: ImageData | null = null;

    function createTextImage() {
      if (!ctx || !canvas) return 0;

      ctx.save();
      const supportsP3 = window.matchMedia("(color-gamut: p3)").matches;
      // Clear the canvas with the background color
      ctx.fillStyle = isDarkMode
        ? supportsP3
          ? "oklch(13.71% 0.036 258.53)"
          : "#020817"
        : supportsP3
          ? "oklch(98.4% 0.0039 243.25)"
          : "#f8fafc";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const logoSize = isMobile ? 300 : 500;
      const scale = logoSize / 512; // Original viewBox is 512x512

      ctx.translate(
        canvas.width / 2 - logoSize / 2,
        canvas.height / 2 - logoSize / 2
      );
      ctx.scale(scale, scale);

      // Set the color for all paths (using a cyan color for demonstration)
      const logoColor = isDarkMode
        ? supportsP3
          ? "oklch(98.4% 0.0039 243.25)"
          : "#f8fafc"
        : supportsP3
          ? "oklch(13.71% 0.036 258.53)"
          : "#020817";
      // const scatteredColor = "#00DCFF"; // Cyan color for scattered particles

      // Draw each path
      AR_LOGO_PATHS.forEach((pathData, _index) => {
        const path = new Path2D(pathData.d);

        // if (index === 2) {
        //   // Circle border path
        //   ctx.strokeStyle = logoColor;
        //   ctx.lineWidth = pathData.strokeWidth ?? 12;
        //   ctx.stroke(path);
        // } else {
        //   // Letter paths
        //   ctx.fillStyle = logoColor;
        //   ctx.fill(path);
        // }
        ctx.fillStyle = logoColor;
        ctx.fill(path);
      });

      ctx.restore();

      textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Clear the canvas again for the animation
      ctx.fillStyle = isDarkMode
        ? supportsP3
          ? "oklch(13.71% 0.036 258.53)"
          : "#020817"
        : supportsP3
          ? "oklch(98.4% 0.0039 243.25)"
          : "#f8fafc";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      return scale;
    }

    function createParticle(scale: number) {
      if (!ctx || !canvas || !textImageData) return null;
      const supportsP3 = window.matchMedia("(color-gamut: p3)").matches;
      const data = textImageData.data;
      const logoColor = isDarkMode
        ? supportsP3
          ? "oklch(98.4% 0.0039 243.25)"
          : "#f8fafc"
        : supportsP3
          ? "oklch(13.71% 0.036 258.53)"
          : "#020817";
      const scatteredColor = "#00DCFF"; // Cyan color for scattered particles

      for (let attempt = 0; attempt < 100; attempt++) {
        const x = Math.floor(Math.random() * canvas.width),
          y = Math.floor(Math.random() * canvas.height);

        const index = (y * canvas.width + x) * 4;

        // Check if this pixel is part of the logo (not transparent/background)
        // For dark mode, we look for white pixels; for light mode, we look for black pixels
        function isLogoPartHelper({
          isDarkMode,
          data,
          index
        }: {
          isDarkMode: boolean;
          data: Uint8ClampedArray;
          index: number;
        }) {
          if (index >= 0 && index + 2 < data.length) {
            const r = data[index],
              g = data[index + 1],
              b = data[index + 2];
            if (
              typeof r === "number" &&
              typeof g === "number" &&
              typeof b === "number"
            ) {
              return isDarkMode
                ? r > 200 && g > 200 && b > 200
                : r < 50 && g < 50 && b < 50;
            } else return false;
          }
          return false;
        }
        const isLogoPart = isLogoPartHelper({ isDarkMode, data, index });

        if (isLogoPart) {
          const centerX = canvas.width / 2,
            centerY = canvas.height / 2;

          let pathIndex = 0;
          if (x < centerX) {
            pathIndex = 0; // A
          } else {
            pathIndex = 1; // R
          }

          // near edge it's likely the circle
          const distFromCenter = Math.sqrt(
            Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
          );
          const logoRadius = (isMobile ? 150 : 250) * scale;
          if (Math.abs(distFromCenter - logoRadius) < 10) {
            pathIndex = 2; // circle
          }

          return {
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            size: Math.random() * 1.5 + 0.5,
            color: logoColor,
            scatteredColor: scatteredColor,
            life: Math.random() * 100 + 50,
            pathIndex: pathIndex
          };
        }
      }

      return null;
    }

    function createInitialParticles(scale: number) {
      if (canvas) {
        const baseParticleCount = 7000;
        const particleCount = Math.floor(
          baseParticleCount *
            Math.sqrt((canvas.width * canvas.height) / (1920 * 1080))
        );
        for (let i = 0; i < particleCount; i++) {
          const particle = createParticle(scale);
          if (particle) particles.push(particle);
        }
      }
    }

    let animationFrameId: number;

    function animate(scale: number) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const supportsP3 = window.matchMedia("(color-gamut: p3)").matches;

      ctx.fillStyle = isDarkMode
        ? supportsP3
          ? "oklch(13.71% 0.036 258.53)"
          : "#020817"
        : supportsP3
          ? "oklch(98.4% 0.0039 243.25)"
          : "#f8fafc";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const { x: mouseX, y: mouseY } = mousePositionRef.current;
      const maxDistance = 240;

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        if (!particle) continue;
        const p = particle;
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (
          distance < maxDistance &&
          (isTouchingRef.current || !("ontouchstart" in window))
        ) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          const moveX = Math.cos(angle) * force * 60;
          const moveY = Math.sin(angle) * force * 60;
          p.x = p.baseX - moveX;
          p.y = p.baseY - moveY;

          ctx.fillStyle = p.scatteredColor;
        } else {
          p.x += (p.baseX - p.x) * 0.1;
          p.y += (p.baseY - p.y) * 0.1;
          ctx.fillStyle = p.color;
        }

        ctx.fillRect(p.x, p.y, p.size, p.size);

        p.life--;
        if (p.life <= 0) {
          const newParticle = createParticle(scale);
          if (newParticle) {
            particles[i] = newParticle;
          } else {
            particles.splice(i, 1);
            i--;
          }
        }
      }

      const baseParticleCount = 7000;
      const targetParticleCount = Math.floor(
        baseParticleCount *
          Math.sqrt((canvas.width * canvas.height) / (1920 * 1080))
      );
      while (particles.length < targetParticleCount) {
        const newParticle = createParticle(scale);
        if (newParticle) particles.push(newParticle);
      }

      animationFrameId = requestAnimationFrame(() => animate(scale));
    }

    const scale = createTextImage();
    createInitialParticles(scale);
    animate(scale);

    const handleResize = () => {
      updateCanvasSize();
      const newScale = createTextImage();
      particles = Array.of<{
        x: number;
        y: number;
        baseX: number;
        baseY: number;
        size: number;
        color: string;
        scatteredColor: string;
        life: number;
        pathIndex: number;
      }>();
      createInitialParticles(newScale);
    };

    const handleMove = (x: number, y: number) => {
      mousePositionRef.current = { x, y };
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0 && e.touches[0]) {
        e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchStart = () => {
      isTouchingRef.current = true;
    };

    const handleTouchEnd = () => {
      isTouchingRef.current = false;
      mousePositionRef.current = { x: 0, y: 0 };
    };

    const handleMouseLeave = () => {
      if (!("ontouchstart" in window)) {
        mousePositionRef.current = { x: 0, y: 0 };
      }
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile, isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  // replace hidden with flex to make the toggle functionality visible again
  return (
    <div
      className={cn(
        `theme-transition relative flex h-dvh w-full flex-col items-center justify-center`,
        isDarkMode ? "bg-background" : "bg-foreground"
      )}>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 h-full w-full touch-none"
        aria-label="Interactive particle effect with AR logo"
      />
      <div className="absolute bottom-8 z-10 hidden flex-col items-center gap-4 text-center">
        <p
          className={cn(
            `font-basis-grotesque-pro-regular text-sm`,
            isDarkMode ? "text-foreground" : "text-background"
          )}>
          Interactive Particle Animation
        </p>
        <button
          onClick={toggleDarkMode}
          className={cn(
            `rounded-md px-4 py-2 font-medium transition-colors`,
            isDarkMode
              ? "bg-foreground text-background"
              : "bg-background text-foreground"
          )}>
          Toggle {isDarkMode ? "Light" : "Dark"} Mode
        </button>
      </div>
    </div>
  );
}

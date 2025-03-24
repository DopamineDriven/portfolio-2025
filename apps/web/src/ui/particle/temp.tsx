"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AR_LOGO_PATHS } from "./ar-logo-paths";

interface ArLogoParticlesProps {
  maxHeight?: number; // Maximum height in pixels
  aspectRatio?: number; // Width to height ratio (default: 2)
  className?: string;
}

export default function ArLogoParticles({
  maxHeight = 400,
  aspectRatio = 2,
  className = ""
}: ArLogoParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isTouchingRef = useRef(false);
  const [_isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 100, height: 50 }); // Default non-zero values

  // Calculate dimensions based on container size and constraints
  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth || 100; // Ensure non-zero

    // Calculate dimensions while maintaining aspect ratio
    let width = Math.max(containerWidth, 10); // Minimum width of 10px
    let height = Math.max(width / aspectRatio, 10); // Minimum height of 10px

    // If height exceeds maxHeight, recalculate width to maintain aspect ratio
    if (height > maxHeight) {
      height = Math.max(maxHeight, 10);
      width = Math.max(height * aspectRatio, 10);
    }

    // If width exceeds container width, recalculate height to maintain aspect ratio
    if (width > containerWidth) {
      width = Math.max(containerWidth, 10);
      height = Math.max(width / aspectRatio, 10);
    }

    // Ensure integer dimensions to avoid canvas rendering issues
    width = Math.floor(width);
    height = Math.floor(height);

    setDimensions({ width, height });
    setIsMobile(window.innerWidth < 768);
  }, [aspectRatio, maxHeight]);

  useEffect(() => {
    // Initial dimensions update
    updateDimensions();

    // Add resize listener
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [aspectRatio, maxHeight, updateDimensions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Ensure dimensions are valid
    if (dimensions.width <= 0 || dimensions.height <= 0) {
      console.warn("Invalid canvas dimensions:", dimensions);
      return;
    }

    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles = Array.of<{
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

    let textImageData: ImageData | null = null;

    function createTextImage() {
      if (!ctx || !canvas) return 0;

      // Safety check for dimensions
      if (canvas.width <= 0 || canvas.height <= 0) {
        console.warn("Invalid canvas dimensions in createTextImage");
        return 0;
      }
      const supportsP3 = window.matchMedia("(color-gamut: p3)").matches;

      ctx.save();

      // Clear the canvas with the background color
      ctx.fillStyle = isDarkMode
        ? supportsP3
          ? "oklch(13.71% 0.036 258.53)"
          : "#020817"
        : supportsP3
          ? "oklch(98.4% 0.0039 243.25)"
          : "#f8fafc";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate logo size safely
      const logoSize = Math.max(
        Math.min(dimensions.width, dimensions.height) * 0.8,
        10
      );
      const scale = logoSize / 512; // Original viewBox is 512x512

      // Center the logo
      ctx.translate(
        Math.max(canvas.width / 2 - logoSize / 2, 0),
        Math.max(canvas.height / 2 - logoSize / 2, 0)
      );
      ctx.scale(scale, scale);

      // Set the color for all paths
      const logoColor = isDarkMode
        ? supportsP3
          ? "oklch(98.4% 0.0039 243.25)"
          : "#f8fafc"
        : supportsP3
          ? "oklch(13.71% 0.036 258.53)"
          : "#020817";

      // Draw each path
      AR_LOGO_PATHS.forEach((pathData, index) => {
        const path = new Path2D(pathData.d);

        if (index === 2) {
          // Circle border path
          ctx.strokeStyle = logoColor;
          ctx.lineWidth = pathData.strokeWidth ?? 12;
          ctx.stroke(path);
        } else {
          // Letter paths
          ctx.fillStyle = logoColor;
          ctx.fill(path);
        }
      });

      ctx.restore();

      try {
        // Create image data safely
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
      } catch (error) {
        console.error("Error creating image data:", error);
        return 0;
      }

      return scale;
    }

    function isLogoPartHelper(
      data: Uint8ClampedArray,
      index: number,
      isDarkMode: boolean
    ) {
      // Check if index is within bounds of the data array
      if (index >= 0 && index + 2 < data.length) {
        const r = data[index],
          g = data[index + 1],
          b = data[index + 2];

        // Check if the values are not undefined
        // Using typeof instead of truthy check to handle 0 values correctly
        if (
          typeof r === "number" &&
          typeof g === "number" &&
          typeof b === "number"
        ) {
          return isDarkMode
            ? r > 200 && g > 200 && b > 200
            : r < 50 && g < 50 && b < 50;
        }
      }
      return false;
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

        // Ensure index is valid
        if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) continue;

        const index = (y * canvas.width + x) * 4;

        // Check if this pixel is part of the logo
        const isLogoPart = isLogoPartHelper(data, index, isDarkMode);

        if (isLogoPart) {
          // Determine which path this pixel belongs to
          const centerX = canvas.width / 2,
            centerY = canvas.height / 2;

          let pathIndex = 0;
          if (x < centerX) {
            pathIndex = 0; // A
          } else {
            pathIndex = 1; // R
          }

          // If it's near the edge, it's likely the circle
          const distFromCenter = Math.sqrt(
            Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
          );
          const logoRadius =
            Math.min(dimensions.width, dimensions.height) * 0.4 * scale;
          if (Math.abs(distFromCenter - logoRadius) < 10) {
            pathIndex = 2; // Circle
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
        // Scale particle count based on canvas area, with safety checks
        const baseParticleCount = 5000;
        const canvasArea = Math.max(canvas.width * canvas.height, 1);
        const referenceArea = 1000 * 500; // Reference size for particle count
        const particleCount = Math.min(
          Math.floor(baseParticleCount * (canvasArea / referenceArea)),
          10000 // Cap at 10,000 particles for performance
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
      const supportsP3 = window.matchMedia("(color-gamut: p3)").matches;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = isDarkMode
        ? supportsP3
          ? "oklch(13.71% 0.036 258.53)"
          : "#020817"
        : supportsP3
          ? "oklch(98.4% 0.0039 243.25)"
          : "#f8fafc";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const { x: mouseX, y: mouseY } = mousePositionRef.current;
      const maxDistance = Math.min(canvas.width, canvas.height) * 0.3; // Scale interaction radius

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
          const moveX = Math.cos(angle) * force * (canvas.width * 0.06); // Scale movement
          const moveY = Math.sin(angle) * force * (canvas.width * 0.06);
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

      // Maintain particle count with safety checks
      const baseParticleCount = 5000;
      const canvasArea = Math.max(canvas.width * canvas.height, 1);
      const referenceArea = 1000 * 500;
      const targetParticleCount = Math.min(
        Math.floor(baseParticleCount * (canvasArea / referenceArea)),
        10000 // Cap at 10,000 particles
      );

      // Only add more particles if we're significantly below target
      if (particles.length < targetParticleCount * 0.8) {
        const particlesToAdd = Math.min(
          10,
          targetParticleCount - particles.length
        );
        for (let i = 0; i < particlesToAdd; i++) {
          const newParticle = createParticle(scale);
          if (newParticle) particles.push(newParticle);
        }
      }

      animationFrameId = requestAnimationFrame(() => animate(scale));
    }

    try {
      const scale = createTextImage();
      createInitialParticles(scale);
      animate(scale);
    } catch (error) {
      console.error("Error initializing animation:", error);
    }

    const handleMove = (x: number, y: number) => {
      mousePositionRef.current = { x, y };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      handleMove(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0 && e.touches[0]) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        handleMove(
          e.touches[0].clientX - rect.left,
          e.touches[0].clientY - rect.top
        );
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

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions, isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{
        height: "auto",
        minHeight: "100px",
        maxHeight: `${maxHeight}px`
      }}>
      {/* Only render canvas when we have valid dimensions */}
      {dimensions.width > 0 && dimensions.height > 0 && (
        <div
          className="flex items-center justify-center"
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            margin: "0 auto"
          }}>
          <canvas
            ref={canvasRef}
            className="touch-none"
            width={dimensions.width}
            height={dimensions.height}
            aria-label="Interactive particle effect with AR logo"
          />
        </div>
      )}

      {/* Optional controls - can be removed if not needed */}
      <div className="absolute right-2 bottom-2 z-10 hidden">
        <button
          onClick={toggleDarkMode}
          className={`rounded-full p-2 ${isDarkMode ? "bg-white text-black" : "bg-black text-white"} text-xs`}
          aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}>
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </div>
  );
}

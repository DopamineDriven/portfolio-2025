"use client";

import type { RefObject } from "react";
import { useEffect, useState } from "react";

interface UseChartCaptureProps {
  chartRef: RefObject<HTMLDivElement | null>;
}

export function useChartCapture({ chartRef }: UseChartCaptureProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (chartRef.current) {
        const { width, height } = chartRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, [chartRef]);

  const captureChart = () => {
    if (chartRef.current) {
      const svgElement = chartRef.current.querySelector("svg");
      if (!svgElement) return;

      // Create a canvas with the same dimensions
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas dimensions with 2x scaling for better quality
      const rect = svgElement.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);

      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8"
      });
      const url = URL.createObjectURL(svgBlob);

      // Create image from SVG and draw to canvas
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setCapturedImage(canvas.toDataURL("image/png"));
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  const downloadChart = () => {
    if (capturedImage) {
      const link = document.createElement("a");
      link.href = capturedImage;
      link.download = `chess-advantage-chart-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return {
    capturedImage,
    captureChart,
    downloadChart,
    dimensions
  };
}

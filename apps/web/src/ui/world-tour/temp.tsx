"use client";

import type { GeoPermissibleObjects } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Iso3166_1 } from "@d0paminedriven/iso-3166-1";
import {
  easeQuadOut,
  geoCentroid,
  geoOrthographic,
  geoPath,
  interpolate,
  json,
  select,
  transition
} from "d3";
import { AnimatePresence, motion, useInView } from "motion/react";
import { feature } from "topojson-client";
import type { TopojsonShape, World110m } from "@/types/topojson";
import { countryCodeToObjOutput } from "@/lib/country-code-to-object";
import { shimmer } from "@/lib/shimmer";
import { Versor } from "@/lib/versor";

const visitorData = [
  ["840", 73],
  ["250", 9],
  ["484", 6],
  ["056", 3],
  ["616", 2],
  ["642", 2],
  ["156", 2],
  ["756", 1],
  ["376", 1]
] as const satisfies readonly [string, number][];

const WorldTour: React.FC = () => {
  const isoHelper = useMemo(() => new Iso3166_1(), []);
  const earthDefault = countryCodeToObjOutput("001", isoHelper); // Using "001" (a non-existent country code) as an escape hatch for the Earth
  const DEFAULT_SCALE = 190;
  const MIN_SCALE = DEFAULT_SCALE;
  const MAX_SCALE = 800;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [currentCountry, setCurrentCountry] = useState(earthDefault);
  const [currentVisitors, setCurrentVisitors] = useState<number>(
    visitorData.reduce((sum, [, count]) => sum + count, 0)
  );
  const isInView = useInView(containerRef, { once: false, amount: "some" });
  const d3ContainerRef = useRef<SVGSVGElement>(null);

  const createVisualization = useCallback(
    (worldData: World110m) => {
      const width = 600;
      const height = 400;

      const svg = select(containerRef.current)
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

      svg.selectAll("*").remove();

      const countries = feature(
        worldData,
        worldData.objects.countries
      ) satisfies FeatureCollection<Geometry, TopojsonShape>;

      const projection = geoOrthographic()
        .scale(DEFAULT_SCALE)
        .translate([width / 2, height / 2]);

      const path = geoPath(projection);

      const g = svg.append("g");

      g.append("path")
        .datum({ type: "Sphere" } as GeoPermissibleObjects)
        .attr("class", "sphere")
        .attr("fill", "#222")
        .attr("d", path);

      g.selectAll("path.country")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("fill", "#eee")
        .attr("stroke", "#333")
        .attr("d", path);

      const countryPathMap: Record<string, SVGPathElement> = {};
      g.selectAll<SVGPathElement, Feature<Geometry>>("path.country").each(
        function (d) {
          if (d.id) {
            countryPathMap[d.id] = this;
          }
        }
      );

      const computeScaleForBounds = (
        bounds: [[number, number], [number, number]],
        currentScale: number,
        feature: Feature
      ) => {
        const [[x0, y0], [x1, y1]] = bounds;
        const dx = x1 - x0;
        const dy = y1 - y0;
        const boxSize = Math.sqrt(dx * dx + dy * dy);
        if (feature.id === "840" || feature.id === "156") {
          console.log(
            `Country ${feature.id} bounds:`,
            bounds,
            `boxSize:`,
            boxSize
          );
          return 360;
        }

        console.log(
          `Country ${feature.id} bounds:`,
          bounds,
          `boxSize:`,
          boxSize
        );

        // For smaller countries use original dynamic scaling
        const zoomFactor = 1.0;
        let newScale =
          (currentScale * Math.min(width, height) * zoomFactor) / boxSize;

        // Clamp the scale between MIN_SCALE and MAX_SCALE
        newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

        return newScale;
      };

      const rotateAndZoomToCountry = (feature: Feature, duration = 3000) => {
        if (!feature) return Promise.resolve();

        const [lon, lat] = geoCentroid(feature);
        const currentRotate = projection.rotate();
        const targetRotate = [-lon, -lat, currentRotate[2]] satisfies [
          number,
          number,
          number
        ];

        // Calculate bounds and target scale
        const bounds = path.bounds(feature);
        const targetScale = computeScaleForBounds(
          bounds,
          projection.scale(),
          feature
        );

        const currentScale = projection.scale();

        return new Promise<void>(resolve => {
          transition()
            .duration(duration)
            .tween("rotate-and-zoom", () => {
              const rotateInterpolator = Versor.interpolateAngles(
                currentRotate satisfies [number, number, number],
                targetRotate
              );
              const scaleInterp = interpolate(currentScale, targetScale);

              return (t: number) => {
                const rotate = rotateInterpolator(t);
                const scale = scaleInterp(t);

                projection.rotate(rotate).scale(scale);
                g.selectAll("path").attr(
                  "d",
                  d => path(d as GeoPermissibleObjects) ?? ""
                );
              };
            })
            .on("end", () => resolve());
        });
      };

      const runTour = async () => {
        const sortedData = [...visitorData].sort((a, b) => b[1] - a[1]);
        for (const [countryCode, visitors] of sortedData) {
          const countryInfo = countryCodeToObjOutput(countryCode, isoHelper);
          if (countryInfo) {
            // Update country info and flag before starting rotation
            setCurrentCountry(countryInfo);
            setCurrentVisitors(visitors);

            // Wait for info to be visible
            await new Promise(resolve => setTimeout(resolve, 1000));

            const feature = countries.features.find(f => f.id === countryCode);
            if (!feature) continue;

            // Zoom in to the country
            await rotateAndZoomToCountry(feature);

            const pathEl = countryPathMap[countryCode];
            if (!pathEl) continue;

            // Highlight country
            await new Promise<void>(resolve => {
              select(pathEl)
                .transition()
                .duration(700)
                .attr("fill", "gold")
                .transition()
                .duration(2000)
                .attr("fill", "#eee")
                .on("end", () => resolve());
            });

            // Pause before moving to the next country
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Zoom out slightly before moving to the next country
            await new Promise<void>(resolve => {
              transition()
                .duration(1000)
                .tween("zoom-out", () => {
                  const currentScale = projection.scale();
                  const targetScale = Math.max(MIN_SCALE, currentScale * 0.8);
                  const scaleInterp = interpolate(currentScale, targetScale);

                  return (t: number) => {
                    const scale = scaleInterp(easeQuadOut(t));
                    projection.scale(scale);
                    g.selectAll("path").attr(
                      "d",
                      d => path(d as GeoPermissibleObjects) ?? ""
                    );
                  };
                })
                .on("end", () => resolve());
            });
          }
        }

        // Reset to Earth view
        setCurrentCountry(earthDefault);
        setCurrentVisitors(
          visitorData.reduce((sum, [, count]) => sum + count, 0)
        );

        // Zoom out and reset rotation
        await new Promise<void>(resolve => {
          transition()
            .duration(2000)
            .tween("reset", () => {
              const currentRotate = projection.rotate() satisfies [
                number,
                number,
                number
              ];
              const currentScale = projection.scale();
              const rotateInterpolator = Versor.interpolateAngles(
                currentRotate,
                [0, 0, 0]
              );
              const scaleInterp = interpolate(currentScale, DEFAULT_SCALE);

              return (t: number) => {
                const rotate = rotateInterpolator(t);
                const scale = scaleInterp(t);
                projection.rotate(rotate).scale(scale);
                g.selectAll("path").attr(
                  "d",
                  d => path(d as GeoPermissibleObjects) ?? ""
                );
              };
            })
            .on("end", () => resolve());
        });
      };

      runTour().catch(err => console.error(err));
    },
    [MIN_SCALE, isoHelper, earthDefault]
  );

  useEffect(() => {
    if (isInView && !hasPlayed) {
      setHasPlayed(true);
      json<World110m>("/topojson/countries-110m.json")
        .then(worldData => {
          if (worldData) {
            createVisualization(worldData);
          }
        })
        .catch(err => console.error(err));
    }
  }, [isInView, hasPlayed, createVisualization]);

  return (
    <motion.div
      ref={containerRef}
      className="my-2 flex w-full flex-col items-start justify-around text-left sm:flex-row sm:items-start sm:justify-center sm:gap-x-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}>
      <div className="flex flex-col items-start sm:ml-2 sm:w-96 sm:items-start">
        <div className="mb-2 text-left">
          <h2 className="theme-transition text-2xl text-current">
            <a id="world-tour" className="appearance-auto">
              World Tour - Total Visitors
            </a>
          </h2>
          <p className="text-sm text-gray-600">Work in Progress</p>
        </div>
        <div className="relative isolate w-full sm:h-20">
          <AnimatePresence mode="sync">
            <motion.div
              key={currentCountry.countryName}
              className="absolute inset-0 flex items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}>
              <div className="flex space-x-2">
                <div className="h-auto w-[4.5rem] shrink-0 overflow-hidden sm:w-20">
                  <Image
                    src={currentCountry.countryFlag ?? "/en.svg"}
                    alt={`Flag of ${currentCountry.countryName}`}
                    width={60}
                    placeholder="blur"
                    loading="eager"
                    blurDataURL={shimmer([60, 36])}
                    height={36}
                    className="aspect-3/2! h-auto w-full object-cover"
                    priority
                  />
                </div>
                <div className="flex flex-col space-y-1 whitespace-nowrap">
                  <p className="text-lg font-medium text-white">
                    {currentCountry.countryName}
                  </p>
                  <div className="flex flex-row items-center space-x-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      role="img"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-5 text-white">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <p className="text-base text-white">{currentVisitors}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="relative sm:flex-1">
        <svg ref={d3ContainerRef} className="mx-auto w-full max-w-3xl" />
      </div>
    </motion.div>
  );
};

export default WorldTour;

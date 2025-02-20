"use client";

import type { GeoPermissibleObjects } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Iso3166_1 } from "@d0paminedriven/iso-3166-1";
import {
  geoArea,
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
import { BreakoutWrapper } from "@/ui/atoms/breakout-wrapper";

const visitorData = [
  ["840", 77],
  ["250", 9],
  ["484", 6],
  ["156", 4],
  ["056", 3],
  ["616", 2],
  ["642", 2],
  ["756", 1],
  ["376", 1],
  ["364", 1]
] as const satisfies readonly [string, number][];

const WorldTour: React.FC = () => {
  const isoHelper = useMemo(() => new Iso3166_1(), []);
  const earthDefault = countryCodeToObjOutput("001", isoHelper);
  const DEFAULT_SCALE = 190;
  const MIN_SCALE = DEFAULT_SCALE * 0.8;
  const MAX_SCALE = DEFAULT_SCALE * 10;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [currentCountry, setCurrentCountry] = useState(earthDefault);
  const [currentVisitors, setCurrentVisitors] = useState<number>(
    visitorData.reduce((sum, [, count]) => sum + count, 0)
  );
  const isInView = useInView(containerRef, { once: false, amount: "some" });
  const d3ContainerRef = useRef<SVGSVGElement | null>(null);

  const createVisualization = useCallback(
    (worldData: World110m) => {
      const width = 800;
      const height = 600;

      const svg = select(containerRef.current)
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

      svg.selectAll("*").remove();

      const countries = feature(
        worldData,
        worldData.objects.countries
      ) as FeatureCollection<Geometry, TopojsonShape>;

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

      const computeScaleForBounds = (
        bounds: [[number, number], [number, number]],
        currentScale: number,
        feature: Feature<Geometry, TopojsonShape>
      ): number => {
        // Get the country's geometry type and area
        const geometryType = feature.geometry.type;
        const area = geoArea(feature);

        // Log the data for analysis
        console.log(`Country: ${feature.id}`);
        console.log(`Area: ${area}`);

        // Special cases for large countries
        if (feature.id === "840") {
          // US or China
          return 500;
        }
        if (feature.id === "156") {
          return 550;
        }

        // Base scale calculation from bounds
        const [[x0, y0], [x1, y1]] = bounds;
        const dx = x1 - x0;
        const dy = y1 - y0;
        const boxSize = Math.sqrt(dx * dx + dy * dy);

        // Define thresholds
        const TINY_COUNTRY_THRESHOLD = 0.001;
        const MEDIUM_COUNTRY_THRESHOLD = 0.03;
        const LARGE_COUNTRY_THRESHOLD = 0.15;

        // Calculate area-based zoom factor with extra boost for tiny countries
        const baseAreaZoomFactor = Math.sqrt(0.234 / area);
        let areaZoomFactor;

        if (area < TINY_COUNTRY_THRESHOLD) {
          // Tiny countries get extra boost
          areaZoomFactor =
            baseAreaZoomFactor *
            (1 + Math.pow(TINY_COUNTRY_THRESHOLD / area, 0.3));
        } else if (area < MEDIUM_COUNTRY_THRESHOLD) {
          // Small countries use base calculation
          areaZoomFactor = baseAreaZoomFactor;
        } else if (area < LARGE_COUNTRY_THRESHOLD) {
          // Medium countries get reduced zoom
          areaZoomFactor = baseAreaZoomFactor * 0.7;
        } else {
          // Large countries get minimum zoom
          areaZoomFactor = baseAreaZoomFactor * 0.5;
        }

        // Apply the standard multiplier
        const zoomFactor = areaZoomFactor * 0.8;

        // Adjust geometry multiplier based on area and geometry type
        let geometryMultiplier;
        if (area >= MEDIUM_COUNTRY_THRESHOLD) {
          geometryMultiplier = 0.9; // Reduce multiplier for medium and large countries
        } else if (geometryType === "Polygon") {
          geometryMultiplier = area < TINY_COUNTRY_THRESHOLD ? 1.4 : 1.2;
        } else {
          geometryMultiplier = 1.0;
        }

        // Calculate new scale incorporating area and geometry type
        let newScale =
          (currentScale *
            Math.min(width, height) *
            zoomFactor *
            geometryMultiplier) /
          boxSize;

        // Clamp scale between MIN_SCALE and MAX_SCALE
        newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

        // Log the calculated values
        console.log(`Area Zoom Factor: ${areaZoomFactor}`);
        console.log(`Geometry Multiplier: ${geometryMultiplier}`);
        console.log(`New Scale: ${newScale}`);
        console.log("---");

        return newScale;
      };

      const highlightCountry = (
        country: Feature<Geometry, TopojsonShape>,
        duration: number
      ): Promise<void> => {
        return new Promise<void>(resolve => {
          const countryPath = g
            .append("path")
            .datum(country)
            .attr("class", "highlight")
            .attr("fill", "gold")
            .attr("stroke", "none")
            .attr("d", path)
            .style("pointer-events", "none");

          countryPath
            .attr("opacity", 0)
            .transition()
            .duration(duration * 0.3)
            .attr("opacity", 0.7)
            .transition()
            .duration(duration * 0.4)
            .attr("opacity", 0.5)
            .transition()
            .duration(duration * 0.3)
            .attr("opacity", 0)
            .on("end", () => {
              countryPath.remove();
              resolve();
            });
        });
      };

      const rotateAndZoomToCountry = async (
        feature: Feature<Geometry, TopojsonShape>,
        duration = 3000
      ): Promise<void> => {
        if (!feature) return;

        const bounds = path.bounds(feature);
        const [lon, lat] = geoCentroid(feature);
        const currentRotate = projection.rotate();
        const targetRotate: [number, number, number] = [
          -lon,
          -lat,
          currentRotate[2]
        ];

        console.log(`Initial Scale: ${projection.scale()}`);
        const targetScale = computeScaleForBounds(
          bounds,
          projection.scale(),
          feature
        );

        // Transition to show the entire country
        await new Promise<void>(resolve => {
          transition()
            .duration(duration)
            .tween("rotate-and-zoom", () => {
              const rotateInterpolator = Versor.interpolateAngles(
                currentRotate as [number, number, number],
                targetRotate
              );
              const scaleInterp = interpolate(projection.scale(), targetScale);

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

        // Highlight the country
        await highlightCountry(feature, 2000);
      };

      const runTour = async () => {
        const sortedData = [...visitorData].sort((a, b) => b[1] - a[1]);
        for (const [countryCode, visitors] of sortedData) {
          const countryInfo = countryCodeToObjOutput(countryCode, isoHelper);
          if (countryInfo) {
            setCurrentCountry(countryInfo);
            setCurrentVisitors(visitors);

            await new Promise(resolve => setTimeout(resolve, 1000));

            const feature = countries.features.find(f => f.id === countryCode);
            if (!feature) continue;

            await rotateAndZoomToCountry(feature);

            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        setCurrentCountry(earthDefault);
        setCurrentVisitors(
          visitorData.reduce((sum, [, count]) => sum + count, 0)
        );

        await new Promise<void>(resolve => {
          transition()
            .duration(2000)
            .tween("reset", () => {
              const currentRotate = projection.rotate() as [
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
    [isoHelper, earthDefault, MAX_SCALE, MIN_SCALE]
  );

  useEffect(() => {
    if (isInView && !hasPlayed) {
      setHasPlayed(true);
      json<World110m>(
        "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/topojson/countries-110m.json"
      )
        .then(worldData => {
          if (worldData) {
            createVisualization(worldData);
          }
        })
        .catch(console.error);
    }
  }, [isInView, hasPlayed, createVisualization]);

  return (
    <div className="w-full sm:space-y-2">
      {/* Full-width container for the globe on mobile */}
      <AnimatePresence mode="popLayout">
        <div className="mx-auto w-full justify-center">
          <div className="relative isolate mx-auto mt-3 flex sm:hidden">
            <motion.div
              key={currentCountry.countryName}
              className="flex items-start justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.2,
                  type: "spring",
                  visualDuration: 0.3,
                  bounce: 0.4,
                  damping: 50
                }
              }}
              exit={{ opacity: 0, x: -50 }}>
              <div className="flex items-center space-x-3">
                <div className="h-auto w-[4.5rem] shrink-0 overflow-hidden">
                  <Image
                    src={currentCountry.countryFlag || "/en.svg"}
                    alt={`Flag of ${currentCountry.countryName}`}
                    width={60}
                    height={36}
                    placeholder="blur"
                    loading="eager"
                    blurDataURL={shimmer([60, 36])}
                    className="aspect-3/2 h-auto w-full rounded-b-xs object-cover"
                    priority
                  />
                </div>
                <div className="flex flex-col space-y-0.5">
                  <p className="text-base font-medium text-white">
                    {currentCountry.countryName}
                  </p>
                  <div className="flex flex-row items-center space-x-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      role="img"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4 text-white">
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
          </div>
          <div className="hidden sm:relative sm:isolate sm:mx-auto sm:flex sm:w-full sm:flex-row sm:justify-center sm:px-0">
            <motion.div
              key={currentCountry.countryName}
              className="motion-ease-in-out-quad flex transform items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.2,
                  type: "spring",
                  visualDuration: 0.3,
                  bounce: 0.4,
                  damping: 50
                }
              }}
              exit={{ opacity: 0, x: -50 }}>
              <div className="flex items-center space-x-3">
                <div className="h-auto w-16 shrink-0 overflow-hidden sm:w-20">
                  <Image
                    src={currentCountry.countryFlag || "/en.svg"}
                    alt={`Flag of ${currentCountry.countryName}`}
                    width={60}
                    height={36}
                    placeholder="blur"
                    loading="eager"
                    blurDataURL={shimmer([60, 36])}
                    className="aspect-3/2 h-auto w-full rounded-md object-cover"
                    priority
                  />
                </div>
                <div className="flex flex-col space-y-1">
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
          </div>
          <BreakoutWrapper>
            <div className="mx-auto max-w-4xl">
              <motion.div
                ref={containerRef}
                className="mx-auto aspect-square w-full sm:aspect-video"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}>
                <svg ref={d3ContainerRef} className="h-8 w-full sm:h-8" />
              </motion.div>
            </div>
          </BreakoutWrapper>
        </div>
      </AnimatePresence>
    </div>
  );
};

export default WorldTour;

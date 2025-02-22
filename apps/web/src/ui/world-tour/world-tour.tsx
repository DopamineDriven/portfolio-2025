"use client";

import type { GeoPermissibleObjects } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Iso3166_1 } from "@d0paminedriven/iso-3166-1";
import {
  interpolate as d3Interpolate,
  easeCubicInOut,
  geoArea,
  geoCentroid,
  geoDistance,
  geoGraticule10,
  geoInterpolate,
  geoOrthographic,
  geoPath,
  json,
  select,
  timer,
  transition
} from "d3";
import * as d3 from "d3";
import { AnimatePresence, motion, useInView } from "motion/react";
import { feature } from "topojson-client";
import type { TopojsonShape as JSONDATA, World110m } from "@/types/topojson";
import { countryCodeToObjOutput } from "@/lib/country-code-to-object";
import { shimmer } from "@/lib/shimmer";
import { cn } from "@/lib/utils";
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
  const DEFAULT_SCALE = 170; // Reduced from 190 to show poles better
  const MIN_SCALE = DEFAULT_SCALE * 0.8;
  const AXIAL_TILT = 23.4;
  const MAX_SCALE = DEFAULT_SCALE * 8;
  const TINY_COUNTRY_SCALE = DEFAULT_SCALE * 4; // New constant for very small countries
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [currentCountry, setCurrentCountry] = useState(earthDefault);
  const [currentVisitors, setCurrentVisitors] = useState<number>(
    visitorData.reduce((sum, [, count]) => sum + count, 0)
  );
  const isInView = useInView(containerRef, { once: false, amount: "some" });
  const d3ContainerRef = useRef<SVGSVGElement | null>(null);
  const [isTourRunning, setIsTourRunning] = useState(false);
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(337.5);

  const createVisualization = useCallback(
    (worldData: World110m) => {
      setIsTourRunning(true);
      setWidth(600);
      setHeight(window.innerWidth >= 640 ? width * (3 / 4) : width * (4 / 3));

      const svg = select(containerRef.current)
        .select("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet"); // Add this line

      svg.selectAll("*").remove();

      const countries = feature(
        worldData,
        worldData.objects.countries
      ) satisfies FeatureCollection<Geometry, JSONDATA>;

      const projection = geoOrthographic()
        .scale(DEFAULT_SCALE)
        .translate([width / 2, height / 2]); // This centers the globe in the SVG

      const path = geoPath(projection);

      const g = svg.append("g");

      // Add a background gradient
      svg
        .append("defs")
        .append("radialGradient")
        .attr("id", "globe-gradient")
        .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%")
        .selectAll("stop")
        .data([
          { offset: "0%", color: "rgba(255,255,255,0.1)" },
          { offset: "100%", color: "rgba(0,0,0,0)" }
        ])
        .enter()
        .append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);

      g.append("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("r", DEFAULT_SCALE)
        .attr("class", "globe-gradient")
        .style("fill", "url(#globe-gradient)")
        .style("transform-origin", "center");

      g.append("path")
        .datum({ type: "Sphere" } as GeoPermissibleObjects)
        .attr("class", "sphere")
        .attr("fill", "#222")
        .attr("d", path);

      g.append("path")
        .datum(geoGraticule10())
        .attr("class", "graticule")
        .attr("fill", "none")
        .attr("stroke", "#666")
        .attr("stroke-width", 0.5)
        .attr("d", path);

      g.selectAll("path.country")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("fill", "#eee")
        .attr("stroke", "#333")
        .attr("d", path);

      const _flightPath = g
        .append("path")
        .attr("class", "flight-path")
        .attr("fill", "none")
        .attr("stroke", "gold")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4 4")
        .style("opacity", 0);

      const computeScaleForBounds = (
        bounds: [[number, number], [number, number]],
        currentScale: number,
        feature: Feature<Geometry, JSONDATA>
      ) => {
        const area = geoArea(feature);

        // Special handling for specific countries
        if (feature.id === "840" || feature.id === "156") {
          // USA or China
          return 360;
        }

        const [[x0, y0], [x1, y1]] = bounds;
        const dx = x1 - x0;
        const dy = y1 - y0;
        const boxSize = Math.sqrt(dx * dx + dy * dy);

        const TINY_COUNTRY_THRESHOLD = 0.001;
        const SMALL_COUNTRY_THRESHOLD = 0.005;
        const MEDIUM_COUNTRY_THRESHOLD = 0.03;
        const LARGE_COUNTRY_THRESHOLD = 0.15;

        // Enhanced scaling for very small countries
        if (area < TINY_COUNTRY_THRESHOLD) {
          // Use a higher minimum scale for tiny countries
          return Math.max(TINY_COUNTRY_SCALE, DEFAULT_SCALE * 5);
        }

        // Progressive scaling based on country size
        let scaleFactor;
        if (area < SMALL_COUNTRY_THRESHOLD) {
          scaleFactor =
            4 +
            ((SMALL_COUNTRY_THRESHOLD - area) / SMALL_COUNTRY_THRESHOLD) * 2;
        } else if (area < MEDIUM_COUNTRY_THRESHOLD) {
          scaleFactor = 3;
        } else if (area < LARGE_COUNTRY_THRESHOLD) {
          scaleFactor = 2;
        } else {
          scaleFactor = 1.5;
        }

        let newScale =
          (currentScale * Math.min(width, height) * scaleFactor) / boxSize;

        // Ensure the scale stays within reasonable bounds
        newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

        return newScale;
      };

      const highlightCountry = (
        country: Feature<Geometry, JSONDATA>,
        duration: number
      ) => {
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
        feature: Feature<Geometry, JSONDATA>,
        index: number,
        total: number
      ) => {
        if (!feature) return;

        const [lon1, lat1] = geoCentroid(feature);
        const [currentLon, currentLat] = projection.rotate();
        const lon0 = -currentLon;
        const lat0 = -currentLat;

        const interpolateLonLat = geoInterpolate([lon0, lat0], [lon1, lat1]);

        const s0 = projection.scale();
        const s1 = computeScaleForBounds(path.bounds(feature), s0, feature);

        // Adjust the intermediate scale based on country size
        const area = geoArea(feature);
        const TINY_COUNTRY_THRESHOLD = 0.001;
        const intermediateScaleFactor =
          area < TINY_COUNTRY_THRESHOLD ? 0.9 : 0.7;
        const _s2 = s0 * intermediateScaleFactor; // Less extreme zoom-out for small countries

        // Use a more consistent scale range
        const minScale = DEFAULT_SCALE * 0.9;
        const maxScale = DEFAULT_SCALE * 1.5;
        const targetScale = Math.max(minScale, Math.min(maxScale, s1));

        // Calculate the progress of the entire tour
        const _progress = index / total;

        // Adjust duration based on distance, but keep it more consistent
        const distance = geoDistance([lon0, lat0], [lon1, lat1]);
        const duration = 2000 + distance * 3000; // Base duration plus distance-based addition

        await new Promise<void>(resolve => {
          transition()
            .duration(duration)
            .ease(easeCubicInOut) // Use a smoother easing function
            .tween("rotate", () => {
              return (t: number) => {
                const [lonI, latI] = interpolateLonLat(t);
                const scale = d3Interpolate(s0, targetScale)(t);
                projection.rotate([-lonI, -latI, AXIAL_TILT]).scale(scale);
                g.selectAll("path").attr(
                  "d",
                  d => path(d as GeoPermissibleObjects) ?? ""
                );
              };
            })
            .on("end", () => resolve());
        });

        await highlightCountry(feature, 1000);
      };

      const runTour = async () => {
        setIsTourRunning(true);
        const sortedData = visitorData.toSorted((a, b) => b[1] - a[1]);
        const totalCountries = sortedData.length;

        // Create a single path for the entire journey
        const tourPath = g
          .append("path")
          .attr("class", "tour-path")
          .attr("fill", "none")
          .attr("stroke", "gold")
          .attr("stroke-width", 2)
          .attr("opacity", 0.5);

        // Calculate the complete tour path
        const tourCoordinates = sortedData
          .map(([countryCode]) => {
            const feature = countries.features.find(f => f.id === countryCode);
            return feature ? geoCentroid(feature) : null;
          })
          .filter(Boolean);

        tourPath.attr(
          "d",
          path({
            type: "LineString",
            coordinates: tourCoordinates
          } as GeoPermissibleObjects)
        );

        for (let i = 0; i < sortedData.length; i++) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const [countryCode, visitors] = sortedData[i]!;
          const countryInfo = countryCodeToObjOutput(countryCode, isoHelper);
          if (countryInfo) {
            setCurrentCountry(countryInfo);
            setCurrentVisitors(visitors);

            const feature = countries.features.find(f => f.id === countryCode);
            if (!feature) continue;

            await rotateAndZoomToCountry(feature, i, totalCountries);

            // Highlight the current segment of the tour path
            const segmentPath = g
              .append("path")
              .attr("class", "current-segment")
              .attr("fill", "none")
              .attr("stroke", "gold")
              .attr("stroke-width", 3)
              .attr("opacity", 1);

            if (i < totalCountries - 1) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const nextCountry = sortedData[i + 1]![0];
              const nextFeature = countries.features.find(
                f => f.id === nextCountry
              );
              if (nextFeature) {
                const currentCoords = geoCentroid(feature);
                const nextCoords = geoCentroid(nextFeature);
                segmentPath.attr(
                  "d",
                  path({
                    type: "LineString",
                    coordinates: [currentCoords, nextCoords]
                  } as GeoPermissibleObjects)
                );
              }
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
            segmentPath.remove();
          }
        }

        setCurrentCountry(earthDefault);
        setCurrentVisitors(
          visitorData.reduce((sum, [, count]) => sum + count, 0)
        );

        // Final transition back to the starting view
        await new Promise<void>(resolve => {
          transition()
            .duration(2000)
            .ease(d3.easeCubicInOut)
            .tween("rotate", () => {
              const currentRotation = projection.rotate();
              const currentScale = projection.scale();
              return (t: number) => {
                const rotation = currentRotation.map(d => d * (1 - t));
                rotation[2] = AXIAL_TILT; // Ensure the axial tilt is maintained
                const scale = d3Interpolate(currentScale, DEFAULT_SCALE)(t);
                projection
                  .rotate(rotation as [number, number, number])
                  .scale(scale);
                g.selectAll("path").attr(
                  "d",
                  d => path(d as GeoPermissibleObjects) ?? ""
                );
              };
            })
            .on("end", () => {
              tourPath.remove();
              resolve();
            });
        });
        setIsTourRunning(false);
      };

      runTour().catch(err => {
        console.error(err);
        setIsTourRunning(false);
      });
    },
    [
      isoHelper,
      earthDefault,
      MAX_SCALE,
      MIN_SCALE,
      TINY_COUNTRY_SCALE,
      height,
      width
    ]
  );

  // Add continuous rotation when not touring
  useEffect(() => {
    if (!isTourRunning && containerRef.current) {
      const svg = select(containerRef.current)
        .select("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr(
          "preserveAspectRatio",
          "xMidYMid meet"
          // window.innerWidth < 640 ? "xMidYMin" : "xMidYMid meet"
        );
      const g = svg.select("g");

      g.select(".globe-gradient")
        .attr("cx", width / 2)
        .attr("cy", height / 2);

      const projection = geoOrthographic()
        .scale(DEFAULT_SCALE)
        .translate([width / 2, height / 2]);
      const path = geoPath(projection);

      const rotationTimer = timer(elapsed => {
        const rotation = [(elapsed * 0.01) % 360, -20, AXIAL_TILT] as [
          number,
          number,
          number
        ];

        projection.rotate(rotation);
        g.selectAll("path").attr(
          "d",
          d => path(d as GeoPermissibleObjects) ?? ""
        );
      });
      return () => rotationTimer.stop();
    }
  }, [isTourRunning, height, width]);

  useEffect(() => {
    if (isInView && !hasPlayed) {
      setHasPlayed(true);
      json<World110m>("/topojson/countries-110m.json")
        .then(worldData => {
          if (worldData) {
            createVisualization(worldData);
          }
        })
        .catch(console.error);
    }
  }, [isInView, hasPlayed, createVisualization]);

  return (
    <div className="bg-background w-full sm:space-y-2">
      <AnimatePresence mode="popLayout">
        <div className="mx-auto w-full justify-center">
          <div className="relative isolate mx-auto mt-0 flex w-full flex-row justify-start px-0">
            <div className="absolute inset-0 bg-[oklch(0.1370608055115447_0.03597153479968494_258.52581130794215)]/30 backdrop-blur-sm"></div>
            <motion.div
              key={currentCountry.countryName}
              className="motion-ease-in-out-quad relative z-10 flex transform items-start justify-center sm:items-center"
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
              <div className="container flex items-center space-x-3">
                <div className="h-auto w-[4.5rem] shrink-0 overflow-hidden">
                  <Image
                    src={currentCountry.countryFlag ?? "/en.svg"}
                    alt={`Flag of ${currentCountry.countryName}`}
                    width={60}
                    height={36}
                    placeholder="blur"
                    loading="eager"
                    blurDataURL={shimmer([60, 36])}
                    className="aspect-3/2 h-auto w-full rounded-xs object-cover"
                    priority
                  />
                </div>
                <div className="flex flex-col space-y-0.5 sm:space-y-1">
                  <p className="text-base font-medium text-white sm:text-lg">
                    {currentCountry.countryName}
                  </p>
                  <div className="flex flex-row items-center space-x-1 sm:space-x-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      role="img"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4 text-white sm:size-5">
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
            <div className="mx-auto max-w-5xl">
              <div className="relative flex h-auto min-w-screen items-center justify-center sm:min-h-[60vh] sm:min-w-full">
                <div
                  className={cn(
                    "pointer-events-none absolute bottom-[10%] left-1/2 h-6 w-[60%] -translate-x-1/2 rounded-full bg-gradient-to-bl from-black/10 via-black/[0.25] to-black/30 mix-blend-soft-light blur-sm sm:bottom-[5%]"
                  )}></div>
                <motion.div
                  ref={containerRef}
                  className="relative top-1/2 bottom-1/2 z-10 mx-auto flex aspect-[3/4] h-auto w-full items-center justify-center align-middle drop-shadow-sm sm:aspect-[4/3]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}>
                  <svg ref={d3ContainerRef} className="h-full w-full" />
                </motion.div>
              </div>
            </div>
          </BreakoutWrapper>
        </div>
      </AnimatePresence>
    </div>
  );
};

export default WorldTour;

"use client";

import type { GeoPermissibleObjects } from "d3-geo";
import type * as GeoJSON from "geojson";
import type React from "react";
import type { GeometryCollection, Topology } from "topojson-specification";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Iso3166_1 } from "@d0paminedriven/iso-3166-1";
import * as d3 from "d3";
import { Users } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import * as topojson from "topojson-client";
import { shimmer } from "@/lib/shimmer";

type JSONDATA = {
  arcs: number[][][];
  type: string;
  objects: {
    countries: {
      type: string;
      geometries: {
        type: string;
        arcs: number[][] | number[][][];
        id?: string;
        properties: {
          name: string;
        };
      }[];
    };
    land: {
      type: string;
      geometries: {
        type: string;
        arcs: number[][][];
      }[];
    };
  };
  bbox: number[];
  transform: {
    scale: number[];
    translate: number[];
  };
};

type CountryObjects = {
  countries: GeometryCollection<JSONDATA>;
};

type World110m = Topology<CountryObjects>;

// const visitorData = [
//   ["840", 70],
//   ["250", 8],
//   ["484", 5],
//   ["056", 3],
//   ["616", 2],
//   ["642", 2],
//   ["156", 2],
//   ["756", 1],
//   ["376", 1]
// ] as const satisfies readonly [string, number][];

const WorldTour: React.FC = () => {

const visitorData = [
  ["840", 70],
  ["250", 8],
  ["484", 5],
  ["056", 3],
  ["616", 2],
  ["642", 2],
  ["156", 2],
  ["756", 1],
  ["376", 1]
] as const satisfies readonly [string, number][];
  const earthDefault = useMemo(
    () => ["en", "EN", "Earth"] as [string, string, string],
    []
  );
  const earthFlagUrl = "/en.svg";

  const DEFAULT_SCALE = 190;
  const MIN_SCALE = DEFAULT_SCALE;
  const MAX_SCALE = 800;
  const _DESIRED_BBOX_RATIO = 0.25;

  const isoHelper = useMemo(() => new Iso3166_1(), []);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [currentCountry, setCurrentCountry] =
    useState<[string, string, string]>(earthDefault);
  const [currentVisitors, setCurrentVisitors] = useState<number>(
    visitorData.reduce((sum, [, count]) => sum + count, 0)
  );
  const [currentFlag, setCurrentFlag] = useState<string>(earthFlagUrl);
  const isInView = useInView(containerRef, { once: false, amount: "some" });
  const d3ContainerRef = useRef<SVGSVGElement>(null);

  const createVisualization = useCallback(
    (worldData: World110m) => {
      const width = 600;
      const height = 400;

      const svg = d3
        .select(containerRef.current)
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

      svg.selectAll("*").remove();

      const countries = topojson.feature(
        worldData,
        worldData.objects.countries
      ) as GeoJSON.FeatureCollection<GeoJSON.Geometry>;

      const projection = d3
        .geoOrthographic()
        .scale(DEFAULT_SCALE)
        .translate([width / 2, height / 2]);

      const path = d3.geoPath(projection);

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
      g.selectAll<SVGPathElement, GeoJSON.Feature<GeoJSON.Geometry>>(
        "path.country"
      ).each(function (d) {
        if (d.id) {
          countryPathMap[d.id] = this;
        }
      });

      const computeScaleForBounds = (
        bounds: [[number, number], [number, number]],
        currentScale: number,
        feature: GeoJSON.Feature
      ): number => {
        // Fixed scale for large countries
        if (feature.id === "840" || feature.id === "156") {
          // US or China
          return 360;
        }

        const [[x0, y0], [x1, y1]] = bounds;
        const dx = x1 - x0;
        const dy = y1 - y0;
        const boxSize = Math.sqrt(dx * dx + dy * dy);

        // For debugging
        // console.log(
        //   `Country ${feature.id} bounds:`,
        //   bounds,
        //   `boxSize:`,
        //   boxSize
        // );

        // For smaller countries, use the original dynamic scaling
        const zoomFactor = 1.0;
        let newScale =
          (currentScale * Math.min(width, height) * zoomFactor) / boxSize;

        // Clamp the scale between MIN_SCALE and MAX_SCALE
        newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

        return newScale;
      };

      const rotateAndZoomToCountry = (
        feature: GeoJSON.Feature,
        duration = 3000
      ): Promise<void> => {
        if (!feature) return Promise.resolve();

        const [lon, lat] = d3.geoCentroid(feature);
        const currentRotate = projection.rotate();
        const targetRotate = [-lon, -lat, currentRotate[2]];

        // Calculate bounds and target scale
        const bounds = path.bounds(feature);
        const targetScale = computeScaleForBounds(
          bounds,
          projection.scale(),
          feature
        );

        const currentScale = projection.scale();

        return new Promise<void>(resolve => {
          d3.transition()
            .duration(duration)
            .tween("rotate-and-zoom", () => {
              const rotateInterp = d3.interpolate(currentRotate, targetRotate);
              const scaleInterp = d3.interpolate(currentScale, targetScale);

              return (t: number) => {
                // Easing functions for zoom and rotation
                const zoomEase = d3.easePolyInOut.exponent(3)(t);
                const rotateEase = d3.easeCubicInOut(t);

                // Calculate intermediate scale and rotation
                const scale = scaleInterp(zoomEase);
                const rotate = rotateInterp(rotateEase);

                projection
                  .rotate(rotate as [number, number] | [number, number, number])
                  .scale(scale);
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
          const countryInfo = isoHelper.parseCountryData(countryCode);
          if (countryInfo) {
            // Update country info and flag before starting the rotation
            setCurrentCountry(countryInfo);
            setCurrentVisitors(visitors);
            setCurrentFlag(`https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/flags/${countryInfo[0].toLowerCase()}.svg`);

            // Wait a moment for the info to be visible
            await new Promise(resolve => setTimeout(resolve, 1000));

            const feature = countries.features.find(f => f.id === countryCode);
            if (!feature) continue;

            // Zoom in to the country
            await rotateAndZoomToCountry(feature);

            const pathEl = countryPathMap[countryCode];
            if (!pathEl) continue;

            // Highlight the country
            await new Promise<void>(resolve => {
              d3.select(pathEl)
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
              d3.transition()
                .duration(1000)
                .tween("zoom-out", () => {
                  const currentScale = projection.scale();
                  const targetScale = Math.max(MIN_SCALE, currentScale * 0.8);
                  const scaleInterp = d3.interpolate(currentScale, targetScale);

                  return (t: number) => {
                    const scale = scaleInterp(d3.easeQuadOut(t));
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
        setCurrentFlag(earthFlagUrl);

        // Zoom out and reset rotation
        await new Promise<void>(resolve => {
          d3.transition()
            .duration(2000)
            .tween("reset", () => {
              const currentRotate = projection.rotate();
              const currentScale = projection.scale();
              const rotateInterp = d3.interpolate(currentRotate, [0, 0, 0]);
              const scaleInterp = d3.interpolate(currentScale, DEFAULT_SCALE);

              return (t: number) => {
                projection
                  .rotate(
                    rotateInterp(t) as
                      | [number, number]
                      | [number, number, number]
                  )
                  .scale(scaleInterp(t));
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
    [isoHelper, MIN_SCALE, earthDefault, visitorData]
  );

  useEffect(() => {
    if (isInView && !hasPlayed) {
      setHasPlayed(true);
      d3.json<World110m>(
        "/topojson/countries-110m.json"
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
    <motion.div
      ref={containerRef}
      className="my-2 flex w-full flex-col items-start text-left justify-around sm:gap-x-8 sm:flex-row sm:items-start"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}>
      <div className="flex flex-col items-start sm:ml-2 sm:w-96 sm:items-start">
        <div className="mb-2 text-left">
          <h2 className="text-xl font-semibold">World Tour - Top Visitors</h2>
          <p className="text-sm text-gray-600">Work in Progress</p>
        </div>
        <div className="relative isolate sm:h-20 w-full">
          <AnimatePresence mode="sync">
            <motion.div
              key={currentCountry[2]}
              className="absolute inset-0 flex items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}>
              <div className="flex space-x-2">
                <div className="h-auto w-[4.5rem] shrink-0 overflow-hidden sm:w-20">
                  <Image
                    src={currentFlag || "/placeholder.svg"}
                    alt={`Flag of ${currentCountry[2]}`}
                    width={60}
                    placeholder="blur"
                    loading="eager"
                    blurDataURL={shimmer([60,36])}
                    height={36}
                    className="aspect-3/2! h-auto w-full object-cover"
                    priority
                  />
                </div>
                <div className="flex flex-col space-y-1 whitespace-nowrap">
                  <p className="text-lg font-medium text-white">
                    {currentCountry[2]}
                  </p>
                  <div className="flex flex-row items-center space-x-1.5">
                    <Users className="h-5 w-5 text-white" />
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

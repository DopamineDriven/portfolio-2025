"use client";

import type { GeoPath, Selection, Timer } from "d3";
import type { GeoPermissibleObjects } from "d3-geo";
import type { Feature, FeatureCollection, Geometry, Polygon } from "geojson";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { useInView } from "motion/react";
import { feature } from "topojson-client";
import type {
  CountryCodeToObjOutputStrictReturnProps,
  TopojsonShape as JSONDATA,
  World110m
} from "@/types/topojson";
import { buildTerminatorGeoJSON } from "@/lib/terminator-polygon";

export function useWorldTour({
  visitorData
}: {
  visitorData: readonly [string, number][];
}) {
  const isoHelper = useMemo(() => new Iso3166_1(), []);

  const earthDefault = useMemo(
    () =>
      isoHelper.countryCodeToObjOutput(
        "001"
      ) as CountryCodeToObjOutputStrictReturnProps,
    [isoHelper]
  );

  const DEFAULT_SCALE = 170; // Reduced from 190 to show poles better

  const MIN_SCALE = DEFAULT_SCALE * 0.8;

  const AXIAL_TILT = 23.44;

  const MAX_SCALE = DEFAULT_SCALE * 8;

  const TINY_COUNTRY_SCALE = DEFAULT_SCALE * 4; // New constant for very small countries

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isTourRunning, setIsTourRunning] = useState(false);

  const [hasPlayed, setHasPlayed] = useState(false);

  const dataRef = useRef(visitorData);

  const [currentCountry, setCurrentCountry] = useState(earthDefault);

  const [width, setWidth] = useState(600);

  const [height, setHeight] = useState(337.5);

  const [currentVisitors, setCurrentVisitors] = useState<number>(
    dataRef.current.reduce((sum, [, count]) => sum + count, 0)
  );
  const isInView = useInView(containerRef, { once: false, amount: "some" });
  // Keep dataRef updated but don't trigger big animations on every minor change

  const gRef = useRef<Selection<SVGGElement, unknown, null, undefined> | null>(
    null
  );
  const pathRef = useRef<GeoPath<any, GeoPermissibleObjects> | null>(null);

  useEffect(() => {
    dataRef.current = visitorData;
  }, [visitorData]);

  // Possibly a memoized derived value
  const sortedData = useMemo(() => {
    return visitorData.toSorted((a, b) => b[1] - a[1]);
  }, [visitorData]);

  const rotationTimerRef = useRef<Timer | null>(null);

  const computeScaleForBounds = useCallback(
    (
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
          4 + ((SMALL_COUNTRY_THRESHOLD - area) / SMALL_COUNTRY_THRESHOLD) * 2;
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
    },
    [MAX_SCALE, MIN_SCALE, TINY_COUNTRY_SCALE, width, height]
  );

  const createVisualization = useCallback(
    (worldData: World110m) => {
      setIsTourRunning(true);
      setWidth(600);
      setHeight(window.innerWidth >= 640 ? width : width * (4 / 3));

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

      // Add atmosphere glow gradient
      const atmosphereGradient = svg
        .append("defs")
        .append("radialGradient")
        .attr("id", "atmosphereGlow")
        .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%");
      atmosphereGradient
        .append("stop")
        .attr("offset", "90%")
        .attr("stop-color", "#4B71FF")
        .attr("stop-opacity", 0.05);
      atmosphereGradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#4B71FF")
        .attr("stop-opacity", 0);

      // Add atmosphere glow
      g.append("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("r", DEFAULT_SCALE * 1.01)
        .attr("fill", "url(#atmosphereGlow)")
        .attr("class", "atmosphere-glow")

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

      // Add the terminator
      const terminatorFeature = buildTerminatorGeoJSON(new Date(Date.now()));
      g.selectAll<SVGPathElement, Feature<Polygon>>("path.terminator")
        .data([terminatorFeature])
        .join("path")
        .attr("class", "terminator")
        .attr("fill", "rgba(0,0,0,0.3)")
        .attr("stroke", "none")
        .attr("d", path);

      // Store references for updates
      gRef.current = g;
      pathRef.current = path;

      const _flightPath = g
        .append("path")
        .attr("class", "flight-path")
        .attr("fill", "none")
        .attr("stroke", "gold")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4 4")
        .style("opacity", 0);

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
                if (gRef.current && pathRef.current) {
                  // Update all paths including countries
                  gRef.current
                    .selectAll("path")
                    .attr("d", d =>
                      pathRef.current != null
                        ? pathRef.current((d as GeoPermissibleObjects) ?? "")
                        : ""
                    );

                  // Update terminator with current time
                  const newTerminatorFeature = buildTerminatorGeoJSON(
                    new Date()
                  );
                  gRef.current
                    .selectAll("path.terminator")
                    .data([newTerminatorFeature])
                    .join("path")
                    .attr("class", "terminator")
                    .attr("fill", "rgba(0,0,0,0.3)")
                    .attr("stroke", "none")
                    .attr("d", pathRef.current);

                  // Update atmosphere glow
                  g.select(".atmosphere-glow").attr("r", scale * 1.01);
                }
              };
            })
            .on("end", () => resolve());
        });

        await highlightCountry(feature, 1000);
      };

      const runTour = async () => {
        setIsTourRunning(true);
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
          const countryInfo = isoHelper.countryCodeToObjOutput(
            countryCode
          ) as CountryCodeToObjOutputStrictReturnProps;
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
            .ease(easeCubicInOut)
            .tween("rotate", () => {
              const currentRotation = projection.rotate() as [
                number,
                number,
                number
              ];
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
      sortedData,
      visitorData,
      isoHelper,
      earthDefault,
      height,
      width,
      computeScaleForBounds
    ]
  );

  // Add continuous rotation when not touring
  useEffect(() => {
    if (!isTourRunning && containerRef.current) {
      const svg = select(containerRef.current)
        .select("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");
      const g = svg.select("g");

      g.select(".globe-gradient")
        .attr("cx", width / 2)
        .attr("cy", height / 2);

      const projection = geoOrthographic()
        .scale(DEFAULT_SCALE)
        .translate([width / 2, height / 2]);
      const path = geoPath(projection);
      if (!rotationTimerRef.current) {
        rotationTimerRef.current = timer(elapsed => {
          const rotation = [-(elapsed * 0.01) % 360, -20, AXIAL_TILT] as [
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
      }

      return () => {
        if (rotationTimerRef.current) {
          rotationTimerRef.current.stop();
          rotationTimerRef.current = null;
        }
      };
    }
  }, [isTourRunning, height, width]);

  useEffect(() => {
    if (!isTourRunning) {
      const updateTerminator = () => {
        if (gRef.current && pathRef.current) {
          const newTerminatorFeature = buildTerminatorGeoJSON(
            new Date(Date.now())
          );
          gRef.current
            .selectAll("path.terminator")
            .data([newTerminatorFeature])
            .join("path")
            .attr("class", "terminator")
            .attr("fill", "rgba(0,0,0,0.3)")
            .attr("stroke", "none")
            .attr("d", pathRef.current);
        }
      };

      updateTerminator();

      const intervalId = setInterval(() => {
        updateTerminator();
      }, 60_000);

      return () => clearInterval(intervalId);
    }
  }, [isTourRunning]);

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

  return { containerRef, currentCountry, currentVisitors };
}

/*

  const highlightCountry = useCallback((
    country: Feature<Geometry, JSONDATA>,
    duration: number,
    g: Selection<SVGGElement, unknown, null, undefined>,
    path: GeoPath<any, GeoPermissibleObjects>
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
  }, [])

  const rotateAndZoomToCountry = useCallback(async (
    feature: Feature<Geometry, JSONDATA>,
    index: number,
    total: number,
    projection: GeoProjection,
    g: Selection<SVGGElement, unknown, null, undefined>,
    path: GeoPath<any, GeoPermissibleObjects>
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

    await highlightCountry(feature, 1000, g, path);
  }, [computeScaleForBounds, highlightCountry])

*/

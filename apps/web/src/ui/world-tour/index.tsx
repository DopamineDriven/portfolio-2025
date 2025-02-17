"use client";

import type { FC } from "react";
import type { GeometryCollection, Topology } from "topojson-specification";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as d3 from "d3";
import { useInView } from "motion/react";
import { motion } from "motion/react";
import * as topojson from "topojson-client";

type JSONDATA = {
  arcs: number[][][];
  type: string;
  objects: {
    countries: {
      type: string;
      geometries: (
        | {
            type: string;
            arcs: number[][][];
            id: string;
            properties: {
              name: string;
            };
          }
        | {
            type: string;
            arcs: number[][];
            id: string;
            properties: {
              name: string;
            };
          }
        | {
            type: string;
            arcs: number[][];
            properties: {
              name: string;
            };
            id?: undefined;
          }
      )[];
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

export type CountryObjects = {
  // "countries" is the key inside the TopoJSON "objects" field
  countries: GeometryCollection<JSONDATA>;
};

// Visitor data you have
export const visitorData: readonly [string, number][] = [
  ["840", 64],
  ["250", 6],
  ["484", 4],
  ["056", 3],
  ["616", 2],
  ["642", 2],
  ["756", 1],
  ["156", 2],
  ["376", 1]
] as const;

// If you want an object form:
// const visitorDataObj = Object.fromEntries(visitorData);

// interface WorldTourProps {
//   // add any props you want
// }

type World110m = Topology<CountryObjects>;

const WorldTour: FC = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  // Use Framer Motion's built-in hook or your own intersection observer
  const isInView = useInView(containerRef, { once: false, amount: "some" });
  // `once: true` ensures it only fires once.
  // `amount: 0.5` means 50% of element has to be visible.

  // D3 ref
  const d3ContainerRef = useRef<SVGSVGElement>(null);

  useEffect(() => {

    if (isInView && !hasPlayed) {
      setHasPlayed(true);

      // 1. Setup your SVG
      const width = 600;
      const height = 400;

      const svg = d3
        .select(containerRef.current)
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);
      // 2. Clear any existing elements if re-rendering
      svg.selectAll("*").remove();

      // 3. Load TopoJSON data for the world
      //    Alternatively, you could fetch from /public/topojson/countries-110m.json
      d3.json<World110m>("/topojson/countries-110m.json")
      .then((worldData) => {
        if (!worldData) return;

        const countries = topojson.feature(
          worldData,
          worldData.objects.countries
        ) as GeoJSON.FeatureCollection<GeoJSON.Geometry>;

        // Create projection + path
        const projection = d3
          .geoOrthographic()
          .scale(height / 2.1)
          .translate([width / 2, height / 2]);

        const path = d3.geoPath(projection);

        // Draw sphere
        svg
          .append("path")
          .datum({ type: "Sphere" } as d3.GeoPermissibleObjects)
          .attr("class", "sphere")
          .attr("fill", "#222")
          .attr("d", path);

        // Draw countries
        svg
          .selectAll("path.country")
          .data(countries.features)
          .enter()
          .append("path")
          .attr("class", "country")
          .attr("fill", "#eee")
          .attr("stroke", "#333")
          .attr("d", path);

        // Build a lookup from code -> path element
        const countryPathMap: Record<string, SVGPathElement> = {};
        svg.selectAll<SVGPathElement, GeoJSON.Feature<GeoJSON.Geometry>>("path.country")
          .each(function (d) {
            if (d.id) {
              countryPathMap[d.id] = this;
            }
          });

        // Function to rotate
        function rotateToCountry(countryCode: string, duration = 5000) {
          const feature = countries.features.find((f) => f.id === countryCode);
          if (!feature) return Promise.resolve();
          const [lon, lat] = d3.geoCentroid(feature);
          return new Promise<void>((resolve) => {
            d3.transition()
              .duration(duration)
              .tween("rotate", () => {
                const current = projection.rotate();
                const target = [-lon, -lat, current[2]] as [number,number] | [number, number, number];
                const interp = d3.interpolate(current, target);
                return (t) => {
                  projection.rotate(interp(t));
                  svg.selectAll("path.country").attr("d", (feature) => path(feature as d3.GeoPermissibleObjects) ?? "");
                  svg.select("path.sphere").attr("d", (d) => path(d as d3.GeoPermissibleObjects) ?? "");
                };
              })
              .on("end", () => resolve());
          });
        }

        // Sort data & step through
        const sortedData = [...visitorData].sort((a, b) => b[1] - a[1]);

        (async function runTour() {
          for (const [countryCode] of sortedData) {
            await rotateToCountry(countryCode);
            const pathEl = countryPathMap[countryCode];
            if (!pathEl) continue;

            // highlight
            d3.select(pathEl)
              .transition()
              .duration(700)
              .attr("fill", "gold")
              .transition()
              .duration(2000)
              .attr("fill", "#eee");
          }
        })().catch((err) => console.error(err));
      })
      .catch(console.error);
    }
  }, [isInView, hasPlayed]);

  const handleClick = () => {
    // Navigate to the sub-page for the full choropleth
    router.push("#/analytics/choropleth");
  };

  return (
    <motion.div
      ref={containerRef}
      className="my-8 flex w-full flex-col text-left justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      onClick={handleClick}
      role="button"
      aria-label="View detailed map analytics">
      <div className="mb-4 text-left">
        <h2 className="text-xl font-bold">World Tour - Top Visitors</h2>
        <p className="text-sm text-gray-600">
          Work in Progress
        </p>
      </div>
      <svg ref={d3ContainerRef} />
    </motion.div>
  );
};

export default WorldTour;

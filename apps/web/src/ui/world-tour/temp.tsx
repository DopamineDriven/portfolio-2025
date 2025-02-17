"use client";

import type { GeoPermissibleObjects } from "d3-geo";
import type * as GeoJSON from "geojson";
import type React from "react";
import type { GeometryCollection, Topology } from "topojson-specification";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Iso3166_1 } from "@d0paminedriven/iso-3166-1";
import * as d3 from "d3";
import { PauseIcon, PlayIcon } from "lucide-react";
import { motion, useInView } from "motion/react";
import * as topojson from "topojson-client";
import { Button } from "@/ui/atoms/button";
import Image from "next/image";

const isoHelper = new Iso3166_1();
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

const visitorData: readonly [string, number][] = [
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

const WorldTour: React.FC = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentCountry, setCurrentCountry] = useState<
    [string, string, string] | null
  >(null);
  const [currentVisitors, setCurrentVisitors] = useState<number | null>(null);
  const [currentFlag, setCurrentFlag] = useState<string | null>(null);
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
        .scale(height / 2.1)
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

      // Add zoom and pan functionality
      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 8])
        .on("zoom", event => {
          // prettier-ignore
          /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */ /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
          g.attr("transform", event.transform)
        });

      svg.call(zoom);

      const rotateToCountry = (
        countryCode: string,
        duration = 5000
      ): Promise<void> => {
        const feature = countries.features.find(f => f.id === countryCode);
        if (!feature) return Promise.resolve();
        const [lon, lat] = d3.geoCentroid(feature);
        return new Promise<void>(resolve => {
          d3.transition()
            .duration(duration)
            .tween("rotate", () => {
              const current = projection.rotate();
              const target = [-lon, -lat, current[2]] as
                | [number, number]
                | [number, number, number];
              const interp = d3.interpolate(current, target);
              return (t: number) => {
                projection.rotate(interp(t));
                g.selectAll("path.country").attr(
                  "d",
                  feature => path(feature as GeoPermissibleObjects) ?? ""
                );
                g.select("path.sphere").attr(
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
          if (!isPlaying) {
            await new Promise<void>(resolve => {
              const checkPlaying = () => {
                if (isPlaying) {
                  resolve();
                } else {
                  setTimeout(checkPlaying, 100);
                }
              };
              checkPlaying();
            });
          }
          const countryInfo = isoHelper.parseCountryData(countryCode);
          if (countryInfo) {
            await rotateToCountry(countryCode);
            const pathEl = countryPathMap[countryCode];
            if (!pathEl) continue;

            // Set the current country info before starting the highlight animation
            setCurrentCountry(countryInfo);
            setCurrentVisitors(visitors);
            setCurrentFlag(isoHelper.getCountryFlag(countryCode));

            // Wait for the highlight animation to complete
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
          }
        }
        setCurrentCountry(null);
        setCurrentVisitors(null);
        setCurrentFlag(null);
      };

      runTour().catch(err => console.error(err));
    },
    [isPlaying]
  );

  useEffect(() => {
    if (isInView && !hasPlayed) {
      setHasPlayed(true);
      d3.json<World110m>(
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

  const handleClick = useCallback(() => {
    router.push("/analytics/choropleth");
  }, [router]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="my-8 flex w-full flex-col items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}>
      <div className="mb-4 text-center">
        <h2 className="text-xl font-bold">World Tour - Top Visitors</h2>
        <p className="text-sm text-gray-600">Work in Progress</p>
      </div>
      {currentCountry && (
        <div className="mb-4 flex items-center justify-center text-center">
          {currentFlag && (
            <Image
              src={currentFlag || "/placeholder.svg"}
              alt={`Flag of ${currentCountry[2]}`}
              className="mr-2 h-6 w-8"
              
            />
          )}
          <div>
            <p className="text-lg font-semibold">{currentCountry[2]}</p>
            <p className="text-sm text-gray-600">Visitors: {currentVisitors}</p>
          </div>
        </div>
      )}
      <div className="relative">
        <svg ref={d3ContainerRef} />
        <Button
          className="absolute top-2 right-2"
          onClick={togglePlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </Button>
      </div>
      <Button
        className="mt-4"
        onClick={handleClick}
        aria-label="View detailed map analytics">
        View Detailed Analytics
      </Button>
    </motion.div>
  );
};

export default WorldTour;

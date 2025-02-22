"use client";

import type { GeoPath, Selection } from "d3";
import type { Feature, Geometry } from "geojson";
import { useMemo } from "react";
import type { TopojsonShape } from "@/types/topojson";

interface UseCountryHighlightProps {
  g: Selection<SVGGElement, unknown, null, undefined> | null;
  path: GeoPath | null;
  duration?: number;
}

export function useCountryHighlight({
  g,
  path,
  duration = 2000
}: UseCountryHighlightProps) {
  return useMemo(() => {
    if (!g || !path) return null;

    return (country: Feature<Geometry, TopojsonShape>): Promise<void> => {
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
  }, [g, path, duration]);
}

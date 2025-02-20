import { Fs } from "@d0paminedriven/fs";
import type { TopojsonShape } from "@/types/topojson";

const fs = new Fs(process.cwd());

const file = JSON.parse(
  fs.fileToBuffer("public/topojson/countries-110m.json").toString("utf-8")
) as TopojsonShape;
const aggregator: Record<string, number> = {};
(async () =>
  file.objects.countries.geometries.map(({ type, properties }) => {
    aggregator[type] = (aggregator[type] ?? 0) + 1;
    return [type, properties.name] as const;
  }))()
  .then(p => {
    console.log(aggregator);
    const filterIt = p.filter(t => t[0] === "MultiPolygon");
    console.log(filterIt);
  })
  .catch(err => console.error(err));

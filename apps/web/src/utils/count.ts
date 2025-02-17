import { Fs } from "@d0paminedriven/fs";
import * as data from "../../public/topojson/countries-110m.json";
const fs = new Fs(process.cwd());
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

const d = data as JSONDATA;

const arrAggregate = Array.of<[string, string, string]>();

(async () =>
  d.objects.countries.geometries.map((v,_i) => {
    if (v?.id) {

      arrAggregate.push([v.id, v.properties.name, v.type]);
    }
    return v
  }))()
  .catch(err => console.error(err))
  .then(() => {

    fs.withWs("src/utils/__generated__/topojson-country-data.ts", `export const topojsonCountryData = ${JSON.stringify(arrAggregate, null, 2)};`)
    console.log(arrAggregate);
  })
  .catch(err => console.error(err));

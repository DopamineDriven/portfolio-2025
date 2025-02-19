import type { GeometryCollection, Topology } from "topojson-specification";

/** typed json object found at `public/topojson/countries-110m.json` */
export type TopojsonShape = {
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

export type CountryObjects = {
  countries: GeometryCollection<TopojsonShape>;
};

export type World110m = Topology<CountryObjects>;

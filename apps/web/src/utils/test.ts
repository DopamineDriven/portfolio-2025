import { Iso3166_1 } from "@d0paminedriven/iso-3166-1";
import { iso_3166_1_object } from "./__generated__/parsed/iso-3166-1-with-french-obj";

const isoHelper = new Iso3166_1();

const a = isoHelper.topoDataAndCountryAreaAndFlagAspectRatioByCountryCode;
const b = iso_3166_1_object;
const r: Record<string, number> = {};

(async () => {
  Object.entries(a).forEach(function ([key, _val]) {
    r[key] = (r[key] ?? 0) + 1;
  });

  Object.entries(b).forEach(function ([key, _val]) {
    r[key] = (r[key] ?? 0) + 1;
  });
})()
  .catch(err => console.error(err))
  .then(() => {
    const sortIt = Object.fromEntries(Object.entries(r).filter((s) =>s[1] <2))
    console.log(sortIt);
  })
  .catch(err => console.error(err));


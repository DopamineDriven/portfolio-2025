// import { Fs } from "@d0paminedriven/fs";
import { Iso3166_1 } from "@d0paminedriven/iso-3166-1";

const iso = new Iso3166_1();

const _visitorData = [
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

const _isoCountries = Object.fromEntries(
  Object.entries(iso.topoDataByCountryCode)
    .map(([key, val]) => {
      const [alpha2, alpha3, countryName] = iso.exciseColons(val);
      return [alpha2, `${alpha3}:${key}:${countryName}`] as [string, string];
    })
    .sort(
      ([keyA, _valA], [keyB, _valB]) =>
        keyA.localeCompare(keyB) - keyB.localeCompare(keyA)
    )
);

// const fs = new Fs(process.cwd());

// fs.withWs(
//   "src/utils/__generated__/topo-data-alpha2-keys.ts",
//   `export const topoDataByAlpha2Key = ${JSON.stringify(isoCountries, null, 2)} as const`
// );


export function arrToObjOutput(target: string) {
  const [alpha2, alpha3, countryName, countryFlag] = iso.parseCountryDataAndFlag(target);

  return {
    alpha2,
    alpha3,
    countryCode: target,
    countryName,
    countryFlag
  }
}

console.log(iso.getAlpha2("642"))

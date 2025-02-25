import type { Feature, Polygon } from "geojson";

import { Fs } from "@d0paminedriven/fs";

/**
 * Converts a regular Date to Julian Date (UTC-based).
 */
function toJulianDate(date: Date = new Date(Date.now())) {
  // The formula to convert from Gregorian calendar date to JD.
  // This is valid for dates in the proleptic Gregorian calendar (post 1582).
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // 1-based
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();

  // If month <= 2, treat it as if it’s the previous year’s 13th or 14th month
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  const jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  // Now account for the time of day
  const fractionalDay = hour / 24 + minute / 1440 + second / 86400;

  return jd + fractionalDay;
}

/**
 * Returns an object with:
 *  - declination: Sun’s apparent declination in degrees
 *  - equationOfTime: Equation of Time in minutes
 *
 * For typical day–night boundary usage, you only need declination + eqnOfTime.
 */
function getSunPosition(date: Date) {
  const JD = toJulianDate(date);
  const d = JD - 2451545.0; // days since J2000.0 epoch

  // Mean solar noon can be improved with eqnOfTime.
  // But let's start with:
  // Mean longitude (deg), not adjusted for ecliptic anomalies
  const g = 357.529 + 0.98560028 * d; // Sun's mean anomaly
  const q = 280.459 + 0.98564736 * d; // Mean ecliptic longitude

  // Convert to radians
  const gRad = (Math.PI / 180) * g;
  const _qRad = (Math.PI / 180) * q;

  // Equation of center
  const c = 1.915 * Math.sin(gRad) + 0.02 * Math.sin(2 * gRad);

  // Ecliptic longitude
  const eclipticLon = q + c; // in degrees
  const eclipticLonRad = (Math.PI / 180) * eclipticLon;

  // Obliquity of the ecliptic (approx)
  const epsilon = 23.439 - 0.00000036 * d; // degrees
  const epsilonRad = (Math.PI / 180) * epsilon;

  // Sun's apparent declination
  const sinDecl = Math.sin(epsilonRad) * Math.sin(eclipticLonRad);
  const decl = (180 / Math.PI) * Math.asin(sinDecl); // degrees

  // Equation of Time (in minutes).
  // This is a known approximation:
  //   EoT = 4 * (q - 0.0057183 - RA),
  // but let's do a simpler direct approach:
  const _y = Math.tan(epsilonRad / 2) * Math.tan(epsilonRad / 2);

  // Right Ascension:
  //  RA = atan2( cos(eps) * sin(eclipLon), cos(eclipLon) )
  // Then we convert RA into degrees
  const sinEclip = Math.sin(eclipticLonRad);
  const cosEclip = Math.cos(eclipticLonRad);
  const RA =
    (180 / Math.PI) * Math.atan2(Math.cos(epsilonRad) * sinEclip, cosEclip);
  const RAmod = (RA + 360) % 360; // keep in [0..360]

  // Equation of time in minutes
  // A standard formula:
  // EoT = 4 * (q - RAmod)  (plus small corrections for nutation, etc.)
  let EoT = 4 * (q - RAmod);
  // We want EoT in the range [-20, +20] typically, so we can mod by ±720 minutes if needed:
  EoT = ((EoT + 720) % 1440) - 720;

  // EoT can end up around ±15 minutes
  // Typically we also subtract an 0.0057183 deg offset but let's keep it simple
  return {
    declination: decl, // degrees
    equationOfTime: EoT // minutes
  };
}

/**
 * Gets the subsolar latitude and longitude for the given Date (UTC).
 */
function getSubsolarPoint(date: Date) {
  // 1) Get sun's declination + EoT
  const { declination, equationOfTime } = getSunPosition(date);

  // 2) subsolar latitude is just the declination
  const latitude = declination;

  // 3) subsolar longitude:
  // At 12:00 "solar time", subsolar longitude = 0° by convention.
  // Equation of time tells how many minutes local solar noon differs from clock noon.
  // We find how many minutes past midnight UTC it is:
  const utcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes();

  // The local solar time offset from 12:00 in minutes:
  // e.g. if EoT = +6, it means solar noon is 6 minutes later than clock noon
  // => the subsolar longitude will have "moved" east or west by some degrees
  const solarTimeMinutes = utcMinutes + equationOfTime;
  // So how far from 12:00 is that?
  const minutesFromSolarNoon = solarTimeMinutes - 12 * 60;

  // Convert to degrees: 1 hour = 15°, so 1 minute = 0.25°
  let longitude = 0.25 * minutesFromSolarNoon;

  // Keep in [-180, 180] range for convenience
  if (longitude > 180) longitude -= 360;
  if (longitude < -180) longitude += 360;

  return { latitude, longitude };
}
// Pseudocode for a “geoCircle” approach in TS:
function buildTerminatorGeoJSON(date: Date): Feature<Polygon> {
  const { latitude, longitude } = getSubsolarPoint(date);
  console.log([latitude, longitude]);
  // The night side is centered on the **antipode** of the subsolar point:
  //   antipode long = subsolarLong + 180
  //   antipode lat  = -subsolarLat
  // Then we create a circle of radius 90° around that center:

  // For a pure TS version, we can manually sample points in lat/long space:
  const centerLon = longitude + 180;
  const centerLat = -latitude;
  const points = Array.of<[number, number] | [number, number, number]>();

  // We'll just create 360 points around the circle for decent resolution
  for (let i = 0; i < 360; i++) {
    const bearing = (Math.PI / 180) * i; // 0..2π
    const lat = Math.asin(
      Math.sin((Math.PI / 180) * centerLat) * Math.cos(Math.PI / 2) +
        Math.cos((Math.PI / 180) * centerLat) *
          Math.sin(Math.PI / 2) *
          Math.cos(bearing)
    );
    const lon =
      (Math.PI / 180) * centerLon +
      Math.atan2(
        Math.sin(bearing) *
          Math.sin(Math.PI / 2) *
          Math.cos((Math.PI / 180) * centerLat),
        Math.cos(Math.PI / 2) -
          Math.sin((Math.PI / 180) * centerLat) * Math.sin(lat)
      );
    points.push([
      (((lon * 180) / Math.PI + 540) % 360) - 180, // normalized to [-180..180]
      (lat * 180) / Math.PI
    ]);
  }

  // Finally, build a GeoJSON polygon:
  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [points]
    },
    properties: {}
  };
}

const fs = new Fs(process.cwd());

fs.withWs(
  "src/utils/__generated__/build-terminator-geo-json.json",
  JSON.stringify(
    buildTerminatorGeoJSON(new Date(Date.now())).geometry.coordinates
  )
);

// type TerminatorFeature = Feature<Polygon, Record<string, unknown>>;
// // Example usage in TS:
// const date = new Date();
// const terminatorFeature = buildTerminatorGeoJSON(date);

// const projection = geoOrthographic().scale(200).translate([400, 250]); // for an 800x500 svg, example

// const pathGenerator = geoPath(projection);

// const svg = select("#my-svg"); // assume you have <svg id="my-svg" ...
// svg
//   .selectAll("path.terminator")
//   .data([terminatorFeature])
//   .join("path")
//   .attr("class", "terminator")
//   .attr("d", d => pathGenerator(d as GeoPermissibleObjects) ?? "")
//   .attr("fill", "rgba(0,0,0,0.3)"); // or black overlay for the night side
// maybe .attr("stroke", "red") if you want to highlight the boundary

import type { Feature, GeoJsonProperties, Polygon } from "geojson";

/**
 * Converts a regular Date to Julian Date (UTC-based).
 */
export function toJulianDate(date: Date) {
  // convert from Gregorian calendar date to Julian Date.
  // valid for dates in proleptic Gregorian calendar (post 1582 CE).
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // 1-based
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();

  // If month <= 2, treat as if it’s the previous year’s 13th or 14th month
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

  /**  account for time of day ("fractional" day) */
  const fractionalDay = (hour - 12) / 24 + minute / 1440 + second / 86400;

  return jd + fractionalDay;
}

/**
 * Returns an object with:
 *  - declination: Sun’s apparent declination in degrees
 *  - equationOfTime: Equation of Time (EoT) in minutes
 *
 * typical day–night boundary usage only requires declination + EoT.
 */
export function getSunPosition(date: Date) {
  const JD = toJulianDate(date);
  const d = JD - 2451545.0; // days since J2000.0 epoch

  // Mean solar noon can be improved with EoT.
  // starting with:
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

  // Approx obliquity of the ecliptic
  const epsilon = 23.439 - 0.00000036 * d; // degrees
  const epsilonRad = (Math.PI / 180) * epsilon;

  // apparent declination of Sun
  const sinDecl = Math.sin(epsilonRad) * Math.sin(eclipticLonRad);
  const decl = (180 / Math.PI) * Math.asin(sinDecl); // degrees

  // EoT in minutes.
  // This is a known approximation:
  // EoT = 4 * (q - 0.0057183 - RA),
  // however, using a simpler direct approach:
  const _y = Math.tan(epsilonRad / 2) * Math.tan(epsilonRad / 2);

  // Right Ascension:
  //  RA = atan2( cos(eps) * sin(eclipLon), cos(eclipLon) )
  // Then convert RA into degrees
  const sinEclip = Math.sin(eclipticLonRad);
  const cosEclip = Math.cos(eclipticLonRad);
  const RA =
    (180 / Math.PI) * Math.atan2(Math.cos(epsilonRad) * sinEclip, cosEclip);
  const RAmod = (RA + 360) % 360; // keep in [0..360]

  // EoT standard formula
  // A standard formula:
  // EoT = 4 * (q - RAmod)  (and small corrections for nutation, etc.)
  let EoT = 4 * (q - RAmod);
  // want EoT in the range [-20, +20] typically to mod by ±720 minutes if needed:
  EoT = ((EoT + 720) % 1440) - 720;

  // EoT can end up around ±15 minutes
  // Typically subtract a 0.0057183 deg offset but omitted for simplicity
  return {
    declination: decl, // degrees
    equationOfTime: EoT // minutes
  };
}

/**
 * Get subsolar latitude and longitude for a given Date (UTC)
 */
export function getSubsolarPoint(date: Date) {
  // 1) sun's declination + EoT
  const { declination, equationOfTime } = getSunPosition(date);

  // 2) subsolar latitude is the declination
  const latitude = declination;

  // 3) subsolar longitude:
  // At 12:00 "solar time", subsolar longitude = 0° by convention
  // EoT provides deviation of solar noon time vs temporal noon.
  // We find how many minutes past midnight UTC it is:
  const utcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes();

  // The local solar time offset from 12:00 in minutes:
  // e.g. if EoT = +6, it means solar noon is 6 minutes later than clock noon
  // => the subsolar longitude will have "moved" east or west by some degrees
  const solarTimeMinutes = utcMinutes + equationOfTime;
  // calculate offset using EoT derived information for solar noon vs temporal noon
  const minutesFromSolarNoon = solarTimeMinutes - 12 * 60;

  // Convert to degrees: Δ15°/hr, 60 min/(15°/hr)->Δ0.25°/min (rate of change is ~0.25° per minute)
  let longitude = -0.25 * minutesFromSolarNoon;

  // keeping [-180, 180] range for convenience
  if (longitude > 180) longitude -= 360;
  if (longitude < -180) longitude += 360;

  return { latitude, longitude };
}

export function buildTerminatorGeoJSON(
  date: Date = new Date(Date.now())
): Feature<Polygon, GeoJsonProperties> {
  const { latitude, longitude } = getSubsolarPoint(date);
  // The night side is centered on the **antipode** of the subsolar point:
  //   antipode long = subsolarLong + 180
  //   antipode lat  = -subsolarLat
  // Then we create a circle of radius 90° around that center:

  // For a pure TS version, we can manually sample points in lat/long space:
  const centerLon = longitude + 180;
  const centerLat = -latitude;
  const points = Array.of<[number, number] | [number, number, number]>(); // can be a 2D or 3D array of arrays

  // generate 360 points around the circle for decent resolution
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

import type { NextRequest } from "next/server";
import { NextResponse, userAgent } from "next/server";

export function detectDeviceWorkup(request: NextRequest) {
  const country = request.headers.get("x-vercel-ip-country") ?? "US";
  const region =
    request.headers.get("x-vercel-ip-country-region") ?? "Illinois";
  const city = request.headers.get("x-vercel-ip-city") ?? "Chicago";
  const lng = request.headers.get("x-vercel-ip-longitude") ?? "-87.8966849";
  const lat = request.headers.get("x-vercel-ip-latitude") ?? "41.8338486";
  const postalCode = request.headers.get("x-vercel-ip-postal-code") ?? "60010";
  const ip = request.headers.get("x-vercel-forwarded-for") ?? "127.0.0.1";

  const tz = request.headers.get("x-vercel-ip-timezone") ?? "America/Chicago";
  const { os, device, ua, browser } = userAgent(request);
  const isMac = /(mac)/gim.test(os?.name ?? "") ?? false;
  const latlng = `${lat},${lng}` as const;
  const browserName = browser.name ?? "Chrome";
  const browserVersion = browser.version ?? "147.0.7727.49";
  const { hostname } = request.nextUrl;

  const accept = request.headers.get("accept-language") ?? "";
  const m = accept.match(
    /^\s*([A-Za-z]{1,8}(?:-[A-Za-z]{1,8})*)(?:;q=[0-9.]+)?/
  );

  const isIOS = /(ios|iphone|ipad|iwatch)/i.test(ua);

  const ios = `${isIOS}` as const;

  const viewport = device?.type === "mobile" ? "mobile" : "desktop";

  let locale = m?.[1] ?? "en-US";

  if (!locale.includes("-")) {
    locale = `${locale.toLowerCase()}-${country}`;
  }

  const obj = {
    hostname,
    locale,
    viewport,
    browserName,
    browserVersion,
    ios,
    latlng,
    tz,
    ua: encodeURIComponent(ua),
    ip,
    country,
    city,
    isMac: `${isMac}`,
    region,
    postalCode
  } as const;

  return obj;
}

export function detectDeviceAndSetCookies(
  request: NextRequest,
  response: NextResponse
) {
  const domain =
    process.env.NODE_ENV !== "development" ? ".asross.com" : undefined;
  const config = {
    domain,
    path: "/",
    secure: typeof domain !== "undefined",
    sameSite: "lax",
    httpOnly: false
  } as const;

  const obj = detectDeviceWorkup(request);

  for (const key of Object.keys(obj)) {
    if (request.cookies.has(key)) {
      response.cookies.delete(key);
    }
  }

  for (const [k, v] of Object.entries(obj)) {
    response.cookies.set(k, v, config);
  }

  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

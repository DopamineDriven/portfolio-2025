import type { NextRequest } from "next/server";
import { NextResponse, userAgent } from "next/server";

function detectDeviceAndSetCookies(
  request: NextRequest,
  response: NextResponse
) {
  const { device, ua, os, browser } = userAgent(request);

  const { hostname } = request.nextUrl;
  for (const name of ["hostname", "viewport", "ios", "supports-webgl"]) {
    if (request.cookies.has(name)) {
      response.cookies.delete(name);
    }
  }

  const isIOS = /(ios|iphone|ipad|iwatch)/i.test(ua);

  const ios = `${isIOS}` as const;

  // Set viewport type
  const viewport = device?.type === "mobile" ? "mobile" : "desktop";

  let supportsWebGL = true;
  if (browser?.name && /(ie)/i.test(browser?.name)) {
    supportsWebGL = false;
  } else if (
    os.name &&
    os.version &&
    /(iOS)/i.test(os?.name) &&
    Number.parseInt(os.version.split(".")?.[0] ?? "0", 10) < 14
  ) {
    supportsWebGL = false;
  } else if (
    os.name &&
    os.version &&
    os.name === "Android" &&
    Number.parseInt(os.version.split(".")?.[0] ?? "0", 10) < 6
  ) {
    supportsWebGL = false;
  }
  // Set cookies
  response.cookies.set("hostname", hostname);
  response.cookies.set("viewport", viewport);
  response.cookies.set("ios", ios);
  response.cookies.set("supports-webgl", `${supportsWebGL}`);
  return response;
}

// You can adjust these for your needs:
const EXCLUDED_PATHS = ["/_next", "/api", "/favicon.ico"];

// Development indicator files that should be excluded from POI
const DEV_INDICATOR_FILES = [
  "/injection-tss-mv3.js",
  "/injection-tss-mv3.js.map",
  "/installHook.js.map",
  "/_vercel/insights",
  "/_vercel/speed-insights"
];

export function middleware(request: NextRequest) {
  // 1) If it's a bot/crawler, do not rewrite (avoid SEO issues).
  const { isBot } = userAgent(request);
  if (isBot) {
    return NextResponse.next();
  }

  // 2) If this path is excluded or is a static asset, skip rewriting.
  const { pathname } = request.nextUrl;
  if (
    EXCLUDED_PATHS.some(excluded => pathname.startsWith(excluded)) ||
    // Skip known static file types
    pathname.match(
      /\.(jpg|jpeg|png|gif|svg|ico|webp|css|js|wasm|json|txt|xml|woff2|hdr|ai|py)$/
    ) ||
    // Skip Vercel development indicator files
    DEV_INDICATOR_FILES.some(file => pathname.includes(file))
  ) {
    const res = NextResponse.next();
    return detectDeviceAndSetCookies(request, res);
  }
  // 3) Check if user has visited before (i.e. "has-visited" cookie).
  const hasVisitedCookie = JSON.parse(
    request.cookies.get("has-visited")?.value ?? "false"
  ) as boolean;

  // Log the cookie state and headers for debugging
  console.log("[SERVER] Cookie check:", {
    hasVisitedCookie: hasVisitedCookie,
    path: pathname,
    cookieHeader: request.headers.get("cookie")
  });

  const hasVisited = hasVisitedCookie;

  // 4) If user is new, send them to /elevator.
  // REMOVED external referer check for now to simplify testing
  if (!hasVisited) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = "/elevator";
    const response = NextResponse.rewrite(rewriteUrl);

    // Only set the POI cookie if it doesn't already exist AND it's not a development file
    if (
      !request.cookies.has("poi") &&
      !DEV_INDICATOR_FILES.some(file => pathname.includes(file))
    ) {
      // Store the original path the user was trying to access
      response.cookies.set("poi", decodeURIComponent(pathname));
      console.log("[SERVER] Middleware setting POI cookie to:", pathname);
    } else {
      console.log("[SERVER] Middleware preserving existing POI cookie");
    }

    // Set the has-visited cookie with the same consistent options
    response.cookies.set("has-visited", "true");
    console.log("[SERVER] Middleware setting has-visited cookie");

    return detectDeviceAndSetCookies(request, response);
  }

  // Otherwise, they've already visited, so let them continue on to their requested page.
  console.log("[SERVER] User has visited before, continuing to:", pathname);
  const res = NextResponse.next();
  return detectDeviceAndSetCookies(request, res);
}
// 5) Matcher configuration
export const config = {
  // This matcher ensures we run middleware on all routes
  // except the explicitly excluded static paths (/_next/static, /_next/image, etc.).
  matcher: ["/", "/elevator", "/posts/:path", "/projects/:path", "/resume"]
};

import type { NextRequest } from "next/server";
import { NextResponse, userAgent } from "next/server";

function detectDeviceAndSetCookies(
  request: NextRequest,
  response: NextResponse
) {
  const { device, ua } = userAgent(request);

  // Clean up existing cookies
  if (request.cookies.has("viewport")) {
    response.cookies.delete("viewport");
  }

  if (request.cookies.has("ios")) {
    response.cookies.delete("ios");
  }

  const isIOS = /(ios|iphone|ipad|iwatch)/i.test(ua);

  const ios = `${isIOS}` as const;

  // Set viewport type
  const viewport = device?.type === "mobile" ? "mobile" : "desktop";

  // Set cookies
  response.cookies.set("viewport", viewport);
  response.cookies.set("ios", ios);

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
      /\.(jpg|jpeg|png|gif|svg|ico|webp|css|js|wasm|json|txt|xml)$/
    ) ||
    // Skip Vercel development indicator files
    DEV_INDICATOR_FILES.some(file => pathname.includes(file))
  ) {
    const res = NextResponse.next();
    return detectDeviceAndSetCookies(request, res);
  }
  // if (request.cookies.has("has-visited") === false) {
  //     request.nextUrl.pathname  = "/elevator"
  //   return NextResponse.rewrite(request.nextUrl);
  // }

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
    // IMPORTANT: Use consistent cookie parameters
    // const cookieOptions = {
    //   path: "/",
    //   httpOnly: false, // Allow JavaScript access
    //   maxAge: 60 * 60 * 24, // 1 day in seconds
    //   sameSite: "lax" as const,
    //   secure: process.env.NODE_ENV !== "development" // Only use secure in production
    // };

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
  matcher: [
    "/",
    "/elevator",
    "/posts/:path",
    "/projects/:path",
    "/resume",
    "/elevator"
  ]
};

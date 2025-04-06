import type { NextRequest } from "next/server";
import { NextResponse, userAgent } from "next/server";

// You can adjust these for your needs:
const EXCLUDED_PATHS = [
  "/_next",
  "/api",
  "/favicon.ico"
];

// Development indicator files that should be excluded from POI
const DEV_INDICATOR_FILES = [
  "/injection-tss-mv3.js",
  "/injection-tss-mv3.js.map",
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
    return NextResponse.next();
  }
  // if (request.cookies.has("has-visited") === false) {
  //     request.nextUrl.pathname  = "/elevator"
  //   return NextResponse.rewrite(request.nextUrl);
  // }

  // 3) Check if user has visited before (i.e. "has-visited" cookie).
  const hasVisitedCookie = (request.cookies.get("has-visited")?.value ?? "false") as "true" | "false";

  // Log the cookie state and headers for debugging
  console.log("[SERVER] Cookie check:", {
    hasVisitedCookie: hasVisitedCookie,
    path: pathname,
    cookieHeader: request.headers.get("cookie")
  });

  const hasVisited = hasVisitedCookie === "true" ? true : false;

  // 4) If user is new, send them to /elevator.
  // REMOVED external referer check for now to simplify testing
  if (!hasVisited) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = "/elevator";
    const response = NextResponse.rewrite(rewriteUrl);
    // IMPORTANT: Use consistent cookie parameters
    const cookieOptions = {
      path: "/",
      httpOnly: false, // Allow JavaScript access
      maxAge: 60 * 60 * 24, // 1 day in seconds
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV !== "development" // Only use secure in production
    };

    // Only set the POI cookie if it doesn't already exist AND it's not a development file
    if (
      !request.cookies.has("poi") &&
      !DEV_INDICATOR_FILES.some(file => pathname.includes(file))
    ) {
      // Store the original path the user was trying to access
      response.cookies.set("poi", pathname, cookieOptions);
      console.log("[SERVER] Middleware setting POI cookie to:", pathname);
    } else {
      console.log("[SERVER] Middleware preserving existing POI cookie");
    }

    // Set the has-visited cookie with the same consistent options
    response.cookies.set("has-visited", "true", cookieOptions);
    console.log("[SERVER] Middleware setting has-visited cookie");

    return response;
  }

  // Otherwise, they've already visited, so let them continue on to their requested page.
  console.log("[SERVER] User has visited before, continuing to:", pathname);
  return NextResponse.next();
}

// 5) Matcher configuration
export const config = {
  // This matcher ensures we run middleware on all routes
  // except the explicitly excluded static paths (/_next/static, /_next/image, etc.).
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

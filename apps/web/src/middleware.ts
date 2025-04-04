import type { NextRequest } from "next/server";
import { NextResponse, userAgent } from "next/server";

// You can adjust these for your needs:
const EXCLUDED_PATHS = [
  "/_next",
  "/api",
  "/favicon.ico",
  "/elevator" // So you don't rewrite /elevator to itself
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
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    pathname.match(
      /\.(jpg|jpeg|png|gif|svg|ico|webp|css|js|wasm|json|txt|xml|mp3|py|ttf|woff2|ai)$/
    )
  ) {
    return NextResponse.next();
  }

  // 3) Check if the request is from an external referrer.
  const referer = request.headers.get("referer") || "";
  const refererUrl = new URL(referer);
  const isExternalReferer = refererUrl.hostname !== request.nextUrl.hostname;

  // 4) Check if user has visited before (i.e. "has-visited" cookie).
  const hasVisitedCookie = (request.cookies.get("has-visited")?.value ??
    "false") as "true" | "false";
  const hasVisited = hasVisitedCookie === "true" ? true : false;

  // 5) If user is new or coming from an external site, send them to /elevator.
  if (!hasVisited || isExternalReferer) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = "/elevator";
    const response = NextResponse.rewrite(rewriteUrl);

    // Set the path of intent (poi) as a non-HTTP-only cookie,
    // so the client can read it and direct them after the elevator ride.
    // Make sure to use the actual pathname the user was trying to access
    response.cookies.set("poi", pathname, {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 // 1 day in seconds
    });

    // Set the has-visited cookie
    response.cookies.set("has-visited", "true", {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 // 1 day
    });

    console.log("Middleware redirecting to elevator with POI:", pathname);
    return response;
  }

  // Otherwise, they've already visited and aren't from an external referrer,
  // so let them continue on to their requested page.
  return NextResponse.next();
}

// 6) Matcher configuration
export const config = {
  // This matcher ensures we run middleware on all routes
  // except the explicitly excluded static paths (/_next/static, /_next/image, etc.).
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

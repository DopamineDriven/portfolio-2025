import { NextResponse, userAgent } from "next/server"
import type { NextRequest } from "next/server"

// You can adjust these for your needs:
const EXCLUDED_PATHS = [
  "/_next",
  "/api",
  "/favicon.ico",
  "/elevator", // So you don't rewrite /elevator to itself
]

export function middleware(request: NextRequest) {
  // 1) If it's a bot/crawler, do not rewrite (avoid SEO issues).
  const { isBot } = userAgent(request)
  if (isBot) {
    return NextResponse.next()
  }

  // 2) If this path is excluded or is a static asset, skip rewriting.
  const { pathname } = request.nextUrl
  if (
    EXCLUDED_PATHS.some((excluded) => pathname.startsWith(excluded)) ||
    // Skip known static file types
    // eslint-disable-next-line
    pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|webp|css|js|wasm|json|txt|xml)$/)
  ) {
    return NextResponse.next()
  }

  // 3) Check if the request is from an external referrer using precise hostname comparison
  const referer = request.headers.get("referer") || ""
  console.log(referer);
  let isExternalReferer = false

  if (referer) {
    try {
      // Parse the referer URL and compare hostnames
      const refererUrl = new URL(referer)
      const currentHostname = request.nextUrl.hostname

      // Check if the hostnames match exactly
      isExternalReferer = refererUrl.hostname !== currentHostname

      console.log(
        `Referer check: ${refererUrl.hostname} vs ${currentHostname} = ${isExternalReferer ? "external" : "internal"}`,
      )
    } catch (error) {
      // If referer URL is invalid, treat as external
      console.error("Invalid referer URL:", referer, error);
      isExternalReferer = true
    }
  } else {
    // No referer means it's likely a direct navigation (typing URL)
    // You can decide if this should count as "external" based on your needs
    isExternalReferer = true
  }

  // 4) Check if user has visited before (i.e. "has-visited" cookie).
  const hasVisitedCookie = request.cookies.get("has-visited")
  const hasVisited = Boolean(hasVisitedCookie?.value)

  // 5) If user is new or coming from an external site, send them to /elevator.
  if (!hasVisited || isExternalReferer) {
    const rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = "/elevator"
    const response = NextResponse.rewrite(rewriteUrl)

    // Only set the POI cookie if it doesn't already exist
    // This preserves any POI set by the client-side code
    if (!request.cookies.has("poi")) {
      response.cookies.set("poi", pathname, {
        path: "/",
        httpOnly: false,
        maxAge: 60 * 60 * 24, // 1 day in seconds
      })
      console.log("Middleware setting POI cookie to:", pathname)
    } else {
      console.log("Middleware preserving existing POI cookie")
    }

    // Set the has-visited cookie
    response.cookies.set("has-visited", "true", {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24, // 1 day
    })

    console.log("Middleware redirecting to elevator")
    return response
  }

  // Otherwise, they've already visited and aren't from an external referrer,
  // so let them continue on to their requested page.
  return NextResponse.next()
}

// 6) Matcher configuration
export const config = {
  // This matcher ensures we run middleware on all routes
  // except the explicitly excluded static paths (/_next/static, /_next/image, etc.).
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}


/**
 *     const host = request.nextUrl.host;
    const baseUrl =
      /(?:(localhost:)[0-9]{3,4}$)/g.test(host) === true
        ? `http://${host}`
        : `https://${host}`;
    const response = NextResponse.rewrite(new URL("/elevator", baseUrl));
 */

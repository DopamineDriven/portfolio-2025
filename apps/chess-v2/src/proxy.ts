import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { detectDeviceAndSetCookies } from "@/lib/server-cookies";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|opengraph-image|twitter-image).*)"
  ]
};

export default async function proxy(req: NextRequest) {
  let country = req.headers.get("x-vercel-ip-country") ?? "US";
  if (req.nextUrl.pathname === "/") {
    req.nextUrl.pathname = `/${country}`;
    // Rewrite to app/[country]/page.tsx
    return detectDeviceAndSetCookies(req, NextResponse.rewrite(req.nextUrl));
  }
  return detectDeviceAndSetCookies(req, NextResponse.next());
}

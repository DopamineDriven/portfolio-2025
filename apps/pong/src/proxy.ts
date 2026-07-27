import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { detectDeviceAndSetCookies } from "@/lib/server-cookies";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|opengraph-image|twitter-image).*)"
  ]
};

export default async function proxy(req: NextRequest) {
  return detectDeviceAndSetCookies(req, NextResponse.next());
}

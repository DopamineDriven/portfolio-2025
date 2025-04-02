import { NextRequest, NextResponse, userAgent } from "next/server";

export function middleware(request: NextRequest) {
  const { device, ua } = userAgent(request);

  const response = NextResponse.next();

  if (request.cookies.has("viewport")) {
    response.cookies.delete("viewport");
  }

  if (request.cookies.has("ios")) {
    response.cookies.delete("ios");
  }

  const isIOS = /(ios|iphone|ipad|iwatch)/i.test(ua);

  const ios = `${isIOS}` as const;

  const viewport = device?.type === "mobile" ? "mobile" : "desktop";

  response.cookies.set("viewport", viewport);

  response.cookies.set("ios", ios);

  return response;
}

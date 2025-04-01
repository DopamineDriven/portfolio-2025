import { NextRequest, NextResponse, userAgent as UA } from "next/server";

export function middleware(request: NextRequest) {
  const { device, os, ua } = UA(request);

  const OS = os?.name ?? "";
  console.log(OS);
  console.log(ua);

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

import { NextRequest, NextResponse } from "next/server";

// only run middleware on home page
export const config = {
  matcher: "/"
};

export default function middleware(req: NextRequest) {
  let country = req.headers.get("X-Vercel-IP-Country");
  if (country === null) country = "US";
  req.nextUrl.pathname = `/${country}`;
  // Rewrite to app/[country]/page.tsx
  return NextResponse.rewrite(req.nextUrl);
}

import { ImageResponse } from "next/og";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl(process.env.NODE_ENV);

export const runtime = "edge";

export async function GET() {
  const fontData = await fetch(
    new URL("/BasisGrotesquePro-Light.ttf", baseUrl)
  ).then(res => res.arrayBuffer());

  const bgData = await fetch(
    new URL("/og.png", baseUrl)
  ).then(res => res.arrayBuffer());

  // 3. Convert bgData into a Base64-encoded data URL for `<img />`
  const bgBase64 = `data:image/png;base64,${Buffer.from(bgData).toString(
    "base64"
  )}`;

  // 4. Return the rendered <ImageResponse>
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"Basis Grotesque Pro", sans-serif'
        }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgBase64}
          alt="Next Chess Bot OG Image"
          style={{
            position: "absolute",
            objectFit: "cover",
            width: "100%",
            height: "100%"
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom right, rgba(0,0,0,0.3), rgba(0,0,0,0.6))"
          }}
        />
        <div
          className="tracking-tight"
          style={{
            position: "relative",
            color: "white",
            fontSize: 56,
            fontWeight: 500,
            textAlign: "center",
            padding: "0 50px",
            letterSpacing: "-0.025em"
          }}>
          Next Chess Bot
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Basis Grotesque Pro",
          data: fontData,
          style: "normal"
        }
      ]
    }
  );
}

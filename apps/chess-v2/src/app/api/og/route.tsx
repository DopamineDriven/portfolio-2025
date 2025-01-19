import { ImageResponse } from "next/og";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl(process.env.NODE_ENV);

export const runtime = "edge";

export async function GET() {
  const fontData = await fetch(
    new URL("/BasisGrotesquePro-Light.ttf", baseUrl)
  ).then(res => res.arrayBuffer());

  const bgData = await fetch(new URL("/og.png", baseUrl)).then(res =>
    res.arrayBuffer()
  );

  const bgBase64 = `data:image/png;base64,${Buffer.from(bgData).toString(
    "base64"
  )}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          fontFamily: '"Basis Grotesque Pro", sans-serif',
          overflow: "hidden"
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
          style={{
            position: "absolute",
            top: "50px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "30px 60px",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}>
          <div
            style={{
              color: "white",
              fontSize: "72px",
              fontWeight: 500,
              textAlign: "center",
              letterSpacing: "-0.025em",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
            }}>
            Next Chess Bot
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            fontSize: "24px",
            fontWeight: 300,
            textAlign: "center",
            opacity: 0.8
          }}>
          Elevate Your Game
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

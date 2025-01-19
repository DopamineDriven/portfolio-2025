import { ImageResponse } from "next/og";

// Use Edge runtime (enables `ImageResponse` with local fetch)
export const runtime = "edge";

// Tell Next the final content type and size for the generated image
export const alt = "Next Chess Bot OG Image";
export const size = {
  width: 1200,
  height: 630
};

export default async function Image() {
  const fontData = await fetch(
    new URL("../../public/BasisGrotesquePro-Light.ttf", import.meta.url)
  ).then(res => res.arrayBuffer());

  const bgData = await fetch(
    new URL("../../public/og.png", import.meta.url)
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
          alt="Background"
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
      // Register our local font with a name matching style.fontFamily
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

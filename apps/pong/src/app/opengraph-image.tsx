import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "React Pong";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";
export default async function Image() {
  const absoluteUrl = new URL("./og-img.png", import.meta.url);

  const fontAbsoluteUrl = new URL(
    "./BasisGrotesquePro-Light.ttf",
    import.meta.url
  );

  try {
    const [response, responseFont] = await Promise.all([
      fetch(absoluteUrl),
      fetch(fontAbsoluteUrl)
    ]);

    if (!response.ok) {
      throw new Error(`Failed to fetch Image: ${response.statusText}`);
    }
    if (!responseFont.ok) {
      throw new Error(`Failed to fetch SVG: ${responseFont.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const arrayBufferFont = await responseFont.arrayBuffer();

    // Encode to base64
    const base64Encoded = Buffer.from(arrayBuffer).toString("base64");
    const ogDataUrl = `data:image/png;base64,${base64Encoded}`;

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            fontFamily: '"Basis Grotesque Pro", sans-serif'
          }}>
          <img
            src={ogDataUrl}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover" // or "contain" if you prefer
            }}
          />
          {/* Optional gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom right, rgba(0,0,0,0.3), rgba(0,0,0,0.6))"
            }}
          />

          {/* Title “Portfolio 2025” */}
          <div
            style={{
              marginTop: 50,
              alignSelf: "center",
              background: "rgba(0, 0, 0, 0.4)",
              padding: "30px 60px",
              borderRadius: 5,
              color: "#fff",
              fontSize: 72,
              fontWeight: 500,
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              zIndex: 1
            }}>
            React Pong
          </div>

          {/* Footer “Andrew Ross” */}
          <div
            style={{
              position: "absolute",
              bottom: 38,
              left: "50%",
              transform: "translateX(-50%)",
              color: "white",
              background: "rgba(0, 0, 0, 0.5)",
              fontSize: 31,
              fontWeight: 900,
              borderRadius: 10,
              textAlign: "center",
              padding: "12px 24px",
              opacity: 0.85,
              zIndex: 1
            }}>
            2025
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Basis Grotesque Pro",
            data: arrayBufferFont,
            style: "normal"
          }
        ]
      }
    );
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error generating OG image: ${err.message}`);
      console.error(err.stack); // Log the stack trace for more detailed debugging
    } else {
      console.error(
        "An unknown error occurred while generating OG image:",
        err
      );
    }
    return new Response(`Failed to generate the image`, {
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
}

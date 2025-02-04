import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Andrew Ross Portfolio 2025";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";
export default async function Image() {
  const absoluteUrl = new URL("./og-new.png", import.meta.url);

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
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: '"Basis Grotesque Pro", sans-serif',
            overflow: "hidden",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url(${ogDataUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "50% 25%"
          }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(to bottom right, rgba(0,0,0,0.3), rgba(0,0,0,0.6))"
            }}
          />
          <div
            style={{
              marginTop: "50px",
              padding: "30px 60px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              display: "flex",
              WebkitBackdropFilter: "blur(10px)",
              borderRadius: "5px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              zIndex: 1
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
              Portfolio 2025
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "38px",
              left: "50%",
              letterSpacing: "-0.025rem",
              transform: "translateX(-50%)",
              color: "white",
              background: "rgba(0, 0, 0, 0.5)",
              fontSize: "31px",
              fontWeight: 900,
              borderRadius: "10px",
              textAlign: "center",
              padding: "12px 24px",
              WebkitBackdropFilter: "blur(10px)",
              opacity: 0.85,
              zIndex: 1
            }}>
            Andrew Ross
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

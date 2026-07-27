import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Andrew Ross Portfolio";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default async function Image() {
  const file = "og-png.png";
  const filePath = join(process.cwd(), file);
  const fileExists = existsSync(filePath);

  const fontFile = "BasisGrotesquePro-Light.ttf";
  const fontFilePath = join(process.cwd(), fontFile);
  const fontFileExists = existsSync(fontFilePath);

  try {
    if (!fileExists) {
      throw new Error(`[og-image.tsx]: file ${filePath} does not exist`);
    }
    if (!fontFileExists) {
      throw new Error(
        `[og-image.tsx]: font file ${fontFilePath} does not exist`
      );
    }

    const [bgImage, ogFont] = await Promise.all([
      readFile(filePath, "base64"),
      readFile(fontFilePath)
    ]);

    const dataUrl = `data:image/png;base64,${bgImage}` as const;

    return new ImageResponse(
      <div
        style={{
          width: "1200px",
          height: "628px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          fontFamily: '"Basis Grotesque Pro", sans-serif'
        }}>
        {/* The full-width, full-height image */}
        <img
          src={dataUrl}
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

        {/* Title “Portfolio YYYY */}
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
          {`Portfolio ${new Date(Date.now()).getFullYear()}`}
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
          Andrew Ross
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            weight: 300,
            name: "Basis Grotesque Pro",
            data: ogFont,
            style: "normal"
          }
        ]
      }
    );
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error generating Twitter image: ${err.message}`);
      console.error(err.stack);
    } else {
      console.error(
        "An unknown error occurred while generating Twitter image:",
        err
      );
    }
    return new Response(`Failed to generate the image`, {
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
}

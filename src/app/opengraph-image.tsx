import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const logoBuffer = readFileSync(join(process.cwd(), "public", "logo-mark.png"));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#5A3026",
        }}
      >
        <img src={logoSrc} width={560} height={310} alt="" />
        <div
          style={{
            marginTop: 20,
            fontSize: 32,
            color: "#DDE8D9",
            letterSpacing: -0.5,
          }}
        >
          Mobilne in modularne hiške ter zemljišča
        </div>
      </div>
    ),
    size
  );
}

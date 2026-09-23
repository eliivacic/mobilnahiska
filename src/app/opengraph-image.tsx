import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const logoBuffer = readFileSync(join(process.cwd(), "public", "logo-white.png"));
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
          backgroundColor: "#1E2749",
        }}
      >
        <img src={logoSrc} width={640} height={213} alt="" />
        <div
          style={{
            marginTop: 28,
            fontSize: 32,
            color: "#E4D9FF",
            letterSpacing: -0.5,
          }}
        >
          Mobilne in modularne hiške naprodaj
        </div>
      </div>
    ),
    size
  );
}

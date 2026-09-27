import { readFileSync } from "node:fs";
import { join } from "node:path";

// Playwright's global setup/teardown run as a plain Node process, not
// through Next.js — so .env.local isn't loaded automatically the way it is
// for `next dev`. This does the minimal parsing needed (no new dependency).
export function loadEnvLocal(): Record<string, string> {
  const path = join(__dirname, "..", ".env.local");
  const content = readFileSync(path, "utf-8");
  const env: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match) env[match[1]] = match[2].replace(/^"(.*)"$/, "$1");
  }
  return env;
}

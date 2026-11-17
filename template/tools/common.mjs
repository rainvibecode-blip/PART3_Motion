// 장면 목록을 Remotion에서 읽어 오는 공통 코드. stills.mjs와 render.mjs가 같이 쓴다.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { selectComposition, getCompositions } from "@remotion/renderer";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const OUT = path.resolve(ROOT, "..", "output");

// --only S01,S03 → 그 장면만. id 전체 또는 앞부분(S01)으로 고른다.
export function onlyArg() {
  const i = process.argv.indexOf("--only");
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1].split(",").map((s) => s.trim()).filter(Boolean) : null;
}

export async function load() {
  console.log("번들 만드는 중…");
  const serveUrl = await bundle({ entryPoint: path.join(ROOT, "src/index.ts"), publicDir: path.join(ROOT, "public"), enableCaching: false });
  const all = await getCompositions(serveUrl);
  const only = onlyArg();
  const scenes = all.filter((c) => c.id !== "Main").filter((c) => !only || only.some((k) => c.id === k || c.id.startsWith(k + "-")));
  if (only && !scenes.length) { console.error(`일치하는 장면이 없습니다: ${only.join(", ")}`); process.exit(2); }
  const main = only ? null : await selectComposition({ serveUrl, id: "Main" });
  return { serveUrl, scenes, main };
}

export const safeName = (s) => s.trim().replace(/[\\/:*?"<>|]+/g, "").replace(/\s+/g, "-");

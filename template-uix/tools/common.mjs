// stills.mjs와 render.mjs가 같이 쓰는 코드.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const OUT = path.resolve(ROOT, "..", "output");
// 같은 프로젝트가 언제 다시 렌더해도 같은 결과가 나오게 CLI 버전을 고정한다.
export const HF = ["--yes", "hyperframes@0.9.65"];
const WIN = process.platform === "win32";

// 명령을 실행하고 출력을 그대로 흘려보낸다. 실패하면 그 종료 코드로 끝낸다.
export function sh(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: "inherit", shell: WIN, ...opts });
  if (r.error) { console.error(`${cmd} 실행 실패: ${r.error.message}`); process.exit(1); }
  if (r.status !== 0 && !opts.allowFail) process.exit(r.status ?? 1);
  return r;
}
export const npx = (args, opts) => sh(WIN ? "npx.cmd" : "npx", [...HF, ...args], opts);

// index.html 의 장면 호스트(data-composition-src가 있는 요소)를 시작 시각 순서로 읽는다.
export function hosts() {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8").replace(/<!--[\s\S]*?-->/g, "");
  const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];
  const list = [];
  for (const [tag] of html.matchAll(/<[a-z]+\b[^>]*\sdata-composition-src="[^"]*"[^>]*>/gi)) {
    const start = Number(attr(tag, "data-start")), dur = Number(attr(tag, "data-duration"));
    const id = attr(tag, "data-composition-id") || attr(tag, "id");
    if (id && Number.isFinite(start) && dur > 0) list.push({ id, start, dur, src: attr(tag, "data-composition-src") });
  }
  return list.sort((a, b) => a.start - b.start);
}

export const safeName = (s) => String(s).trim().replace(/[\\/:*?"<>|]+/g, "").replace(/\s+/g, "-");

// 전체본(../output/전체.mp4)을 렌더하고, index.html 의 장면 호스트 시각대로 잘라
// 장면별 MP4(../output/장면별/NN_id.mp4)와 미리보기 스틸(../output/stills/NN_id.jpg)을 만든다.
// 사용: npm run render
import fs from "node:fs";
import path from "node:path";
import { OUT, npx, sh, hosts, safeName } from "./common.mjs";

const full = path.join(OUT, "전체.mp4");
const clipsDir = path.join(OUT, "장면별"), stillsDir = path.join(OUT, "stills");
fs.mkdirSync(OUT, { recursive: true });

console.log("전체본 렌더 중…");
npx(["render", "--output", full, "--quiet"]);
if (!fs.existsSync(full) || fs.statSync(full).size === 0) { console.error(`결과 파일이 비어 있습니다: ${full}`); process.exit(1); }
console.log(`완료 output/전체.mp4`);

// 지난 렌더의 장면 파일이 섞이지 않게 비우고 다시 만든다.
for (const d of [clipsDir, stillsDir]) { fs.rmSync(d, { recursive: true, force: true }); fs.mkdirSync(d, { recursive: true }); }
const list = hosts();
const ff = (args) => sh("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { allowFail: true });
let made = 0;
list.forEach((h, i) => {
  const name = `${String(i + 1).padStart(2, "0")}_${safeName(h.id)}`;
  const clip = path.join(clipsDir, `${name}.mp4`);
  const r = ff(["-ss", String(h.start), "-i", full, "-t", String(h.dur), "-c:v", "libx264", "-crf", "16", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-c:a", "aac", "-movflags", "+faststart", clip]);
  if (r.status === 0) { made++; console.log(`완료 output/장면별/${name}.mp4`); }
  else console.log(`장면 ${h.id}를 자르지 못했습니다(ffmpeg). 전체본은 정상입니다.`);
  // 장면이 다 차린 화면: 끝나기 0.6초 전(전환 직전)
  ff(["-ss", String(Math.max(h.start, h.start + h.dur - 0.6)), "-i", full, "-frames:v", "1", "-vf", "scale=960:-2", "-q:v", "4", path.join(stillsDir, `${name}.jpg`)]);
});
console.log(`렌더 완료: 장면 ${made}/${list.length}개 + 전체본`);

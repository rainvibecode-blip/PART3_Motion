// 장면마다 스틸 3장(25%·60%·끝나기 0.5초 전)을 output/stills/에 만든다. 맨 끝 프레임은 장면 전환으로 흐려져 있어 쓰지 않는다. 렌더 전에 화면을 눈으로 확인하는 용도.
// 사용: npm run stills  |  npm run stills -- --only S01,S03
import fs from "node:fs";
import path from "node:path";
import { renderStill } from "@remotion/renderer";
import { load, OUT } from "./common.mjs";

const { serveUrl, scenes } = await load();
const dir = path.join(OUT, "stills");
fs.mkdirSync(dir, { recursive: true });
for (const c of scenes) {
  const last = c.durationInFrames - 1;
  const frames = [...new Set([Math.round(last * 0.25), Math.round(last * 0.6), Math.max(0, last - 15)])];
  for (const f of frames) {
    const output = path.join(dir, `${c.id}_${String(f).padStart(4, "0")}.jpg`);
    await renderStill({ composition: c, serveUrl, output, frame: f, imageFormat: "jpeg", jpegQuality: 80, scale: 0.5 });
    console.log(`스틸 ${path.relative(path.dirname(OUT), output)}`);
  }
}
console.log(`스틸 완료: 장면 ${scenes.length}개`);

// 장면별 MP4(output/장면별/NN_제목.mp4)와 전체본(output/전체.mp4)을 만든다.
// 사용: npm run render  |  npm run render -- --only S01,S03 (전체본은 만들지 않음)
import fs from "node:fs";
import path from "node:path";
import { renderMedia, getCompositions } from "@remotion/renderer";
import { load, OUT, safeName } from "./common.mjs";

const { serveUrl, scenes, main } = await load();
const order = (await getCompositions(serveUrl)).filter((c) => c.id !== "Main").map((c) => c.id);
const dir = path.join(OUT, "장면별");
fs.mkdirSync(dir, { recursive: true });

const run = async (composition, outputLocation) => {
  let shown = -1;
  await renderMedia({
    composition, serveUrl, codec: "h264", outputLocation, imageFormat: "jpeg",
    onProgress: ({ progress }) => { const p = Math.floor(progress * 10); if (p !== shown) { shown = p; console.log(`  ${composition.id} ${p * 10}%`); } },
  });
  if (!fs.existsSync(outputLocation) || fs.statSync(outputLocation).size === 0) throw new Error(`결과 파일이 비어 있습니다: ${outputLocation}`);
  console.log(`완료 ${path.relative(path.dirname(OUT), outputLocation)}`);
};

for (const c of scenes) {
  const n = String(order.indexOf(c.id) + 1).padStart(2, "0");
  await run(c, path.join(dir, `${n}_${safeName(c.props?.title || c.defaultProps?.title || c.id)}.mp4`));
}
if (main) await run(main, path.join(OUT, "전체.mp4"));
console.log(`렌더 완료: 장면 ${scenes.length}개${main ? " + 전체본" : ""}`);

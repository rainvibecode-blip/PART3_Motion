// 렌더 전에 화면을 눈으로 확인하는 스틸. 결과는 ../output/review/ 에 쌓인다.
// 사용: npm run stills                      → 장면마다 시작+0.3초·중간, 컷마다 이음새(review-beats.jpg, review-seam-NN.jpg)
//       npm run stills -- --at 1.5,4,9      → 그 시각(초)의 프레임
//       npm run stills -- --composition dg  → 그 장면만
import fs from "node:fs";
import path from "node:path";
import { OUT, npx } from "./common.mjs";

const dir = path.join(OUT, "review");
fs.mkdirSync(dir, { recursive: true });
const extra = process.argv.slice(2);
// --at·--composition 스틸은 리뷰 시트를 지우지 않고 at-<초>s.png 로 더한다(--keep).
npx(["snapshot", "--output", dir, ...(extra.length ? [...extra, ...(extra.includes("--keep") ? [] : ["--keep"])] : ["--review"])]);
console.log(`스틸 완료 → ${path.relative(path.dirname(OUT), dir)}/`);
for (const f of fs.readdirSync(dir).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort()) console.log(`  ${f}`);

// ────────────────────────────────────────────────────────────
//  fonts.tsx — 서체 로딩. 네트워크 없이 public/fonts의 파일만 쓴다.
//   · 한글 = IBM Plex Sans KR 400/500/700
//   · 영문·숫자 = Outfit (가변 100–900)
//   · 고정폭(코드·경로·숫자 카운터) = IBM Plex Mono 400/500/600
//  세 서체 모두 SIL Open Font License 1.1이다 (public/fonts/*-OFL.txt).
//  다른 한글 서체로 바꾸려면: public/fonts에 woff2 파일을 넣고 KO_FACES의 파일 이름만 바꾼다.
//  서체의 재배포 조건은 서체마다 다르다. 저장소에 올리기 전에 그 서체의 라이선스를 확인한다.
// ────────────────────────────────────────────────────────────
import { useEffect } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

export const FONT = '"Motion Outfit", "Motion Korean"';
export const MONO = '"Motion Mono", "Motion Korean"';

const KO_FACES: [string, string][] = [
  ["IBMPlexSansKR-Regular.woff2", "400"],
  ["IBMPlexSansKR-Medium.woff2", "500"],
  ["IBMPlexSansKR-Bold.woff2", "600 900"],
];
const MONO_FACES: [string, string][] = [
  ["IBMPlexMono-Regular.woff2", "400"],
  ["IBMPlexMono-Medium.woff2", "500"],
  ["IBMPlexMono-SemiBold.woff2", "600 900"],
];

let fontPromise: Promise<void> | undefined;
export function loadMotionFonts(): Promise<void> {
  if (typeof document === "undefined" || typeof FontFace === "undefined") return Promise.resolve();
  if (!fontPromise) {
    const face = (family: string, file: string, weight: string) =>
      new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, { weight, style: "normal" }).load();
    fontPromise = Promise.all([
      face("Motion Outfit", "Outfit.ttf", "100 900"),
      ...KO_FACES.map(([file, weight]) => face("Motion Korean", file, weight)),
      ...MONO_FACES.map(([file, weight]) => face("Motion Mono", file, weight)),
    ]).then((faces) => {
      faces.forEach((f) => document.fonts.add(f));
      // 가짜 굵기 금지 + 한글은 단어 단위로 줄바꿈
      const st = document.createElement("style");
      st.textContent = "*{font-synthesis:none}html{word-break:keep-all;overflow-wrap:break-word}";
      document.head.appendChild(st);
    });
  }
  return fontPromise;
}

// 서체가 준비될 때까지 렌더를 기다린다.
export function useMotionFonts() {
  useEffect(() => {
    const handle = delayRender("서체 로딩", { timeoutInMilliseconds: 120000 });
    loadMotionFonts().then(() => continueRender(handle)).catch((error) => cancelRender(error));
    return () => continueRender(handle);
  }, []);
}

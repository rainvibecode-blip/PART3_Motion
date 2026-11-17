// ────────────────────────────────────────────────────────────
//  design.ts — 모노크롬(흑백) 디자인 토큰 + 폰트 로딩.
//
//  · 폰트(src/fonts.tsx): 한글 IBM Plex Sans KR, 영문·숫자 Outfit, 고정폭(MONO) IBM Plex Mono. 모두 OFL 서체.
//          FONT는 "Outfit → 한글 서체" 순서라 한글은 자동으로 한글 서체가 된다.
//  · 컬러 없음 — 흑/백/회색만. 강조는 '검정 채움' 하나.
//  · 배경 흰색. 카드는 흰 바탕 + 검정 테두리 + 옅은 그림자.
//  · 여백/간격: 전부 8의 배수.
// ────────────────────────────────────────────────────────────
// 폰트 로딩은 BrowserFrame이 useMotionFonts로 한다.
export {FONT, MONO} from './fonts';

// 모노크롬 팔레트 — 모든 토큰을 흑/백/회색으로. (씬 코드가 기존 키를 참조하므로 키는 유지)
const INK = "#141414";
const SOFT_FILL = "#F2F2F2"; // 아이콘 타일·옅은 채움
const LINE = "#E2E2E2";

export const C = {
  ink: INK, // 텍스트·선
  inkSoft: "#7A7A7A", // 보조 텍스트
  paper: "#FFFFFF", // 카드 바탕
  cream: "#FFFFFF", // 무대 배경 = 흰색
  creamDeep: "#ECECEC",
  line: LINE,

  // 강조 = 검정 채움 (컬러 대체)
  brand: INK,
  brandDeep: "#000000",
  brandSoft: SOFT_FILL,

  // 구역색 → 전부 모노크롬으로 통일 (차이는 아이콘·라벨로)
  hall: INK,
  hallSoft: SOFT_FILL,
  kitchen: INK,
  kitchenSoft: SOFT_FILL,
  store: INK,
  storeSoft: SOFT_FILL,
  api: INK,
  apiSoft: SOFT_FILL,

  white: "#FFFFFF",
  shadow: "0 12px 32px rgba(20,20,20,0.10)",
  shadowSoft: "0 6px 18px rgba(20,20,20,0.07)",
};

export const RADIUS = {
  card: 28,
  chip: 16,
  pill: 999,
  small: 12,
};

// 8의 배수 간격 헬퍼
export const S = (n: number) => n * 8;

// 전역 타입 스케일 — 글자는 최소화, 비주얼(아이콘)에 무게중심.
export const TS = 1.12;
export const fs = (n: number) => Math.round(n * TS);

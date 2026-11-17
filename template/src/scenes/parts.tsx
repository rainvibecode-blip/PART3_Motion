// ────────────────────────────────────────────────────────────
//  parts.tsx — 공용 모션 부품. scenes/index.tsx에 등록하지 않는다.
//  요청서 기법 매핑: Slot(A1 플레이스홀더) · FillCard(A3 강조→진정) · SlotFill(A1+A2+A3 한 몸) ·
//  FlyChip(C1 매치컷) · Wire(C2 자유 각도 draw-in) · MiniMark(판정) · BigPill(강조) ·
//  Cam(B2 풀백 / B3 요약축소 / B4 켄번스) · Layer(D2 비초점 디밍)
// ────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, interpolateColors } from "remotion";
import { C, FONT, MONO, RADIUS, fs } from "../design";
import { appear, pop, draw, EASE } from "../anim";
import { CheckIcon, CrossIcon, QuestionIcon } from "../components/Icons";

// appear() 결과를 style로 펴는 축약
export const op = (a: { opacity: number; scale: number }) => ({
  opacity: a.opacity,
  transform: `scale(${a.scale})`,
});

// A1. 점선 플레이스홀더 — "여기에 뭔가 들어온다" 예고
export const Slot: React.FC<{ w: number; h: number; delay?: number; r?: number; fadeAt?: number }> = ({
  w,
  h,
  delay = 0,
  r = RADIUS.card,
  fadeAt,
}) => {
  const frame = useCurrentFrame();
  const oIn = interpolate(frame - delay, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // fadeAt: 내용물이 들어와 자리를 채우면 점선은 조용히 물러난다
  const oOut =
    fadeAt == null ? 1 : interpolate(frame - fadeAt, [0, 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = oIn * oOut;
  return (
    <div
      style={{
        opacity: o * 0.9,
        width: w,
        height: h,
        border: `2px dashed #CFCFCF`,
        borderRadius: r,
        background: C.white,
      }}
    />
  );
};

// A3. 새로 들어온 카드만 강조(검정 테두리+그림자), settle 프레임부터 회색으로 가라앉는다
export const FillCard: React.FC<{
  delay: number;
  settle?: number;
  w: number;
  h: number;
  children: React.ReactNode;
}> = ({ delay, settle, w, h, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = appear(frame, fps, delay);
  const calm =
    settle == null
      ? 0
      : interpolate(frame - settle, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        opacity: a.opacity,
        transform: `scale(${a.scale})`,
        width: w,
        height: h,
        background: C.white,
        border: `3px solid ${interpolateColors(calm, [0, 1], [C.ink, "#D5D5D5"])}`,
        borderRadius: RADIUS.card,
        boxShadow: `0 12px 32px rgba(20,20,20,${0.12 - calm * 0.07})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
};

// C1. 날아가는 칩 — from에서 잠깐 섰다가 to로 날아가 박힌다 (매치컷)
export const FlyChip: React.FC<{
  from: [number, number];
  to: [number, number];
  start: number;
  flight?: number;
  appearAt?: number;
  mono?: boolean;
  dark?: boolean;
  card?: boolean;
  size?: number;
  z?: number;
  children: React.ReactNode;
}> = ({ from, to, start, flight = 26, appearAt, mono = true, dark = false, card = false, size = 24, z = 6, children }) => {
  const frame = useCurrentFrame();
  const aAt = appearAt ?? start - 14;
  const o = interpolate(frame - aAt, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p = interpolate(frame - start, [0, flight], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const arc = Math.sin(p * Math.PI); // 비행 중 살짝 떠오르고 그림자가 커진다(고도감)
  const x = from[0] + (to[0] - from[0]) * p;
  const y = from[1] + (to[1] - from[1]) * p - arc * 48;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) scale(${1 + arc * 0.08})`,
        zIndex: z,
        opacity: o,
        background: dark ? C.ink : C.white,
        color: dark ? C.white : C.ink,
        border: `2px solid ${C.ink}`,
        borderRadius: card ? RADIUS.chip : RADIUS.pill,
        padding: card ? "16px 32px" : "8px 24px",
        fontFamily: mono ? MONO : FONT,
        fontWeight: 700,
        fontSize: fs(size),
        whiteSpace: "nowrap",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        boxShadow: `0 ${8 + arc * 16}px ${24 + arc * 24}px rgba(20,20,20,${0.1 + arc * 0.08})`,
      }}
    >
      {children}
    </div>
  );
};

// C2. 자유 각도 연결선 — 요소가 먼저 서고, 선이 delay 후 그려진다. shape로 "방식이 다름"을 표현.
export const Wire: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay?: number;
  dur?: number;
  thickness?: number;
  shape?: "line" | "zigzag" | "curve";
  opacity?: number;
  z?: number;
}> = ({ x1, y1, x2, y2, delay = 0, dur = 20, thickness = 4, shape = "line", opacity = 1, z = 0 }) => {
  const frame = useCurrentFrame();
  const p = draw(frame, delay, dur);
  const pad = 80;
  const minX = Math.min(x1, x2) - pad;
  const minY = Math.min(y1, y2) - pad;
  const w = Math.abs(x2 - x1) + pad * 2;
  const h = Math.abs(y2 - y1) + pad * 2;
  const ax = x1 - minX;
  const ay = y1 - minY;
  const bx = x2 - minX;
  const by = y2 - minY;
  const len = Math.hypot(bx - ax, by - ay) || 1;
  const px = -(by - ay) / len; // 단위 수직 벡터
  const py = (bx - ax) / len;
  let d = `M${ax} ${ay} L${bx} ${by}`;
  if (shape === "zigzag") {
    const m1x = ax + (bx - ax) * 0.33 + px * 28;
    const m1y = ay + (by - ay) * 0.33 + py * 28;
    const m2x = ax + (bx - ax) * 0.66 - px * 28;
    const m2y = ay + (by - ay) * 0.66 - py * 28;
    d = `M${ax} ${ay} L${m1x} ${m1y} L${m2x} ${m2y} L${bx} ${by}`;
  } else if (shape === "curve") {
    const cx = ax + (bx - ax) * 0.5 + px * 72;
    const cy = ay + (by - ay) * 0.5 + py * 72;
    d = `M${ax} ${ay} Q${cx} ${cy} ${bx} ${by}`;
  }
  return (
    <svg
      style={{ position: "absolute", left: minX, top: minY, zIndex: z }}
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
    >
      <path
        d={d}
        pathLength={1}
        stroke={C.ink}
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeDasharray="1"
        strokeDashoffset={1 - p}
        opacity={opacity}
        fill="none"
      />
    </svg>
  );
};

// 판정 미니 배지 — 아이콘 귀퉁이에 얹는 체크/엑스/물음표 (흰 링으로 분리)
export const MiniMark: React.FC<{ kind?: "check" | "cross" | "question"; delay?: number; size?: number }> = ({
  kind = "check",
  delay = 0,
  size = 64,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, delay);
  const Icon = kind === "check" ? CheckIcon : kind === "cross" ? CrossIcon : QuestionIcon;
  return (
    <div
      style={{
        transform: `scale(${p})`,
        background: C.white,
        borderRadius: "50%",
        padding: 8,
        boxShadow: C.shadowSoft,
        display: "flex",
      }}
    >
      <Icon size={size} />
    </div>
  );
};

// 결론/숫자 강조 — 검정 알약 (컬러 대신 검정 채움이 유일한 강조)
export const BigPill: React.FC<{ delay?: number; size?: number; mono?: boolean; children: React.ReactNode }> = ({
  delay = 0,
  size = 30,
  mono = false,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, delay);
  return (
    <div
      style={{
        transform: `scale(${p})`,
        background: C.ink,
        color: C.white,
        borderRadius: RADIUS.pill,
        padding: "16px 40px",
        fontFamily: mono ? MONO : FONT,
        fontWeight: 800,
        fontSize: fs(size),
        whiteSpace: "nowrap",
        boxShadow: C.shadow,
      }}
    >
      {children}
    </div>
  );
};

// A1+A2+A3 한 몸 — 빈 자리(점선)를 먼저 깔고 → 내용이 들어오며 검정 테두리로 강조 → 다음 것이 오면 회색으로 가라앉는다.
// 카탈로그 결정표: "항목을 여러 개 나열한다(A, B, C)" 대목의 기본형.
export const SlotFill: React.FC<{
  w: number;
  h: number;
  slotAt: number; // 빈 자리 예고
  fillAt: number; // 채워지는 시점
  settleAt?: number; // 강조 해제(다음 것이 들어올 때)
  row?: boolean; // 가로 배치(아이콘 + 라벨)
  children: React.ReactNode;
}> = ({ w, h, slotAt, fillAt, settleAt, row = false, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slotO = interpolate(frame - slotAt, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const a = appear(frame, fps, fillAt);
  const filled = interpolate(frame - fillAt, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const calm =
    settleAt == null
      ? 0
      : interpolate(frame - settleAt, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // 점선 회색 → (채워짐) 검정 → (진정) 옅은 회색
  const border = filled < 0.5 ? "#DCDCDC" : interpolateColors(calm, [0, 1], [C.ink, "#D5D5D5"]);
  return (
    <div
      style={{
        opacity: slotO,
        width: w,
        height: h,
        boxSizing: "border-box",
        background: C.white,
        border: `3px ${filled < 0.5 ? "dashed" : "solid"} ${border}`,
        borderRadius: RADIUS.card,
        boxShadow: `0 12px 32px rgba(20,20,20,${(0.12 - calm * 0.08) * filled})`,
        display: "flex",
        flexDirection: row ? "row" : "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        textAlign: "center",
      }}
    >
      <div style={{ opacity: a.opacity, transform: `scale(${a.scale})`, display: "flex", flexDirection: row ? "row" : "column", alignItems: "center", gap: 24 }}>
        {children}
      </div>
    </div>
  );
};

// B 계열 카메라 — 무대 좌표(content 1600x848, 중심 800/424) 기준.
// from에서 시작해 at 프레임부터 dur 동안 to로 이동한다. s>1이면 그만큼 바짝 붙은 상태.
//  · B2 풀백: from{s:1.8} → to{s:1}  · B3 요약축소: from{s:1} → to{s:0.72}
//  · push: 도착 후 단방향 미세 확대(켄 번스, 화면이 오래 정지할 때만)
export const Cam: React.FC<{
  from: { x: number; y: number; s: number };
  to: { x: number; y: number; s: number };
  at: number;
  dur?: number;
  push?: number;
  pushDur?: number;
  children: React.ReactNode;
}> = ({ from, to, at, dur = 70, push = 0, pushDur = 240, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const k = push
    ? interpolate(frame - (at + dur), [0, pushDur], [1, 1 + push], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  const s = (from.s + (to.s - from.s) * p) * k;
  const cx = from.x + (to.x - from.x) * p;
  const cy = from.y + (to.y - from.y) * p;
  const tx = -(cx - 800) * s;
  const ty = -(cy - 424) * s;
  return (
    <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: "800px 424px" }}>
      {children}
    </AbsoluteFill>
  );
};

// D2 비초점 디밍 — 무대 좌표를 유지한 채 한 묶음을 통째로 흐리게 한다.
// at 프레임에 1 → to(기본 0.32)로 내려간다. 지금 봐야 할 것만 선명하게 남긴다.
export const Layer: React.FC<{ at?: number; to?: number; dur?: number; children: React.ReactNode }> = ({
  at,
  to = 0.32,
  dur = 20,
  children,
}) => {
  const frame = useCurrentFrame();
  const o = at == null ? 1 : interpolate(frame - at, [0, dur], [1, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

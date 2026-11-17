// ────────────────────────────────────────────────────────────
//  motion.tsx — Remotion 확장 패키지로 만든 품질 부품.
//
//  · FitText   : 글자가 상자를 넘치거나 의도치 않게 줄바꿈되는 사고를 막는다
//                (게이트 A 확인 항목 ② — 눈으로 잡던 걸 코드가 먼저 막는다)
//  · DrawPath  : 어떤 모양의 선이든 "그려지며" 나타난다 (규칙 11 draw-in)
//  · Connector : 두 지점을 잇는 곡선/꺾은선 연결 + 화살촉. 직선 Arrow의 상위 호환
//  · Ring      : 비율·진행도를 나타내는 링 (도넛). 숫자 대신 그림으로
//
//  사용 패키지: @remotion/layout-utils · @remotion/paths · @remotion/shapes
// ────────────────────────────────────────────────────────────
import React from "react";
import { useCurrentFrame } from "remotion";
import { fitText } from "@remotion/layout-utils";
import { evolvePath, getLength } from "@remotion/paths";
import { makeCircle } from "@remotion/shapes";
import { FONT, MONO, C } from "../design";
import { draw, fadeIn } from "../anim";

// ── FitText ─────────────────────────────────────────────────
// 주어진 폭 안에 한 줄로 들어가도록 글자 크기를 자동으로 줄인다.
// size는 "최대 크기"다 — 짧은 글은 그대로, 긴 글만 줄어든다.
export const FitText: React.FC<{
  children: string;
  width: number;
  size?: number;
  min?: number;
  color?: string;
  weight?: number | string;
  mono?: boolean;
}> = ({ children, width, size = 40, min = 20, color = C.ink, weight = 700, mono = false }) => {
  const family = mono ? MONO : FONT; // 시스템 고정폭 대체 금지 — 공통 IBM Plex Mono
  const { fontSize } = fitText({
    text: children,
    withinWidth: width,
    fontFamily: family,
    fontWeight: String(weight),
  });
  const final = Math.max(min, Math.min(size, fontSize));
  return (
    <span
      style={{
        fontFamily: family,
        fontSize: final,
        fontWeight: weight,
        color,
        whiteSpace: "nowrap",
        display: "inline-block",
        lineHeight: 1.25,
      }}
    >
      {children}
    </span>
  );
};

// ── DrawPath ────────────────────────────────────────────────
// 임의의 SVG path가 delay 이후 dur 프레임에 걸쳐 그려진다.
export const DrawPath: React.FC<{
  d: string;
  width: number;
  height: number;
  delay?: number;
  dur?: number;
  color?: string;
  thickness?: number;
  dashed?: boolean;
}> = ({ d, width, height, delay = 0, dur = 24, color = C.ink, thickness = 4, dashed = false }) => {
  const frame = useCurrentFrame();
  const p = draw(frame, delay, dur);
  const len = getLength(d);
  const evo = evolvePath(p, d);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" style={{ display: "block", overflow: "visible" }}>
      <path
        d={d}
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? `${thickness * 2} ${thickness * 3}` : evo.strokeDasharray}
        strokeDashoffset={dashed ? len * (1 - p) : evo.strokeDashoffset}
      />
    </svg>
  );
};

// ── Connector ───────────────────────────────────────────────
// (x1,y1) → (x2,y2)를 잇는 연결선. 좌표는 At과 같은 무대 좌표계(1600x848).
// curve로 휘어지는 정도를 준다(0이면 직선).
// 아이콘이 먼저 서고 → 이 선이 나중에 그려진다 (규칙 11).
export const Connector: React.FC<{
  x1: number; y1: number; x2: number; y2: number;
  delay?: number; dur?: number; curve?: number;
  color?: string; thickness?: number; head?: boolean; dashed?: boolean;
}> = ({ x1, y1, x2, y2, delay = 0, dur = 24, curve = 0, color = C.ink, thickness = 4, head = true, dashed = false }) => {
  const frame = useCurrentFrame();
  const p = draw(frame, delay, dur);
  // 곡선 제어점 — 두 점의 중간에서 수직 방향으로 curve만큼 밀어낸다
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const norm = Math.hypot(dx, dy) || 1;
  const cx = mx - (dy / norm) * curve;
  const cy = my + (dx / norm) * curve;
  const d = curve === 0 ? `M${x1} ${y1} L${x2} ${y2}` : `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`;
  const len = getLength(d);
  const evo = evolvePath(p, d);
  // 화살촉 — 선이 다 그려진 뒤 끝점 각도에 맞춰 등장
  const ang = curve === 0 ? Math.atan2(dy, dx) : Math.atan2(y2 - cy, x2 - cx);
  const hp = fadeIn(frame, delay + dur - 4, 8);
  const hs = 14 * hp;
  const ax = (a: number) => x2 - Math.cos(ang - a) * hs;
  const ay = (a: number) => y2 - Math.sin(ang - a) * hs;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1600 848"
      preserveAspectRatio="none"
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none", zIndex: 0 }}
    >
      <path
        d={d}
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={dashed ? `${thickness * 2} ${thickness * 3}` : evo.strokeDasharray}
        strokeDashoffset={dashed ? len * (1 - p) : evo.strokeDashoffset}
      />
      {head && hp > 0.01 ? (
        <path
          d={`M${ax(0.5)} ${ay(0.5)} L${x2} ${y2} L${ax(-0.5)} ${ay(-0.5)}`}
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ) : null}
    </svg>
  );
};

// ── Ring ────────────────────────────────────────────────────
// 비율/진행도 링. value 0~1. 링이 delay 이후 시계방향으로 차오른다.
export const Ring: React.FC<{
  size?: number; value?: number; delay?: number; dur?: number;
  thickness?: number; color?: string; track?: string;
}> = ({ size = 200, value = 1, delay = 0, dur = 30, thickness = 12, color = C.ink, track = C.brandSoft }) => {
  const frame = useCurrentFrame();
  const p = draw(frame, delay, dur) * value;
  const r = size / 2 - thickness / 2;
  const circle = makeCircle({ radius: r });
  const len = getLength(circle.path);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={thickness} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={thickness}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
};

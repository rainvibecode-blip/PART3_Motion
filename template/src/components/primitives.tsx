// ────────────────────────────────────────────────────────────
//  primitives.tsx — 무대·씬페이드·칩·헤더 등 공통 빌딩블록.
//  전부 인라인 스타일. design.ts 토큰만 사용.
// ────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { C, FONT, MONO, RADIUS, fs } from "../design";
import { appear, riseIn, pop } from "../anim";

// 무대 — 브라우저 content 영역 안. 크림 바탕 + 중앙정렬 기본.
export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: C.cream,
      fontFamily: FONT,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    }}
  >
    {children}
  </AbsoluteFill>
);

// 씬 크로스페이드 (앞뒤 12프레임) — 배경 위에서 투명 페이드
export const SceneFade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(
    frame,
    [0, 12, durationInFrames - 12, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

// 절대좌표 배치 (중앙 기준). content 영역은 1600 x 848.
export const At: React.FC<{ x: number; y: number; children: React.ReactNode; z?: number }> = ({
  x,
  y,
  children,
  z = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: "translate(-50%,-50%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: z,
    }}
  >
    {children}
  </div>
);

// 기술 스택 칩 (모노스페이스 라벨)
export const Chip: React.FC<{
  delay?: number;
  color?: string;
  bg?: string;
  children: React.ReactNode;
  size?: number;
}> = ({ delay = 0, color = C.ink, bg = C.white, children, size = 26 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = appear(frame, fps, delay);
  return (
    <div
      style={{
        opacity: a.opacity,
        transform: `scale(${a.scale})`,
        background: bg,
        color,
        border: `2px solid ${color}`,
        borderRadius: RADIUS.pill,
        padding: "8px 24px",
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: fs(size),
        boxShadow: C.shadowSoft,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

// 콘텐츠 제목만 표시한다. 기존 호출 호환용 en/color는 화면에 출력하지 않는다.
// 장면 ID·번호·제작용 영문 배지는 사용자 지시로 영구 금지.
export const Header: React.FC<{ delay?: number; ko: string; en?: string; y?: number; color?: string }> = ({
  delay = 0,
  ko,
  y = 52,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r = riseIn(frame, fps, delay, 16);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        textAlign: "center",
        opacity: r.opacity,
        transform: `translateY(${r.y}px)`,
      }}
    >
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: fs(48), color: C.ink, letterSpacing: -1, lineHeight: 1.1 }}>
        {ko}
      </div>
    </div>
  );
};

// 통통 튀어 등장하는 배지/이모지 원형
export const PopBadge: React.FC<{ delay?: number; bg: string; size?: number; children: React.ReactNode }> = ({
  delay = 0,
  bg,
  size = 96,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, delay);
  return (
    <div
      style={{
        transform: `scale(${p})`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: C.shadowSoft,
        fontSize: size * 0.5,
      }}
    >
      {children}
    </div>
  );
};

// 아이콘 아래 짧은 키워드 라벨. 하단 자막이 아니라 "요소에 붙는 이름표" — 텍스트는 최소화하되 0으로 만들지 않기.
// 긴 문장 금지(한두 단어 키워드). riseIn으로 아이콘보다 살짝 늦게 등장.
export const IconLabel: React.FC<{ delay?: number; children: React.ReactNode; mono?: boolean; size?: number }> = ({
  delay = 0,
  children,
  mono = false,
  size = 26,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r = riseIn(frame, fps, delay, 10);
  return (
    <div
      style={{
        opacity: r.opacity,
        transform: `translateY(${r.y}px)`,
        fontFamily: mono ? MONO : FONT,
        fontWeight: 700,
        fontSize: fs(size),
        color: C.ink,
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

// 단계 번호 배지 — 검정 원 + 흰 숫자. 순서를 가진 다이어그램에서 씀.
export const StepBadge: React.FC<{ delay?: number; n: number; size?: number }> = ({ delay = 0, n, size = 56 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, delay);
  return (
    <div
      style={{
        transform: `scale(${p})`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: C.ink,
        color: C.white,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: fs(size * 0.44),
      }}
    >
      {n}
    </div>
  );
};

// 좌우 대비(O/X) 구도에서 가운데 세로 구분선. 위에서 아래로 그려지며 등장.
export const VDivider: React.FC<{ delay?: number; height?: number }> = ({ delay = 0, height = 440 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <div style={{ width: 2, height: height * p, background: C.line }} />;
};

// 여러 요소를 묶는 옅은 테두리 프레임 (예: "한 페이지 안의 세 구역").
export const Frame: React.FC<{ delay?: number; w: number; h: number; children?: React.ReactNode }> = ({
  delay = 0,
  w,
  h,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = appear(frame, fps, delay);
  return (
    <div
      style={{
        opacity: a.opacity * 0.9,
        transform: `scale(${a.scale})`,
        width: w,
        height: h,
        border: `2px solid ${C.line}`,
        borderRadius: RADIUS.card,
        background: C.white,
      }}
    >
      {children}
    </div>
  );
};

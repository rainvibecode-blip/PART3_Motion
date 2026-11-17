// ────────────────────────────────────────────────────────────
//  anim.ts — 공통 모션 헬퍼 (전 씬이 같은 타이밍 규칙 공유)
// ────────────────────────────────────────────────────────────
import { interpolate, spring, Easing } from "remotion";

const EASE = Easing.bezier(0.16, 1, 0.3, 1);

// 카드/요소 등장: scale 0.88→1 + opacity 0→1 (delay 만큼 늦게)
export const appear = (frame: number, fps: number, delay = 0) => {
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 120, mass: 0.7 },
  });
  return {
    opacity: interpolate(s, [0, 1], [0, 1]),
    scale: interpolate(s, [0, 1], [0.88, 1]),
    s,
  };
};

// 아래에서 떠오르며 페이드인 (캡션·라벨)
export const riseIn = (frame: number, fps: number, delay = 0, rise = 18) => {
  const p = interpolate(frame - delay, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return { opacity: p, y: interpolate(p, [0, 1], [rise, 0]) };
};

// 통통 튀는 pop (아이콘·배지·체크)
export const pop = (frame: number, fps: number, delay = 0) =>
  spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 220, mass: 0.6 },
  });

// 선/경로 그려지기 진행도 0→1
export const draw = (frame: number, delay = 0, dur = 24) =>
  interpolate(frame - delay, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

// 0→1 단순 페이드
export const fadeIn = (frame: number, delay = 0, dur = 16) =>
  interpolate(frame - delay, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// 부드러운 상하 부유 모션 (살짝 살아있는 느낌)
export const float = (frame: number, amp = 6, period = 90, phase = 0) =>
  Math.sin(((frame + phase) / period) * Math.PI * 2) * amp;

export { EASE };

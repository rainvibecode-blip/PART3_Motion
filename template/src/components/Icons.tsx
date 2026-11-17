// ────────────────────────────────────────────────────────────
//  Icons.tsx — 공용 플랫 SVG 아이콘 세트 (모노크롬).
//  · 윤곽선은 "화면에서" 얇게: SW(size)가 아이콘을 키워도 실제 선 굵기(≈4.4px)를 유지한다.
//    (뷰박스 고정 strokeWidth를 쓰면 큰 아이콘일수록 선이 두꺼워져 촌스러워진다)
//  · 컬러(hue) 금지 — 흑/백/회색만.
// ────────────────────────────────────────────────────────────
import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
const draw=(frame:number,delay=0,dur=24)=>interpolate(frame-delay,[0,dur],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp",easing:Easing.bezier(.16,1,.3,1)});

type IconProps = { size?: number; color?: string; soft?: string };

// 화면 기준 선 굵기를 일정하게: rendered px = SW * (size/viewBox) ≈ 4.4px.
// k로 강조(1.3)·헤어라인(0.7) 조절. 작은 아이콘에선 3을 넘지 않게 clamp.
const SW = (size: number, k = 1, viewBox = 100) => Math.min(3 * k, (4.4 * k * viewBox) / size);

const base = (size: number) => ({
  width: size,
  height: size,
  display: "block" as const,
});

// ── 기본 세트 ──────────────────────────────────────────────

// 화면 / 결과물 = 모니터
export const ScreenIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <rect x="10" y="14" width="80" height="56" rx="10" fill={soft} stroke={color} strokeWidth={sw} />
      <rect x="18" y="22" width="64" height="40" rx="4" fill="#FFFFFF" stroke={color} strokeWidth={SW(size, 0.7)} opacity="0.9" />
      <rect x="26" y="32" width="28" height="5" rx="2.5" fill={color} />
      <rect x="26" y="43" width="44" height="5" rx="2.5" fill={color} opacity="0.45" />
      <rect x="26" y="54" width="34" height="4" rx="2" fill={color} opacity="0.25" />
      <path d="M50 70 V82" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <path d="M32 88 H68" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
};

// 위치 핀 (오시는 길)
export const PinIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path
        d="M50 12 C33 12 20 25 20 42 C20 65 50 90 50 90 C50 90 80 65 80 42 C80 25 67 12 50 12 Z"
        fill={soft}
        stroke={color}
        strokeWidth={sw}
      />
      <circle cx="50" cy="42" r="12" fill={color} />
    </svg>
  );
};

// 사용자(사람)
export const PersonIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 110" style={{ ...base(size), height: size * 1.1 }} fill="none">
      {/* 목·어깨·몸통이 한 획: 머리 원이 목 위에 얹혀 하나의 형태로 움직인다 */}
      <path d="M16 104 V96 C16 76 28 62 42 58 V48 H58 V58 C72 62 84 76 84 96 V104 Z" fill={soft} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M42 58 L50 72 L58 58" stroke={color} strokeWidth={SW(size, 0.8)} strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <circle cx="50" cy="28" r="18" fill={soft} stroke={color} strokeWidth={sw} />
    </svg>
  );
};

// AI 비서(봇) = 클로드
export const BotIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 110" style={{ ...base(size), height: size * 1.1 }} fill="none">
      <line x1="50" y1="8" x2="50" y2="20" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <circle cx="50" cy="8" r="4.5" fill={color} />
      <rect x="14" y="20" width="72" height="56" rx="14" fill={soft} stroke={color} strokeWidth={sw} />
      <rect x="28" y="36" width="14" height="10" rx="4" fill={color} />
      <rect x="58" y="36" width="14" height="10" rx="4" fill={color} />
      <path d="M36 58 Q50 68 64 58" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
      <rect x="8" y="36" width="7" height="20" rx="3.5" fill={color} opacity="0.55" />
      <rect x="85" y="36" width="7" height="20" rx="3.5" fill={color} opacity="0.55" />
      <path d="M30 76 L24 100 M70 76 L76 100" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <path d="M24 100 H76" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
};

// 통과 = 원형 체크(검정 채움)
export const CheckIcon: React.FC<IconProps> = ({ size = 110, color = "#141414" }) => {
  const sw = SW(size, 1.4);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <circle cx="50" cy="50" r="38" fill={color} />
      <path d="M28 50 L44 66 L72 34" stroke="#FFFFFF" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// 금지 / 실패 = 원형 X(검정 채움)
export const CrossIcon: React.FC<IconProps> = ({ size = 110, color = "#141414" }) => {
  const sw = SW(size, 1.4);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <circle cx="50" cy="50" r="38" fill={color} />
      <path d="M34 34 L66 66 M66 34 L34 66" stroke="#FFFFFF" strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
};

// 물음표 = 결과를 모른다
export const QuestionIcon: React.FC<IconProps> = ({ size = 110, color = "#141414" }) => {
  const sw = SW(size, 1.4);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <circle cx="50" cy="50" r="38" fill={color} />
      <path
        d="M38 40 A12 12 0 1 1 50 56 V62"
        stroke="#FFFFFF"
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="50" cy="72" r="3.5" fill="#FFFFFF" />
    </svg>
  );
};

// 시간 = 시계
export const ClockIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <circle cx="50" cy="50" r="38" fill={soft} stroke={color} strokeWidth={sw} />
      <path d="M50 18 V23 M82 50 H77 M50 82 V77 M18 50 H23" stroke={color} strokeWidth={sw} strokeLinecap="round" opacity="0.5" />
      <path d="M50 30 V50 L63 60" stroke={color} strokeWidth={SW(size, 1.2)} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="50" cy="50" r="3.5" fill={color} />
    </svg>
  );
};

// 화살표(흐름) — delay 이후 선이 "그려지며" 연결되고, 끝에서 화살촉이 톡 등장.
export const Arrow: React.FC<{
  length?: number;
  color?: string;
  thickness?: number;
  dir?: "right" | "left";
  delay?: number;
}> = ({ length = 120, color = "#141414", thickness = 4, dir = "right", delay = 0 }) => {
  const frame = useCurrentFrame();
  const p = draw(frame, delay, 16); // 선 진행도 0→1
  const head = interpolate(frame - delay, [16, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const x1 = dir === "right" ? 4 : length - 4;
  const x2 = dir === "right" ? length - 14 : 14;
  const lineLen = Math.abs(x2 - x1);

  return (
    <svg width={length} height="32" viewBox={`0 0 ${length} 32`} fill="none" style={{ display: "block" }}>
      <line
        x1={x1}
        y1="16"
        x2={x2}
        y2="16"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeDasharray={lineLen}
        strokeDashoffset={lineLen * (1 - p)}
      />
      <path
        d={dir === "right" ? `M${length - 24} 4 L${length - 4} 16 L${length - 24} 28` : `M24 4 L4 16 L24 28`}
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={head}
        style={{ transformBox: "fill-box", transformOrigin: "center", transform: `scale(${0.6 + head * 0.4})` }}
      />
    </svg>
  );
};

// ── 이번 영상용 아이콘 (재사용 가치 있으면 _template로 승격) ──

// 미용실 = 가위
export const ScissorsIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path d="M30 72 L72 12" stroke={color} strokeWidth={SW(size, 1.3)} strokeLinecap="round" />
      <path d="M70 72 L28 12" stroke={color} strokeWidth={SW(size, 1.3)} strokeLinecap="round" />
      <circle cx="26" cy="82" r="12" fill={soft} stroke={color} strokeWidth={sw} />
      <circle cx="74" cy="82" r="12" fill={soft} stroke={color} strokeWidth={sw} />
      <circle cx="50" cy="56" r="4.5" fill={color} />
    </svg>
  );
};

// 애매한 요청 = 말풍선(…)
export const SpeechIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path d="M22 16 H78 A14 14 0 0 1 92 30 V60 A14 14 0 0 1 78 74 H46 L28 90 V74 H22 A14 14 0 0 1 8 60 V30 A14 14 0 0 1 22 16 Z" fill={soft} stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <circle cx="34" cy="45" r="4.5" fill={color} />
      <circle cx="50" cy="45" r="4.5" fill={color} />
      <circle cx="66" cy="45" r="4.5" fill={color} />
    </svg>
  );
};

// 참고 이미지 한 장
export const PhotoIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <rect x="10" y="20" width="80" height="60" rx="8" fill={soft} stroke={color} strokeWidth={sw} />
      <circle cx="32" cy="40" r="7" fill={color} />
      <path d="M14 76 L40 48 L54 63 L68 51 L86 70 V76 Z" fill={color} />
    </svg>
  );
};

// 참고 이미지 세 장 (겹친 스택)
export const PhotoStackIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <g transform="rotate(-9 50 54)">
        <rect x="14" y="24" width="64" height="50" rx="7" fill="#FFFFFF" stroke={color} strokeWidth={sw} />
      </g>
      <g transform="rotate(7 50 54)">
        <rect x="22" y="22" width="64" height="50" rx="7" fill="#FFFFFF" stroke={color} strokeWidth={sw} />
      </g>
      <rect x="18" y="34" width="64" height="50" rx="7" fill={soft} stroke={color} strokeWidth={sw} />
      <circle cx="34" cy="50" r="5.5" fill={color} />
      <path d="M21 81 L41 61 L52 72 L62 63 L79 78 V81 Z" fill={color} />
    </svg>
  );
};

// 핀터레스트 보드 = 검색 바 + 타일 그리드(고른 3장은 검정 채움)
export const BoardIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <rect x="8" y="8" width="84" height="16" rx="8" fill="#FFFFFF" stroke={color} strokeWidth={sw} />
      <circle cx="21" cy="16" r="5" fill="none" stroke={color} strokeWidth={sw} />
      <path d="M25 20 L30 25" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <path d="M40 16 H72" stroke={color} strokeWidth={sw} strokeLinecap="round" opacity="0.35" />
      <rect x="8" y="32" width="24" height="26" rx="5" fill={color} />
      <rect x="38" y="32" width="24" height="34" rx="5" fill={soft} stroke={color} strokeWidth={sw} />
      <rect x="68" y="32" width="24" height="22" rx="5" fill={color} />
      <rect x="8" y="64" width="24" height="28" rx="5" fill={soft} stroke={color} strokeWidth={sw} />
      <rect x="38" y="72" width="24" height="20" rx="5" fill={color} />
      <rect x="68" y="60" width="24" height="32" rx="5" fill={soft} stroke={color} strokeWidth={sw} />
    </svg>
  );
};

// 거의 그대로 베낌 = 똑같은 두 장
export const CopyIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <rect x="10" y="16" width="56" height="44" rx="7" fill="#FFFFFF" stroke={color} strokeWidth={sw} />
      <circle cx="26" cy="30" r="4.5" fill={color} opacity="0.55" />
      <path d="M13 57 L30 40 L40 49 L48 42 L63 55 V57 Z" fill={color} opacity="0.55" />
      <rect x="34" y="40" width="56" height="44" rx="7" fill={soft} stroke={color} strokeWidth={sw} />
      <circle cx="50" cy="54" r="4.5" fill={color} />
      <path d="M37 81 L54 64 L64 73 L72 66 L87 79 V81 Z" fill={color} />
    </svg>
  );
};

// 공통점 = 세 원의 교집합(벤 다이어그램)
export const VennIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <circle cx="36" cy="40" r="26" fill={soft} stroke={color} strokeWidth={sw} />
      <circle cx="64" cy="40" r="26" fill={soft} stroke={color} strokeWidth={sw} />
      <circle cx="50" cy="64" r="26" fill={soft} stroke={color} strokeWidth={sw} />
      <circle cx="36" cy="40" r="26" fill="none" stroke={color} strokeWidth={sw} />
      <circle cx="64" cy="40" r="26" fill="none" stroke={color} strokeWidth={sw} />
      <circle cx="50" cy="64" r="26" fill="none" stroke={color} strokeWidth={sw} />
      <circle cx="50" cy="48" r="11" fill={color} />
    </svg>
  );
};

// 취향을 읽는다 = 눈
export const EyeIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path d="M8 50 C24 26 76 26 92 50 C76 74 24 74 8 50 Z" fill={soft} stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <circle cx="50" cy="50" r="17" fill="#FFFFFF" stroke={color} strokeWidth={sw} />
      <circle cx="50" cy="50" r="9" fill={color} />
    </svg>
  );
};

// 갈아엎기 = 되돌리기 순환 화살표 (오른쪽에서 시계방향 3/4바퀴 → 위에서 화살촉)
export const RedoIcon: React.FC<IconProps> = ({ size = 110, color = "#141414" }) => {
  const sw = SW(size, 1.3);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      {/* 두 개의 반원 화살표가 서로를 물고 도는 순환 */}
      <path d="M23.5 36 A30 30 0 0 1 76.5 36" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
      <path d="M78 24 L76.5 36 L66 30.5" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M76.5 64 A30 30 0 0 1 23.5 64" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
      <path d="M22 76 L23.5 64 L34 69.5" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
};

// 값 비교 = 저울 (왼쪽이 가볍다 = 올라간다)
export const ScaleIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path d="M50 24 V76" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <path d="M34 88 H66" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <path d="M50 76 L36 88 M50 76 L64 88" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <circle cx="50" cy="22" r="4" fill={color} />
      <g transform="rotate(9 50 30)">
        <path d="M14 30 H86" stroke={color} strokeWidth={sw} strokeLinecap="round" />
        <path d="M14 30 V42 M86 30 V42" stroke={color} strokeWidth={SW(size, 0.7)} strokeLinecap="round" opacity="0.5" />
        <path d="M2 42 H26 L20 56 H8 Z" fill={soft} stroke={color} strokeWidth={sw} strokeLinejoin="round" />
        <path d="M74 42 H98 L92 56 H80 Z" fill={color} />
      </g>
    </svg>
  );
};

// 분위기 = 명도 스와치 3단 (컬러 대신 톤)
export const ToneIcon: React.FC<IconProps> = ({ size = 110, color = "#141414" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <rect x="8" y="26" width="24" height="48" rx="7" fill="#FFFFFF" stroke={color} strokeWidth={sw} />
      <rect x="38" y="26" width="24" height="48" rx="7" fill="#E2E2E2" stroke={color} strokeWidth={sw} />
      <rect x="68" y="26" width="24" height="48" rx="7" fill={color} />
      <path d="M8 88 H92" stroke={color} strokeWidth={sw} strokeLinecap="round" opacity="0.3" />
    </svg>
  );
};

// 남의 자산(로고·문구·사진) — 그대로 복제 금지 대상
export const BrandMarkIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <rect x="20" y="10" width="60" height="60" rx="16" fill={soft} stroke={color} strokeWidth={sw} />
      <path d="M36 54 L50 26 L64 54 Z" fill={color} />
      <rect x="26" y="80" width="48" height="7" rx="3.5" fill={color} />
      <rect x="36" y="92" width="28" height="6" rx="3" fill={color} opacity="0.4" />
    </svg>
  );
};

// 클로드 데스크탑 앱 창 — 왼쪽 사이드바의 active 항목(Code)이 검정 하이라이트
export const AppWindowIcon: React.FC<IconProps & { active?: number }> = ({
  size = 110,
  color = "#141414",
  soft = "#F2F2F2",
  active = 1,
}) => {
  const sw = SW(size, 1, 120);
  return (
    <svg viewBox="0 0 120 84" style={{ width: size, height: size * 0.7, display: "block" }} fill="none">
      <rect x="2" y="2" width="116" height="80" rx="10" fill="#FFFFFF" stroke={color} strokeWidth={sw} />
      <path d="M38 2 V82" stroke={color} strokeWidth={sw} />
      <path d="M2 12 H118" stroke={color} strokeWidth={sw} opacity="0.35" />
      <circle cx="10" cy="7" r="2.5" fill={color} opacity="0.35" />
      <circle cx="18" cy="7" r="2.5" fill={color} opacity="0.35" />
      <circle cx="26" cy="7" r="2.5" fill={color} opacity="0.35" />
      {[0, 1, 2, 3].map((i) =>
        i === active ? (
          <rect key={i} x="7" y={20 + i * 14} width="25" height="11" rx="5.5" fill={color} />
        ) : (
          <rect key={i} x="9" y={23 + i * 14} width="21" height="5" rx="2.5" fill={color} opacity="0.3" />
        )
      )}
      <rect x="48" y="24" width="60" height="8" rx="4" fill={soft} stroke={color} strokeWidth={SW(size, 0.7, 120)} />
      <rect x="48" y="40" width="46" height="6" rx="3" fill={color} opacity="0.25" />
      <rect x="48" y="52" width="56" height="6" rx="3" fill={color} opacity="0.25" />
      <rect x="48" y="64" width="34" height="6" rx="3" fill={color} opacity="0.25" />
    </svg>
  );
};

// 터미널 = 검은 화면 + 명령 프롬프트
export const TerminalIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size, 1.3);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <rect x="8" y="16" width="84" height="68" rx="12" fill={color} />
      <path d="M20 16 H80 A12 12 0 0 1 92 28 V34 H8 V28 A12 12 0 0 1 20 16 Z" fill={soft} />
      <circle cx="20" cy="25" r="3.5" fill={color} />
      <circle cx="31" cy="25" r="3.5" fill={color} opacity="0.55" />
      <circle cx="42" cy="25" r="3.5" fill={color} opacity="0.3" />
      <path d="M24 48 L36 58 L24 68" stroke="#FFFFFF" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M44 68 H68" stroke="#FFFFFF" strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
};

// 폴더 (열림 옵션)
export const FolderIcon: React.FC<IconProps & { open?: boolean }> = ({
  size = 110,
  color = "#141414",
  soft = "#F2F2F2",
  open = false,
}) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path d="M8 26 H36 L44 36 H88 V82 H8 Z" fill={soft} stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      {open ? (
        <path d="M20 46 H96 L84 82 H8 Z" fill="#FFFFFF" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      ) : (
        <path d="M8 46 H88" stroke={color} strokeWidth={sw} opacity="0.25" />
      )}
    </svg>
  );
};

// 권한 = 열쇠
export const KeyIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <circle cx="32" cy="50" r="20" fill={soft} stroke={color} strokeWidth={sw} />
      <circle cx="32" cy="50" r="7" fill="#FFFFFF" stroke={color} strokeWidth={sw} />
      <path d="M52 50 H90" stroke={color} strokeWidth={SW(size, 1.15)} strokeLinecap="round" />
      <path d="M78 50 V64 M64 50 V60" stroke={color} strokeWidth={SW(size, 1.15)} strokeLinecap="round" />
    </svg>
  );
};

// 마우스 커서 (클릭 지점 지시)
export const CursorIcon: React.FC<IconProps> = ({ size = 110, color = "#141414" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path
        d="M30 18 L30 76 L44 62 L54 84 L66 78 L56 58 L74 56 Z"
        fill={color}
        stroke="#FFFFFF"
        strokeWidth={sw}
        strokeLinejoin="round"
      />
    </svg>
  );
};

// 메뉴판 (카페 메뉴 소개)
export const MenuListIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <rect x="16" y="8" width="68" height="84" rx="10" fill={soft} stroke={color} strokeWidth={sw} />
      <path d="M28 28 H58" stroke={color} strokeWidth={SW(size, 1.4)} strokeLinecap="round" />
      <path d="M28 44 H72 M28 58 H72 M28 72 H62" stroke={color} strokeWidth={sw} strokeLinecap="round" opacity="0.55" />
      <circle cx="68" cy="24" r="6" fill={color} />
    </svg>
  );
};

// 카페 = 잔 (내카페 폴더 주제)
export const CupIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path d="M18 38 H70 V60 A26 26 0 0 1 18 60 Z" fill={soft} stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M70 44 H80 A11 11 0 0 1 80 66 H70" stroke={color} strokeWidth={sw} fill="none" />
      <path d="M14 88 H82" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <path d="M36 28 C42 22 30 16 36 8 M54 28 C60 22 48 16 54 8" stroke={color} strokeWidth={sw} strokeLinecap="round" opacity="0.5" />
    </svg>
  );
};

// 원페이지 구성 = 세 구역으로 나뉜 페이지 (active로 강조)
export const WireframeIcon: React.FC<IconProps & { active?: number }> = ({
  size = 110,
  color = "#141414",
  soft = "#F2F2F2",
  active = -1,
}) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <rect x="10" y="6" width="80" height="88" rx="10" fill="#FFFFFF" stroke={color} strokeWidth={sw} />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x="18"
          y={14 + i * 28}
          width="64"
          height="22"
          rx="6"
          fill={active === i ? color : soft}
          stroke={color}
          strokeWidth={SW(size, 0.75)}
        />
      ))}
    </svg>
  );
};

// ── 레거시(식당 비유 계열) — 예전 영상 씬이 참조한다. 필요 없으면 지워도 된다. ──

// 주방 = 양쪽 손잡이 냄비 + 김 (좌우 대칭이라 큰 크기에서도 안정적)
export const KitchenIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path d="M38 32 C44 26 32 20 38 10 M62 32 C68 26 56 20 62 10" stroke={color} strokeWidth={sw} strokeLinecap="round" opacity="0.5" />
      <path d="M8 52 H22 M78 52 H92" stroke={color} strokeWidth={SW(size, 1.15)} strokeLinecap="round" />
      <path d="M18 44 H82 V62 A18 18 0 0 1 64 80 H36 A18 18 0 0 1 18 62 Z" fill={soft} stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M14 40 H86" stroke={color} strokeWidth={SW(size, 1.4)} strokeLinecap="round" />
    </svg>
  );
};

// 창고 / 데이터베이스 = 원통(DB)
export const DatabaseIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path d="M20 24 V52 C20 59 33 64 50 64 C67 64 80 59 80 52 V24" fill={soft} stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M20 52 V76 C20 83 33 88 50 88 C67 88 80 83 80 76 V52" fill={soft} stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <ellipse cx="50" cy="24" rx="30" ry="12" fill={soft} stroke={color} strokeWidth={sw} />
      <ellipse cx="50" cy="52" rx="30" ry="12" fill="none" stroke={color} strokeWidth={sw} />
      <circle cx="68" cy="47" r="2.8" fill={color} />
      <circle cx="68" cy="73" r="2.8" fill={color} />
    </svg>
  );
};

// 파일 보관함 = 사진/박스 (S3)
export const FileStoreIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <rect x="16" y="24" width="68" height="52" rx="8" fill={soft} stroke={color} strokeWidth={sw} />
      <circle cx="36" cy="42" r="7" fill={color} />
      <path d="M22 70 L44 48 L58 62 L70 52 L78 60 V70 Z" fill={color} />
    </svg>
  );
};

// 주문서 / API = 영수증 티켓
export const TicketIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path
        d="M26 14 H74 V86 L66 80 L58 86 L50 80 L42 86 L34 80 L26 86 Z"
        fill={soft}
        stroke={color}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <path d="M38 34 H62 M38 48 H62 M38 62 H54" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
};

// 배포 / 주소 = 지구본
export const GlobeIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <circle cx="50" cy="50" r="34" fill={soft} stroke={color} strokeWidth={sw} />
      <ellipse cx="50" cy="50" rx="14" ry="34" fill="none" stroke={color} strokeWidth={sw} />
      <path d="M50 16 V84" stroke={color} strokeWidth={SW(size, 0.7)} strokeLinecap="round" opacity="0.35" />
      <path d="M19 38 Q50 47 81 38 M19 62 Q50 53 81 62" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
    </svg>
  );
};

// 식당 간판 건물
export const StoreIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path d="M18 36 L24 18 H76 L82 36 Z" fill={color} />
      <path d="M18 36 H82 V84 H18 Z" fill={soft} stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <rect x="40" y="56" width="20" height="28" rx="3" fill={color} />
      <rect x="26" y="48" width="14" height="14" rx="2" fill={color} opacity="0.6" />
      <rect x="60" y="48" width="14" height="14" rx="2" fill={color} opacity="0.6" />
    </svg>
  );
};

// 하네스 = 놀이기구 안전바
export const SafetyBarIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <rect x="10" y="20" width="18" height="70" rx="7" fill={soft} stroke={color} strokeWidth={sw} />
      <rect x="72" y="20" width="18" height="70" rx="7" fill={soft} stroke={color} strokeWidth={sw} />
      <rect x="12" y="42" width="76" height="24" rx="12" fill={color} />
      <path d="M34 42 L22 66 M52 42 L40 66 M70 42 L58 66 M88 42 L76 66" stroke="#FFFFFF" strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
};

// 업무 매뉴얼 / 지침 문서 = 체크 붙은 클립보드 문서
export const DocumentIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size, 1, 120);
  return (
    <svg viewBox="0 0 100 120" style={{ ...base(size), height: size * 1.2 }} fill="none">
      <path d="M18 12 H60 L82 34 V104 A8 8 0 0 1 74 112 H26 A8 8 0 0 1 18 104 Z" fill={soft} stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M60 12 V34 H82" fill="#FFFFFF" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M32 54 H68 M32 68 H68 M32 82 H56" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <rect x="32" y="92" width="12" height="4" rx="2" fill={color} opacity="0.45" />
    </svg>
  );
};

// 비용 = 원형 동전에 원화(₩) 마크
export const CoinIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <circle cx="50" cy="50" r="36" fill={soft} stroke={color} strokeWidth={sw} />
      <circle cx="50" cy="50" r="27" fill="none" stroke={color} strokeWidth={SW(size, 0.5)} opacity="0.5" />
      <path d="M34 38 L42 62 L50 44 L58 62 L66 38" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M32 48 H68 M32 56 H68" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
};

// ── 로컬/배포(식당 비유) 계열 아이콘 ──

// 우리 집 = 지붕 + 문
export const HouseIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path d="M10 48 L50 16 L90 48" stroke={color} strokeWidth={SW(size, 1.15)} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M20 46 H80 V86 H20 Z" fill={soft} stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <rect x="42" y="60" width="16" height="26" rx="3" fill={color} />
      <rect x="28" y="56" width="12" height="12" rx="2" fill={color} opacity="0.45" />
    </svg>
  );
};

// 가게 문 — open이면 문짝이 바깥으로 열려 어두운 실내가 보인다(= 들어갈 수 있다)
export const DoorIcon: React.FC<IconProps & { open?: boolean }> = ({
  size = 110,
  color = "#141414",
  soft = "#F2F2F2",
  open = false,
}) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path d="M14 90 H86" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      {open ? (
        <>
          <rect x="22" y="10" width="42" height="80" rx="4" fill={color} />
          <rect x="18" y="6" width="50" height="84" rx="8" fill="none" stroke={color} strokeWidth={sw} />
          <path d="M64 14 L88 24 V80 L64 90 Z" fill="#FFFFFF" stroke={color} strokeWidth={sw} strokeLinejoin="round" />
          <circle cx="70" cy="52" r="3.5" fill={color} />
        </>
      ) : (
        <>
          <rect x="24" y="8" width="52" height="82" rx="8" fill={soft} stroke={color} strokeWidth={sw} />
          <circle cx="64" cy="50" r="4" fill={color} />
          <path d="M36 26 H62" stroke={color} strokeWidth={sw} strokeLinecap="round" opacity="0.3" />
        </>
      )}
    </svg>
  );
};

// 잠김 = 자물쇠
export const LockIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path d="M32 46 V32 A18 18 0 0 1 68 32 V46" stroke={color} strokeWidth={SW(size, 1.15)} strokeLinecap="round" fill="none" />
      <rect x="20" y="46" width="60" height="40" rx="10" fill={soft} stroke={color} strokeWidth={sw} />
      <circle cx="50" cy="62" r="5" fill={color} />
      <path d="M50 66 V74" stroke={color} strokeWidth={SW(size, 1.15)} strokeLinecap="round" />
    </svg>
  );
};

// 링크 공유 = 사슬 두 고리
export const LinkIcon: React.FC<IconProps> = ({ size = 110, color = "#141414" }) => {
  const sw = SW(size, 1.15);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <g transform="rotate(-45 50 50)">
        <path d="M46 30 H32 A20 20 0 0 0 32 70 H46" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
        <path d="M54 30 H68 A20 20 0 0 1 68 70 H54" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
        <path d="M34 50 H66" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      </g>
    </svg>
  );
};

// 간판 = 기둥에 올린 판 (배포 = 간판 달기)
export const SignIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <rect x="8" y="14" width="84" height="46" rx="10" fill={soft} stroke={color} strokeWidth={sw} />
      <path d="M24 30 H60" stroke={color} strokeWidth={SW(size, 1.4)} strokeLinecap="round" />
      <path d="M24 44 H76" stroke={color} strokeWidth={sw} strokeLinecap="round" opacity="0.5" />
      <path d="M30 60 V86 M70 60 V86" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <path d="M18 88 H82" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
};

// 전원 = 껐다 켰다 (내 컴퓨터를 끄면…)
export const PowerIcon: React.FC<IconProps> = ({ size = 110, color = "#141414" }) => {
  const sw = SW(size, 1.3);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path d="M50 14 V46" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <path d="M30 28 A28 28 0 1 0 70 28" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
    </svg>
  );
};

// 서버 = 늘 켜져 있는 랙 (내 컴퓨터 대신 불을 켜두는 쪽)
export const ServerIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      {[14, 42, 70].map((y) => (
        <g key={y}>
          <rect x="16" y={y} width="68" height="22" rx="6" fill={soft} stroke={color} strokeWidth={sw} />
          <circle cx="28" cy={y + 11} r="3.5" fill={color} />
          <circle cx="38" cy={y + 11} r="3.5" fill={color} opacity="0.35" />
          <path d={`M52 ${y + 11} H72`} stroke={color} strokeWidth={sw} strokeLinecap="round" opacity="0.35" />
        </g>
      ))}
    </svg>
  );
};

// 내 컴퓨터 = 노트북 (off면 화면이 꺼진 상태, blank면 화면을 비워 다른 아이콘을 얹을 수 있다)
export const LaptopIcon: React.FC<IconProps & { off?: boolean; blank?: boolean }> = ({
  size = 110,
  color = "#141414",
  soft = "#F2F2F2",
  off = false,
  blank = false,
}) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <rect x="14" y="12" width="72" height="52" rx="7" fill={soft} stroke={color} strokeWidth={sw} />
      <rect x="21" y="19" width="58" height="38" rx="3" fill={off ? color : "#FFFFFF"} stroke={color} strokeWidth={SW(size, 0.7)} opacity={off ? 1 : 0.9} />
      {!off && !blank && (
        <>
          <rect x="29" y="28" width="24" height="5" rx="2.5" fill={color} />
          <rect x="29" y="38" width="38" height="5" rx="2.5" fill={color} opacity="0.45" />
          <rect x="29" y="48" width="28" height="4" rx="2" fill={color} opacity="0.25" />
        </>
      )}
      <rect x="4" y="66" width="92" height="12" rx="6" fill={soft} stroke={color} strokeWidth={sw} />
      <rect x="40" y="68" width="20" height="4" rx="2" fill={color} opacity="0.4" />
    </svg>
  );
};

// 주소 표시줄 (localhost냐 진짜 도메인이냐를 보여주는 칩) — dark면 검정 알약
export const AddressBarIcon: React.FC<IconProps & { dark?: boolean }> = ({
  size = 110,
  color = "#141414",
  dark = false,
}) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 44" style={{ width: size, height: size * 0.44, display: "block" }} fill="none">
      <rect x="2" y="6" width="96" height="32" rx="16" fill={dark ? color : "#FFFFFF"} stroke={color} strokeWidth={SW(size, 1, 100)} />
      <circle cx="18" cy="22" r="6" fill="none" stroke={dark ? "#FFFFFF" : color} strokeWidth={sw} />
      <path d="M32 22 H82" stroke={dark ? "#FFFFFF" : color} strokeWidth={SW(size, 1.4, 100)} strokeLinecap="round" opacity="0.85" />
    </svg>
  );
};

// ── 성장·한도·하드웨어 계열 ──

// 증가 / 성장 = 우상향 꺾은선 차트
export const ChartUpIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <rect x="12" y="14" width="76" height="72" rx="10" fill={soft} stroke={color} strokeWidth={sw} />
      <path
        d="M24 70 L44 50 L58 62 L78 32"
        stroke={color}
        strokeWidth={SW(size, 1.3)}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M64 32 H78 V46"
        stroke={color}
        strokeWidth={SW(size, 1.3)}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

// 한도 / 제한 = 반원 게이지 + 바늘 + 상한 눈금
export const GaugeIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path d="M14 72 A36 36 0 0 1 86 72 Z" fill={soft} stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M50 72 L68 50" stroke={color} strokeWidth={SW(size, 1.3)} strokeLinecap="round" />
      <circle cx="50" cy="72" r="6" fill={color} />
      <path d="M76 62 L88 57" stroke={color} strokeWidth={SW(size, 1.3)} strokeLinecap="round" />
      <path d="M22 56 L28 54 M48 36 V44" stroke={color} strokeWidth={SW(size, 0.7)} strokeLinecap="round" opacity="0.45" />
    </svg>
  );
};

// CPU / 램 = 칩 (컴퓨팅 성능)
export const ChipIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <rect x="24" y="24" width="52" height="52" rx="8" fill={soft} stroke={color} strokeWidth={sw} />
      <rect x="38" y="38" width="24" height="24" rx="5" fill={color} />
      {[36, 50, 64].map((p) => (
        <g key={p}>
          <path d={`M${p} 24 V12`} stroke={color} strokeWidth={sw} strokeLinecap="round" />
          <path d={`M${p} 76 V88`} stroke={color} strokeWidth={sw} strokeLinecap="round" />
          <path d={`M24 ${p} H12`} stroke={color} strokeWidth={sw} strokeLinecap="round" />
          <path d={`M76 ${p} H88`} stroke={color} strokeWidth={sw} strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
};

// 미니 PC(맥 미니) = 납작한 본체 상자 (노트북이 닫혀 있어도 도는 쪽)
export const MiniPcIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <rect x="12" y="34" width="76" height="36" rx="12" fill={soft} stroke={color} strokeWidth={sw} />
      <circle cx="28" cy="52" r="4.5" fill={color} />
      <path d="M42 52 H74" stroke={color} strokeWidth={sw} strokeLinecap="round" opacity="0.35" />
      <path d="M26 78 H74" stroke={color} strokeWidth={SW(size, 0.7)} strokeLinecap="round" opacity="0.3" />
    </svg>
  );
};

// ── 깃 · 버전관리 세트 ──────────────────

// 브랜치 = 줄기에서 가지가 뻗어 나감 (git branch 그래프)
export const BranchIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path d="M30 20 L30 80" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <path d="M30 48 C30 34 46 34 58 34 C66 34 70 30 70 24" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <circle cx="30" cy="20" r="9" fill={soft} stroke={color} strokeWidth={sw} />
      <circle cx="30" cy="80" r="9" fill={soft} stroke={color} strokeWidth={sw} />
      <circle cx="70" cy="20" r="9" fill={color} />
    </svg>
  );
};

// 머지 = 갈라진 가지가 원본으로 다시 합쳐짐
export const MergeIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path d="M30 20 L30 80" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <path d="M70 28 C70 44 54 48 42 52 C34 55 30 60 30 68" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <circle cx="30" cy="20" r="9" fill={soft} stroke={color} strokeWidth={sw} />
      <circle cx="70" cy="20" r="9" fill={soft} stroke={color} strokeWidth={sw} />
      <circle cx="30" cy="80" r="9" fill={color} />
    </svg>
  );
};

// 커밋 = 도장 찍기 (지금 상태에 이름 붙여 확정)
export const StampIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <rect x="40" y="14" width="20" height="16" rx="6" fill={color} />
      <path d="M36 32 L64 32 L70 54 L30 54 Z" fill={soft} stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <rect x="22" y="54" width="56" height="12" rx="6" fill={color} />
      <rect x="16" y="78" width="68" height="8" rx="4" fill={color} opacity="0.35" />
    </svg>
  );
};

// 봉투 = 서류를 담아 봉인하는 단위 (스테이징~커밋 비유)
export const EnvelopeIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <rect x="10" y="24" width="80" height="54" rx="10" fill={soft} stroke={color} strokeWidth={sw} />
      <path d="M13 30 L50 58 L87 30" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M13 74 L38 52 M87 74 L62 52" stroke={color} strokeWidth={SW(size, 0.7)} strokeLinecap="round" opacity="0.35" />
    </svg>
  );
};

// 캐비닛 = 회사 공용 보관함 (= 깃허브)
export const CabinetIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <rect x="18" y="14" width="64" height="72" rx="8" fill={soft} stroke={color} strokeWidth={sw} />
      <path d="M18 38 L82 38 M18 62 L82 62" stroke={color} strokeWidth={sw} />
      <rect x="42" y="24" width="16" height="5" rx="2.5" fill={color} />
      <rect x="42" y="48" width="16" height="5" rx="2.5" fill={color} />
      <rect x="42" y="72" width="16" height="5" rx="2.5" fill={color} />
    </svg>
  );
};

// 클라우드 업로드 = 푸시 (내 컴퓨터 → 인터넷)
export const CloudUpIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path
        d="M30 66 C20 66 14 59 14 51 C14 43 21 36 29 36 C32 25 42 18 53 18 C66 18 76 28 77 40 C85 41 90 48 90 55 C90 61 85 66 78 66 Z"
        fill={soft}
        stroke={color}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <path d="M50 88 L50 56 M38 68 L50 56 L62 68" stroke={color} strokeWidth={sw * 1.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// 가방 = 짐 싸기 (.gitignore 비유: 애초에 안 넣는다)
export const BagIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path d="M38 30 L38 22 C38 18 41 16 44 16 L56 16 C59 16 62 18 62 22 L62 30" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
      <rect x="14" y="30" width="72" height="54" rx="10" fill={soft} stroke={color} strokeWidth={sw} />
      <rect x="44" y="46" width="12" height="22" rx="6" fill={color} />
    </svg>
  );
};

// 문서 더미 = 최종·진짜최종·이게진짜최종 (손으로 한 버전관리)
export const DocStackIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <rect x="16" y="14" width="50" height="62" rx="8" fill={soft} stroke={color} strokeWidth={sw} />
      <rect x="26" y="22" width="50" height="62" rx="8" fill={soft} stroke={color} strokeWidth={sw} />
      <rect x="36" y="30" width="48" height="60" rx="8" fill="#FFFFFF" stroke={color} strokeWidth={sw} />
      <path d="M46 46 L74 46 M46 58 L74 58 M46 70 L64 70" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
};

// 방패 = 보안 리스크 차단
export const ShieldIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path d="M50 12 L82 24 L82 50 C82 70 66 84 50 90 C34 84 18 70 18 50 L18 24 Z" fill={soft} stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M36 50 L46 60 L66 40" stroke={color} strokeWidth={sw * 1.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
};

// 금지 = 아예 못 나가게 막는다
export const BanIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <circle cx="50" cy="50" r="34" fill={soft} stroke={color} strokeWidth={sw * 1.4} />
      <path d="M28 72 L72 28" stroke={color} strokeWidth={sw * 1.4} strokeLinecap="round" />
    </svg>
  );
};

// USB 허브 = 본체 + 포트 4개 + 아래로 나가는 케이블 (연결 표준 하나로 전부 꽂는다)
export const UsbHubIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <rect x="10" y="34" width="80" height="30" rx="10" fill={soft} stroke={color} strokeWidth={sw} />
      {[24, 41, 58, 75].map((x) => (
        <rect key={x} x={x - 6} y="44" width="13" height="10" rx="2" fill={color} />
      ))}
      <path d="M50 64 V82" stroke={color} strokeWidth={SW(size, 1.15)} strokeLinecap="round" />
      <rect x="41" y="82" width="18" height="11" rx="3.5" fill={color} />
      <path d="M22 26 V18 M78 26 V18" stroke={color} strokeWidth={SW(size, 0.7)} strokeLinecap="round" opacity="0.4" />
    </svg>
  );
};

// 커밋 로그 = 시간순으로 쌓인 세이브 포인트 (한 줄 = 한 커밋)
export const CommitLogIcon: React.FC<IconProps> = ({ size = 110, color = "#141414", soft = "#F2F2F2" }) => {
  const sw = SW(size);
  return (
    <svg viewBox="0 0 100 100" style={base(size)} fill="none">
      <path d="M26 16 L26 84" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      {[24, 44, 64, 84].map((y, i) => (
        <React.Fragment key={y}>
          <circle cx="26" cy={y} r="8" fill={i === 3 ? color : soft} stroke={color} strokeWidth={sw} />
          <rect x="44" y={y - 3} width={i % 2 === 0 ? 40 : 28} height="6" rx="3" fill={color} opacity={0.75 - i * 0.12} />
        </React.Fragment>
      ))}
    </svg>
  );
};

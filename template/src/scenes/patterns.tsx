// ────────────────────────────────────────────────────────────
//  patterns.tsx — 검증된 씬 레이아웃 4종.
//
//  [주의] 이 파일은 "복사해서 쓰는 원본"이다. scenes/index.tsx에 등록하지 않는다.
//     새 씬을 만들 때 아래 네 구도 중 하나를 골라 scenes/S0x_이름.tsx로 복사한 뒤
//     아이콘·라벨·헤더만 바꾼다. 좌표/크기/딜레이는 그대로 두는 게 안전하다.
//
//  좌표계: 브라우저 content 영역 1600 × 848. 헤더는 상단 y≈52~170을 쓴다.
//  아이콘 크기는 하한 기준(콘텐츠 높이 25% ≈ 212px)이며, 흐름/대비 구도처럼
//  요소가 여러 개일 때는 176~216이 균형이 좋다.
// ────────────────────────────────────────────────────────────
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Stage, Header, At, IconLabel, StepBadge, VDivider, Frame } from "../components/primitives";
import { PhotoStackIcon, ScreenIcon, CheckIcon, PhotoIcon, CopyIcon, VennIcon, ToneIcon, Arrow } from "../components/Icons";
import { appear, pop } from "../anim";

// ── P1. 3칸 흐름 (A → B → C) ────────────────────────────────
//  가장 많이 쓰는 기본형. 원인 → 과정 → 결과, 입력 → 처리 → 출력.
//  아이콘 x = 320 / 800 / 1280, 화살표 x = 560 / 1040 (length 176).
//  아이콘 y = 440, 라벨 y = 608. 등장 delay 8 → 26 → 56, 화살표 38 / 56.
export const P1_Flow3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = appear(frame, fps, 8);
  const b = appear(frame, fps, 26);
  const c = pop(frame, fps, 56);

  return (
    <Stage>
      <Header en="FLOW" ko="세 칸 흐름 구도" />

      <At x={320} y={440}>
        <div style={{ opacity: a.opacity, transform: `scale(${a.scale})` }}>
          <PhotoStackIcon size={216} />
        </div>
      </At>
      <At x={320} y={608}>
        <IconLabel delay={18}>입력</IconLabel>
      </At>

      <At x={560} y={440}>
        <Arrow length={176} delay={38} />
      </At>

      <At x={800} y={440}>
        <div style={{ opacity: b.opacity, transform: `scale(${b.scale})` }}>
          <ScreenIcon size={200} />
        </div>
      </At>
      <At x={800} y={608}>
        <IconLabel delay={34}>처리</IconLabel>
      </At>

      <At x={1040} y={440}>
        <Arrow length={176} delay={56} />
      </At>

      <At x={1280} y={440}>
        <div style={{ transform: `scale(${c})` }}>
          <CheckIcon size={184} />
        </div>
      </At>
      <At x={1280} y={608}>
        <IconLabel delay={64}>결과</IconLabel>
      </At>
    </Stage>
  );
};

// ── P2. 좌우 대비 (이건 이렇고 ↔ 저건 저렇다) ────────────────
//  가운데 VDivider(x=800)로 나누고 양쪽에 같은 형태의 미니 흐름을 둔다.
//  왼쪽 x = 264 / 456(화살표) / 648, 오른쪽 x = 952 / 1144(화살표) / 1336.
//  아이콘 y = 456(size 200), 라벨 y = 600. 오른쪽은 왼쪽보다 40프레임쯤 늦게.
export const P2_Compare: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l1 = appear(frame, fps, 8);
  const l2 = appear(frame, fps, 34);
  const r1 = appear(frame, fps, 48);
  const r2 = appear(frame, fps, 74);

  return (
    <Stage>
      <Header en="A vs B" ko="좌우 대비 구도" />

      <At x={264} y={456}>
        <div style={{ opacity: l1.opacity, transform: `scale(${l1.scale})` }}>
          <PhotoIcon size={200} />
        </div>
      </At>
      <At x={264} y={600}>
        <IconLabel delay={18}>한 장</IconLabel>
      </At>
      <At x={456} y={456}>
        <Arrow length={128} delay={28} />
      </At>
      <At x={648} y={456}>
        <div style={{ opacity: l2.opacity, transform: `scale(${l2.scale})` }}>
          <CopyIcon size={200} />
        </div>
      </At>
      <At x={648} y={600}>
        <IconLabel delay={44}>거의 복제</IconLabel>
      </At>

      <At x={800} y={456}>
        <VDivider delay={40} height={392} />
      </At>

      <At x={952} y={456}>
        <div style={{ opacity: r1.opacity, transform: `scale(${r1.scale})` }}>
          <PhotoStackIcon size={208} />
        </div>
      </At>
      <At x={952} y={600}>
        <IconLabel delay={58}>세 장</IconLabel>
      </At>
      <At x={1144} y={456}>
        <Arrow length={128} delay={68} />
      </At>
      <At x={1336} y={456}>
        <div style={{ opacity: r2.opacity, transform: `scale(${r2.scale})` }}>
          <VennIcon size={200} />
        </div>
      </At>
      <At x={1336} y={600}>
        <IconLabel delay={84}>공통점</IconLabel>
      </At>
    </Stage>
  );
};

// ── P3. 단계 3칸 (1 · 2 · 3) ────────────────────────────────
//  나열형 정리 컷. StepBadge y = 312, 아이콘 y = 472(size 184), 라벨 y = 632.
//  x = 400 / 800 / 1200, delay 8 → 28 → 48.
//  "한 덩어리(한 페이지/한 프롬프트)의 구성요소"라면 Frame(w 1216 × h 408, 중심 y 476)으로 묶는다.
export const P3_Steps3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = appear(frame, fps, 12);
  const b = appear(frame, fps, 32);
  const c = appear(frame, fps, 52);
  const items: { x: number; n: number; s: { opacity: number; scale: number }; label: string; Icon: React.FC<{ size?: number }>; badge: number; lab: number }[] = [
    { x: 400, n: 1, s: a, label: "무엇을", Icon: ScreenIcon, badge: 8, lab: 24 },
    { x: 800, n: 2, s: b, label: "어떤 부분", Icon: PhotoStackIcon, badge: 28, lab: 44 },
    { x: 1200, n: 3, s: c, label: "어떤 분위기", Icon: ToneIcon, badge: 48, lab: 64 },
  ];

  return (
    <Stage>
      <Header en="STEPS" ko="단계 세 칸 구도" />
      {items.map(({ x, n, s, label, Icon, badge, lab }) => (
        <React.Fragment key={n}>
          <At x={x} y={312}>
            <StepBadge n={n} delay={badge} />
          </At>
          <At x={x} y={472}>
            <div style={{ opacity: s.opacity, transform: `scale(${s.scale})` }}>
              <Icon size={184} />
            </div>
          </At>
          <At x={x} y={632}>
            <IconLabel delay={lab}>{label}</IconLabel>
          </At>
        </React.Fragment>
      ))}
    </Stage>
  );
};

// ── P4. 히어로 1개 + 주변 키워드 ────────────────────────────
//  핵심 비유를 한 방에 보여주는 리빌 컷. 히어로는 크게(288~400).
//  히어로 x = 456 · y = 440(size 296), 주변 키워드 라벨은 좌 216 / 우 696 (y 312), 아래 y 640.
//  오른쪽에 결론 아이콘을 두면 화살표 x = 856(length 168, delay 64) → 아이콘 x = 1176.
export const P4_Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hero = appear(frame, fps, 8);
  const out = appear(frame, fps, 60);

  return (
    <Stage>
      <Header en="HERO" ko="히어로 + 키워드 구도" />

      <At x={456} y={440}>
        <div style={{ opacity: hero.opacity, transform: `scale(${hero.scale})` }}>
          <VennIcon size={296} />
        </div>
      </At>
      <At x={216} y={312}>
        <IconLabel delay={26} size={24}>
          키워드 A
        </IconLabel>
      </At>
      <At x={696} y={312}>
        <IconLabel delay={32} size={24}>
          키워드 B
        </IconLabel>
      </At>
      <At x={456} y={640}>
        <IconLabel delay={38} size={24}>
          키워드 C
        </IconLabel>
      </At>

      <At x={856} y={440}>
        <Arrow length={168} delay={64} />
      </At>

      <At x={1176} y={440}>
        <div style={{ opacity: out.opacity, transform: `scale(${out.scale})` }}>
          <CheckIcon size={264} />
        </div>
      </At>
      <At x={1176} y={624}>
        <IconLabel delay={76}>결론</IconLabel>
      </At>
    </Stage>
  );
};

// Frame(묶음 테두리)을 쓰려면 P3_Steps3를 복사한 씬 안에서 아이콘들보다 먼저 이렇게 깔면 된다:
//   <At x={800} y={476}><Frame delay={4} w={1216} h={408} /></At>
// (Stage·Header는 씬당 하나 — 패턴 컴포넌트를 다른 씬 안에 중첩하지 말 것)

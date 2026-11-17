// ────────────────────────────────────────────────────────────
//  S01_Example — 장면 골격 예시(세 칸 흐름). 실제 장면으로 바꾼다.
//  좌표계: 브라우저 content 영역 1600 × 848. At의 x·y는 요소의 중심이다.
// ────────────────────────────────────────────────────────────
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Stage, Header, At, IconLabel } from "../components/primitives";
import { DocumentIcon, BoardIcon, ScreenIcon, Arrow } from "../components/Icons";
import { appear, pop } from "../anim";

export const S01_Example: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = appear(frame, fps, 8);
  const b = appear(frame, fps, 40);
  const c = pop(frame, fps, 80);

  return (
    <Stage>
      <Header en="FLOW" ko="원고가 영상이 되는 흐름" />

      <At x={320} y={440}>
        <div style={{ opacity: a.opacity, transform: `scale(${a.scale})` }}>
          <DocumentIcon size={216} />
        </div>
      </At>
      <At x={320} y={608}>
        <IconLabel delay={18}>원고</IconLabel>
      </At>

      <At x={560} y={440}>
        <Arrow length={176} delay={28} />
      </At>

      <At x={800} y={440}>
        <div style={{ opacity: b.opacity, transform: `scale(${b.scale})` }}>
          <BoardIcon size={200} />
        </div>
      </At>
      <At x={800} y={608}>
        <IconLabel delay={50}>장면 설계</IconLabel>
      </At>

      <At x={1040} y={440}>
        <Arrow length={176} delay={64} />
      </At>

      <At x={1280} y={440}>
        <div style={{ transform: `scale(${c})` }}>
          <ScreenIcon size={200} />
        </div>
      </At>
      <At x={1280} y={608}>
        <IconLabel delay={90}>영상</IconLabel>
      </At>
    </Stage>
  );
};

// ────────────────────────────────────────────────────────────
//  Root.tsx — 장면 목록(scenes/index.tsx)을 Remotion 컴포지션으로 등록한다.
//  모든 장면은 흰 배경 + 맥 스타일 브라우저 창(BrowserFrame) 안에서 그려진다.
//  장면 id는 파일·렌더 연결 전용이다. 화면 글자로 쓰지 않는다.
//  "Main"은 모든 장면을 이어 붙인 전체본이다.
// ────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill, Composition, Sequence } from "remotion";
import { BrowserFrame } from "./components/BrowserFrame";
import { Background } from "./components/Background";
import { FPS, SCENES } from "./scenes";

const frames = (seconds: number) => Math.max(1, Math.round(seconds * FPS));

const Framed: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: "#FFFFFF" }}>
    <Background />
    <BrowserFrame>{children}</BrowserFrame>
  </AbsoluteFill>
);

const Main: React.FC = () => {
  let from = 0;
  return (
    <Framed>
      {SCENES.map((s) => {
        const dur = frames(s.seconds);
        const el = (
          <Sequence key={s.id} from={from} durationInFrames={dur}>
            <s.comp />
          </Sequence>
        );
        from += dur;
        return el;
      })}
    </Framed>
  );
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Main" component={Main} durationInFrames={SCENES.reduce((n, s) => n + frames(s.seconds), 0) || 1} fps={FPS} width={1920} height={1080} />
    {SCENES.map((s) => {
      // title은 렌더 도구가 파일 이름을 정할 때 읽는다. 화면에는 쓰지 않는다.
      const Comp: React.FC<{ title: string }> = () => (
        <Framed>
          <s.comp />
        </Framed>
      );
      return <Composition key={s.id} id={s.id} component={Comp} durationInFrames={frames(s.seconds)} fps={FPS} width={1920} height={1080} defaultProps={{ title: s.title }} />;
    })}
  </>
);

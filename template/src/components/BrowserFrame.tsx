// ────────────────────────────────────────────────────────────
//  BrowserFrame.tsx — 맥 스타일 브라우저 창 (모노크롬).
//  신호등(회색 3점) + 주소 바 + 둥근 모서리 + 그림자. 흰 content.
// ────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "../design";
import {useMotionFonts} from "../fonts";
import {BROWSER,BROWSER_SCALE,ADDRESS} from "../geometry";
const {width:WIN_W,height:WIN_H,bar:BAR_H}=BROWSER;

export const BrowserFrame: React.FC<{ children: React.ReactNode; fitScene?:boolean }> = ({ children, fitScene=false }) => {useMotionFonts();return (
  <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div
      style={{
        width: WIN_W,
        boxSizing: "border-box",
        height: WIN_H,
        borderRadius: 24,
        background: C.paper,
        boxShadow: "0 32px 80px rgba(20,20,20,0.16), 0 6px 20px rgba(20,20,20,0.10)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${C.line}`,
      }}
    >
      {/* 상단 바: 신호등(회색) + 주소 바 */}
      <div
        style={{
          height: BAR_H,
          boxSizing: "border-box",
          flex: `0 0 ${BAR_H}px`,
          background: "#F4F4F4",
          borderBottom: `1px solid ${C.creamDeep}`,
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {["#C9C9C9", "#D8D8D8", "#E4E4E4"].map((col) => (
            <div key={col} style={{ width: 16, height: 16, borderRadius: "50%", background: col }} />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            height: 40,
            background: C.white,
            borderRadius: 999,
            border: `1px solid ${C.creamDeep}`,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 24px",
            fontFamily: FONT,
            fontWeight: 700,
            fontSynthesis: "none",
            fontSize: 22,
            color: C.inkSoft,
          }}
        >
          <span style={{ color: C.inkSoft, fontSize: 16 }}>●</span>
          <span style={{ fontWeight: 700, color: C.ink }}>{ADDRESS}</span>
        </div>
      </div>

      {/* content 영역 — 흰 바탕, 씬이 여기 안에서 렌더 */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", background: C.white }}>
        {fitScene ? <div style={{position:'absolute',width:1920,height:1080,left:(WIN_W-2*BROWSER.border-1920*BROWSER_SCALE)/2,top:0,transform:`scale(${BROWSER_SCALE})`,transformOrigin:'0 0'}}>{children}</div> : children}
      </div>
    </div>
  </AbsoluteFill>
);};

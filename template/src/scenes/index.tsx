// ────────────────────────────────────────────────────────────
//  scenes/index.tsx — 이 영상의 유일한 장면 목록.
//  새 장면: scenes/S02_이름.tsx를 만들고 아래 SCENES에 한 줄을 더한다.
//   · id      영문·숫자·하이픈만. 컴포지션 이름이다. 화면에 나오지 않는다.
//   · title   결과 파일 이름에 쓰는 한글 제목.
//   · seconds 장면 길이(초). 원고의 그 구간을 읽는 시간에 맞춘다.
// ────────────────────────────────────────────────────────────
import React from "react";
import { S01_Example } from "./S01_Example";

export const FPS = 30;

export type Scene = { id: string; title: string; seconds: number; comp: React.FC };

export const SCENES: Scene[] = [
  { id: "S01-example", title: "예시 세 칸 흐름", seconds: 8, comp: S01_Example },
];

---
name: ui-explainer-motion
description: >-
  깔끔한 "AI·생산성 유튜브 해설" 스타일 모션그래픽을 HyperFrames로 재사용하는 키트.
  다음 기법을 CSS 토큰·컴포넌트(uix.css), GSAP 헬퍼 40개 가까이(uix.js, UIX.blurIn·crtOff·spotlight 등),
  바로 쓰는 씬 8종, 50초 데모 릴, 효과음, Pretendard로 제공한다.
  - 라이트 캔버스: 파스텔 오라, 스켈레톤 UI 카드, 파랑 선택 상태
  - 다크 캔버스: 점 그리드 위 화면녹화 + 얼굴 PiP
  - 강조: 앰버 스포트라이트, 형광펜, 리더 라인 주석, 키캡, 빨리감기
  - 구조: 브라운관 TV 끄기 챕터 카드, TIP 삼각형 와이프 타이틀
  - 전환: 줌 스루 블러, RGB 글리치
  - 토킹헤드 위: 키네틱 자막, 모프 스티커
  사용자가 구글 머티리얼처럼 깔끔한 UI 스타일의 해설·튜토리얼·AI 팁·생산성 유튜브 모션그래픽을
  원할 때 쓴다. "UI 설명 모션", "스켈레톤 UI 다이어그램", "스포트라이트 크롭", "TV 끄기 전환",
  "TIP 타이틀 카드", "화면녹화 연출", "줌 스루 전환", "Jeff Su 스타일 모션",
  "JeffSu_motion_reference 모션 재사용"이라고 하거나, 그 레퍼런스에서 분석한 모션을 다시 쓰려 할 때도 쓴다.
  카드 캐러셀 리스티클(card-carousel-reel), 슬라이드 덱, 특정 크리에이터 영상 그대로 따라 만들기에는 쓰지 않는다.
---

# UI 설명 모션

AI·생산성 해설 유튜브에서 흔한 "정돈된 UI 설명" 모션 문법을 HyperFrames 부품으로 묶은 스킬이다. 출처는 Jeff Su 채널 최근 3편을 프레임 단위로 잰 분석(`PART3_Motion/JeffSu_motion_reference/README.md`)이다. 기본 타이밍은 거기서 잰 값이다.

**스타일만 가져온다.** 다음 것은 결과물에 넣지 않는다.
- 원작자의 얼굴, 목소리, 화면, 로고, 채널명
- 남의 브랜드 로고(사용 권리가 있을 때만 `<img>`로 넣는다)
- 지어낸 헤드라인을 실제 기사처럼 보이게 하는 것

얼굴·화면 자리에는 실루엣과 스켈레톤 목업이 들어 있으니 사용자 본인 영상으로 바꾼다.

HyperFrames 렌더 계약(타임라인 등록, `fromTo`, 결정적 렌더, 폰트, 자산 경로)은 `/hyperframes` 스킬이 기준이다. 씬을 새로 쓰거나 크게 고치기 전에 먼저 읽는다.

## 구성

```
assets/kit/uix.css      토큰(--uix-*) + 컴포넌트 클래스        → references/look.md
assets/kit/uix.js       window.UIX 타임라인 헬퍼              → references/helpers.md
assets/scenes/*.html    씬 8종(hl tk ch dg fl dc tp sc)       → references/scenes.md
assets/starter/index.html  8씬 50초 데모 릴(효과음 20개 포함)
assets/fonts/           Pretendard 500–800 (OFL)
assets/sfx/             whoosh-short · pop · sparkle · chime (Pixabay)
scripts/install-kit.sh  위 파일을 프로젝트에 복사
```

## 작업 순서

### 1. 프로젝트에 키트 넣기

이 스킬은 `PART3_Motion/.claude/skills/ui-explainer-motion/`에 있는 프로젝트 전용 스킬이다. 아래 명령은 `PART3_Motion` 폴더에서 실행한다.

새 프로젝트:

```bash
npx hyperframes init <dir> --skip-skills --skill=hyperframes
.claude/skills/ui-explainer-motion/scripts/install-kit.sh <dir> --starter
```

`--starter`가 하는 일:
- `index.html`을 데모 릴로 바꾼다. 원래 파일은 `index.html.before-uix`로 남는다.
- 8씬을 모두 `compositions/`에 복사한다.

이미 있는 프로젝트에는 필요한 씬만 넣는다.

```bash
.claude/skills/ui-explainer-motion/scripts/install-kit.sh <dir> --scenes dg,sc
```

키트·폰트·효과음은 항상 덮어쓰고, 씬 파일은 이미 있으면 건드리지 않는다. 기존 `index.html`의 `<head>`에는 스크립트가 출력하는 세 가지를 넣는다.
- GSAP 다음에 `uix.css` 링크와 `uix.js` 스크립트
- 스타터의 Pretendard `@font-face` 블록
- `.uix-font-names` 줄. 렌더 컴파일러는 이 파일에 적힌 폰트 이름만 임베드한다. 이 줄이 없으면 Oswald·EB Garamond가 빠진다.

### 2. 씬 고르고 이어 붙이기

| 이야기에서 필요한 것 | 씬 |
| --- | --- |
| 첫 3초 훅(언론·반응 인용) | `hl` 헤드라인 몽타주 |
| 말하는 사람 위 강조 문장, 링크 안내 | `tk` 토킹헤드 |
| 섹션 시작 | `ch` 챕터 카드(앞 씬을 `crtOff`로 끝냄), 짧은 팁 목록이면 `tp` TIP 카드 |
| 개수·분류가 있는 개념 | `dg` 숫자 → 카드 |
| 사람·AI·도구 관계, A/B 비교 | `fl` 흐름도 |
| 변환(PDF → 텍스트 등)과 규모 | `dc` 문서 스캔 |
| 실제 앱 시연 | `sc` 화면녹화 |

**이어 붙이는 규칙**(자세한 것은 `references/scenes.md`):
- 라이트 → 라이트: 앞 씬 끝 `zoomThrough` + 뒤 씬 시작 `zoomIn`
- 토킹헤드 → 섹션: `crtOff` + `ch`
- `tp`: 앞 씬보다 0.2초 일찍, 위 트랙에서 시작한다.
- 시연 끝: `glitch` 2프레임 후 컷

`index.html`에서 호스트의 `data-start`·`data-duration`을 맞추고, 루트 `data-duration`을 영상 길이로 바꾼다. 효과음 `<audio>`도 같이 옮긴다.

### 3. 내용 바꾸기

- **글자**: 씬 파일의 HTML을 직접 고친다. 한글 제목에는 `.uix-ko`를 붙인다.
- **색**: `index.html`의 `:root`에서 `--uix-*`를 덮어쓴다.
- **본인 영상·화면**:
  - `tk`의 `#tk-face`, `sc`의 `.uix-window-body`와 `#sc-pip`에 `<video>`를 넣는다(각 파일 맨 위 주석에 예시).
  - 화면녹화는 `muted`로 넣고, 말소리는 별도 `<audio>` 또는 `data-has-audio="true"`로 처리한다.
  - 영상·음성·음악 준비는 `/media-use`로 한다.
- **자막 타이밍**: 단어 span에 `data-t`(자막 시작부터의 초)를 적는다.
- **좌표**(하이라이트 박스, 커서, 주석): 실제 화면에 맞춘다. 푸시 인이 끝난 뒤 배율을 기준으로 한다.

### 4. 새 씬을 직접 쓸 때

```html
<template>
  <style>#root { position: absolute; inset: 0; } /* 씬 전용 위치는 #xx-… 로 */</style>
  <div id="root" data-composition-id="xx" data-width="1920" data-height="1080">
    <div class="uix-light">
      <div class="uix-aura" data-layout-allow-overflow></div>
      <div id="xx-card" class="uix-card uix-hide">…</div>
    </div>
  </div>
  <script>
    (function () {                       // IIFE: 씬끼리 변수가 부딪치지 않게
      var S = UIX.scope("xx");
      var tl = gsap.timeline({ paused: true });
      UIX.blurIn(tl, "#xx-card", 0.3);
      window.__timelines["xx"] = tl;     // 트윈을 모두 더한 뒤 등록
    })();
  </script>
</template>
```

- 아이디·클래스는 씬 id로 시작한다.
- 등장 요소에는 `uix-hide`를 붙인다.
- 위치는 CSS `left/top`으로 잡고, 움직임은 헬퍼로 준다.
- 헬퍼에 없는 동작은 `tl.fromTo(…, { immediateRender: false })`로 쓴다.
- 기존 씬 파일을 복사해 시작하는 것이 가장 빠르다.

### 5. 확인 → 미리보기 → 렌더

```bash
npx hyperframes check --json
npx hyperframes snapshot --review
```

- `review-beats.jpg`와 컷마다의 `review-seam-NN.jpg`를 직접 열어 본다.
- 바꾼 씬만 볼 때는 `--composition <id>`를 쓴다.

**데모 릴 기준으로 남는 정상 경고**(고칠 필요 없음):
- 연결선 고아(`connector_orphan`)
- TIP 아웃라인 글자의 캔버스 밖 표시
- 빨리감기 아이콘이 말풍선을 가림

**실제 문제**는 다음과 같다.
- `contrast_aa_failure`가 보이는 글자에 뜰 때
- `text_below_floor`(28px 미만)
- `line_unread`: 단어 수 × 0.3초 + 0.5초보다 짧게 보인 문장

미리보기(`npx hyperframes preview`)를 열어 사용자에게 보여 주고, 승인을 받으면 렌더한다.

```bash
npx hyperframes render -o renders/<name>.mp4
```

## 레퍼런스에서 지킨 것(바꾸기 전에 이유를 볼 것)

| 규칙 | 값 | 이유 |
| --- | --- | --- |
| 기본 등장 | 블러 10→0 + 14px 상승, **0.32초 expo.out** | 채널 전체의 결. 튕기는 이징(bounce·back)은 쓰지 않는다 |
| 퇴장 | 등장의 40~50%(0.18초) | 다음 요소에 시선을 넘긴다 |
| 같은 묶음의 스태거 | 0.06~0.1초 | 숫자 원은 0.1초 |
| 나레이션 단위 | 요소 하나 = 말 한 마디 | 한꺼번에 다 띄우지 않는다 |
| 선택 상태 | 파랑 테두리 + 옅은 링, 0.22초 | 한 번에 카드 하나만 |
| 스포트라이트 | 배경 어둡게·블러, 앰버 테두리 카드 0.3초 | 채널의 시그니처. 읽을 시간(단어 × 0.3초 + 0.5초)을 준다 |
| 스캔 라인 | 2.2초 | 변환이 "일어난다"는 느낌 |
| 챕터 | TV 끄기 약 0.67초 + 플래시 + 고정 | 끈 뒤 바로 켠다. 사이에 검은 화면이 길면 안 된다 |
| 자막 | 강조 문장에만, 단어당 약 0.1초, 키워드만 노랑 | 상시 자막처럼 쓰지 않는다 |
| 글리치 | 2프레임 | 길면 싸구려 프리셋처럼 보인다 |
| 줌 스루 | 나가는 쪽 0.45초 power3.in + 들어오는 쪽 0.38초 | 장면이 카메라를 지나간다 |

새 동작을 더할 때도 같은 이징 역할을 쓴다(`UIX.ease`). 도착은 `expo.out`, 카메라는 `power2.inOut`, 퇴장·관통은 `power2.in`/`power3.in`이다.

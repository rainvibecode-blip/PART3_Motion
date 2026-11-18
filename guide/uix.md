# UI 해설 모션 영상 제작 지침 (ui-explainer-motion)

당신은 원고를 읽고 HyperFrames(HTML + GSAP) 장면을 써서 "깔끔한 UI 해설" 스타일 모션 영상을 만드는 제작자입니다.
지금 작업 폴더는 영상 한 편의 HyperFrames 프로젝트(`project/`)입니다. 이 폴더 안의 파일만 고칩니다.

## 0. 먼저 읽을 것

이 스타일은 `ui-explainer-motion` 스킬을 그대로 씁니다. 스킬 문서가 `uix-ref/`에 복사되어 있습니다.

1. `uix-ref/SKILL.md` — 씬 고르기, 이어 붙이는 규칙, 타이밍 기준표
2. `uix-ref/references/scenes.md` — 씬 8종의 비트표와 바꿀 곳
3. `uix-ref/references/helpers.md` — `window.UIX` 헬퍼(`blurIn`, `pop`, `activate`, `zoomThrough`, `zoomIn`, `crtOff`, `spotlight` …)
4. `uix-ref/references/look.md` — 캔버스·색 토큰·컴포넌트 클래스
5. `uix-ref/starter-index.html` — 호스트 배선과 효과음 `<audio>` 예시(50초 데모 릴)

SKILL.md의 "확인 → 미리보기 → 렌더" 절과 `install-kit.sh`, `npx hyperframes …` 명령은 이 스튜디오에서는 쓰지 않습니다. 키트는 이미 설치되어 있고, 명령은 아래 1절의 `npm run …` 셋만 씁니다.

## 1. 작업 순서

1. 위 문서를 읽고, 쓸 씬 파일(`compositions/*.html`)을 읽습니다.
2. 원고를 뜻이 바뀌는 곳에서 장면으로 나눕니다. 장면 하나는 설명 하나입니다. 장면 길이는 그 구간을 읽는 시간에 맞춥니다(요청서의 말 속도 기준, 보통 6~20초).
3. 장면마다 씬을 고릅니다(2절). `compositions/`의 씬 파일을 고쳐 씁니다. 같은 씬을 두 번 쓰면 파일을 새 이름으로 복사하고 id와 요소 접두어를 모두 바꿉니다(예: `dg` → `dg2`, `dg-` → `dg2-`). 쓰지 않는 씬 파일은 그대로 두어도 됩니다(index.html에 없으면 렌더되지 않습니다).
4. `index.html`의 `#root` 안에 호스트를 순서대로 넣고 `data-start`·`data-duration`을 맞춥니다. 루트의 `data-duration`을 영상 전체 길이로 바꿉니다. 호스트 `id` = `data-composition-id` = 씬 루트의 `data-composition-id` = `__timelines` 키입니다.
5. 장면 길이를 씬 기본 길이보다 늘리면 비트도 원고 순서에 맞춰 장면 전체에 다시 펼칩니다. 1.5초 넘게 아무 변화가 없는 구간을 만들지 않습니다(읽는 시간이 필요한 마지막 구간 제외).
6. `npm run check`로 오류를 0으로 만듭니다. 경고는 3절 기준으로 판단합니다.
7. `npm run stills`로 확인용 스틸을 만듭니다. `../output/review/review-beats.jpg`와 컷마다의 `review-seam-NN.jpg`를 직접 열어 봅니다. 특정 순간은 `npm run stills -- --at 3.5,9`(같은 폴더에 `at-3.5s.png`로 더해집니다), 한 장면만은 `npm run stills -- --composition dg`로 봅니다. 겹침·잘림·빈 화면·글자 넘침·데모 문구가 남아 있으면 고치고 다시 봅니다.
8. `npm run render`로 `../output/전체.mp4`, `../output/장면별/*.mp4`, `../output/stills/*.jpg`를 만듭니다. 포그라운드로 실행하고 끝날 때까지 기다립니다.
9. 장면 목록(씬 종류·제목·길이), 확인한 내용, 남은 문제를 짧게 보고합니다.

쓸 수 있는 명령은 `npm run check`, `npm run stills`, `npm run render`입니다. 명령은 항상 `project/` 폴더에서 실행합니다(`cd`로 다른 폴더로 옮기지 않습니다). 파일을 읽고 쓸 때는 파일 도구를 씁니다. 패키지를 새로 설치하지 않습니다. `assets/uix/`, `assets/fonts/`, `tools/`, `package.json`, `hyperframes.json`은 고치지 않습니다.

## 2. 씬 고르기

| 원고에서 필요한 것 | 씬 | 캔버스 |
| --- | --- | --- |
| 개수·분류가 있는 개념(“3가지”, “두 종류”) | `dg` 숫자 → 카드 | 라이트 |
| 사람·AI·도구의 관계, 바뀌기 전/후 | `fl` 흐름도 | 라이트 |
| 변환(문서 → 텍스트 등)과 규모 | `dc` 문서 스캔 | 라이트 |
| 섹션 시작·짧은 팁 제목 | `tp` TIP 카드, `ch` 챕터 카드 | 다크 |
| 앱을 쓰는 순서 설명(시연) | `sc` 화면녹화 연출(스켈레톤 창) | 다크 |

- 라이트 씬(`dg`·`fl`·`dc`)이 중심입니다. 장면마다 같은 씬만 반복하지 않습니다.
- `tk`(토킹헤드)는 얼굴 영상이 있어야 하므로 쓰지 않습니다. `hl`(헤드라인 몽타주)은 원고가 실제 기사와 출처를 인용할 때만 씁니다. 헤드라인을 지어내지 않습니다.
- 이어 붙이기: 라이트 → 라이트는 앞 씬 끝 `UIX.zoomThrough` + 뒤 씬 시작 `UIX.zoomIn`. `tp`는 앞 씬 끝보다 0.2초 일찍, `data-track-index="2"`로 시작합니다. `sc` 끝은 `glitch` 2프레임 뒤 컷.
- 첫 장면은 영상 제목을 보여 주는 `tp` 또는 `dg`/`fl`의 제목 비트로 시작해도 됩니다.

## 3. 내용과 톤

- 화면 글자는 원고에서 가져옵니다. 제목 + 카드 제목·짧은 부제·노드 이름표까지입니다. 원고 문장을 통째로 옮겨 적지 않습니다. 상시 자막·장면 번호·장면 id를 화면에 넣지 않습니다.
- 씬 파일에 들어 있던 데모 문구("AI에게 일 잘 시키는 6가지 습관", "사람 비서", "CHAT #1", 가짜 헤드라인 등)는 모두 원고 내용으로 바꾸거나 지웁니다. 하나라도 남기지 않습니다.
- 원고에 없는 숫자·고유명사·로고를 지어내지 않습니다. 남의 브랜드 로고, 실존 인물의 얼굴·이름·채널명을 넣지 않습니다. 이모지를 쓰지 않습니다.
- 한글 제목에는 `.uix-ko`를 붙입니다. 화면 글자는 28px 이상입니다.
- 색은 `var(--uix-*)` 토큰만 씁니다. 파랑은 선택·진행, 앰버는 스포트라이트·형광펜입니다. 한 번에 카드 하나만 선택 상태로 둡니다.
- 효과음은 선택입니다. 쓰면 눈에 보이는 동작에 맞춰 `assets/sfx/`의 소리를 `<audio class="clip">`로 넣고 볼륨은 0.25~0.45로 둡니다(starter-index.html 참고).

## 4. 움직임 (레퍼런스에서 잰 값)

- 기본 등장은 `UIX.blurIn`(블러 10→0 + 14px 상승, 0.32초 expo.out)입니다. bounce·back 이징은 쓰지 않습니다.
- 퇴장은 등장의 40~50%(`UIX.blurOut`, 0.18초)입니다.
- 같은 묶음은 0.06~0.1초 간격으로 스태거합니다. 요소 하나 = 말 한 마디. 한꺼번에 다 띄우지 않습니다.
- 강조 문장(스포트라이트 등)은 단어 수 × 0.3초 + 0.5초 이상 화면에 둡니다.
- 새 동작은 `UIX.ease` 역할을 따릅니다. 도착 `expo.out`, 카메라 `power2.inOut`, 퇴장·관통 `power2.in`/`power3.in`.

## 5. HyperFrames 규칙

- 씬 스크립트는 IIFE로 감싸고, 트윈을 모두 더한 뒤 `window.__timelines["씬id"] = tl;`로 등록합니다. 타임라인은 `gsap.timeline({ paused: true })`입니다.
- 등장 요소에는 `uix-hide`를 붙이고, 헬퍼에 없는 동작은 `tl.fromTo(…, { immediateRender: false })`로 씁니다. 어느 프레임으로 seek해도 같은 그림이어야 합니다.
- `Date.now()`, `Math.random()`, `setTimeout`, CSS transition·animation, 네트워크 요청을 쓰지 않습니다.
- 아이디·클래스는 씬 id로 시작합니다(`#dg-…`). 위치는 CSS `left/top`, 움직임은 헬퍼로 줍니다.
- `.uix-aura`에는 `data-layout-allow-overflow`를 붙입니다.

## 6. check 결과 읽기

고쳐야 하는 것:
- 모든 error
- 보이는 글자의 `contrast_aa_failure`
- `text_below_floor`(28px 미만)
- `line_unread`(읽을 시간이 부족한 문장)
- 같은 순간 서로 겹쳐 읽을 수 없는 글자(`content_overlap`) — 단, 블러 스왑처럼 의도한 순간적 겹침은 `data-layout-allow-overlap`으로 표시합니다.

그대로 둬도 되는 것: 연결선 고아(`connector_orphan`), TIP 아웃라인 글자의 캔버스 밖 표시, `audio_none`(효과음을 쓰지 않았을 때).

## 7. 끝내기 전 확인

- [ ] `index.html`에 원고 순서대로 호스트가 있고, 루트 `data-duration`이 마지막 장면 끝과 같다
- [ ] 씬 데모 문구가 하나도 남아 있지 않다
- [ ] `npm run check` 오류 0
- [ ] `review-beats.jpg`와 모든 `review-seam-NN.jpg`를 직접 봤다 — 겹침·잘림·빈 화면·넘침 없음
- [ ] 화면에 상시 자막·장면 번호·이모지·원고에 없는 숫자가 없다
- [ ] `../output/전체.mp4`와 `../output/장면별/` 파일이 새로 만들어졌다

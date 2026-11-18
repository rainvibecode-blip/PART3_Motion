# 룩: 토큰과 컴포넌트 (`assets/kit/uix.css`)

색과 서체는 모두 `:root`의 `--uix-*` 변수다.

- **브랜드를 바꿀 때**: `index.html`의 `:root`에서 덮어쓴다.
- **씬 파일**: 변수 이름(`var(--uix-blue)`)만 쓰고 색 값을 직접 적지 않는다.

## 캔버스 3종

| 클래스 | 생김새 | 쓰임 |
| --- | --- | --- |
| `.uix-light` + `.uix-aura` | 흰 바탕. 위쪽에 분홍·라벤더·피치 오라가 옅게 깔린다 | 개념 설명, 흐름도, 비교 |
| `.uix-dark` | #161618 + 54px 점 그리드 | 화면녹화 시연, 얼굴 PiP |
| `.uix-chapter` + `.uix-crosses` + `.uix-gold-lines` | #131314 + 성긴 "+"와 금색 사선 | 챕터 구분 |

추가 규칙:
- `.uix-aura`에는 늘 `data-layout-allow-overflow`를 붙인다. 캔버스 밖으로 번지도록 만든 장식이다.
- 한 영상 안에서 라이트 → 라이트 전환은 `zoomThrough` / `zoomIn`으로 한다. 다크로 넘어갈 때는 `crtOff` → 챕터 카드, 또는 컷 + `glitch`로 한다.

## 색의 역할

| 토큰 | 값 | 역할 |
| --- | --- | --- |
| `--uix-blue` | #1a73e8 | 선택·활성 테두리, 진행 |
| `--uix-blue-soft` | #e8f0fe | 선택 채움 |
| `--uix-blue-ink` | #0b57d0 | 옅은 파랑 위의 글자(AA 5.6:1) |
| `--uix-amber` | #fbbc04 | 스포트라이트 테두리, 하이라이트 박스, 리더 라인, 태그 외곽 |
| `--uix-marker` | #fbbc04 | 형광펜 |
| `--uix-green` / `--uix-box-green` | #34a853 / #188038 | 체크 / 키워드 박스(흰 글자 AA) |
| `--uix-red` / `--uix-box-red` | #ea4335 / #c5221f | 경고·✕ / 키워드 박스 |
| `--uix-orange` | #ff5a1f | 스티커, 클릭 리플 |
| `--uix-gold` | #e8a33d | 챕터 카드 사선 |
| `--uix-key-alt` | #7f7de3 | 강조 키캡 |

한 장면에 강조색은 하나만 쓴다. 파랑은 "지금 이것", 앰버는 "여기를 보라"다. 둘이 같은 요소에 겹치면 안 된다.

## 서체

| 토큰 | 서체 | 쓰는 곳 |
| --- | --- | --- |
| `--uix-font` | Pretendard → Inter | 본문, 카드, 칩, 자막, **모든 한글 제목** |
| `--uix-display` | Oswald → Pretendard | 영문 대문자 제목, 태그, CTA, TIP 눈썹 |
| `--uix-serif` | EB Garamond → Playfair Display | 헤드라인 카드의 매체명, 인용 카드 |

추가 규칙:
- **한글 제목**: Oswald에는 한글이 없다. 한글 제목에는 `.uix-ko`를 함께 붙인다. Pretendard 800, 자간 −0.02em, 대문자 변환 없음으로 바뀐다.
  - 예: `class="uix-chapter-title uix-ko"`
- **폰트 이름 적기**: 렌더 컴파일러는 `index.html` 안의 `<style>`에 적힌 폰트 이름만 임베드한다.
  - 그래서 스타터에 `.uix-font-names { font-family: "Inter", "Oswald", "EB Garamond", … }` 줄이 있다.
  - 이 줄을 지우면 Oswald·EB Garamond가 시스템 서체로 바뀐다.
- **최소 글자 크기**: 28px(1080 기준). 카드 부제, 입력창 안내 문구도 28px 이상으로 둔다.

## 컴포넌트

| 클래스 | 무엇 | 메모 |
| --- | --- | --- |
| `.uix-card` (`-title`, `-sub`) | 흰 카드, 22px 라운드, 회색 2px 테두리 | 선택 상태는 `UIX.activate` |
| `.uix-panel` | 카드 안의 옅은 회색 영역 | 미니 일러스트 바탕 |
| `.uix-skel` (`s m l f`, `blue hot thick`) | 스켈레톤 막대 | 실제 글자 대신 구조만 보여 줌 |
| `.uix-chip` (`.pill`) | 76px 높이 노드 칩 | `.uix-avatar`, 아이콘, `.uix-check`와 함께 |
| `.uix-avatar` | CSS로 그린 사람 아이콘(실제 얼굴 아님) | 안에 `<img>`를 넣으면 사진 |
| `.uix-num` (`.on`) | 60px 숫자 원 | |
| `.uix-check` / `.uix-x` | 초록 체크 / 빨강 ✕ 원 | 안에 SVG 경로 |
| `.uix-app` | 빛나는 흰 앱 타일 | 안에 아이콘 `<img>` 또는 SVG |
| `.uix-wires` | 연결선 SVG 오버레이 | `path.blue`, `path.dash` |
| `.uix-window` (`.light`, `-bar`, `-body`) | 둥근 화면녹화 창 | body 안에 `<video>`/`<img>` |
| `.uix-pip` | 290×350 얼굴 PiP, 흰 5px 테두리 | |
| `.uix-dim` + `.uix-focus` | 스포트라이트 배경 + 앰버 발췌 카드 | `.uix-focus.dark` |
| `.uix-mark` | 형광펜 구절 | `UIX.marker` |
| `.uix-hbox` | 앰버 하이라이트 박스 | `UIX.growX` |
| `.uix-callout` (`-dot`, `svg`, `-box`) | 리더 라인 주석 | 좌표는 캔버스 기준 px |
| `.uix-keys` / `.uix-key` (`.alt`) | 키캡 오버레이 | |
| `.uix-cursor` / `.uix-ripple` / `.uix-chevron` | 커서, 클릭 링, 손그림 쉐브론 | |
| `.uix-ff` | ▶▶ 빨리감기 아이콘 | `UIX.fastForward` |
| `.uix-tagwrap` (`.box`, `.txt`) | 열리고 접히는 검정 태그 | `UIX.tagIn/Out` |
| `.uix-tag` (`.light`, `.plain`) | 정적인 태그 | |
| `.uix-cta` + `.uix-cta-shape` | 기울어진 평행사변형 CTA | skew는 안쪽, 움직임은 바깥 |
| `.uix-corner` | 오른쪽 아래 고정 칩("보너스 팁") | |
| `.uix-sticker` | 오렌지 원형 스티커 | `UIX.sticker` |
| `.uix-title-stack`, `.uix-eyebrow`, `.uix-title`, `.uix-sub` | 영문 대문자 타이틀 묶음 | |
| `.uix-chapter-title` | 챕터 타이틀 | |
| `.uix-tip` (`-ground`, `-lock`, `-eyebrow`, `-title`, `-sub`), `.uix-outline` | TIP 카드 | |
| `.uix-caps` (`.hl`) | 강조 문장 자막 | `UIX.words` |
| `.uix-split-dark` / `.uix-split-light` / `.uix-headline` / `.uix-key-box` (`.red`) | 헤드라인 몽타주 | |
| `.uix-quote` | 세리프 인용 카드 | |
| `.uix-doc` (`.ph`) + `.uix-scan` | 문서 + 스캔 라인 | |
| `.uix-cell` | 규모 샷 셀 | `UIX.cells` |
| `.uix-crt-v` / `.uix-crt-h` | TV 끄기 선 | `UIX.crtOff` |
| `.uix-glitch` | 글리치 줄무늬 | `UIX.glitch` |
| `.uix-mock` (`-side`, `-row.sel`, `-main`), `.uix-bubble` (`.me .ai`), `.uix-input`, `.uix-send` | 다크 채팅 앱 목업 | 실제 녹화가 없을 때만 |
| `.uix-talk-ph` + `.uix-person` | 실루엣 자리표시자 | 실제 영상으로 교체 |

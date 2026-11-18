# UIX 헬퍼 API (`assets/kit/uix.js`)

모든 헬퍼는 `UIX.이름(tl, 대상, at, opts)` 꼴이고, 일시정지된 GSAP 타임라인 `tl`에 트윈을 더한 뒤 `tl`을 돌려준다.

- **대상**: 요소, 선택자 문자열, NodeList, 또는 이것들의 배열을 받는다.
  - 씬 안에서는 `#씬id-…` 아이디나 `UIX.scope("씬id").$$(…)`로 고른다.
  - 그래야 다른 씬의 같은 클래스를 건드리지 않는다.
- **at**: 그 씬 타임라인 기준의 초다. 씬은 호스트의 `data-start`에서 0초로 시작한다.
- **등장하는 요소**: HTML에 `class="uix-hide"`(opacity 0)를 붙여 둔다.
  - 모든 등장 트윈은 `fromTo` + `immediateRender:false`다.
  - 그래서 어느 프레임으로 seek해도 같은 그림이 나온다.
- **기본값의 출처**: 레퍼런스 3편에서 잰 값이다(±0.1초). opts로 바꿀 수 있다.

## 등장과 퇴장

| 헬퍼 | 하는 일 | 기본값 / opts |
| --- | --- | --- |
| `blurIn(tl, t, at, o)` | 시그니처 등장. 투명도 0→1, 블러 10→0, 위로 14px | 0.32초 expo.out. `dur, blur, x, y, scale, stagger, ease` |
| `blurOut(tl, t, at, o)` | 퇴장. 등장보다 40~50% 짧다 | 0.18초 power2.in. `dur, blur, y, stagger` |
| `fade` / `fadeOut` | 순수 투명도 | 0.25초 / 0.2초. `to`, `from`, `dur`, `stagger` |
| `show` / `hide` | 그 프레임에 바로 켜고 끈다(`tl.set`) | — |
| `pop(tl, t, at, o)` | 숫자 원·아이콘·체크가 튀어나옴 | 0.26초 expo.out, scale 0.5→1, **0.1초 간격**. `from, dur, stagger` |

## 그리기와 강조

| 헬퍼 | 하는 일 | 기본값 / opts |
| --- | --- | --- |
| `growX` | 왼쪽에서 오른쪽으로 폭이 자람(하이라이트 박스, 선) | 0.45초 power3.out. `origin, dur` |
| `draw` | SVG `path`/`line` 획 그리기(연결선, 리더 라인, 금색 사선) | 0.45초 power2.inOut. `dur, stagger, ease` |
| `marker` | `.uix-mark`·`.uix-key-box` 뒤 색 박스 와이프 | 0.4초, 여러 개면 0.3초 간격. `color`를 주면 박스가 지날 때 글자색도 바꾼다(밝은 바탕의 흰 글자용). `colorFrom`으로 시작색 지정 |
| `activate` / `deactivate` | 카드·칩 선택 상태(회색→파랑 테두리 + 옅은 링) | 0.22초 / 0.18초. `border` |
| `numOn` / `numOff` | 숫자 원이 파랑으로 | 0.2초 |

## 글자

| 헬퍼 | 하는 일 | 기본값 / opts |
| --- | --- | --- |
| `typeOn` / `typeOff` | 한 글자씩 타이핑(라벨, 태그) | 35ms / 25ms 간격. `step` |
| `words(tl, el, at, o)` | 단어 단위 키네틱 자막. `<span class="hl">`은 노랑으로 유지 | 0.09초 간격. 단어마다 블러 6→0, 0.13초. `step`, `times:[…]`, 또는 span의 `data-t`(초) |
| `wordsOf(el)` | 단어 span 배열만 돌려준다(직접 애니메이트할 때) | — |

자막 단어 타이밍을 음성에 맞추려면 단어를 감싼 span에 `data-t`를 적는다.

```html
<div id="tk-cap1" class="uix-caps"><span data-t="0">AI를</span> <span data-t="0.32">쓰는</span> …</div>
```

## 카메라와 전환

| 헬퍼 | 하는 일 | 기본값 / opts |
| --- | --- | --- |
| `pushIn` | 화면녹화 창으로 천천히 다가감 | scale 1.12, 1.1초 power2.inOut. `scale, origin, x, y, dur` |
| `zoomThrough` | 나가는 장면이 카메라를 지나치며 사라짐 | scale 1→1.35 + 블러 16, 0.45초 power3.in |
| `zoomIn` | 들어오는 장면이 살짝 작고 흐린 상태에서 자리 잡음 | scale 0.94→1, 0.38초 expo.out. `from` |
| `crtOff(tl, layer, at, {v, h})` | TV 끄기: 타원 → 세로 슬릿 → 가로선 번쩍 → 소멸(약 0.67초). `v`·`h`는 `.uix-crt-v`·`.uix-crt-h` 요소 | 프레임 단위 고정 |
| `titleFlash(tl, el, at, o)` | 타이틀이 엉뚱한 크기로 1프레임씩 두 번 번쩍 → 0.22초 블러 인 | `s1, x1, s2, x2` |
| `glitch(tl, layer, at, o)` | 2프레임 RGB 글리치(색 분리 + 가로 밀림 + 기울임) | `frames`(2), `bars`: `.uix-glitch` 줄무늬 오버레이 |
| `fastForward(tl, icon, win, at, dur)` | ▶▶ 아이콘 + 창이 2프레임마다 빨강/청록 테두리로 떨림 | 약 1.2~1.5초 |

## 소품

| 헬퍼 | 하는 일 |
| --- | --- |
| `spotlight(tl, dim, card, at)` / `spotlightOut` | 배경 어둡게 + 블러 → 앰버 테두리 발췌 카드 착지(0.3초). 나갈 때는 카드가 먼저 사라진다 |
| `callout(tl, dot, line, box, at)` | 노랑 점 팝 → 리더 라인 그리기 → 흰 박스 블러 인 |
| `ripple(tl, el, at)` | 클릭 지점 오렌지 링(0.45초) |
| `tagIn(tl, box, text, at)` / `tagOut` | 태그 박스가 가운데서 열리고(0.15초) 글자가 타이핑됨. 나갈 때는 글자가 지워진 뒤 박스가 접힌다 |
| `sticker(tl, el, at)` | 작은 오렌지 사각형이 회전하며 원으로 커지고(0.6초), 안의 `<div>` 글자가 단어 단위로 채워짐 |
| `scan(tl, line, at, {dur, distance})` | 문서 위→아래 스캔 라인(2.2초) |
| `wave(tl, cells, at, {span, to})` | 셀 색이 x 위치 순서로 물결처럼 바뀜(1.0초) |

## 장식(스크립트로 만드는 비시간 요소)

| 헬퍼 | 하는 일 |
| --- | --- |
| `crosses(container, {cols, rows, keep, seed})` | 챕터 카드의 성긴 "+" 점. 시드가 같으면 매번 같은 배치 |
| `cells(container, {cols, rows, gap, x, y, skip})` | 규모 샷의 작은 문서 셀 격자. `skip(x,y)`로 구멍을 뚫는다 |
| `rng(seed)` | 결정적 난수(mulberry32). `Math.random()` 대신 쓴다 |
| `token(name, fallback)` | CSS 변수 값을 읽는다 |
| `UIX.F` | 1프레임(1/30초). 프레임 단위 연출에 쓴다 |
| `UIX.ease` | `arrive` expo.out · `settle` power3.out · `move` power2.inOut · `exit` power2.in · `through` power3.in |

## 함정

- **`blurIn`은 x·y·scale을 0/1로 되돌린다.** 이미 GSAP로 옮긴 요소에 다시 쓰면 제자리로 튄다. 이동한 요소에는 `fade`를 쓰거나 안쪽 요소에 건다.
- **CSS `transform`이 있는 요소는 GSAP로 움직이지 않는다.** 예: `.uix-cta-shape`의 skew. 바깥 래퍼(`.uix-cta`)를 움직인다.
- **`.clip` 요소에는 `display`·`visibility`를 트윈하지 않는다.** 투명도만 쓴다.
- **시작 상태가 안 보이는 요소**는 HTML에 `uix-hide`를 꼭 붙인다. `crtOff`·`titleFlash`처럼 `tl.set`으로 켜는 요소는 인라인 `style="opacity:0"`이어도 된다.
- **`draw`는 타임라인을 만들 때 대시 값을 정한다.** 그 뒤 경로 `d`를 바꾸면 길이가 어긋난다. `d`를 고친 뒤 타임라인을 다시 만든다(파일 저장이면 자동).

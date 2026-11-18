/* ==========================================================================
   UIX 키트 — 깔끔한 UI 설명 모션용 타임라인 헬퍼 (HyperFrames)
   index.html <head>에서 GSAP 다음에 한 번만 불러온다:
     <script src="assets/uix/uix.js"></script>

   모든 헬퍼는 일시정지된 GSAP 타임라인에 트윈을 더하고 그 타임라인을 돌려준다:
     UIX.이름(tl, 대상, at, opts)
   대상: 요소, NodeList/배열, 선택자. 씬 안에서는 UIX.scope("<composition-id>")로
   골라서, 같은 클래스가 다른 씬까지 번지지 않게 한다.

   결정성 규칙 (HyperFrames 계약): 시계, Math.random, repeat:-1을 쓰지 않는다.
   등장하는 요소는 class "uix-hide"(opacity 0)를 달고, 모든 등장 트윈은
   immediateRender:false라서 어느 프레임으로 seek해도 같은 그림이 나온다.
   기본 타이밍은 레퍼런스 분석에서 잰 값이다(±0.1초).
   ========================================================================== */
(function (w) {
  "use strict";

  var FPS = 30;
  var F = 1 / FPS;

  // 요소 | 선택자 | NodeList | 이것들의 배열  ->  평평한 Element[]
  function arr(t) {
    if (!t) return [];
    if (typeof t === "string") return Array.prototype.slice.call(document.querySelectorAll(t));
    if (t.nodeType) return [t];
    var out = [];
    Array.prototype.forEach.call(t, function (x) { out = out.concat(arr(x)); });
    return out;
  }
  function opt(o, k, d) {
    return o && o[k] !== undefined ? o[k] : d;
  }
  function token(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name);
    return (v && v.trim()) || fallback;
  }
  // 장식 배치용 시드 난수 (mulberry32)
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var UIX = { FPS: FPS, F: F, token: token, rng: rng };

  /* 역할별 이징: 도착은 길게 내려앉고, 카메라 이동은 양쪽을 부드럽게,
     줌 스루와 퇴장은 가속한다. */
  UIX.ease = {
    arrive: "expo.out",
    settle: "power3.out",
    move: "power2.inOut",
    exit: "power2.in",
    through: "power3.in",
  };

  /* 한 씬 안에서만 요소를 찾는다. */
  UIX.scope = function (id) {
    var root = document.querySelector('[data-composition-id="' + id + '"]') || document;
    return {
      root: root,
      $: function (s) { return root.querySelector(s); },
      $$: function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); },
    };
  };

  /* ---------------------------------------------------------------- 등장·퇴장 */

  // 시그니처 등장: 투명도 0→1, 블러 10→0, 14px 상승, 0.32초 expo.out
  UIX.blurIn = function (tl, t, at, o) {
    return tl.fromTo(
      arr(t),
      { opacity: 0, filter: "blur(" + opt(o, "blur", 10) + "px)", x: opt(o, "x", 0), y: opt(o, "y", 14), scale: opt(o, "scale", 1) },
      { opacity: 1, filter: "blur(0px)", x: 0, y: 0, scale: 1, duration: opt(o, "dur", 0.32), ease: opt(o, "ease", "expo.out"), stagger: opt(o, "stagger", 0), immediateRender: false },
      at
    );
  };

  // 퇴장: 등장보다 40~50% 짧게
  UIX.blurOut = function (tl, t, at, o) {
    return tl.fromTo(
      arr(t),
      { opacity: 1, filter: "blur(0px)" },
      { opacity: 0, filter: "blur(" + opt(o, "blur", 8) + "px)", y: opt(o, "y", 0), duration: opt(o, "dur", 0.18), ease: "power2.in", stagger: opt(o, "stagger", 0), immediateRender: false },
      at
    );
  };

  UIX.fade = function (tl, t, at, o) {
    return tl.fromTo(arr(t), { opacity: 0 }, { opacity: opt(o, "to", 1), duration: opt(o, "dur", 0.25), ease: "power2.out", stagger: opt(o, "stagger", 0), immediateRender: false }, at);
  };
  UIX.fadeOut = function (tl, t, at, o) {
    return tl.fromTo(arr(t), { opacity: opt(o, "from", 1) }, { opacity: 0, duration: opt(o, "dur", 0.2), ease: "power2.in", immediateRender: false }, at);
  };
  UIX.show = function (tl, t, at) { return tl.set(arr(t), { opacity: 1 }, at); };
  UIX.hide = function (tl, t, at) { return tl.set(arr(t), { opacity: 0 }, at); };

  // 숫자 원·아이콘이 0.1초 간격으로 튀어나옴
  UIX.pop = function (tl, t, at, o) {
    return tl.fromTo(
      arr(t),
      { opacity: 0, scale: opt(o, "from", 0.5) },
      { opacity: 1, scale: 1, duration: opt(o, "dur", 0.26), ease: opt(o, "ease", "expo.out"), stagger: opt(o, "stagger", 0.1), immediateRender: false },
      at
    );
  };

  // 왼쪽 끝에서 폭이 자람 (하이라이트 박스, 태그 박스, 선)
  UIX.growX = function (tl, t, at, o) {
    return tl.fromTo(
      arr(t),
      { opacity: 1, scaleX: 0, transformOrigin: opt(o, "origin", "0% 50%") },
      { scaleX: 1, duration: opt(o, "dur", 0.45), ease: opt(o, "ease", "power3.out"), stagger: opt(o, "stagger", 0), immediateRender: false },
      at
    );
  };

  // SVG 획 그리기 (연결선, 리더 라인, 금색 사선)
  UIX.draw = function (tl, t, at, o) {
    var st = opt(o, "stagger", 0);
    arr(t).forEach(function (p, i) {
      var len = p.getTotalLength ? Math.ceil(p.getTotalLength()) + 2 : 1000;
      p.style.strokeDasharray = len + " " + len;
      p.style.strokeDashoffset = len;
      tl.fromTo(p, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: opt(o, "dur", 0.45), ease: opt(o, "ease", "power2.inOut"), immediateRender: false }, at + i * st);
    });
    return tl;
  };

  /* 글자 뒤 형광펜 / 키워드 박스: 0.4초에 왼쪽→오른쪽으로 칠한다.
     opts.color(+ opts.colorFrom)를 주면 박스가 지날 때 글자색도 바꾼다.
     밝은 바탕에서 박스 위 흰 글자를 쓸 때 필요하다. */
  UIX.marker = function (tl, t, at, o) {
    var d = opt(o, "dur", 0.4), st = opt(o, "stagger", 0.3);
    tl.fromTo(
      arr(t),
      { backgroundSize: "0% 100%" },
      { backgroundSize: "100% 100%", duration: d, ease: opt(o, "ease", "power2.inOut"), stagger: st, immediateRender: false },
      at
    );
    if (o && o.color) {
      tl.fromTo(arr(t), { color: opt(o, "colorFrom", "#4a4a4a") }, { color: o.color, duration: d * 0.5, ease: "none", stagger: st, immediateRender: false }, at + d * 0.35);
    }
    return tl;
  };

  /* 카드·칩 선택 상태: 회색 테두리 -> 파랑 테두리 + 옅은 링.
     시작과 끝 값을 모두 적었다(계산된 스타일 순서: 색이 먼저). 그래야 seek해도
     안전하고 GSAP가 그림자 목록을 보간할 수 있다. */
  var SH_IDLE = "rgba(32, 33, 36, 0.05) 0px 2px 4px 0px, rgba(32, 33, 36, 0.3) 0px 18px 44px -18px";
  var SH_ON = "rgba(26, 115, 232, 0.16) 0px 0px 0px 6px, rgba(32, 33, 36, 0.3) 0px 18px 44px -18px";
  UIX.activate = function (tl, t, at, o) {
    return tl.fromTo(
      arr(t),
      { borderColor: token("--uix-line", "#e3e6eb"), boxShadow: SH_IDLE },
      { borderColor: opt(o, "border", token("--uix-blue", "#1a73e8")), boxShadow: SH_ON, duration: opt(o, "dur", 0.22), ease: "power2.out", immediateRender: false },
      at
    );
  };
  UIX.deactivate = function (tl, t, at, o) {
    return tl.fromTo(
      arr(t),
      { borderColor: opt(o, "border", token("--uix-blue", "#1a73e8")), boxShadow: SH_ON },
      { borderColor: token("--uix-line", "#e3e6eb"), boxShadow: SH_IDLE, duration: 0.18, ease: "power2.out", immediateRender: false },
      at
    );
  };
  // 숫자 원·작은 노드가 파랑으로 (되돌리기는 UIX.numOff)
  UIX.numOn = function (tl, t, at, o) {
    return tl.fromTo(
      arr(t),
      { backgroundColor: "#ffffff", borderColor: "#dadce0", color: token("--uix-muted", "#5f6368") },
      { backgroundColor: token("--uix-blue-soft", "#e8f0fe"), borderColor: token("--uix-blue", "#1a73e8"), color: token("--uix-blue-ink", "#0b57d0"), duration: 0.2, ease: "power2.out", stagger: opt(o, "stagger", 0.05), immediateRender: false },
      at
    );
  };
  UIX.numOff = function (tl, t, at) {
    return tl.fromTo(
      arr(t),
      { backgroundColor: token("--uix-blue-soft", "#e8f0fe"), borderColor: token("--uix-blue", "#1a73e8"), color: token("--uix-blue-ink", "#0b57d0") },
      { backgroundColor: "#ffffff", borderColor: "#dadce0", color: token("--uix-muted", "#5f6368"), duration: 0.18, ease: "power2.out", immediateRender: false },
      at
    );
  };

  /* ---------------------------------------------------------------- 글자 */

  function splitChars(el) {
    if (el.__uixChars) return el.__uixChars;
    var text = el.textContent;
    el.textContent = "";
    var out = [];
    for (var i = 0; i < text.length; i++) {
      var s = document.createElement("span");
      s.textContent = text[i];
      s.style.opacity = "0";
      el.appendChild(s);
      out.push(s);
    }
    el.__uixChars = out;
    return out;
  }

  // 라벨 글자가 35ms마다 한 자씩 타이핑됨
  UIX.typeOn = function (tl, t, at, o) {
    arr(t).forEach(function (el) {
      tl.to(splitChars(el), { opacity: 1, duration: 0.001, stagger: opt(o, "step", 0.035) }, at);
    });
    return tl;
  };
  UIX.typeOff = function (tl, t, at, o) {
    arr(t).forEach(function (el) {
      tl.to(splitChars(el).slice().reverse(), { opacity: 0, duration: 0.001, stagger: opt(o, "step", 0.025) }, at);
    });
    return tl;
  };

  function splitWords(el) {
    if (el.__uixWords) return el.__uixWords;
    var nodes = Array.prototype.slice.call(el.childNodes);
    var out = [];
    el.textContent = "";
    nodes.forEach(function (n) {
      var isEl = n.nodeType === 1;
      var cls = isEl ? n.className : "";
      var dt = isEl ? n.getAttribute("data-t") : null;
      if (isEl && n.tagName === "BR") { el.appendChild(document.createElement("br")); return; }
      (n.textContent || "").split(/(\s+)/).forEach(function (p) {
        if (!p) return;
        if (/^\s+$/.test(p)) { el.appendChild(document.createTextNode(" ")); return; }
        var s = document.createElement("span");
        s.className = "uix-w" + (cls ? " " + cls : "");
        s.textContent = p;
        s.style.opacity = "0";
        if (dt !== null) { s.setAttribute("data-t", dt); dt = null; }
        el.appendChild(s);
        out.push(s);
      });
    });
    el.__uixWords = out;
    return out;
  }

  /* 단어 단위 등장 (키네틱 자막, 스티커 글자).
     타이밍: span의 data-t(`at` 기준 초) → 없으면 opts.times[i] → 없으면 i*step. */
  UIX.words = function (tl, t, at, o) {
    var step = opt(o, "step", 0.09);
    var times = opt(o, "times", null);
    arr(t).forEach(function (el) {
      splitWords(el).forEach(function (wd, i) {
        var dt = wd.getAttribute("data-t");
        var when = at + (dt !== null ? parseFloat(dt) : times ? times[i] : i * step);
        tl.fromTo(wd, { opacity: 0, filter: "blur(6px)" }, { opacity: 1, filter: "blur(0px)", duration: opt(o, "dur", 0.13), ease: "power2.out", immediateRender: false }, when);
      });
    });
    return tl;
  };
  UIX.wordsOf = function (el) { return splitWords(el); };

  /* ---------------------------------------------------------------- 카메라 */

  UIX.pushIn = function (tl, t, at, o) {
    return tl.to(arr(t), {
      scale: opt(o, "scale", 1.12), x: opt(o, "x", 0), y: opt(o, "y", 0),
      transformOrigin: opt(o, "origin", "50% 50%"),
      duration: opt(o, "dur", 1.1), ease: "power2.inOut",
    }, at);
  };

  /* ---------------------------------------------------------------- 전환 */

  // 다이어그램 → 다이어그램: 나가는 레이어가 카메라를 지나쳐 사라짐 (0.45초)
  UIX.zoomThrough = function (tl, t, at, o) {
    return tl.fromTo(
      arr(t),
      { scale: 1, opacity: 1, filter: "blur(0px)" },
      { scale: opt(o, "scale", 1.35), opacity: 0, filter: "blur(" + opt(o, "blur", 16) + "px)", duration: opt(o, "dur", 0.45), ease: "power3.in", immediateRender: false },
      at
    );
  };
  // …들어오는 레이어는 살짝 작고 흐린 상태에서 자리 잡음 (0.38초)
  UIX.zoomIn = function (tl, t, at, o) {
    return tl.fromTo(
      arr(t),
      { scale: opt(o, "from", 0.94), opacity: 0, filter: "blur(10px)" },
      { scale: 1, opacity: 1, filter: "blur(0px)", duration: opt(o, "dur", 0.38), ease: "expo.out", immediateRender: false },
      at
    );
  };

  /* TV 끄기: 화면이 타원 → 세로 슬릿으로 줄고, 가로선이 번쩍인 뒤 사라짐(약 0.67초).
     opts.v / opts.h는 .uix-crt-v / .uix-crt-h 선 요소(선택). */
  UIX.crtOff = function (tl, t, at, o) {
    var el = arr(t)[0];
    tl.fromTo(el, { clipPath: "ellipse(75% 75% at 50% 50%)" }, { clipPath: "ellipse(30% 62% at 50% 50%)", duration: 3 * F, ease: "power2.in", immediateRender: false }, at);
    tl.to(el, { clipPath: "ellipse(3% 50% at 50% 50%)", duration: 3 * F, ease: "power3.in" }, at + 3 * F);
    tl.set(el, { opacity: 0 }, at + 6 * F);
    var v = o && o.v, h = o && o.h;
    if (v) {
      tl.fromTo(v, { opacity: 1, scaleY: 1 }, { scaleY: 0.02, duration: 3 * F, ease: "power3.in", immediateRender: false }, at + 6 * F);
      tl.set(v, { opacity: 0 }, at + 9 * F);
    }
    if (h) {
      tl.fromTo(h, { opacity: 1, scaleX: 0.04 }, { scaleX: 1, duration: 5 * F, ease: "expo.out", immediateRender: false }, at + 9 * F);
      tl.to(h, { scaleX: 0, opacity: 0, duration: 5 * F, ease: "power2.in" }, at + 15 * F);
    }
    return tl;
  };

  /* 타이틀 "켜기": 엉뚱한 크기로 1프레임씩 두 번 번쩍인 뒤 0.22초 블러 인.
     자리 잡은 타이틀은 완전히 멈춰 있다. */
  UIX.titleFlash = function (tl, t, at, o) {
    var el = arr(t)[0];
    tl.set(el, { opacity: 1, scale: opt(o, "s1", 1.6), x: opt(o, "x1", -280), y: 30 }, at);
    tl.set(el, { opacity: 0 }, at + F);
    tl.set(el, { opacity: 1, scale: opt(o, "s2", 2.5), x: opt(o, "x2", 140), y: 0 }, at + 4 * F);
    tl.set(el, { opacity: 0, scale: 1, x: 0, y: 0 }, at + 5 * F);
    tl.fromTo(el, { opacity: 0, filter: "blur(6px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.22, ease: "power2.out", immediateRender: false }, at + 9 * F);
    return tl;
  };

  /* 레이어에 2프레임 RGB 글리치 (스폰서·새 화면으로 컷할 때).
     opts.bars: 함께 번쩍일 .uix-glitch 오버레이. */
  UIX.glitch = function (tl, t, at, o) {
    var els = arr(t), n = opt(o, "frames", 2);
    var looks = [
      { x: 30, skewX: 9, filter: "saturate(2.2) contrast(1.35) hue-rotate(-18deg)" },
      { x: -38, skewX: -6, filter: "saturate(2.6) brightness(1.3) hue-rotate(24deg)" },
      { x: 16, skewX: 3, filter: "contrast(1.6) saturate(1.8)" },
    ];
    for (var i = 0; i < n; i++) tl.set(els, looks[i % 3], at + i * F);
    tl.set(els, { x: 0, skewX: 0, filter: "none" }, at + n * F);
    var bars = o && o.bars;
    if (bars) {
      var kids = arr(bars.children);
      for (var j = 0; j < n; j++) {
        tl.set(bars, { opacity: 1 }, at + j * F);
        kids.forEach(function (b, k) { tl.set(b, { x: ((k * 37 + j * 53) % 120) - 60 }, at + j * F); });
      }
      tl.set(bars, { opacity: 0 }, at + n * F);
    }
    return tl;
  };

  /* ▶▶ 빨리감기: 아이콘이 켜지고, 창이 2프레임마다 빨강/청록 테두리로 떨리고,
     아이콘이 꺼진다. */
  UIX.fastForward = function (tl, icon, win, at, dur) {
    tl.set(arr(icon), { opacity: 1 }, at);
    tl.set(arr(icon), { opacity: 0 }, at + dur);
    var k = 0;
    for (var tt = 0; tt < dur - F; tt += 2 * F, k++) {
      tl.set(arr(win), {
        x: ((k % 3) - 1) * 5,
        filter: k % 2
          ? "drop-shadow(-7px 0 0 rgba(255,0,80,0.85)) drop-shadow(7px 0 0 rgba(0,230,255,0.85))"
          : "drop-shadow(6px 0 0 rgba(255,0,80,0.85)) drop-shadow(-6px 0 0 rgba(0,230,255,0.85))",
      }, at + tt);
    }
    tl.set(arr(win), { x: 0, filter: "none" }, at + dur);
    return tl;
  };

  /* ---------------------------------------------------------------- 소품 */

  // 스포트라이트: 화면을 어둡게·흐리게 한 뒤 앰버 테두리 발췌 카드가 착지
  UIX.spotlight = function (tl, dim, card, at, o) {
    UIX.fade(tl, dim, at, { dur: 0.25 });
    return tl.fromTo(
      arr(card),
      { opacity: 0, scale: opt(o, "from", 0.94), filter: "blur(8px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.3, ease: "expo.out", immediateRender: false },
      at + 0.06
    );
  };
  UIX.spotlightOut = function (tl, dim, card, at) {
    UIX.blurOut(tl, card, at, { dur: 0.18 });
    return UIX.fadeOut(tl, dim, at + 0.04, { dur: 0.2 });
  };

  // 리더 라인 주석: 점 팝 → 선 그리기 → 박스 블러 인
  UIX.callout = function (tl, dot, line, box, at) {
    UIX.pop(tl, dot, at, { from: 0.2, dur: 0.22 });
    UIX.draw(tl, line, at + 0.1, { dur: 0.3 });
    return UIX.blurIn(tl, box, at + 0.3, { y: 8 });
  };

  // 클릭 리플 (오렌지 링)
  UIX.ripple = function (tl, t, at) {
    return tl.fromTo(arr(t), { opacity: 1, scale: 0.3 }, { opacity: 0, scale: 1.5, duration: 0.45, ease: "power2.out", immediateRender: false }, at);
  };

  // 태그: 박스가 가운데서 열리고(0.15초) 글자가 타이핑됨
  UIX.tagIn = function (tl, box, text, at) {
    tl.fromTo(arr(box), { opacity: 1, scaleX: 0, transformOrigin: "50% 50%" }, { scaleX: 1, duration: 0.15, ease: "power3.out", immediateRender: false }, at);
    return UIX.typeOn(tl, text, at + 0.12);
  };
  UIX.tagOut = function (tl, box, text, at) {
    UIX.typeOff(tl, text, at);
    return tl.to(arr(box), { scaleX: 0, transformOrigin: "0% 50%", duration: 0.15, ease: "power2.in" }, at + 0.12);
  };

  // 모프 스티커: 작은 오렌지 사각형이 돌며 원이 되고(0.6초) 글자가 채워짐
  UIX.sticker = function (tl, t, at, o) {
    var el = arr(t)[0];
    tl.fromTo(el,
      { opacity: 0, scale: 0.08, rotation: -110, borderRadius: "14%" },
      { opacity: 1, scale: 1, rotation: 0, borderRadius: "50%", duration: 0.6, ease: "expo.out", immediateRender: false }, at);
    var txt = el.querySelector("div");
    if (txt) UIX.words(tl, txt, at + 0.45, { step: opt(o, "step", 0.1) });
    return tl;
  };

  // 문서를 위→아래로 훑는 스캔 라인 (2.2초)
  UIX.scan = function (tl, line, at, o) {
    var d = opt(o, "dur", 2.2);
    tl.set(arr(line), { opacity: 1 }, at);
    tl.fromTo(arr(line), { y: 0 }, { y: opt(o, "distance", 440), duration: d, ease: "power1.inOut", immediateRender: false }, at);
    return tl.to(arr(line), { opacity: 0, duration: 0.2, ease: "power2.in" }, at + d);
  };

  // 격자를 x 위치 순서로 왼쪽→오른쪽 물들이는 색 물결
  UIX.wave = function (tl, cells, at, o) {
    var els = arr(cells);
    var xs = els.map(function (e) { return e.offsetLeft + (e.offsetParent ? e.offsetParent.offsetLeft : 0); });
    var min = Math.min.apply(null, xs), max = Math.max.apply(null, xs);
    var span = opt(o, "span", 1.0);
    var to = opt(o, "to", { backgroundColor: "#d2e3fc", borderColor: "#8ab4f8" });
    els.forEach(function (e, i) {
      var v = {}; for (var k in to) v[k] = to[k];
      v.duration = opt(o, "dur", 0.25); v.ease = "power2.out";
      tl.to(e, v, at + ((xs[i] - min) / Math.max(1, max - min)) * span);
    });
    return tl;
  };

  /* ---------------------------------------------------------------- 장식 */

  // 챕터 카드의 성긴 "+" 점 (시드 고정이라 렌더마다 같음)
  UIX.crosses = function (container, o) {
    var cols = opt(o, "cols", 9), rows = opt(o, "rows", 5), keep = opt(o, "keep", 0.75);
    var W = opt(o, "w", 1920), H = opt(o, "h", 1080), r = rng(opt(o, "seed", 7));
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        if (r() > keep) continue;
        var i = document.createElement("i");
        i.style.left = Math.round(((x + 0.5) / cols) * W) + "px";
        i.style.top = Math.round(((y + 0.5) / rows) * H) + "px";
        container.appendChild(i);
      }
    }
    return container;
  };

  // 작은 문서 셀 격자 (줌아웃 "규모" 샷용)
  UIX.cells = function (container, o) {
    var cols = opt(o, "cols", 30), rows = opt(o, "rows", 14), gap = opt(o, "gap", 64), cls = opt(o, "cls", "uix-cell");
    var ox = opt(o, "x", 0), oy = opt(o, "y", 0), skip = opt(o, "skip", null);
    var out = [];
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var px = ox + x * gap, py = oy + y * gap;
        if (skip && skip(px, py)) continue;
        var c = document.createElement("i");
        c.className = cls;
        c.style.left = px + "px";
        c.style.top = py + "px";
        container.appendChild(c);
        out.push(c);
      }
    }
    return out;
  };

  w.UIX = UIX;
})(window);

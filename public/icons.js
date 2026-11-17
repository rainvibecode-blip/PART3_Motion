// Studio_001 아이콘 — 얇은 선 SVG 한 벌. 이모지·기호 문자 대신 <i class="ic ic-이름"></i>로 쓴다.
// 경로는 24×24 격자, 선 굵기 1.75. 색은 글자색(currentColor)을 따른다(CSS mask).
(function () {
  const P = {
    dashboard: "<rect x='3.5' y='3.5' width='7' height='7' rx='1.5'/><rect x='13.5' y='3.5' width='7' height='7' rx='1.5'/><rect x='3.5' y='13.5' width='7' height='7' rx='1.5'/><rect x='13.5' y='13.5' width='7' height='7' rx='1.5'/>",
    folder: "<path d='M3.5 7A2.5 2.5 0 0 1 6 4.5h3.6l2 2.5H18A2.5 2.5 0 0 1 20.5 9.5v7A2.5 2.5 0 0 1 18 19H6a2.5 2.5 0 0 1-2.5-2.5z'/>",
    download: "<path d='M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14'/>",
    video: "<rect x='3' y='5' width='18' height='14' rx='2.5'/><path d='M10 9.2v5.6l4.6-2.8z'/>",
    calendar: "<rect x='3.5' y='5' width='17' height='15.5' rx='2.5'/><path d='M3.5 10h17M8 3v4M16 3v4M8 14h2M12 14h2M8 17h2'/>",
    compose: "<path d='M11 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5V13'/><path d='M17.6 3.6a2 2 0 0 1 2.8 2.8L12.5 14.3 9 15l.7-3.5z'/>",
    image: "<rect x='3.5' y='4.5' width='17' height='15' rx='2.5'/><circle cx='9' cy='9.5' r='1.6'/><path d='m20.5 15.5-4.6-4.6L7 19.5'/>",
    activity: "<path d='M3 12h4l2.5-6.5 5 13L17 12h4'/>",
    layers: "<path d='m12 3.5 8.5 4.5-8.5 4.5L3.5 8z'/><path d='m3.5 12.5 8.5 4.5 8.5-4.5'/><path d='m3.5 16.5 8.5 4.5 8.5-4.5' opacity='.55'/>",
    history: "<path d='M3.5 12a8.5 8.5 0 1 0 2.5-6'/><path d='M3.5 4v4h4'/><path d='M12 7.5V12l3 2'/>",
    bookmark: "<path d='M6.5 3.5h11a1 1 0 0 1 1 1v16l-6.5-4-6.5 4v-16a1 1 0 0 1 1-1z'/>",
    settings: "<path d='M4 7h9M17 7h3M4 17h3M11 17h9'/><circle cx='15' cy='7' r='2'/><circle cx='9' cy='17' r='2'/>",
    idea: "<path d='M9.5 18h5M10.5 21h3'/><path d='M12 3a6 6 0 0 0-3.7 10.7c.8.7 1.2 1.4 1.2 2.3h5c0-.9.4-1.6 1.2-2.3A6 6 0 0 0 12 3z'/>",
    plus: "<path d='M12 5v14M5 12h14'/>",
    "arrow-right": "<path d='M5 12h14M13 6l6 6-6 6'/>",
    "arrow-left": "<path d='M19 12H5M11 6l-6 6 6 6'/>",
    external: "<path d='M8 16 16.5 7.5M9 7.5h7.5V15'/>",
    "chevron-right": "<path d='m9.5 6 6 6-6 6'/>",
    "chevron-down": "<path d='m6 9.5 6 6 6-6'/>",
    play: "<path d='M8 5.5v13l10.5-6.5z' fill='black'/>",
    check: "<path d='m5 12.5 4.5 4.5L19 7.5'/>",
    x: "<path d='M6.5 6.5l11 11M17.5 6.5l-11 11'/>",
    undo: "<path d='M9 14 4 9l5-5'/><path d='M4 9h10.5a5.5 5.5 0 0 1 0 11H11'/>",
    repeat: "<path d='m17 2.5 3.5 3.5-3.5 3.5'/><path d='M3.5 11.5V10a4 4 0 0 1 4-4h13'/><path d='m7 21.5-3.5-3.5L7 14.5'/><path d='M20.5 12.5V14a4 4 0 0 1-4 4h-13'/>",
    restart: "<path d='M6 5v14'/><path d='M18.5 5.5v13L9.5 12z'/>",
    "frame-prev": "<path d='M15 6l-6 6 6 6'/><path d='M19 6v12' opacity='.55'/>",
    "frame-next": "<path d='M9 6l6 6-6 6'/><path d='M5 6v12' opacity='.55'/>",
    refresh: "<path d='M20 11.5A8 8 0 0 0 6 6.3L4 8.5'/><path d='M4 4v4.5h4.5'/><path d='M4 12.5a8 8 0 0 0 14 5.2l2-2.2'/><path d='M20 20v-4.5h-4.5'/>",
    drop: "<path d='M12 3.2c2.6 3.4 6.2 7.9 6.2 11.4a6.2 6.2 0 0 1-12.4 0c0-3.5 3.6-8 6.2-11.4z'/>",
  };
  const url = (body) => "url(\"data:image/svg+xml," + encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'>" + body + "</svg>") + "\")";
  // :root에 --ic-이름 변수로도 두어 CSS 의사 요소(::before 체크 표시 등)에서 쓸 수 있게 한다
  const css = ":root{" + Object.entries(P).map(([k, v]) => `--ic-${k}:${url(v)};`).join("") + "}\n"
    + Object.keys(P).map((k) => `.ic-${k}{--ic:var(--ic-${k})}`).join("\n");
  const style = document.createElement("style");
  style.id = "studio-icons";
  style.textContent = css;
  document.head.append(style);
  window.icon = (name, cls = "") => `<i class="ic ic-${name}${cls ? " " + cls : ""}" aria-hidden="true"></i>`;
})();

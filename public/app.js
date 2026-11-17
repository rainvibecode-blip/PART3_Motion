// Studio_001 화면. 페이지: 새 영상 만들기 / 영상 / 작업 / 설정.
const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const h = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const media = (video, ...rest) => "/media/" + [video, ...rest].map(encodeURIComponent).join("/");
const api = async (url, body) => {
  const r = await fetch(url, body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : undefined);
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || r.statusText);
  return r.json();
};
function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 3200); }
const ago = (t) => { const d = (Date.now() - t) / 1000; return d < 60 ? "방금" : d < 3600 ? Math.floor(d / 60) + "분 전" : d < 86400 ? Math.floor(d / 3600) + "시간 전" : Math.floor(d / 86400) + "일 전"; };
const span = (ms) => { const s = Math.max(0, Math.round(ms / 1000)); return `${Math.floor(s / 60)}분 ${String(s % 60).padStart(2, "0")}초`; };
const STATUS = { waiting: "대기", running: "진행 중", done: "완료", failed: "실패", cancelled: "취소" };
const TYPE = { create: "새 영상", revise: "수정" };
const ENGINE = { claude: "Claude Code", codex: "Codex" };
const live = (j) => j.status === "running" || j.status === "waiting";

// ── 화면 밝기 ────────────────────────────────────────────────
const getTheme = () => { try { const v = localStorage.getItem("theme"); return v === "light" || v === "dark" ? v : "system"; } catch { return "system"; } };
function setTheme(v) {
  if (v === "system") document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme", v);
  try { localStorage.setItem("theme", v); } catch {}
  document.querySelectorAll("[data-theme-set]").forEach((b) => b.classList.toggle("on", b.dataset.themeSet === v));
}
$("#theme-seg").onclick = (e) => { const b = e.target.closest("[data-theme-set]"); if (b) setTheme(b.dataset.themeSet); };
setTheme(getTheme());

// ── 라우터 ───────────────────────────────────────────────────
const routes = {};
let cleanup = null;
async function render() {
  const [page, ...rest] = location.hash.replace(/^#\/?/, "").split("/");
  const arg = decodeURIComponent(rest.join("/"));
  if (cleanup) { cleanup(); cleanup = null; }
  const name = routes[page] ? page : "new";
  const nav = { video: "videos", job: "jobs" }[name] || name;
  document.querySelectorAll("#nav a").forEach((a) => a.classList.toggle("on", a.dataset.route === nav));
  const main = $("#main");
  try { cleanup = (await routes[name](main, arg)) || null; }
  catch (e) { main.innerHTML = `<div class="empty">화면을 불러오지 못했습니다: ${esc(e.message)}</div>`; }
  window.scrollTo(0, 0);
}
async function badges() {
  try {
    const [jobs, videos] = await Promise.all([api("/api/jobs"), api("/api/videos")]);
    $("#cnt-jobs").textContent = jobs.filter(live).length || "";
    $("#cnt-videos").textContent = videos.length || "";
  } catch {}
}
window.addEventListener("hashchange", render);
setInterval(badges, 5000);

// ── 새 영상 만들기 ───────────────────────────────────────────
routes.new = async (main) => {
  const info = await api("/api/info"), st = info.settings;
  main.innerHTML = `<div class="head"><div><h1>새 영상 만들기</h1><p class="sub">원고를 넣으면 장면을 설계하고 모션 영상을 만듭니다. 진행 상황과 결과는 '작업' 페이지에서 확인할 수 있습니다.</p></div></div>
  <form class="form" id="f" style="grid-template-columns:minmax(0,860px)">
    <div>
      <div class="field"><label>제목</label><input type="text" name="title" required maxlength="60" placeholder="예: 클로드코드 스킬 추천"><span class="hint">폴더 이름은 오늘 날짜 + 제목(공백→하이픈)으로 만들어집니다.</span></div>
      <div class="field"><label>스타일</label><div class="styles" id="styles">${Object.entries(info.styles).map(([k, s]) => `<div class="scard on" data-k="${k}" role="checkbox" aria-checked="true"><b>${esc(s.name)}</b><small>${esc(s.tagline)}</small></div>`).join("")}</div><span class="hint">${esc(info.styles.mono.desc)}</span></div>
      <div class="field"><label>원고</label><textarea name="script" required style="min-height:320px" placeholder="대본을 그대로 붙여넣으세요. 문단이 장면 경계가 됩니다."></textarea></div>
      <div class="field"><label>연출 아이디어 (선택)</label><textarea name="guide" style="min-height:120px" placeholder="장면별 연출 아이디어를 적으세요. 예:&#10;- 도입: 서버 아이콘 5개가 하나씩 쌓임&#10;- 두 번째 문단: 좌우 비교"></textarea><span class="hint">참고용입니다. 원고에 더 맞는 연출이 있으면 에이전트가 바꿀 수 있습니다.</span></div>
      <div class="field"><label>추가 지시 (선택)</label><textarea name="extra" style="min-height:70px" placeholder="예: 장면은 5개 이내로, 두 번째 문단은 단계 구도로"></textarea></div>
      <button class="btn primary" type="submit" id="go" style="width:100%;justify-content:center;padding:12px">${icon("play")}만들기 시작</button>
      <p class="hint" style="margin-top:8px">${info.installed ? "" : "처음 실행할 때는 영상 엔진(Remotion)과 렌더용 브라우저를 내려받습니다. 몇 분 더 걸립니다. "}${ENGINE[st.engine]}로 실행합니다. 엔진은 설정에서 바꿉니다. 중간에 멈추려면 작업 페이지에서 '취소'.</p>
    </div>
  </form>`;
  const f = $("#f");
  f.onsubmit = async (e) => {
    e.preventDefault(); const fd = new FormData(f), go = $("#go");
    go.disabled = true;
    try {
      const job = await api("/api/jobs", { style: "mono", title: fd.get("title"), script: fd.get("script"), guide: fd.get("guide"), extra: fd.get("extra") });
      location.hash = `#/job/${job.id}`;
    } catch (err) { toast(err.message); go.disabled = false; }
  };
};

// ── 영상 ─────────────────────────────────────────────────────
const thumb = (v) => v.stills.length ? `<img class="row-thumb" loading="lazy" src="${media(v.name, "output", "stills", v.stills[v.stills.length - 1])}" alt="">` : `<span class="row-thumb empty-thumb">미리보기 없음</span>`;
routes.videos = async (main) => {
  const videos = await api("/api/videos");
  main.innerHTML = `<div class="head"><div><h1>영상 ${videos.length}편</h1><p class="sub">만든 영상은 videos 폴더에 날짜_제목으로 저장됩니다.</p></div><div class="actions"><a class="btn primary" href="#/new">${icon("plus")}새 영상 만들기</a></div></div><div class="jlist" id="vl"></div>`;
  const list = $("#vl");
  if (!videos.length) list.innerHTML = `<div class="empty">아직 만든 영상이 없습니다. '새 영상 만들기'에서 원고를 넣어 보세요.</div>`;
  for (const v of videos) {
    const el = h(`<div class="jrow" role="link" tabindex="0">${thumb(v)}<div><div class="t">${esc(v.title)}</div><div class="s">${esc(v.date)} · ${v.full ? `장면 ${v.clips.length}개 · 전체본 있음` : "아직 렌더하지 않음"}</div></div><span class="chip soft">흑백</span><span class="muted">${icon("chevron-right")}</span></div>`);
    el.onclick = () => (location.hash = `#/video/${encodeURIComponent(v.name)}`); el.onkeydown = (e) => { if (e.key === "Enter") el.click(); };
    list.append(el);
  }
};
routes.video = async (main, name) => {
  const v = await api(`/api/videos/${encodeURIComponent(name)}`);
  const files = [...(v.full ? [{ label: "전체본", file: ["output", "전체.mp4"] }] : []), ...v.clips.map((c) => ({ label: c.replace(/\.mp4$/, ""), file: ["output", "장면별", c] }))];
  const running = v.jobs.find(live);
  main.innerHTML = `<a class="back" href="#/videos">${icon("arrow-left")}영상 목록</a>
  <div class="head"><div><h1>${esc(v.title)}</h1><p class="sub head-meta"><span class="chip">흑백 인포그래픽</span><span class="mono">${esc(v.name)}</span></p></div><div class="actions"><button class="btn" id="open">${icon("folder")}폴더 열기</button></div></div>
  ${running ? `<div class="panel" style="margin-bottom:20px"><span class="dot ${running.status}"></span> 이 영상의 작업이 ${STATUS[running.status]}입니다. <a href="#/job/${running.id}" style="color:var(--ink);font-weight:600">로그 열기</a></div>` : ""}
  ${files.length ? `<div class="board"><div class="clist" id="cl"></div><div class="player"><div class="stage"><video id="pv" controls></video></div><div class="actions"><a class="btn" id="dl" download>${icon("download")}이 파일 받기</a></div></div></div>` : `<div class="empty">아직 렌더한 영상이 없습니다.</div>`}
  <section class="panel" style="margin-top:24px"><h2>수정 요청</h2><form id="rev"><div class="field"><textarea name="note" required style="min-height:90px" placeholder="예: 두 번째 장면의 아이콘을 서버로 바꾸고, 마지막 장면을 3초 더 길게"></textarea></div><button class="btn primary" type="submit">${icon("play")}수정 시작</button></form></section>
  <section class="panel" style="margin-top:16px"><h2>원고</h2><pre style="white-space:pre-wrap;font:inherit;margin:0">${esc(v.script)}</pre></section>`;
  $("#open").onclick = () => api("/api/open", { video: v.name }).catch((e) => toast(e.message));
  if (files.length) {
    const pick = (i) => {
      const src = media(v.name, ...files[i].file);
      $("#pv").poster = v.stills.length ? media(v.name, "output", "stills", v.stills[v.stills.length - 1]) : ""; $("#pv").src = src; $("#dl").href = src;
      $("#cl").querySelectorAll(".item").forEach((b, n) => b.classList.toggle("on", n === i));
    };
    files.forEach((f, i) => { const b = h(`<button class="item" type="button" style="grid-template-columns:1fr"><span class="nm">${esc(f.label)}</span></button>`); b.onclick = () => { pick(i); $("#pv").play().catch(() => {}); }; $("#cl").append(b); });
    pick(0);
  }
  const rev = $("#rev");
  rev.onsubmit = async (e) => {
    e.preventDefault();
    try { const job = await api(`/api/videos/${encodeURIComponent(v.name)}/revise`, { note: rev.note.value }); location.hash = `#/job/${job.id}`; }
    catch (err) { toast(err.message); }
  };
};

// ── 작업 ─────────────────────────────────────────────────────
const jobLine = (j) => `${TYPE[j.type] || j.type} · ${ENGINE[j.engine] || j.engine}${j.model ? ` ${esc(j.model)}` : ""} · ${STATUS[j.status]} · ${live(j) ? `경과 <span class="job-eta" data-from="${j.startedAt}">${span(Date.now() - j.startedAt)}</span>` : `${ago(j.startedAt)}${j.endedAt ? ` · ${span(j.endedAt - j.startedAt)} 걸림` : ""}`}`;
const tickEta = (root) => root.querySelectorAll(".job-eta[data-from]").forEach((el) => (el.textContent = span(Date.now() - Number(el.dataset.from))));
routes.jobs = async (main) => {
  main.innerHTML = `<div class="head"><div><h1>작업</h1><p class="sub">진행 중인 작업과 지난 작업입니다. 한 번에 하나씩 실행하고 나머지는 대기합니다.</p></div></div><div class="jlist" id="jl"></div>`;
  const draw = async () => {
    const jobs = await api("/api/jobs"), jl = $("#jl"); if (!jl) return;
    jl.replaceChildren();
    if (!jobs.length) jl.innerHTML = `<div class="empty">아직 작업이 없습니다.</div>`;
    for (const j of jobs) {
      const el = h(`<div class="jrow${live(j) ? " live" : ""}" role="link" tabindex="0"><span class="dot ${j.status}"></span><div><div class="t">${esc(j.title)}</div><div class="s">${jobLine(j)}</div>${live(j) && j.lastLog ? `<div class="job-last">${esc(j.lastLog.text)}</div>` : ""}${j.failure ? `<div class="job-last">${esc(j.failure)}</div>` : ""}</div><span class="chip soft">${TYPE[j.type] || j.type}</span><span class="muted">${icon("chevron-right")}</span></div>`);
      el.onclick = () => (location.hash = `#/job/${j.id}`); el.onkeydown = (e) => { if (e.key === "Enter") el.click(); };
      jl.append(el);
    }
  };
  await draw();
  const timers = [setInterval(() => tickEta(main), 1000), setInterval(draw, 4000)];
  return () => timers.forEach(clearInterval);
};
routes.job = async (main, id) => {
  let j = await api(`/api/jobs/${id}`);
  main.innerHTML = `<a class="back" href="#/jobs">${icon("arrow-left")}작업 목록</a>
  <div class="head"><div><h1>${esc(j.title)}</h1><p class="sub head-meta" id="jmeta"></p></div>
    <div class="actions"><label class="switch muted" style="font-size:12.5px"><input type="checkbox" id="follow" checked> 자동 스크롤</label><button class="btn danger" id="cancel">취소</button><a class="btn primary" id="tovideo" href="#/video/${encodeURIComponent(j.video)}">${icon("video")}영상 보기</a></div></div>
  <div id="result" class="panel" style="margin-bottom:16px" hidden></div><div class="console" id="con"></div>`;
  const con = $("#con");
  const line = (l) => {
    con.append(h(`<div class="l ${esc(l.kind)}"><span class="k">${esc(l.kind)}</span><span>${esc(l.text)}</span></div>`));
    if ($("#follow").checked) con.scrollTop = con.scrollHeight;
  };
  const head = () => {
    $("#jmeta").innerHTML = `<span class="dot ${j.status}"></span><span>${jobLine(j)}</span>`;
    $("#cancel").disabled = !live(j);
    $("#tovideo").hidden = j.status !== "done";
    const box = $("#result"); box.hidden = !j.failure;
    box.innerHTML = j.failure ? `<b>작업이 끝나지 않았습니다.</b><p style="margin:6px 0 0;white-space:pre-wrap">${esc(j.failure)}</p>` : "";
  };
  j.log.forEach(line); head();
  $("#cancel").onclick = async () => { try { j = { ...j, ...(await api(`/api/jobs/${id}/cancel`, {})) }; head(); } catch (e) { toast(e.message); } };
  const es = new EventSource(`/api/jobs/${id}/stream`);
  es.addEventListener("log", (e) => line(JSON.parse(e.data)));
  es.addEventListener("job", (e) => { j = { ...j, ...JSON.parse(e.data) }; head(); badges(); });
  const timer = setInterval(() => tickEta(main), 1000);
  return () => { es.close(); clearInterval(timer); };
};

// ── 설정 ─────────────────────────────────────────────────────
routes.settings = async (main) => {
  const info = await api("/api/info"), s = info.settings;
  main.innerHTML = `<div class="head"><div><h1>설정</h1><p class="sub">설정은 이 컴퓨터의 data/settings.json에만 저장됩니다.</p></div></div>
  <form class="settings" id="sf">
    <div class="field"><label>기본 실행 엔진</label><select name="engine">${Object.entries(ENGINE).map(([k, v]) => `<option value="${k}"${s.engine === k ? " selected" : ""}>${v}</option>`).join("")}</select></div>
    <div class="field"><label>Claude 기본 모델</label><select name="claudeModel">${info.models.claude.map((m) => `<option value="${esc(m.id)}"${s.claudeModel === m.id ? " selected" : ""}>${esc(m.name)}</option>`).join("")}</select></div>
    <div class="field"><label>말 속도 (글자/초)</label><input type="number" name="charsPerSec" min="2" max="15" step="0.1" value="${esc(s.charsPerSec)}"><span class="hint">원고 길이로 영상 길이를 추정할 때 씁니다. 공백을 뺀 글자 수 기준입니다.</span></div>
    <div class="field"><label>Claude Code 실행 파일</label><input type="text" name="claudePath" value="${esc(s.claudePath)}"><span class="hint">터미널에서 claude가 실행되면 그대로 두세요. 찾지 못하면 전체 경로를 넣습니다.</span></div>
    <div class="field"><label>Codex 실행 파일</label><input type="text" name="codexPath" value="${esc(s.codexPath)}"></div>
    <button class="btn primary" type="submit">저장</button>
  </form>`;
  $("#sf").onsubmit = async (e) => {
    e.preventDefault();
    try { await api("/api/settings", Object.fromEntries(new FormData(e.target))); toast("저장했습니다"); } catch (err) { toast(err.message); }
  };
};

render(); badges();

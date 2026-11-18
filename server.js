// ────────────────────────────────────────────────────────────
//  Studio_001 — 원고를 넣으면 모션 영상을 만드는 로컬 앱.
//  스타일: 흑백 인포그래픽(Remotion, template/) · UI 해설 모션(HyperFrames, template-uix/ + skills/ui-explainer-motion)
//  http://localhost:3000 · 이 컴퓨터 안에서만 열린다(127.0.0.1).
//
//  흐름: 요청 → videos/<날짜>_<제목>/ 폴더 생성(스타일별 템플릿 복사) → Claude Code 또는 Codex CLI가
//        장면 코드를 쓰고 스틸로 확인하고 렌더 → output/전체.mp4 + output/장면별/*.mp4
//  API 키를 쓰지 않는다. 이 컴퓨터에 로그인된 CLI를 그대로 실행한다.
// ────────────────────────────────────────────────────────────
const express = require("express");
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { spawn } = require("child_process");

const ROOT = __dirname;
const TEMPLATE = path.join(ROOT, "template");
const TEMPLATE_UIX = path.join(ROOT, "template-uix");
const UIX_SKILL_BUNDLED = path.join(ROOT, "skills", "ui-explainer-motion");
const VIDEOS = path.join(ROOT, "videos");
const DATA = path.join(ROOT, "data");
const JOBS_DIR = path.join(DATA, "jobs");
const PORT = Number(process.env.PORT || 3000);
const WIN = process.platform === "win32";
for (const d of [VIDEOS, JOBS_DIR]) fs.mkdirSync(d, { recursive: true });

// ── 스타일 · 모델 ────────────────────────────────────────────
// 스타일마다 영상 엔진(Remotion / HyperFrames), 템플릿, 제작 지침이 다르다.
const STYLES = {
  mono: {
    name: "흑백 인포그래픽",
    chip: "흑백",
    tagline: "흰 배경 · 맥 브라우저 창 · 굵은 한글 산스 · 아이콘 중심",
    desc: "큰 선 아이콘과 짧은 키워드로 설명하는 흑백 무대입니다. 흐름·대비·단계를 그림으로 보여 줍니다.",
    kit: "remotion",
    guide: path.join(ROOT, "guide", "mono.md"),
  },
  uix: {
    name: "UI 해설 모션",
    chip: "UI 해설",
    tagline: "라이트 캔버스 · 스켈레톤 UI 카드 · 블러 등장 · 스포트라이트",
    desc: "구글 머티리얼처럼 정돈된 AI·생산성 해설 모션입니다. 숫자→카드, 흐름도, 문서 스캔, TIP·챕터 카드로 개념을 보여 줍니다. (ui-explainer-motion 스킬 · HyperFrames)",
    kit: "hyperframes",
    guide: path.join(ROOT, "guide", "uix.md"),
  },
};
const styleOf = (k) => (STYLES[k] ? k : "mono");
const publicStyles = () => Object.fromEntries(Object.entries(STYLES).map(([k, s]) => [k, { name: s.name, chip: s.chip, tagline: s.tagline, desc: s.desc, kit: s.kit }]));
const MODELS = {
  claude: [{ id: "", name: "CLI 기본 모델" }, { id: "opus", name: "Opus" }, { id: "sonnet", name: "Sonnet" }, { id: "haiku", name: "Haiku" }],
  codex: [{ id: "", name: "CLI 기본 모델" }],
};
const ENGINE_NAME = { claude: "Claude Code", codex: "Codex" };

// ── 설정 ─────────────────────────────────────────────────────
const SETTINGS_FILE = path.join(DATA, "settings.json");
const DEFAULTS = { engine: "claude", claudeModel: "", codexModel: "", claudePath: "claude", codexPath: "codex", charsPerSec: 6.5, uixSkillPath: "" };
const readJson = (file, fallback) => { try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return fallback; } };
const settings = () => ({ ...DEFAULTS, ...readJson(SETTINGS_FILE, {}) });
// UI 해설 모션 스킬 폴더. 설정에 경로가 있으면 그 폴더(내가 고치는 원본 스킬)를, 없으면 동봉본을 쓴다.
const uixSkillDir = () => {
  const p = settings().uixSkillPath.replace(/^~(?=\/|$)/, os.homedir());
  return p && fs.existsSync(path.join(p, "assets", "kit", "uix.js")) ? p : UIX_SKILL_BUNDLED;
};

// 더블클릭 실행은 PATH가 짧다. 흔한 설치 위치를 더한다.
// 다른 Claude Code 세션 안에서 서버를 켰을 때 따라 들어오는 세션 변수와, 구독 대신 API 과금으로 바꿔 버리는
// API 키 변수는 넘기지 않는다. 그래서 CLI는 항상 이 컴퓨터에 로그인된 구독 계정으로 실행된다.
const DROP_ENV = /^(CLAUDECODE|CLAUDE_CODE_(ENTRYPOINT|SESSION_ID|SESSION_ATTENDED|CHILD_SESSION|CHILD_NOTES_DIR|MESSAGING_SOCKET|MESSAGING_TOKEN|EXECPATH)|CLAUDE_PID|CLAUDE_EFFORT|CLAUDE_PLUGIN_DATA|ANTHROPIC_API_KEY|ANTHROPIC_AUTH_TOKEN)$/;
const childEnv = (extra = {}) => {
  const home = os.homedir();
  const more = WIN ? [] : [`${home}/.local/bin`, `${home}/.npm-global/bin`, "/opt/homebrew/bin", "/usr/local/bin"];
  const base = Object.fromEntries(Object.entries(process.env).filter(([k]) => !DROP_ENV.test(k)));
  return { ...base, FORCE_COLOR: "0", PATH: [...more, process.env.PATH || ""].join(path.delimiter), ...extra };
};
const NPM = WIN ? "npm.cmd" : "npm";

// ── 경로 안전 ────────────────────────────────────────────────
function safeJoin(base, rel) {
  const p = path.resolve(base, String(rel || ""));
  if (p !== base && !p.startsWith(base + path.sep)) throw new Error("허용되지 않는 경로입니다");
  return p;
}
const safeTitle = (title) => String(title || "").trim().replace(/[\\/:*?"<>|.]+/g, "").replace(/\s+/g, "-").slice(0, 60);
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

// ── 영상 목록 ────────────────────────────────────────────────
function videoInfo(name) {
  const dir = path.join(VIDEOS, name);
  if (!fs.existsSync(path.join(dir, "project"))) return null;
  const out = path.join(dir, "output");
  const list = (sub, ext) => { try { return fs.readdirSync(path.join(out, sub)).filter((f) => f.endsWith(ext)).sort(); } catch { return []; } };
  const full = fs.existsSync(path.join(out, "전체.mp4")) && fs.statSync(path.join(out, "전체.mp4")).size > 0;
  const m = name.match(/^(\d{4}-\d{2}-\d{2})_(.+)$/);
  return {
    name, date: m ? m[1] : "", title: (m ? m[2] : name).replace(/-/g, " "),
    style: styleOf(readJson(path.join(dir, "studio.json"), {}).style),
    full, clips: list("장면별", ".mp4"), stills: list("stills", ".jpg"),
    createdAt: fs.statSync(dir).birthtimeMs,
  };
}
const listVideos = () => fs.readdirSync(VIDEOS, { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith("."))
  .map((d) => videoInfo(d.name)).filter(Boolean).sort((a, b) => b.createdAt - a.createdAt);

// ── 새 영상 폴더 만들기 ──────────────────────────────────────
function scaffold(title, address, script, style) {
  const base = `${today()}_${safeTitle(title)}`;
  let name = base;
  for (let n = 2; fs.existsSync(path.join(VIDEOS, name)); n++) name = `${base}-${n}`;
  const dir = path.join(VIDEOS, name), project = path.join(dir, "project");
  fs.mkdirSync(path.join(dir, "output"), { recursive: true });
  if (STYLES[style].kit === "hyperframes") scaffoldUix(project, name);
  else {
    fs.cpSync(TEMPLATE, project, { recursive: true, filter: (src) => !/[\\/]node_modules([\\/]|$)/.test(src) });
    // 의존 패키지는 template 것 하나를 같이 쓴다(영상마다 새로 설치하지 않는다).
    fs.symlinkSync(path.join(TEMPLATE, "node_modules"), path.join(project, "node_modules"), WIN ? "junction" : "dir");
    const geo = path.join(project, "src", "geometry.ts");
    fs.writeFileSync(geo, fs.readFileSync(geo, "utf8").replace('export const ADDRESS: string = "";', () => `export const ADDRESS: string = ${JSON.stringify(String(address || "").trim().slice(0, 60))};`));
  }
  fs.writeFileSync(path.join(dir, "studio.json"), JSON.stringify({ style }, null, 2));
  fs.writeFileSync(path.join(dir, "원고.txt"), script);
  return name;
}
// HyperFrames 프로젝트 + ui-explainer-motion 키트(install-kit.sh 와 같은 배치) + 스킬 문서(uix-ref/).
function scaffoldUix(project, name) {
  const skill = uixSkillDir(), A = path.join(skill, "assets");
  const copyAll = (from, to, ok = () => true) => {
    fs.mkdirSync(to, { recursive: true });
    for (const f of fs.readdirSync(from)) if (!f.startsWith(".") && ok(f)) fs.cpSync(path.join(from, f), path.join(to, f), { recursive: true });
  };
  fs.cpSync(TEMPLATE_UIX, project, { recursive: true, filter: (src) => !/[\\/](node_modules|\.hyperframes)([\\/]|$)/.test(src) });
  copyAll(path.join(A, "kit"), path.join(project, "assets", "uix"));
  copyAll(path.join(A, "fonts"), path.join(project, "assets", "fonts"));
  copyAll(path.join(A, "sfx"), path.join(project, "assets", "sfx"));
  copyAll(path.join(A, "scenes"), path.join(project, "compositions"), (f) => f.endsWith(".html"));
  const ref = path.join(project, "uix-ref");
  fs.mkdirSync(ref, { recursive: true });
  fs.copyFileSync(path.join(skill, "SKILL.md"), path.join(ref, "SKILL.md"));
  copyAll(path.join(skill, "references"), path.join(ref, "references"));
  fs.copyFileSync(path.join(A, "starter", "index.html"), path.join(ref, "starter-index.html"));
  fs.writeFileSync(path.join(project, "meta.json"), JSON.stringify({ id: name, name, createdAt: new Date().toISOString() }, null, 2));
}

// ── 요청서(프롬프트) ─────────────────────────────────────────
function estimate(script) {
  const chars = script.replace(/\s/g, "").length, sec = chars / settings().charsPerSec;
  return { chars, sec: Math.round(sec) };
}
function buildPrompt(job) {
  const r = job.request, st = STYLES[styleOf(job.style)], guide = fs.readFileSync(st.guide, "utf8");
  if (job.type === "revise") return [
    guide, "", "# 이번 요청 — 기존 영상 수정",
    "이 폴더(project)의 영상은 이미 한 번 만들었습니다. 아래 수정 지시만 반영하고 다시 확인·렌더하세요. 지시와 무관한 장면은 바꾸지 마세요.",
    "", "## 수정 지시", r.note, "", "## 원고 (참고)", r.script || "(원고 파일 ../원고.txt 참조)",
  ].join("\n");
  const e = estimate(r.script);
  return [
    guide, "", "# 이번 요청 — 새 영상",
    `- 제목: ${r.title}`,
    `- 스타일: ${st.name}`,
    `- 원고 길이: 공백 제외 ${e.chars}자 · 말 속도 ${settings().charsPerSec}자/초 기준 약 ${e.sec}초`,
    r.sceneLen ? `- 장면 길이: ${r.sceneLen}` : "- 장면 길이: 설명량에 맞춰 자동",
    "", "## 원고", r.script,
    r.guide ? `\n## 연출 아이디어 (참고용 — 원고에 더 맞는 연출이 있으면 바꿔도 됩니다)\n${r.guide}` : "",
    r.extra ? `\n## 추가 지시\n${r.extra}` : "",
  ].join("\n");
}

// ── 작업 ─────────────────────────────────────────────────────
const jobs = [];
const streams = new Map();   // jobId → Set<res>
const jobDir = (job) => path.join(JOBS_DIR, job.id);
const publicJob = (j) => { const { proc, ...rest } = j; return rest; };
function saveJob(job) {
  fs.mkdirSync(jobDir(job), { recursive: true });
  fs.writeFileSync(path.join(jobDir(job), "job.json"), JSON.stringify(publicJob(job), null, 2));
}
const USER = (() => { try { return os.userInfo().username; } catch { return ""; } })();
const maskUser = (text) => (USER.length >= 3 ? text.split(USER).join("user") : text);
function log(job, kind, text) {
  // 화면 녹화·공유 때 사용자 이름이 든 전체 경로가 보이지 않게, 스튜디오 폴더와 홈 폴더 경로를 줄여 적는다.
  const line = { t: Date.now(), kind, text: maskUser(String(text).split(ROOT + path.sep).join("").split(os.homedir()).join("~")).slice(0, 6000) };
  fs.appendFileSync(path.join(jobDir(job), "log.jsonl"), JSON.stringify(line) + "\n");
  job.lastLog = { kind, text: line.text.split("\n")[0].slice(0, 200) };
  for (const res of streams.get(job.id) || []) res.write(`event: log\ndata: ${JSON.stringify(line)}\n\n`);
}
function setStatus(job, status, extra = {}) {
  Object.assign(job, { status }, extra);
  if (["done", "failed", "cancelled"].includes(status)) job.endedAt = Date.now();
  saveJob(job);
  for (const res of streams.get(job.id) || []) res.write(`event: job\ndata: ${JSON.stringify(publicJob(job))}\n\n`);
}
const loadLog = (job) => { try { return fs.readFileSync(path.join(jobDir(job), "log.jsonl"), "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l)); } catch { return []; } };

// 서버를 껐다 켜도 지난 작업이 남는다. 실행 중이던 작업은 멈춘 것으로 표시한다.
for (const id of fs.readdirSync(JOBS_DIR)) {
  const j = readJson(path.join(JOBS_DIR, id, "job.json"), null);
  if (!j) continue;
  if (j.status === "running" || j.status === "waiting") Object.assign(j, { status: "failed", endedAt: Date.now(), failure: "서버가 꺼져 작업이 멈췄습니다. 영상 화면에서 수정 요청으로 이어서 진행할 수 있습니다." });
  jobs.push(j);
}
jobs.sort((a, b) => b.startedAt - a.startedAt);

function readLines(stream, onLine) {
  let buffer = "";
  stream.setEncoding("utf8");
  stream.on("data", (text) => {
    buffer += text;
    let i;
    while ((i = buffer.indexOf("\n")) >= 0) { onLine(buffer.slice(0, i)); buffer = buffer.slice(i + 1); }
  });
  stream.on("end", () => { if (buffer.trim()) onLine(buffer); buffer = ""; });
}
// 명령 하나를 실행하고 출력을 작업 로그에 남긴다.
function run(job, cmd, args, cwd, { stdin, onLine, env } = {}) {
  return new Promise((resolve) => {
    let p;
    try { p = spawn(cmd, args, { cwd, env: childEnv(env), stdio: ["pipe", "pipe", "pipe"], shell: WIN }); }
    catch (e) { return resolve({ code: 1, error: e }); }
    job.proc = p;
    p.once("error", (error) => resolve({ code: 1, error }));
    p.stdin.on("error", () => {});
    readLines(p.stdout, onLine || ((t) => t.trim() && log(job, "out", t)));
    readLines(p.stderr, (t) => t.trim() && log(job, "info", t));
    p.once("close", (code, signal) => resolve({ code: code ?? 1, signal }));
    p.stdin.end(stdin ?? "");
  });
}

const CLAUDE_TOOLS = ["Read", "Write", "Edit", "Glob", "Grep", "Bash(npm run check:*)", "Bash(npm run stills:*)", "Bash(npm run render:*)", "Bash(ls:*)"];
const CLAUDE_TOOLS_BY_KIT = { remotion: [...CLAUDE_TOOLS, "Bash(npx tsc:*)"], hyperframes: CLAUDE_TOOLS };
async function runClaude(job, prompt, project) {
  const tools = CLAUDE_TOOLS_BY_KIT[STYLES[styleOf(job.style)].kit];
  const s = settings(), args = ["-p", "--output-format", "stream-json", "--verbose", "--permission-mode", "acceptEdits", "--add-dir", path.dirname(project), "--allowedTools", ...tools];
  if (job.model) args.push("--model", job.model);
  log(job, "cmd", `Claude Code · ${job.model || "CLI 기본 모델"} · 이 영상 폴더 안에서만 파일을 고칩니다`);
  let failure = "", completed = false, last = "";
  const r = await run(job, s.claudePath, args, project, {
    stdin: prompt + "\n\n렌더는 포그라운드로 실행하고 끝날 때까지 기다린 뒤 보고하세요(백그라운드 실행 금지).",
    // 헤드리스 세션은 보고하는 순간 끝난다. 백그라운드 실행을 끄고, 긴 렌더가 시간 한도에 걸리지 않게 한다.
    env: { CLAUDE_CODE_DISABLE_BACKGROUND_TASKS: "1", BASH_DEFAULT_TIMEOUT_MS: "3600000", BASH_MAX_TIMEOUT_MS: "3600000" },
    onLine: (text) => {
      if (!text.trim()) return;
      let ev; try { ev = JSON.parse(text); } catch { return log(job, "out", text); }
      if (ev.type === "system" && ev.subtype === "init") log(job, "info", `세션 시작 (${ev.model || "기본 모델"} · ${ev.apiKeySource && ev.apiKeySource !== "none" ? `API 키(${ev.apiKeySource}) 과금` : "로그인한 구독 계정"})`);
      if (ev.type === "assistant") for (const c of ev.message?.content || []) {
        if (c.type === "text" && c.text?.trim()) { last = c.text.trim(); log(job, "claude", last); }
        if (c.type === "tool_use") { const i = c.input || {}; log(job, "tool", `${c.name} · ${String(i.command || i.file_path || i.pattern || "").slice(0, 200)}`); }
      }
      if (ev.type === "result") {
        completed = true;
        if (ev.is_error || (ev.subtype && ev.subtype !== "success")) failure = ev.result || ev.subtype || "Claude 작업 실패";
        if (ev.result && ev.result !== last) { last = ev.result; log(job, "claude", last); }
      }
    },
  });
  return finish(r, failure, completed, last, s.claudePath, "Claude Code");
}
async function runCodex(job, prompt, project) {
  const s = settings(), args = ["exec", "--json", "--color", "never", "--sandbox", "workspace-write", "--skip-git-repo-check", "--add-dir", path.dirname(project), "-C", project];
  if (job.model) args.push("--model", job.model);
  args.push("-");
  log(job, "cmd", `Codex · ${job.model || "CLI 기본 모델"} · 이 영상 폴더 안에서만 파일을 고칩니다`);
  let failure = "", completed = false, last = "";
  const r = await run(job, s.codexPath, args, project, {
    stdin: prompt + "\n\n샌드박스 제한으로 스틸·렌더 명령이 실패하면 반복하지 말고, 장면 코드와 `npm run check` 통과까지만 끝낸 뒤 그 사실을 보고하세요. 스튜디오가 렌더를 이어서 실행합니다.",
    onLine: (text) => {
      if (!text.trim()) return;
      let ev; try { ev = JSON.parse(text); } catch { return log(job, "out", text); }
      const item = ev.item || {};
      if (ev.type === "thread.started") log(job, "info", "세션 시작");
      if (ev.type === "item.started" && item.type === "command_execution") log(job, "tool", item.command);
      if (ev.type === "item.completed") {
        if (item.type === "agent_message") { last = item.text || ""; log(job, "codex", last); }
        else if (item.type === "command_execution") { if (item.aggregated_output) log(job, item.exit_code ? "err" : "out", item.aggregated_output); }
        else if (item.type === "file_change") log(job, "tool", (item.changes || []).map((c) => `${c.kind} · ${c.path}`).join("\n"));
      }
      if (ev.type === "turn.failed") { failure = ev.error?.message || "Codex 작업 실패"; log(job, "err", failure); }
      if (ev.type === "turn.completed") completed = true;
    },
  });
  return finish(r, failure, completed, last, s.codexPath, "Codex");
}
function finish(r, failure, completed, last, bin, name) {
  if (r.error) return { ok: false, text: r.error.code === "ENOENT" ? `${name} CLI를 찾을 수 없습니다(${bin}). 설치와 로그인을 확인하거나 설정에서 실행 파일 경로를 지정하세요.` : String(r.error.message || r.error) };
  if (failure || r.code !== 0 || !completed) return { ok: false, text: failure || last || `${name}가 정상 결과 없이 끝났습니다 (code=${r.code}). CLI 로그인 상태와 사용 한도를 확인하세요.` };
  return { ok: true, text: last };
}

const fullMp4 = (video) => path.join(VIDEOS, video, "output", "전체.mp4");
const rendered = (job) => { try { const st = fs.statSync(fullMp4(job.video)); return st.size > 0 && st.mtimeMs >= job.startedAt; } catch { return false; } };

async function execute(job) {
  const project = path.join(VIDEOS, job.video, "project");
  const kit = STYLES[styleOf(job.style)].kit;
  setStatus(job, "running", { startedAt: Date.now() });
  try {
    if (kit === "remotion" && !fs.existsSync(path.join(TEMPLATE, "node_modules", "remotion"))) {
      log(job, "status", "처음 실행 — 영상 엔진(Remotion)을 설치합니다. 몇 분 걸립니다.");
      const r = await run(job, NPM, ["install", "--no-audit", "--no-fund"], TEMPLATE);
      if (job.cancelled) return;
      if (r.code !== 0) return setStatus(job, "failed", { failure: "Remotion 설치에 실패했습니다. 네트워크 연결과 Node.js 버전(20 이상)을 확인하세요." });
    }
    const prompt = buildPrompt(job);
    fs.writeFileSync(path.join(jobDir(job), "request.md"), prompt);
    log(job, "status", `${ENGINE_NAME[job.engine]}가 장면을 설계합니다.`);
    const result = await (job.engine === "codex" ? runCodex : runClaude)(job, prompt, project);
    if (job.cancelled) return;
    job.result = result.text;
    if (!result.ok) return setStatus(job, "failed", { failure: result.text });
    // 에이전트가 렌더까지 못 했으면(예: 샌드박스 제한) 스튜디오가 직접 렌더한다.
    if (!rendered(job)) {
      log(job, "status", "전체 영상 파일이 없어 스튜디오가 렌더를 실행합니다.");
      // HyperFrames 렌더는 시작할 때 스스로 lint 한다. Remotion만 먼저 타입 검사를 한다.
      const check = kit === "remotion" ? await run(job, NPM, ["run", "check"], project) : { code: 0 };
      if (job.cancelled) return;
      if (check.code !== 0) return setStatus(job, "failed", { failure: "장면 코드에 타입 오류가 남아 렌더하지 못했습니다. 영상 화면에서 수정 요청으로 이어서 진행하세요." });
      const r = await run(job, NPM, ["run", "render"], project);
      if (job.cancelled) return;
      if (r.code !== 0 || !rendered(job)) return setStatus(job, "failed", { failure: "렌더에 실패했습니다. 로그의 마지막 오류를 확인하세요." });
    }
    log(job, "status", "완료 — 영상 화면에서 결과를 확인하세요.");
    setStatus(job, "done");
  } catch (e) {
    if (!job.cancelled) setStatus(job, "failed", { failure: String(e.message || e) });
  } finally {
    delete job.proc;
    pump();
  }
}
// 한 번에 하나씩 실행한다. 렌더가 CPU를 많이 쓰기 때문이다.
function pump() {
  if (jobs.some((j) => j.status === "running")) return;
  const next = jobs.filter((j) => j.status === "waiting").sort((a, b) => a.createdAt - b.createdAt)[0];
  if (next) execute(next);
}
function addJob(fields) {
  const s = settings(), engine = MODELS[fields.engine] ? fields.engine : s.engine;
  const model = MODELS[engine].some((m) => m.id === fields.model) ? fields.model : s[engine + "Model"] || "";
  const job = { id: crypto.randomBytes(4).toString("hex"), status: "waiting", createdAt: Date.now(), startedAt: Date.now(), ...fields, engine, model };
  jobs.unshift(job); saveJob(job); pump();
  return job;
}

// ── HTTP ─────────────────────────────────────────────────────
const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(express.static(path.join(ROOT, "public")));
app.use("/media", express.static(VIDEOS, { acceptRanges: true, index: false, dotfiles: "ignore" }));
const fail = (res, e, code = 400) => res.status(code).json({ error: String(e.message || e) });

app.get("/api/info", (req, res) => res.json({ styles: publicStyles(), models: MODELS, settings: settings(), installed: fs.existsSync(path.join(TEMPLATE, "node_modules", "remotion")), uixSkill: maskUser(uixSkillDir().split(os.homedir()).join("~")) }));
app.post("/api/settings", (req, res) => {
  const b = req.body || {}, next = settings();
  for (const k of ["engine", "claudeModel", "codexModel", "claudePath", "codexPath", "uixSkillPath"]) if (typeof b[k] === "string") next[k] = b[k].trim();
  if (!MODELS[next.engine]) next.engine = DEFAULTS.engine;
  for (const k of ["claudePath", "codexPath"]) if (!next[k]) next[k] = DEFAULTS[k];
  const cps = Number(b.charsPerSec); if (cps >= 2 && cps <= 15) next.charsPerSec = cps;
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(next, null, 2));
  res.json(next);
});

app.get("/api/videos", (req, res) => res.json(listVideos()));
app.get("/api/videos/:name", (req, res) => {
  try {
    const dir = safeJoin(VIDEOS, req.params.name), info = videoInfo(path.basename(dir));
    if (!info) return res.status(404).json({ error: "영상을 찾을 수 없습니다" });
    let script = ""; try { script = fs.readFileSync(path.join(dir, "원고.txt"), "utf8"); } catch {}
    res.json({ ...info, script, jobs: jobs.filter((j) => j.video === info.name).map(publicJob) });
  } catch (e) { fail(res, e); }
});
app.post("/api/videos/:name/revise", (req, res) => {
  try {
    const dir = safeJoin(VIDEOS, req.params.name), info = videoInfo(path.basename(dir));
    if (!info) return res.status(404).json({ error: "영상을 찾을 수 없습니다" });
    const note = String(req.body?.note || "").trim();
    if (!note) throw new Error("수정할 내용을 적어 주세요");
    let script = ""; try { script = fs.readFileSync(path.join(dir, "원고.txt"), "utf8"); } catch {}
    res.json(publicJob(addJob({ type: "revise", title: info.title, video: info.name, style: info.style, engine: req.body.engine, model: req.body.model, request: { note, script } })));
  } catch (e) { fail(res, e); }
});
app.post("/api/open", (req, res) => {
  try {
    const dir = safeJoin(VIDEOS, req.body?.video || "");
    spawn(WIN ? "explorer" : process.platform === "darwin" ? "open" : "xdg-open", [dir], { detached: true, stdio: "ignore" }).unref();
    res.json({ ok: true });
  } catch (e) { fail(res, e); }
});

app.get("/api/jobs", (req, res) => res.json(jobs.map(publicJob)));
app.get("/api/jobs/:id", (req, res) => { const j = jobs.find((x) => x.id === req.params.id); j ? res.json({ ...publicJob(j), log: loadLog(j) }) : res.status(404).json({ error: "작업을 찾을 수 없습니다" }); });
app.get("/api/jobs/:id/stream", (req, res) => {
  const j = jobs.find((x) => x.id === req.params.id); if (!j) return res.status(404).end();
  res.set({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" }); res.flushHeaders();
  if (!streams.has(j.id)) streams.set(j.id, new Set());
  streams.get(j.id).add(res);
  req.on("close", () => streams.get(j.id)?.delete(res));
});
app.post("/api/jobs", (req, res) => {
  try {
    const b = req.body || {}, title = String(b.title || "").trim(), script = String(b.script || "").trim();
    if (!safeTitle(title)) throw new Error("제목을 입력하세요");
    if (script.length < 20) throw new Error("원고를 20자 이상 넣어 주세요");
    if (b.style && !STYLES[b.style]) throw new Error("지원하지 않는 스타일입니다");
    const style = styleOf(b.style);
    const video = scaffold(title, b.address, script, style);
    const request = { title, script, address: String(b.address || "").trim(), guide: String(b.guide || "").trim(), extra: String(b.extra || "").trim(), sceneLen: String(b.sceneLen || "").trim() };
    res.json(publicJob(addJob({ type: "create", title, video, style, engine: b.engine, model: b.model, request })));
  } catch (e) { fail(res, e); }
});
app.post("/api/jobs/:id/cancel", (req, res) => {
  const j = jobs.find((x) => x.id === req.params.id); if (!j) return res.status(404).json({ error: "작업을 찾을 수 없습니다" });
  if (j.status === "running" || j.status === "waiting") {
    j.cancelled = true;
    if (j.proc) { try { WIN ? spawn("taskkill", ["/pid", String(j.proc.pid), "/T", "/F"]) : j.proc.kill("SIGTERM"); } catch {} }
    log(j, "status", "사용자가 취소했습니다.");
    setStatus(j, "cancelled");
    pump();
  }
  res.json(publicJob(j));
});
app.get("*", (req, res) => res.sendFile(path.join(ROOT, "public", "index.html")));

app.listen(PORT, "127.0.0.1", () => console.log(`Studio_001 → http://localhost:${PORT}`));

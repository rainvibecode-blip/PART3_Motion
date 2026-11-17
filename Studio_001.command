#!/bin/bash
# Studio_001 바로가기 (macOS) — 더블클릭하면 서버를 켜고 브라우저를 연다.
# 끄기: 이 터미널 창에서 Ctrl+C

STUDIO="$(cd "$(dirname "$0")" && pwd)"
PORT="${PORT:-3000}"
URL="http://localhost:$PORT"

# 더블클릭 실행은 PATH가 짧다. node·npm·claude·codex의 흔한 설치 위치를 더한다.
export PATH="$HOME/.local/bin:$HOME/.npm-global/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

printf '\033]0;Studio_001\007'
clear
echo "Studio_001"
echo "────────────────────────────────"

# 이미 켜져 있으면 브라우저만 연다
if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "이미 실행 중입니다 → $URL"
  open "$URL"
  exit 0
fi

cd "$STUDIO" || { echo "폴더를 찾을 수 없습니다: $STUDIO"; read -r; exit 1; }

if ! command -v node >/dev/null 2>&1; then
  echo "node를 찾을 수 없습니다. Node.js 20 이상을 설치해 주세요 → https://nodejs.org"
  read -r; exit 1
fi

if [ ! -d node_modules ]; then
  echo "처음 실행 — 필요한 패키지를 설치합니다 (1분쯤)…"
  npm install --no-audit --no-fund --silent || { echo "설치 실패"; read -r; exit 1; }
fi

echo "서버를 켜는 중…  $URL"
PORT="$PORT" node server.js &
SERVER_PID=$!

# 서버가 뜨면 브라우저를 연다 (최대 20초 대기)
for _ in $(seq 1 40); do
  if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    open "$URL"
    echo "열었습니다 → $URL"
    echo "끄려면 이 창에서 Ctrl+C"
    echo "────────────────────────────────"
    break
  fi
  sleep 0.5
done

trap 'echo; echo "서버를 끕니다…"; kill "$SERVER_PID" 2>/dev/null; exit 0' INT TERM
wait "$SERVER_PID"

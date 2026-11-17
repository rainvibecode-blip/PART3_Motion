#!/usr/bin/env bash
# Studio_001 실행 — http://localhost:3000 (포트 바꾸기: PORT=5000 bash start.sh)
cd "$(dirname "$0")"
[ -d node_modules ] || npm install --no-audit --no-fund
PORT="${PORT:-3000}" node server.js

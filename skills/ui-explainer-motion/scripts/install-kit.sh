#!/usr/bin/env bash
# UI 설명 모션 키트를 HyperFrames 프로젝트에 복사한다.
#
#   install-kit.sh <프로젝트 폴더> [--scenes all|none|hl,tk,ch,dg,fl,dc,tp,sc] [--starter]
#
#   키트   -> <프로젝트>/assets/uix/uix.css, uix.js     (항상 덮어씀)
#   폰트   -> <프로젝트>/assets/fonts/Pretendard-*.woff2 (+ 라이선스 안내)
#   효과음 -> <프로젝트>/assets/sfx/*.mp3 (+ CREDITS.md)
#   씬     -> <프로젝트>/compositions/<이름>.html       (이미 있으면 건드리지 않음)
#   --starter 는 <프로젝트>/index.html 을 8씬 데모 릴로 바꾼다
#             (원래 파일은 index.html.before-uix 로 남긴다)
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
A="$SKILL_DIR/assets"

if [ $# -lt 1 ]; then
  sed -n '2,12p' "$0"; exit 1
fi
P="$1"; shift
SCENES="all"; STARTER=0
while [ $# -gt 0 ]; do
  case "$1" in
    --scenes) SCENES="$2"; shift 2 ;;
    --starter) STARTER=1; shift ;;
    *) echo "모르는 옵션: $1" >&2; exit 1 ;;
  esac
done

[ -d "$P" ] || { echo "프로젝트 폴더가 없음: $P (먼저 실행: npx hyperframes init $P --skip-skills --skill=hyperframes)" >&2; exit 1; }

mkdir -p "$P/assets/uix" "$P/assets/fonts" "$P/compositions"
cp "$A/kit/uix.css" "$A/kit/uix.js" "$P/assets/uix/"
cp "$A/fonts/"*.woff2 "$A/fonts/LICENSE-Pretendard.txt" "$P/assets/fonts/"
mkdir -p "$P/assets/sfx"
cp "$A/sfx/"*.mp3 "$A/sfx/CREDITS.md" "$P/assets/sfx/"
echo "키트   -> $P/assets/uix/ (uix.css, uix.js)"
echo "폰트   -> $P/assets/fonts/ (Pretendard 500/600/700/800)"
echo "효과음 -> $P/assets/sfx/ (whoosh-short, pop, sparkle, chime)"

# 씬 id -> 파일 이름
name_of() {
  case "$1" in
    hl) echo headlines ;; tk) echo talk ;; ch) echo chapter ;; dg) echo diagram ;;
    fl) echo flow ;; dc) echo doc-scan ;; tp) echo tip ;; sc) echo screen ;;
    *) echo "" ;;
  esac
}
if [ "$SCENES" != "none" ]; then
  [ "$SCENES" = "all" ] && SCENES="hl,tk,ch,dg,fl,dc,tp,sc"
  IFS=',' read -r -a IDS <<< "$SCENES"
  for id in "${IDS[@]}"; do
    n="$(name_of "$id")"
    [ -n "$n" ] || { echo "모르는 씬 id: $id" >&2; continue; }
    if [ -e "$P/compositions/$n.html" ]; then
      echo "씬     -> compositions/$n.html 이미 있어서 그대로 둠"
    else
      cp "$A/scenes/$n.html" "$P/compositions/$n.html"
      echo "씬     -> compositions/$n.html  (id \"$id\")"
    fi
  done
fi

if [ "$STARTER" = 1 ]; then
  # 확장자를 .html 로 두지 않는다: 루트에 .html 이 둘이면 진입점이 둘로 잡힌다
  [ -e "$P/index.html" ] && cp "$P/index.html" "$P/index.html.before-uix"
  cp "$A/starter/index.html" "$P/index.html"
  echo "index  -> 스타터 릴 (원래 파일은 index.html.before-uix 로 보관)"
else
  echo
  echo "$P/index.html 의 <head> 에서 GSAP 다음에 아래 두 줄을 넣는다:"
  echo '  <link rel="stylesheet" href="assets/uix/uix.css" />'
  echo '  <script src="assets/uix/uix.js"></script>'
  echo "그리고 $A/starter/index.html 의 Pretendard @font-face 블록과 .uix-font-names 줄을 옮겨 온다."
fi

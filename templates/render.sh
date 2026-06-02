#!/usr/bin/env bash
# Wrapper gọi tools/render-diagrams.mjs
# Pipeline: drawio CLI -> SVG -> Puppeteer -> PNG
#
# Cách dùng:
#   ./scripts/render.sh                       # render toàn bộ
#   ./scripts/render.sh 07b                   # filter theo tên file
#   ./scripts/render.sh 07b --keep-svg        # giữ lại SVG
#   ./scripts/render.sh 07b --scale 3         # PNG x3
#   ./scripts/render.sh 07b --border 30       # padding 30px

set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
    echo "[ERROR] Node.js không được cài đặt. Cần Node.js >= 18: https://nodejs.org" >&2
    exit 1
fi

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPT="$PROJECT_ROOT/tools/render-diagrams.mjs"

if [[ ! -f "$SCRIPT" ]]; then
    echo "[ERROR] Không tìm thấy: $SCRIPT" >&2
    exit 1
fi

if [[ ! -d "$PROJECT_ROOT/node_modules/puppeteer" ]]; then
    echo "Cài đặt puppeteer..."
    (cd "$PROJECT_ROOT" && npm install puppeteer)
fi

cd "$PROJECT_ROOT"
node "$SCRIPT" "$@"

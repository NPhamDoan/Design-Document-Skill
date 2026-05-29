#!/bin/bash
# Render tất cả file .drawio sang PNG bằng draw.io desktop CLI
# Yêu cầu: cài draw.io desktop
#   macOS:  brew install --cask drawio
#   Linux:  https://github.com/jgraph/drawio-desktop/releases

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
INPUT_DIR="$PROJECT_DIR/docs/document/diagrams/drawio-common"
OUTPUT_DIR="$PROJECT_DIR/docs/document/diagrams/drawio-export"

# Tìm drawio
if command -v drawio >/dev/null 2>&1; then
  DRAWIO="drawio"
elif [ -x "/Applications/draw.io.app/Contents/MacOS/draw.io" ]; then
  DRAWIO="/Applications/draw.io.app/Contents/MacOS/draw.io"
elif [ -x "/usr/local/bin/drawio" ]; then
  DRAWIO="/usr/local/bin/drawio"
else
  echo "[Render] Khong tim thay draw.io desktop"
  echo "  macOS:  brew install --cask drawio"
  echo "  Linux:  https://github.com/jgraph/drawio-desktop/releases"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

echo "[Render] Su dung: $DRAWIO"
echo "[Render] Input:   $INPUT_DIR"
echo "[Render] Output:  $OUTPUT_DIR"
echo ""

COUNTER=0
TOTAL=$(ls -1 "$INPUT_DIR"/*.drawio 2>/dev/null | wc -l)

for f in "$INPUT_DIR"/*.drawio; do
  [ -e "$f" ] || continue
  COUNTER=$((COUNTER + 1))
  basename_no_ext="$(basename "$f" .drawio)"
  output="$OUTPUT_DIR/${basename_no_ext}.png"
  echo "  [$COUNTER/$TOTAL] $(basename "$f")"

  "$DRAWIO" --export --format png --scale 2 --crop --border 20 --output "$output" "$f" >/dev/null 2>&1 || true

  if [ -f "$output" ]; then
    echo "         OK"
  else
    echo "         FAIL"
  fi
done

echo ""
echo "[Render] Hoan tat: $COUNTER file"

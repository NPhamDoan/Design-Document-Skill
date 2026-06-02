// Pipeline render diagram:
//   1. drawio CLI -> SVG (giữ nguyên kích thước nội dung, có --crop --border)
//   2. Puppeteer  -> SVG sang PNG (bằng Chromium engine)
//   3. Dọn SVG trung gian (giữ lại nếu có flag --keep-svg)
//
// Cách dùng:
//   node tools/render-diagrams.mjs                      # render toàn bộ -> PNG
//   node tools/render-diagrams.mjs 07b                  # filter theo tên file
//   node tools/render-diagrams.mjs 07b --keep-svg       # giữ lại file SVG
//   node tools/render-diagrams.mjs 07b --scale 3        # PNG độ phân giải x3 (mặc định x2)
//   node tools/render-diagrams.mjs 07b --border 30      # padding xung quanh nội dung (mặc định 20)
//
// Yêu cầu:
//   - draw.io desktop (winget install JGraph.Draw)
//   - Node.js >= 18
//   - npm install puppeteer

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "docs", "document", "diagrams", "drawio-common");
const OUT_DIR = path.join(ROOT, "docs", "document", "diagrams", "drawio-export");

// ========== Args ==========
const args = process.argv.slice(2);
const filter = args.find((a) => !a.startsWith("--")) || "";
const keepSvg = args.includes("--keep-svg");
const scaleIdx = args.indexOf("--scale");
const pngScale = scaleIdx >= 0 && args[scaleIdx + 1] ? parseFloat(args[scaleIdx + 1]) : 2;
const borderIdx = args.indexOf("--border");
const border = borderIdx >= 0 && args[borderIdx + 1] ? parseInt(args[borderIdx + 1]) : 20;

// ========== Validate ==========
if (!fs.existsSync(SRC_DIR)) {
  console.error(`Không tìm thấy thư mục source: ${SRC_DIR}`);
  process.exit(1);
}
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Tìm drawio desktop
const drawioCandidates = [
  "C:\\Program Files\\draw.io\\draw.io.exe",
  "C:\\Program Files (x86)\\draw.io\\draw.io.exe",
  process.env.LOCALAPPDATA
    ? path.join(process.env.LOCALAPPDATA, "Programs", "draw.io", "draw.io.exe")
    : null,
  "/Applications/draw.io.app/Contents/MacOS/draw.io",
  "/usr/bin/drawio",
].filter(Boolean);

const drawioExe = drawioCandidates.find((p) => fs.existsSync(p));
if (!drawioExe) {
  console.error("Không tìm thấy draw.io desktop.");
  console.error("  Windows: winget install JGraph.Draw");
  console.error("  macOS:   brew install --cask drawio");
  process.exit(1);
}
console.log(`drawio CLI: ${drawioExe}`);

// Danh sách file
const files = fs
  .readdirSync(SRC_DIR)
  .filter((f) => f.endsWith(".drawio"))
  .filter((f) => !filter || f.includes(filter))
  .map((f) => path.join(SRC_DIR, f));

if (files.length === 0) {
  console.warn("Không có file .drawio nào để render.");
  process.exit(0);
}

console.log(`Render ${files.length} file -> PNG (scale: ${pngScale}x, border: ${border}px)`);
console.log("");

// ========== Helpers ==========
async function waitForFile(p, timeoutMs = 15000) {
  let waited = 0;
  while (!fs.existsSync(p) && waited < timeoutMs) {
    await new Promise((r) => setTimeout(r, 300));
    waited += 300;
  }
  return fs.existsSync(p);
}

function parseSvgSize(svgContent) {
  const widthMatch = svgContent.match(/<svg[^>]+\bwidth="([\d.]+)(\w*)"/);
  const heightMatch = svgContent.match(/<svg[^>]+\bheight="([\d.]+)(\w*)"/);
  let widthPx = widthMatch ? parseFloat(widthMatch[1]) : 1200;
  let heightPx = heightMatch ? parseFloat(heightMatch[1]) : 800;
  // Một số drawio xuất với pt (1pt ≈ 1.333px)
  if (widthMatch && widthMatch[2] === "pt") widthPx *= 1.333333;
  if (heightMatch && heightMatch[2] === "pt") heightPx *= 1.333333;
  return { widthPx: Math.ceil(widthPx), heightPx: Math.ceil(heightPx) };
}

function buildHtml(svgContent, widthPx, heightPx) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${widthPx}px;height:${heightPx}px;overflow:hidden;background:#ffffff}
svg{display:block;width:${widthPx}px;height:${heightPx}px}
</style></head><body>${svgContent}</body></html>`;
}

// ========== Main ==========
const browser = await puppeteer.launch({ headless: true });
let ok = 0, fail = 0;

for (const src of files) {
  const baseName = path.basename(src, ".drawio");
  const svgPath = path.join(OUT_DIR, `${baseName}.svg`);
  const pngPath = path.join(OUT_DIR, `${baseName}.png`);
  const tmpHtml = path.join(OUT_DIR, `_tmp-${baseName}.html`);

  process.stdout.write(`  ${baseName} ... `);

  try {
    // Bước 1: drawio CLI -> SVG
    if (fs.existsSync(svgPath)) fs.unlinkSync(svgPath);
    execSync(
      `"${drawioExe}" --export --format svg --crop --border ${border} --output "${svgPath}" "${src}"`,
      { stdio: "ignore" }
    );
    if (!(await waitForFile(svgPath))) {
      console.log("FAIL (SVG not generated)");
      fail++;
      continue;
    }
    process.stdout.write("SVG ");

    // Bước 2: SVG -> HTML -> PNG qua Puppeteer
    const svgContent = fs.readFileSync(svgPath, "utf8");
    const { widthPx, heightPx } = parseSvgSize(svgContent);
    const html = buildHtml(svgContent, widthPx, heightPx);
    fs.writeFileSync(tmpHtml, html, "utf8");

    const page = await browser.newPage();
    await page.setViewport({
      width: widthPx,
      height: heightPx,
      deviceScaleFactor: pngScale,
    });
    await page.goto(`file:///${tmpHtml.replace(/\\/g, "/")}`, { waitUntil: "load" });

    if (fs.existsSync(pngPath)) fs.unlinkSync(pngPath);
    await page.screenshot({
      path: pngPath,
      clip: { x: 0, y: 0, width: widthPx, height: heightPx },
      omitBackground: false,
    });

    await page.close();

    // Bước 3: dọn file tạm
    if (fs.existsSync(tmpHtml)) fs.unlinkSync(tmpHtml);
    if (!keepSvg && fs.existsSync(svgPath)) fs.unlinkSync(svgPath);

    const kb = Math.round(fs.statSync(pngPath).size / 1024);
    console.log(`PNG OK [${widthPx}x${heightPx}] ${kb}KB`);
    ok++;
  } catch (e) {
    console.log(`FAIL (${e.message.split("\n")[0]})`);
    fail++;
    try { if (fs.existsSync(tmpHtml)) fs.unlinkSync(tmpHtml); } catch {}
  }
}

await browser.close();

console.log("");
console.log(`Hoàn tất: ${ok} thành công, ${fail} thất bại.`);
process.exit(fail);

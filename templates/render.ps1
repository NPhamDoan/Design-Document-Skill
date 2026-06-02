# Wrapper gọi tools/render-diagrams.mjs
# Pipeline: drawio CLI -> SVG -> Puppeteer -> PNG
#
# Cách dùng:
#   .\scripts\render.ps1                         # render toàn bộ
#   .\scripts\render.ps1 -File 07b               # filter theo tên
#   .\scripts\render.ps1 -KeepSvg                # giữ lại file SVG để debug
#   .\scripts\render.ps1 -Scale 3                # PNG độ phân giải x3
#   .\scripts\render.ps1 -Border 30              # padding 30px

[CmdletBinding()]
param(
    [string]$File = "",
    [int]$Scale = 2,
    [int]$Border = 20,
    [switch]$KeepSvg
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Kiểm tra Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js không được cài đặt. Cần Node.js >= 18: https://nodejs.org"
    exit 1
}

# Đường dẫn project
$projectRoot = Split-Path $PSScriptRoot -Parent
$scriptPath = Join-Path $projectRoot "tools\render-diagrams.mjs"

if (-not (Test-Path $scriptPath)) {
    Write-Error "Không tìm thấy: $scriptPath"
    exit 1
}

# Kiểm tra puppeteer đã cài chưa
$nodeModules = Join-Path $projectRoot "node_modules\puppeteer"
if (-not (Test-Path $nodeModules)) {
    Write-Host "Cài đặt puppeteer..." -ForegroundColor Yellow
    Push-Location $projectRoot
    try { npm install puppeteer } finally { Pop-Location }
}

# Build args
$nodeArgs = @($scriptPath)
if ($File)    { $nodeArgs += $File }
if ($KeepSvg) { $nodeArgs += "--keep-svg" }
if ($Scale -ne 2)   { $nodeArgs += @("--scale", $Scale) }
if ($Border -ne 20) { $nodeArgs += @("--border", $Border) }

# Chạy
Push-Location $projectRoot
try {
    & node @nodeArgs
    exit $LASTEXITCODE
} finally {
    Pop-Location
}

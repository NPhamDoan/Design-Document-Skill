# Render tất cả file .drawio sang PNG bằng draw.io desktop CLI
# Yêu cầu: cài draw.io desktop (winget install JGraph.Draw)

$ErrorActionPreference = "Stop"

$ProjectDir = Split-Path -Parent $PSScriptRoot
$InputDir = Join-Path $ProjectDir "docs\document\diagrams\drawio-common"
$OutputDir = Join-Path $ProjectDir "docs\document\diagrams\drawio-export"

# Tìm draw.io desktop
$DrawioPaths = @(
  "C:\Program Files\draw.io\draw.io.exe",
  "$env:LOCALAPPDATA\Programs\draw.io\draw.io.exe",
  "$env:ProgramFiles\draw.io\draw.io.exe"
)
$Drawio = $DrawioPaths | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $Drawio) {
  Write-Host "[Render] Khong tim thay draw.io desktop. Cai bang:" -ForegroundColor Red
  Write-Host "  winget install JGraph.Draw" -ForegroundColor Yellow
  exit 1
}

if (-not (Test-Path $OutputDir)) {
  New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

Write-Host "[Render] Su dung: $Drawio" -ForegroundColor Cyan
Write-Host "[Render] Input:   $InputDir" -ForegroundColor Cyan
Write-Host "[Render] Output:  $OutputDir" -ForegroundColor Cyan
Write-Host ""

$Files = Get-ChildItem -Path $InputDir -Filter "*.drawio"
$Total = $Files.Count
$Counter = 0

foreach ($File in $Files) {
  $Counter++
  $OutputFile = Join-Path $OutputDir ($File.BaseName + ".png")
  Write-Host "  [$Counter/$Total] $($File.Name)" -ForegroundColor Gray

  & $Drawio --export --format png --scale 2 --crop --border 20 --output $OutputFile $File.FullName 2>&1 | Out-Null

  if (Test-Path $OutputFile) {
    Write-Host "         OK $($OutputFile)" -ForegroundColor Green
  } else {
    Write-Host "         FAIL" -ForegroundColor Red
  }
}

Write-Host ""
Write-Host "[Render] Hoan tat: $Counter file" -ForegroundColor Green

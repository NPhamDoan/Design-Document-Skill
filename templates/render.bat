@echo off
REM Render tất cả file .drawio sang PNG bằng draw.io desktop CLI
REM Yêu cầu: cài draw.io desktop (winget install JGraph.Draw)

setlocal
set "PROJECT_DIR=%~dp0.."
set "INPUT_DIR=%PROJECT_DIR%\docs\document\diagrams\drawio-common"
set "OUTPUT_DIR=%PROJECT_DIR%\docs\document\diagrams\drawio-export"
set "DRAWIO=C:\Program Files\draw.io\draw.io.exe"

if not exist "%DRAWIO%" (
  echo [Render] Khong tim thay draw.io desktop tai: %DRAWIO%
  echo Cai bang lenh: winget install JGraph.Draw
  exit /b 1
)

if not exist "%OUTPUT_DIR%" (
  mkdir "%OUTPUT_DIR%"
)

echo [Render] Dang render PNG tu %INPUT_DIR%
echo [Render] Output: %OUTPUT_DIR%
echo.

for %%f in ("%INPUT_DIR%\*.drawio") do (
  echo   - %%~nxf
  "%DRAWIO%" --export --format png --scale 2 --crop --border 20 --output "%OUTPUT_DIR%\%%~nf.png" "%%f"
)

echo.
echo [Render] Hoan tat!
endlocal

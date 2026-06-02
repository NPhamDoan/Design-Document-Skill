@echo off
REM Wrapper goi tools/render-diagrams.mjs
REM Pipeline: drawio CLI -> SVG -> Puppeteer -> PNG
REM
REM Cach dung:
REM   scripts\render.bat                    -> render toan bo
REM   scripts\render.bat 07b                -> filter theo ten file
REM   scripts\render.bat 07b --keep-svg     -> giu lai SVG
REM   scripts\render.bat 07b --scale 3      -> PNG x3
REM   scripts\render.bat 07b --border 30    -> padding 30px

setlocal

where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js khong duoc cai dat. Can Node.js ^>= 18: https://nodejs.org
    exit /b 1
)

set "PROJECT_ROOT=%~dp0.."
set "SCRIPT=%PROJECT_ROOT%\tools\render-diagrams.mjs"

if not exist "%SCRIPT%" (
    echo [ERROR] Khong tim thay: %SCRIPT%
    exit /b 1
)

if not exist "%PROJECT_ROOT%\node_modules\puppeteer" (
    echo Cai dat puppeteer...
    pushd "%PROJECT_ROOT%"
    call npm install puppeteer
    popd
)

pushd "%PROJECT_ROOT%"
node "%SCRIPT%" %*
set EXITCODE=%ERRORLEVEL%
popd

exit /b %EXITCODE%

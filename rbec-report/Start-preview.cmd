@echo off
cd /d "%~dp0"
echo Open http://127.0.0.1:8765 in your browser.
echo Keep this window open while using the report. Press Ctrl+C to stop.
if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" (
  "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" -m http.server 8765 --bind 127.0.0.1
) else (
  py -3 -m http.server 8765 --bind 127.0.0.1
)
pause

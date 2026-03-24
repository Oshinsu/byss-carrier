@echo off
title BYSS CARRIER — Arret
color 0C

echo.
echo    Arret du BYSS CARRIER...
echo.

:: Kill Node.js processes on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING" 2^>nul') do (
    echo    Arret du processus PID %%a
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo    Le vaisseau est au port.
echo.
timeout /t 3 /nobreak >nul

@echo off
title BYSS CARRIER — The Executor
color 0B

echo.
echo    ██████╗ ██╗   ██╗███████╗███████╗
echo    ██╔══██╗╚██╗ ██╔╝██╔════╝██╔════╝
echo    ██████╔╝ ╚████╔╝ ███████╗███████╗
echo    ██╔══██╗  ╚██╔╝  ╚════██║╚════██║
echo    ██████╔╝   ██║   ███████║███████║
echo    ╚═════╝    ╚═╝   ╚══════╝╚══════╝
echo.
echo    ██████╗ █████╗ ██████╗ ██████╗ ██╗███████╗██████╗
echo    ██╔════╝██╔══██╗██╔══██╗██╔══██╗██║██╔════╝██╔══██╗
echo    ██║     ███████║██████╔╝██████╔╝██║█████╗  ██████╔╝
echo    ██║     ██╔══██║██╔══██╗██╔══██╗██║██╔══╝  ██╔══██╗
echo    ╚██████╗██║  ██║██║  ██║██║  ██║██║███████╗██║  ██║
echo     ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝
echo.
echo    THE EXECUTOR — Le Porte-Avions du BYSS EMPIRE
echo    ================================================
echo.

cd /d "%~dp0.."

echo    [*] Demarrage du vaisseau...
echo.

:: Check if node_modules exists
if not exist "node_modules" (
    echo    [!] Installation des dependances...
    call pnpm install
    echo.
)

:: Kill any existing process on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING" 2^>nul') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo    [*] Demarrage Next.js sur port 3000...
echo    [*] Le Pont s'ouvre...
echo.

:: Start dev server in background
start /B pnpm dev >nul 2>&1

:: Wait for server to be ready
echo    [*] Initialisation des systemes...
:wait_loop
timeout /t 2 /nobreak >nul
curl -s -o nul http://localhost:3000 2>nul
if errorlevel 1 goto wait_loop

echo.
echo    ================================================
echo    [OK] BYSS CARRIER operationnel sur port 3000
echo    [OK] Ouverture du navigateur...
echo    ================================================
echo.

:: Open in Chrome as app (PWA-like window)
start "" "chrome.exe" --app=http://localhost:3000 --window-size=1400,900 2>nul
if errorlevel 1 (
    :: Fallback: try default browser
    start http://localhost:3000
)

echo.
echo    Le vaisseau est en vol. Fermer cette fenetre arrete le serveur.
echo    Ctrl+C pour quitter.
echo.

:: Keep alive
:keep_alive
timeout /t 3600 /nobreak >nul
goto keep_alive

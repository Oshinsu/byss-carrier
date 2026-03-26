@echo off
:: Creates a desktop shortcut for BYSS CARRIER

set SCRIPT_DIR=%~dp0
set TARGET=%SCRIPT_DIR%launch.bat
set SHORTCUT=%USERPROFILE%\Desktop\BYSS CARRIER.lnk
set ICON=%SCRIPT_DIR%..\public\favicon.ico

:: Create VBScript to make shortcut (Windows native)
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\CreateShortcut.vbs"
echo sLinkFile = "%SHORTCUT%" >> "%TEMP%\CreateShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\CreateShortcut.vbs"
echo oLink.TargetPath = "%TARGET%" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.WorkingDirectory = "%SCRIPT_DIR%.." >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Description = "BYSS CARRIER - The Executor" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.WindowStyle = 7 >> "%TEMP%\CreateShortcut.vbs"
echo oLink.IconLocation = "%SCRIPT_DIR%..\public\app-icon.ico, 0" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Save >> "%TEMP%\CreateShortcut.vbs"

cscript //nologo "%TEMP%\CreateShortcut.vbs"
del "%TEMP%\CreateShortcut.vbs"

echo.
echo Raccourci "BYSS CARRIER" cree sur le Bureau !
echo Double-cliquez dessus pour lancer le vaisseau.
echo.
pause

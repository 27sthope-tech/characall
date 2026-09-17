@echo off
cd /d "%~dp0"
start "" wscript //nologo "%~dp0run-app.vbs"
exit /b
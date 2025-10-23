@echo off
echo Killing any existing node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo Starting backend server...
cd /d %~dp0
node server.js


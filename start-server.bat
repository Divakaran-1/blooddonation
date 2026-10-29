@echo off
set PATH=%PATH%;C:\Program Files\nodejs
title Blood Donation Backend Server
echo ==================================================
echo   Starting Blood Donation Backend Server...
echo ==================================================
cd /d "%~dp0server"
npm run dev
pause

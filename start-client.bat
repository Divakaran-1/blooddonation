@echo off
set PATH=%PATH%;C:\Program Files\nodejs
title Blood Donation Frontend (React)
echo ==================================================
echo   Starting Blood Donation Frontend (React)...
echo ==================================================
cd /d "%~dp0client"
npm run dev
pause

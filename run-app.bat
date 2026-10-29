@echo off
set PATH=%PATH%;C:\Program Files\nodejs
title Launch LifeDrop Blood Donation Portal

echo ========================================================
echo   Launching LifeDrop Blood Donation Management Portal...
echo ========================================================
echo.
echo 1. Starting Backend API Server (Port 5000)...
start "Backend Server (MongoDB)" cmd /k "cd /d ""%~dp0server"" && npm run dev"

echo 2. Waiting 3 seconds for server to start...
timeout /t 3 /nobreak >nul

echo 3. Starting React Frontend (Port 3000)...
start "React Frontend" cmd /k "cd /d ""%~dp0client"" && npm run dev"

echo 4. Opening Browser to http://localhost:3000...
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo ========================================================
echo   LifeDrop Portal is now running!
echo   Keep the two black terminal windows open while using the app.
echo ========================================================
echo.
pause


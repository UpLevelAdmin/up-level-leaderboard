@echo off
title Tournament Manager
echo Starting...
echo.

if not exist "node_modules" (
    echo [First Time Setup] Installing dependencies...
    echo This requires Internet connection. Please wait...
    call npm install
    echo.
)

echo Starting Server...
node server.js

if %errorlevel% neq 0 (
    echo.
    echo [Error Detected] Attempting to repair/install dependencies...
    call npm install
    echo.
    echo Retrying start...
    node server.js
)

pause

@echo off
setlocal
cd /d "%~dp0"
echo [1/3] Linting frontend...
call npm run lint
if errorlevel 1 goto :error
echo [2/3] Building frontend...
call npm run build
if errorlevel 1 goto :error
echo [3/3] Checking backend syntax...
node --check backend\src\server.js
if errorlevel 1 goto :error
node --check backend\src\db.js
if errorlevel 1 goto :error
echo.
echo Build verification passed.
exit /b 0
:error
echo Build verification failed.
exit /b 1

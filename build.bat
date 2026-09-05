@echo off
setlocal
cd /d "%~dp0"
echo [1/3] Linting frontend...
call npm run lint
if errorlevel 1 goto :error
echo [2/3] Building frontend...
call npm run build
if errorlevel 1 goto :error
echo [3/3] Checking Railway production commands and backend syntax...
node -e "const p=require('./package.json'); if(!p.scripts || !p.scripts.start) process.exit(1)"
if errorlevel 1 goto :error
call npm test --prefix backend
if errorlevel 1 goto :error
node --check backend\src\server.js
if errorlevel 1 goto :error
node --check backend\src\db.js
if errorlevel 1 goto :error
node --input-type=module -e "import('./backend/src/seed.js').then(m => { if(!Array.isArray(m.seedProducts) || m.seedProducts.length === 0) process.exit(1) })"
if errorlevel 1 goto :error
echo.
echo Build verification passed.
exit /b 0
:error
echo Build verification failed.
exit /b 1

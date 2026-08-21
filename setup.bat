@echo off
setlocal
cd /d "%~dp0"
echo [DTPT Techs] Installing frontend dependencies...
call npm install
if errorlevel 1 goto :error
echo [DTPT Techs] Installing backend dependencies...
pushd backend
call npm install
if errorlevel 1 (popd & goto :error)
if not exist .env copy .env.example .env >nul
popd
if not exist .env copy .env.example .env >nul
echo.
echo Setup complete. Update backend\.env, then run run.bat.
exit /b 0
:error
echo Setup failed. Review the error above.
exit /b 1

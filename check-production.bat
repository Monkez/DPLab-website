@echo off
setlocal

set "FRONTEND_URL=%~1"
set "BACKEND_URL=%~2"

if "%FRONTEND_URL%"=="" set "FRONTEND_URL=https://www.dtpt.shop"
if "%BACKEND_URL%"=="" set "BACKEND_URL=https://api.dtpt.shop"

echo [1/3] Checking frontend: %FRONTEND_URL%
curl.exe --fail --silent --show-error --location --output NUL "%FRONTEND_URL%"
if errorlevel 1 goto :error

echo [2/3] Checking backend health: %BACKEND_URL%/api/health
curl.exe --fail --silent --show-error "%BACKEND_URL%/api/health"
if errorlevel 1 goto :error
echo.

echo [3/3] Checking catalogue bootstrap: %BACKEND_URL%/api/bootstrap
curl.exe --fail --silent --show-error --output NUL "%BACKEND_URL%/api/bootstrap"
if errorlevel 1 goto :error

echo.
echo Railway production checks passed.
exit /b 0

:error
echo.
echo Production check failed. Review the URL and Railway deployment logs.
exit /b 1

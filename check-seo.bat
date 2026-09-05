@echo off
setlocal
set "SITE_URL=%~1"
if "%SITE_URL%"=="" set "SITE_URL=https://www.dtpt.shop"
echo Checking SEO endpoints at %SITE_URL%...
node scripts\check-seo.mjs "%SITE_URL%"
if errorlevel 1 (
  echo SEO check failed.
  exit /b 1
)
echo SEO check passed.

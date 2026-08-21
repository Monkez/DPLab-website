@echo off
setlocal
cd /d "%~dp0"
if not exist node_modules call setup.bat
if errorlevel 1 exit /b 1
echo Starting DTPT Techs frontend and backend...
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:10000
start "" /b cmd /c "cd /d ""%~dp0backend"" && npm run dev"
call npm run dev

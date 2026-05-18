@echo off
echo ===================================
echo   EchoEngage - Starting Services
echo ===================================
echo.

:: Start backend
echo [1/2] Starting Python backend on port 8000...
cd /d "%~dp0backend"
start "EchoEngage-Backend" cmd /c "python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

:: Wait for backend to start
timeout /t 3 /nobreak > nul

:: Start frontend
echo [2/2] Starting React frontend on port 5173...
cd /d "%~dp0frontend"
start "EchoEngage-Frontend" cmd /c "npm run dev"

echo.
echo ===================================
echo   EchoEngage is starting up!
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:5173
echo   API Docs: http://localhost:8000/docs
echo ===================================
echo.
echo Press any key to exit (servers will keep running)
pause > nul

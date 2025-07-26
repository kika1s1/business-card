@echo off
echo.
echo ===============================================
echo  Business Card Builder - Development Setup
echo ===============================================
echo.
echo Starting fake server on port 3001...
cd server
start "Fake Server" cmd /k "npm start"
echo.
echo Waiting for server to start...
timeout /t 3 /nobreak >nul
echo.
echo Starting frontend on port 5173...
cd ..\client
start "Frontend" cmd /k "npm run dev"
echo.
echo ===============================================
echo  Both servers are starting!
echo.
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:3001
echo.
echo  Admin Login: admin@test.com / admin123
echo  User Login:  john@test.com / user123
echo ===============================================
echo.
pause 
@echo off
echo.
echo ===============================================
echo  Business Card Builder - Development Setup
echo ===============================================
echo.

echo Step 1: Checking if fake server is already running...
netstat -an | findstr ":3001" >nul
if %errorlevel% equ 0 (
    echo ✅ Server already running on port 3001
) else (
    echo 🚀 Starting fake server on port 3001...
    cd server
    start "Fake API Server" cmd /c "echo Starting fake server... && npm start && pause"
    cd ..
    echo ⏳ Waiting for server to initialize...
    timeout /t 5 /nobreak >nul
)

echo.
echo Step 2: Checking if frontend is already running...
netstat -an | findstr ":5173" >nul
if %errorlevel% equ 0 (
    echo ✅ Frontend already running on port 5173
    goto :show_info
)

netstat -an | findstr ":5174" >nul
if %errorlevel% equ 0 (
    echo ✅ Frontend already running on port 5174
    goto :show_info
)

echo 🚀 Starting frontend...
cd client
start "Frontend Dev Server" cmd /c "echo Starting frontend... && npm run dev && pause"
cd ..

:show_info
echo.
echo ===============================================
echo  🎉 Development servers starting!
echo.
echo  📋 Access Points:
echo  Frontend: http://localhost:5173 OR http://localhost:5174
echo  Backend:  http://localhost:3001
echo.
echo  🔐 Login Credentials:
echo  Admin:    admin@test.com / admin123
echo  User:     john@test.com / user123
echo.
echo  🔧 If login fails:
echo  1. Run test-server.bat to check server
echo  2. Open client/clear-auth.html to clear auth state
echo ===============================================
echo.
pause 
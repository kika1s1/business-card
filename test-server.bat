@echo off
echo Testing fake server...
echo.

echo 1. Testing if server is running on port 3001...
netstat -an | findstr ":3001"
if %errorlevel% neq 0 (
    echo ❌ Server is NOT running on port 3001
    echo.
    echo Starting server...
    cd server
    start "Fake Server" cmd /k "npm start"
    echo.
    echo ⏳ Waiting for server to start...
    timeout /t 5 /nobreak >nul
    cd ..
) else (
    echo ✅ Server is running on port 3001
)

echo.
echo 2. Testing API endpoints...
echo.

echo Testing templates endpoint:
curl -s http://localhost:3001/api/templates
if %errorlevel% equ 0 (
    echo ✅ Templates endpoint working
) else (
    echo ❌ Templates endpoint failed
)

echo.
echo Testing login endpoint:
curl -s -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@test.com\",\"password\":\"admin123\"}"
if %errorlevel% equ 0 (
    echo ✅ Login endpoint working
) else (
    echo ❌ Login endpoint failed
)

echo.
echo ===============================================
echo If tests pass, try frontend again at:
echo http://localhost:5174/login
echo.
echo Admin login: admin@test.com / admin123
echo ===============================================
pause 
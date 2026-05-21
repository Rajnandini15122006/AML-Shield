@echo off
echo ===================================================
echo               Starting AML Shield System
echo ===================================================

echo [1/3] Starting MongoDB database...
start "MongoDB Database" /Min "C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe" --dbpath "d:\UserData\Desktop\EDI\AML-Fraud-Detection-System\mongodb_data" --port 27017 --bind_ip 127.0.0.1

echo [2/3] Starting Backend Server (Express)...
cd aml-backend
start "AML Backend" npm run dev

echo [3/3] Starting Frontend Client (Vite)...
cd ../aml-frontend
start "AML Frontend" npm run dev

echo ===================================================
echo  AML Shield successfully initialized!
echo  - Backend running on: http://localhost:5000/
echo  - Frontend running on: http://localhost:5173/
echo ===================================================
echo.
echo Press any key to exit this starter console. (Servers will keep running in their own windows).
pause > nil

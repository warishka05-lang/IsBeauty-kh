@echo off
cd /d %~dp0
start "ISBEAUTY BACKEND" cmd /k "cd server && if not exist node_modules npm install && npm start"
start "ISBEAUTY FRONTEND" cmd /k "cd client && python -m http.server 5500"
timeout /t 3 /nobreak >nul
start http://127.0.0.1:5500/site.html
start http://127.0.0.1:5500/admin.html

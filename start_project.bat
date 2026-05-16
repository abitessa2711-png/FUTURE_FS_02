@echo off
echo Starting Backend Server...
start cmd /k "cd backend && npm start"

echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo Both servers are running. You can close this window now.

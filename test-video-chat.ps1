# PowerShell script to test video chat
Write-Host "🎥 MaskChat Video Chat Testing Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if backend is running
Write-Host "📡 Checking if backend server is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/health" -TimeoutSec 2 -UseBasicParsing
    Write-Host "✅ Backend server is running on port 5001" -ForegroundColor Green
    Write-Host ""
    Write-Host "Server Health:" -ForegroundColor Cyan
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
    Write-Host ""
} catch {
    Write-Host "❌ Backend server is NOT running" -ForegroundColor Red
    Write-Host ""
    Write-Host "To start the backend server:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor White
    Write-Host "  npm start" -ForegroundColor White
    Write-Host ""
}

# Check if frontend is accessible
Write-Host "🌐 Checking if frontend is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -UseBasicParsing
    Write-Host "✅ Frontend is running on port 3000" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Frontend is NOT running" -ForegroundColor Red
    Write-Host ""
    Write-Host "To start the frontend:" -ForegroundColor Yellow
    Write-Host "  cd frontend" -ForegroundColor White
    Write-Host "  npm start" -ForegroundColor White
    Write-Host ""
}

Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Ensure both backend and frontend are running" -ForegroundColor White
Write-Host "2. Open http://localhost:3000 in TWO browser windows" -ForegroundColor White
Write-Host "3. Click 'Video Chat' in BOTH windows" -ForegroundColor White
Write-Host "4. Allow camera/microphone permissions in both" -ForegroundColor White
Write-Host "5. Both users should connect automatically in 2-5 seconds" -ForegroundColor White
Write-Host ""
Write-Host "📖 For detailed testing guide, see: VIDEO_CHAT_TEST_GUIDE.md" -ForegroundColor Yellow
Write-Host ""


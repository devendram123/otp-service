@echo off
echo ========================================================
echo   🚀 Deploying OTP API to GitHub for 12rajdev
echo ========================================================
echo.
echo [1/3] Checking if remote origin is set...
git remote set-url origin https://github.com/12rajdev/otp-service.git

echo [2/3] Adding changes and committing...
git add .
git commit -m "deploy: update project" 2>nul

echo [3/3] Pushing to GitHub (You may be asked for credentials)...
echo.
echo IMPORTANT: If prompted, use your GitHub username (12rajdev) 
echo and your Personal Access Token (NOT your password).
echo.
git push -u origin main

echo.
if %errorlevel% neq 0 (
    echo ❌ Push failed. Please check your credentials and try again.
    echo    Note: You must have created the repository 'otp-service' on GitHub first!
    echo    Go to: https://github.com/new and name it 'otp-service'
) else (
    echo ✅ Successfully pushed to https://github.com/12rajdev/otp-service
    echo.
    echo Next steps:
    echo 1. Go to https://dashboard.render.com
    echo 2. Click New - Web Service
    echo 3. Connect 'otp-service'
    echo 4. Click Deploy!
)
pause

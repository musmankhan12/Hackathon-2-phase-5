@echo off
REM Pre-deployment checklist script for Vercel (Windows version)

echo 🔍 Running pre-deployment checks for Vercel...
echo.

echo ✅ Checking if all required files exist...
set "REQUIRED_FILES=frontend\package.json frontend\next.config.js frontend\tsconfig.json frontend\vercel.json"

for %%f in (%REQUIRED_FILES%) do (
    if exist "%%f" (
        echo    Found: %%f ✓
    ) else (
        echo    Missing: %%f ✗
        set "MISSING=1"
    )
)

echo.
echo ✅ Checking if build succeeds locally...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo    Build failed ✗
    set "BUILD_FAILED=1"
) else (
    echo    Build succeeded ✓
)

cd ..

echo.
echo ⚠️  Checking for common environment variable issues...
if exist ".env.example" (
    echo    Found environment example: .env.example
    type .env.example
    echo.
)

if exist "frontend\.env.local.example" (
    echo    Found environment example: frontend\.env.local.example
    type frontend\.env.local.example
    echo.
)

echo.
echo 📋 Pre-deployment checklist summary:
echo.
echo Before deploying to Vercel, ensure you have:
echo 1. Set up a PostgreSQL database (e.g., on Neon)
echo 2. Configured all required environment variables in Vercel dashboard
echo 3. Updated API endpoints to work with your deployment setup
echo 4. Tested the build locally with 'npm run build'
echo.
echo For detailed instructions, see VERCEL_DEPLOYMENT_INSTRUCTIONS.md
echo.

if "%MISSING%"=="1" goto :error
if "%BUILD_FAILED%"=="1" goto :error

echo ✅ No obvious issues detected. Ready for Vercel deployment!
goto :end

:error
echo ❌ Issues detected that may prevent successful deployment

:end
pause
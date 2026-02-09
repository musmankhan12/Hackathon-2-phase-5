#!/bin/bash
# Pre-deployment checklist script for Vercel

echo "🔍 Running pre-deployment checks for Vercel..."

echo ""
echo "✅ Checking if all required files exist..."
REQUIRED_FILES=(
  "frontend/package.json"
  "frontend/next.config.js" 
  "frontend/tsconfig.json"
  "frontend/vercel.json"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "   Found: $file ✓"
  else
    echo "   Missing: $file ✗"
    MISSING=1
  fi
done

echo ""
echo "✅ Checking if build succeeds locally..."
cd frontend
if npm run build; then
  echo "   Build succeeded ✓"
else
  echo "   Build failed ✗"
  BUILD_FAILED=1
fi

echo ""
echo "⚠️  Checking for common environment variable issues..."
ENV_EXAMPLES=(
  "../.env.example"
  ".env.local.example"
)

for env_file in "${ENV_EXAMPLES[@]}"; do
  if [ -f "$env_file" ]; then
    echo "   Found environment example: $env_file"
    echo "   Contents:"
    cat "$env_file" | sed 's/^/     /'
    echo ""
  fi
done

echo ""
echo "📋 Pre-deployment checklist summary:"
echo ""
echo "Before deploying to Vercel, ensure you have:"
echo "1. Set up a PostgreSQL database (e.g., on Neon)"
echo "2. Configured all required environment variables in Vercel dashboard"
echo "3. Updated API endpoints to work with your deployment setup"
echo "4. Tested the build locally with 'npm run build'"
echo ""
echo "For detailed instructions, see VERCEL_DEPLOYMENT_INSTRUCTIONS.md"

if [ "$MISSING" == "1" ] || [ "$BUILD_FAILED" == "1" ]; then
  echo ""
  echo "❌ Issues detected that may prevent successful deployment"
  exit 1
else
  echo ""
  echo "✅ No obvious issues detected. Ready for Vercel deployment!"
fi
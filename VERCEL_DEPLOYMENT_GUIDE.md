# Vercel Deployment Guide for Todo App

This guide addresses common issues that may arise when deploying the Todo App to Vercel.

## Common Vercel Deployment Issues and Solutions

### 1. Environment Variables Configuration

#### Frontend Environment Variables (Required for Vercel)
You need to set these environment variables in your Vercel project settings:

```
NEXT_PUBLIC_API_URL=https://your-vercel-project-url.vercel.app/api
NEXT_PUBLIC_BETTER_AUTH_URL=https://your-vercel-project-url.vercel.app
```

#### Backend Environment Variables (for API routes)
If you're deploying the backend separately or using Vercel's API routes:
```
DATABASE_URL=your_postgres_database_url
BETTER_AUTH_SECRET=your_better_auth_secret
FRONTEND_URL=https://your-vercel-project-url.vercel.app
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 2. Database Configuration Issue

The current setup uses SQLite for local development (`sqlite:///./todo_app.db`), but this won't work on Vercel since it has an ephemeral file system. You need to use a hosted database like PostgreSQL.

For Vercel deployment, change your DATABASE_URL to a PostgreSQL database:
- Option 1: Use Neon (free tier available) - recommended
- Option 2: Use Supabase
- Option 3: Use AWS RDS or Google Cloud SQL

### 3. Backend API Integration

Currently, the frontend expects the backend API at `NEXT_PUBLIC_API_URL`. For Vercel deployment, you have two options:

#### Option A: Deploy Backend as Vercel Functions (Recommended)
Move your FastAPI backend to Vercel's API routes. This requires converting FastAPI routes to Next.js API routes.

#### Option B: Host Backend Separately
Deploy the FastAPI backend to a platform like Railway, Render, or Heroku, then update NEXT_PUBLIC_API_URL to point to that deployed URL.

### 4. Authentication Configuration

Better Auth needs to be configured properly for production. Make sure to:
- Generate a strong secret key: `openssl rand -base64 32`
- Set the correct origin URLs for CORS
- Configure the adapter for your production database

### 5. Build Configuration

The current build works fine, but for Vercel deployment, ensure your `vercel.json` is properly configured:

```json
{
  "framework": "nextjs",
  "functions": {
    "src/pages/api/**/*": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

### 6. Steps to Deploy Successfully

1. **Prepare your database**:
   - Set up a PostgreSQL database (Neon is recommended)
   - Update your DATABASE_URL to point to the hosted database

2. **Configure environment variables in Vercel**:
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add the required variables mentioned above

3. **Update API endpoints**:
   - If using a separate backend, update NEXT_PUBLIC_API_URL
   - If integrating backend into Next.js, convert FastAPI routes to Next.js API routes

4. **Deploy**:
   - Push your changes to GitHub
   - Vercel will automatically deploy from your GitHub repo

### 7. Recommended Architecture for Vercel

For optimal performance on Vercel, consider this architecture:

```
Frontend (Next.js) on Vercel
├── Pages/Components
├── API Routes (converted from FastAPI)
│   ├── /api/todos
│   ├── /api/auth
│   └── /api/chat
└── Database: PostgreSQL (Neon/Supabase)
```

This eliminates cross-origin requests and leverages Vercel's edge network.

### 8. Potential Error Messages and Solutions

- **"Database connection failed"**: Check DATABASE_URL is set correctly and points to a hosted database
- **"CORS error"**: Ensure FRONTEND_URL matches your deployed URL
- **"Auth not working"**: Verify BETTER_AUTH_SECRET is set and same across frontend/backend
- **"Chat API not working"**: Check OPENROUTER_API_KEY is valid and properly set
- **"Build fails due to missing dependencies"**: Ensure all dependencies are in package.json

### 9. Testing Before Deployment

Before deploying to Vercel, test locally with production-like settings:
```bash
# Set environment variables for production
NEXT_PUBLIC_API_URL=https://localhost:3000 npm run dev
# Or test the build
npm run build && npm run start
```

### 10. Additional Recommendations

- Use Vercel's Analytics for monitoring
- Set up custom domains
- Configure SSL certificates
- Set up automatic deployments from GitHub
- Monitor logs via Vercel Dashboard
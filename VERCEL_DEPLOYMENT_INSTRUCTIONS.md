# Deploying Todo App to Vercel

This document explains how to successfully deploy the Todo App with Conversational AI to Vercel.

## Prerequisites

1. A GitHub account with the code pushed to a repository
2. A Vercel account (sign up at https://vercel.com)
3. A PostgreSQL database (we recommend Neon for free tier)
4. An OpenRouter API key for AI functionality

## Step-by-Step Deployment Guide

### 1. Prepare Your Database

Vercel uses an ephemeral file system, so SQLite won't work for production. You need to set up a hosted PostgreSQL database:

1. Go to [Neon](https://neon.tech/) and create a free account
2. Create a new project and get your connection string
3. Note down your database connection string in the format:
   ```
   postgresql://username:password@ep-xxxxxx.us-east-1.aws.neon.tech/dbname?sslmode=require
   ```

### 2. Fork and Connect Your Repository

1. Make sure your code is pushed to a GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project" → "Import Git Repository"
4. Select your todo app repository
5. Click "Import"

### 3. Configure Environment Variables

During the project import, you'll be prompted to add environment variables. Add these:

#### For the Frontend (Next.js):
```
NEXT_PUBLIC_API_URL=https://your-project-name.vercel.app
NEXT_PUBLIC_BETTER_AUTH_URL=https://your-project-name.vercel.app
```

#### For the Backend (if using integrated API routes):
```
DATABASE_URL=your_postgresql_connection_string_from_neon
BETTER_AUTH_SECRET=generate_a_strong_secret_key_using_openssl_rand_-base64_32
FRONTEND_URL=https://your-project-name.vercel.app
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 4. Adjust Build Settings (if needed)

Make sure your project is configured to use Next.js. In most cases, Vercel will detect this automatically, but you can verify in your project settings that:

- Framework Preset: Next.js
- Build Command: `next build`
- Output Directory: `.next`
- Development Command: `next dev`

### 5. Common Issues and Solutions

#### Issue: "Database connection failed"
**Solution:** Ensure your DATABASE_URL is correctly set to a hosted PostgreSQL database, not SQLite.

#### Issue: "Auth not working"
**Solution:** 
1. Verify that BETTER_AUTH_SECRET is set with a strong random value
2. Ensure FRONTEND_URL matches your deployed URL exactly
3. Check that NEXT_PUBLIC_BETTER_AUTH_URL is set correctly

#### Issue: "API routes returning 404"
**Solution:** If you're using the FastAPI backend separately, ensure NEXT_PUBLIC_API_URL points to your deployed backend. For better integration, consider migrating FastAPI routes to Next.js API routes.

#### Issue: "Chat functionality not working"
**Solution:** Verify that OPENROUTER_API_KEY is correctly set and that your account has sufficient credits.

### 6. Recommended Architecture for Production

For optimal performance on Vercel, consider migrating your FastAPI backend to Next.js API routes:

```
Current Structure:
├── backend/ (FastAPI)
└── frontend/ (Next.js)

Recommended for Vercel:
└── frontend/ (Next.js with API routes)
    ├── src/
    │   └── app/
    │       ├── api/
    │       │   ├── todos/
    │       │   │   ├── route.ts (handles /api/todos)
    │       │   │   └── [id]/route.ts (handles /api/todos/:id)
    │       │   ├── auth/
    │       │   │   └── [...nextauth]/route.ts
    │       │   └── chat/route.ts
    │       ├── todos/
    │       └── chat/
```

### 7. Migrating FastAPI Routes to Next.js API Routes

If you want to consolidate everything in one Vercel deployment, you'll need to convert your FastAPI routes to Next.js API routes. Here's an example conversion:

**From FastAPI:**
```python
@app.post("/todos")
async def create_todo(todo_data: TodoCreate, current_user: dict = Depends(get_current_user)):
    # Logic to create todo
    return {"id": new_id, "title": todo_data.title, ...}
```

**To Next.js API Route (src/app/api/todos/route.ts):**
```typescript
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';

export async function POST(request: NextRequest) {
  try {
    // Get session to verify user authentication
    const session = await getServerSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, priority } = await request.json();
    
    // Logic to create todo in database
    const newTodo = await createTodoInDB({
      userId: session.user.id,
      title,
      description,
      priority
    });

    return Response.json(newTodo, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}
```

### 8. Post-Deployment Verification

After deployment:

1. Visit your deployed URL
2. Test signing up/logging in
3. Create a few todos to verify the database connection
4. Test the chat functionality
5. Check browser console and Vercel logs for any errors

### 9. Monitoring and Maintenance

- Monitor your application through the Vercel Dashboard
- Check logs regularly for errors
- Ensure your database stays within limits
- Monitor your OpenRouter API usage

### 10. Troubleshooting Checklist

Before contacting support, verify:

- [ ] Environment variables are correctly set
- [ ] Database connection string is valid and accessible
- [ ] Authentication secrets are properly configured
- [ ] API keys have sufficient permissions/credits
- [ ] CORS settings allow requests from your domain
- [ ] Build completes without errors
- [ ] All dependencies are properly declared in package.json

For additional help, refer to the [Vercel documentation](https://vercel.com/docs) or reach out to the support team.
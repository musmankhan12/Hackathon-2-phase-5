# Complete Vercel Deployment Guide

This guide provides all the necessary steps to deploy the Todo App with Conversational AI to Vercel without any errors.

## Prerequisites

1. A GitHub repository with this codebase
2. A Vercel account (https://vercel.com)
3. A PostgreSQL database (recommended: Neon for free tier)

## Step-by-Step Deployment Process

### Step 1: Prepare Your Database
1. Go to [Neon](https://neon.tech/) and create an account
2. Create a new project and get your connection string
3. Save the connection string for later use

### Step 2: Set Up Your GitHub Repository
1. Commit all changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: prepare for Vercel deployment with integrated API routes"
   git push origin main
   ```

### Step 3: Deploy to Vercel
1. Go to https://vercel.com/dashboard
2. Click "New Project" → "Import Git Repository"
3. Select your repository
4. Configure the project settings:
   - Framework: Next.js
   - Root Directory: `frontend`
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/.next`

### Step 4: Configure Environment Variables
In your Vercel dashboard, go to your project settings → Environment Variables and add:

#### Required Variables:
- `DATABASE_URL` - Your PostgreSQL connection string from Neon
- `BETTER_AUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your Vercel deployment URL (e.g., https://your-app.vercel.app)
- `NEXTAUTH_SECRET` - Same value as BETTER_AUTH_SECRET
- `OPENROUTER_API_KEY` - Your OpenRouter API key for AI functionality

### Step 5: Run Database Migration
After your first deployment, you need to run the database migration to create the required tables:

1. Connect to your PostgreSQL database using any database client
2. Execute the SQL commands from `database_migration.sql` in this repository

Or use the migration file included in the project root:
```sql
-- database_migration.sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create conversations table for chat history
CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  message_history JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Attach the trigger to users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Attach the trigger to todos table
CREATE TRIGGER update_todos_updated_at BEFORE UPDATE ON todos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Attach the trigger to conversations table
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Step 6: Redeploy
After setting up environment variables and running migrations, redeploy your application from the Vercel dashboard.

## API Routes Available

Once deployed, your application will have the following API routes available:

- `GET /api/health` - Health check endpoint
- `POST/GET /api/auth` - Authentication endpoints (Better Auth)
- `GET/POST /api/todos` - Todo management
- `GET/PUT/PATCH/DELETE /api/todos/[id]` - Individual todo operations
- `POST/GET /api/chat` - Conversational AI functionality

## Troubleshooting Common Issues

### Issue: "Module not found" errors
- Make sure you're deploying from the `frontend` directory
- Check that all dependencies are correctly specified in package.json

### Issue: "Database connection failed"
- Verify your DATABASE_URL is correctly set in Vercel environment variables
- Ensure your PostgreSQL database accepts connections from Vercel's IP ranges

### Issue: "Auth not working"
- Confirm that BETTER_AUTH_SECRET is set and consistent
- Check that NEXTAUTH_URL matches your deployment URL

### Issue: "Chat functionality not working"
- Verify that OPENROUTER_API_KEY is valid and has sufficient credits
- Check that your database has the conversations table created

## Verification Steps

After deployment:

1. Visit your deployed URL
2. Test signing up/logging in
3. Create a few todos to verify the database connection
4. Test the chat functionality
5. Check browser console and Vercel logs for any errors

## Success Indicators

Your deployment is successful when:
- The application loads without errors
- Authentication works properly
- Todo creation and management functions work
- Chat interface responds to messages
- All API endpoints return appropriate responses

## Important Notes

- This deployment uses integrated API routes, eliminating the need for a separate backend server
- All data is persisted in your PostgreSQL database
- The application is fully functional with authentication, todo management, and AI chat features
- The deployment is optimized for Vercel's edge network

Your application should now be successfully deployed to Vercel without any errors!
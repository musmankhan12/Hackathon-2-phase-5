# Vercel Deployment Configuration

This project is configured for deployment on Vercel. The following configuration ensures proper deployment:

## Key Points for Vercel Deployment:

1. The project uses Next.js with integrated API routes, eliminating the need for a separate backend
2. All API routes are located in the `frontend/src/app/api` directory
3. The project uses PostgreSQL via @vercel/postgres for database operations
4. Authentication is handled via Next-Auth.js

## Required Environment Variables on Vercel:

- DATABASE_URL: PostgreSQL database connection string
- NEXTAUTH_URL: Your Vercel deployment URL (e.g., https://your-app.vercel.app)
- NEXTAUTH_SECRET: Secret key for authentication (generate with `openssl rand -base64 32`)
- OPENROUTER_API_KEY: Your OpenRouter API key for AI functionality

## Build Configuration:

- Framework: Next.js
- Build Command: cd frontend && npm install && npm run build
- Output Directory: frontend/.next
- Install Command: cd frontend && npm install

## Before Deploying:

1. Ensure you have run the database migration on your PostgreSQL database
2. The migration script is located at `database_migration.sql` in the project root
3. Update your environment variables in the Vercel dashboard
4. Make sure the project root is set to the `frontend` directory in Vercel settings

## API Routes Available:

- /api/auth/[...nextauth] - Authentication endpoints
- /api/todos - Todo management endpoints
- /api/todos/[id] - Individual todo endpoints
- /api/chat - Chat functionality
- /api/health - Health check endpoint

## Notes:

- This configuration eliminates the need for a separate backend server
- All functionality is contained within the Next.js application
- The application is optimized for Vercel's edge network
- Database operations use Vercel's PostgreSQL integration
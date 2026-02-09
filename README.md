# Todo App with Conversational AI - Vercel Optimized

This is a full-stack todo application with a conversational AI assistant that can help manage your todos using natural language. This version has been optimized for Vercel deployment with integrated API routes.

## Features

- **Single Codebase**: Next.js frontend with integrated API routes (no separate backend server needed)
- **Todo management**: Create, read, update, delete, and toggle completion status of todos
- **Conversational AI**: Natural language processing for todo management through the chat interface
- **Authentication**: Secure user authentication and authorization using Next-Auth
- **Responsive design**: Works on desktop and mobile devices
- **Database integration**: PostgreSQL database integration ready for Vercel deployment

## Tech Stack

- **Frontend/Backend**: Next.js 14 with App Router and API Routes
- **Authentication**: Next-Auth.js
- **Database**: PostgreSQL (with @vercel/postgres for Vercel integration)
- **AI Integration**: OpenRouter API for conversational AI
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Prerequisites

- Node.js (v18 or higher)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo-app-cli
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables**

   Copy the example environment file:
   ```bash
   # In the frontend directory
   cp .env.local.example .env.local
   ```

   Update the `.env.local` file with your actual configuration:
   - `NEXT_PUBLIC_API_URL`: Base URL for API calls (leave empty for Vercel deployment to use relative paths)
   - `DATABASE_URL`: Your PostgreSQL connection string (required for Vercel deployment)
   - `BETTER_AUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: URL of your deployed application
   - `NEXTAUTH_SECRET`: Same value as BETTER_AUTH_SECRET or generate separately
   - `OPENROUTER_API_KEY`: Your OpenRouter API key for AI functionality

## Running the Application Locally

1. **Start the development server**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Access the application**:
   - Frontend: http://localhost:3000
   - Health check: http://localhost:3000/api/health

## Deploying to Vercel

### Step 1: Prepare Your Database
You need a PostgreSQL database for Vercel deployment (SQLite won't work due to Vercel's ephemeral file system):
1. Create a free PostgreSQL database (recommended: [Neon](https://neon.tech/))
2. Get your database connection string

### Step 2: Deploy to Vercel
1. Push your code to a GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project" → "Import Git Repository"
4. Select your todo app repository
5. Configure the following environment variables in the Vercel dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_URL`: Your Vercel deployment URL (e.g., https://your-app.vercel.app)
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
6. Make sure the Root Directory is set to `frontend`
7. Click "Deploy"

### Step 3: Run Database Migration
After deployment, you'll need to run the database migration to create the required tables. You can do this by connecting to your database directly or using a migration tool.

The SQL migration script is located at `database_migration.sql` in the root of the project.

## API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - Next-Auth endpoints

### Todos
- `GET /api/todos` - Get all todos for the authenticated user
- `POST /api/todos` - Create a new todo
- `GET /api/todos/[id]` - Get a specific todo
- `PUT /api/todos/[id]` - Update a todo
- `PATCH /api/todos/[id]` - Toggle completion status
- `DELETE /api/todos/[id]` - Delete a todo

### Chat
- `POST /api/chat` - Send a message to the AI assistant
- `GET /api/chat` - Get conversation history

### Health Check
- `GET /api/health` - Check API health status

## Using the Chat Agent

1. Navigate to the chat interface at http://localhost:3000/chat (or your deployed URL)
2. Sign in to authenticate
3. Start chatting with the AI assistant using natural language:
   - "Add a todo to buy groceries"
   - "Show me my todos"
   - "Mark the first todo as complete"
   - "Delete the todo about buying milk"

## Environment Variables

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL`: Base URL for API calls (empty for relative paths in Vercel)
- `DATABASE_URL`: PostgreSQL connection string (required for Vercel)
- `NEXTAUTH_URL`: URL of the application (for Next-Auth)
- `NEXTAUTH_SECRET`: Secret key for Next-Auth
- `OPENROUTER_API_KEY`: API key for OpenRouter AI service

## Troubleshooting

- If the application doesn't work after deployment, ensure your environment variables are correctly set in the Vercel dashboard
- Check that your PostgreSQL database is accessible from Vercel
- If the chat agent doesn't work, verify that your OpenRouter API key is valid and properly configured
- For authentication issues, ensure the NEXTAUTH_URL and NEXTAUTH_SECRET are properly set
- If you see "An error occurred while processing your request" in the chat, check:
  - That your OPENROUTER_API_KEY is correctly set
  - That the database is accessible and properly configured
  - Check the Vercel logs for detailed error messages

## Development

The application is designed to work seamlessly both in development and production environments. The API routes are integrated directly into the Next.js application, eliminating the need for a separate backend server.
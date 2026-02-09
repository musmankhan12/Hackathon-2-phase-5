// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Simple in-memory storage for demonstration
// In production, use a proper database
let conversations: Record<string, any[]> = {};

export async function POST(request: NextRequest) {
  try {
    // Check for Better Auth session cookie
    const authCookie = cookies().get('better-auth-session-token');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = 'mock-user-id'; // Would come from session validation
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Initialize user's conversation history if it doesn't exist
    if (!conversations[userId]) {
      conversations[userId] = [];
    }

    // Add user message to conversation
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    conversations[userId].push(userMessage);

    // Process the message and generate AI response
    // This is a simplified version - in production, call OpenRouter API
    let aiResponse = '';
    
    // Simple NLP to understand todo commands
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('add') || lowerMsg.includes('create')) {
      // Extract todo title (simplified extraction)
      const titleMatch = message.match(/(?:add|create)\s+(?:a\s+)?(.+)/i);
      const title = titleMatch ? titleMatch[1].trim() : 'New todo';
      
      // In a real implementation, you would call the todos API to create the todo
      aiResponse = `I've added "${title}" to your todo list.`;
    } else if (lowerMsg.includes('show') || lowerMsg.includes('list') || lowerMsg.includes('get')) {
      // In a real implementation, you would fetch todos from the database
      aiResponse = "Here are your todos: [This would show your actual todos in a real implementation]";
    } else if (lowerMsg.includes('complete') || lowerMsg.includes('done') || lowerMsg.includes('finish')) {
      // In a real implementation, you would mark a todo as complete
      aiResponse = "I've marked that todo as complete.";
    } else {
      // Default response
      aiResponse = `You said: "${message}". I can help you manage your todos. Try saying "add a todo to buy groceries" or "show me my todos".`;
    }

    // Add AI response to conversation
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };
    
    conversations[userId].push(aiMessage);

    // In a real implementation, you would save conversation to database:
    /*
    try {
      await sql`
        INSERT INTO conversations (user_id, message_history) 
        VALUES (${userId}, ${JSON.stringify(conversations[userId])})
        ON CONFLICT (user_id) 
        DO UPDATE SET message_history = ${JSON.stringify(conversations[userId])}, updated_at = NOW()
      `;
    } catch (dbError) {
      console.warn('Could not save conversation to database:', dbError);
    }
    */

    return NextResponse.json({
      response: aiResponse,
      conversation: conversations[userId]
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    return NextResponse.json({ error: 'Failed to process chat message' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check for Better Auth session cookie
    const authCookie = cookies().get('better-auth-session-token');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = 'mock-user-id'; // Would come from session validation

    // In a real implementation, you would get conversation from database:
    /*
    try {
      const result = await sql`
        SELECT message_history, created_at, updated_at 
        FROM conversations 
        WHERE user_id = ${userId}
      `;
      
      if (result.rowCount > 0) {
        const dbConversation = result.rows[0];
        return NextResponse.json({
          conversation: JSON.parse(dbConversation.message_history),
          createdAt: dbConversation.created_at,
          updatedAt: dbConversation.updated_at
        });
      }
    } catch (dbError) {
      console.warn('Could not fetch conversation from database:', dbError);
    }
    */

    // Fallback to in-memory storage
    const userConversation = conversations[userId] || [];
    return NextResponse.json({ conversation: userConversation });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
  }
}
// src/app/api/todos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // For handling Better Auth cookies

export async function GET(request: NextRequest) {
  try {
    // Check for Better Auth session cookie
    const authCookie = cookies().get('better-auth-session-token');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real implementation, you would validate the session token
    // For now, we'll simulate getting the user ID from the session
    // This is a simplified approach - Better Auth would provide utilities for this
    const userId = 'mock-user-id'; // Would come from session validation
    
    // Since we're not using a database in this simplified version, 
    // we'll return mock data. In a real implementation you would query the database:
    /*
    const result = await sql`
      SELECT id, title, description, completed, priority, created_at 
      FROM todos 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;
    */
    
    // Mock response for now
    const mockTodos = [
      { id: 1, title: 'Sample Todo', description: 'This is a sample todo', completed: false, priority: 'medium', created_at: new Date().toISOString() },
      { id: 2, title: 'Another Todo', description: 'This is another sample todo', completed: true, priority: 'high', created_at: new Date().toISOString() }
    ];
    
    return NextResponse.json(mockTodos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check for Better Auth session cookie
    const authCookie = cookies().get('better-auth-session-token');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = 'mock-user-id'; // Would come from session validation
    const { title, description, priority } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // In a real implementation, you would insert into the database:
    /*
    const result = await sql`
      INSERT INTO todos (title, description, completed, priority, user_id) 
      VALUES (${title}, ${description || ''}, false, ${priority || 'medium'}, ${userId}) 
      RETURNING id, title, description, completed, priority, created_at
    `;
    */
    
    // Mock response for now
    const newTodo = {
      id: Date.now(), // In real implementation, this would come from DB
      title,
      description: description || '',
      completed: false,
      priority: priority || 'medium',
      created_at: new Date().toISOString()
    };
    
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}
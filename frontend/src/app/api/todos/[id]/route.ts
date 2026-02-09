// src/app/api/todos/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check for Better Auth session cookie
    const authCookie = cookies().get('better-auth-session-token');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = 'mock-user-id'; // Would come from session validation
    const todoId = params.id;
    
    // In a real implementation, you would query the database:
    /*
    const result = await sql`
      SELECT id, title, description, completed, priority, created_at 
      FROM todos 
      WHERE id = ${todoId} AND user_id = ${userId}
    `;

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
    */
    
    // Mock response for now
    const mockTodo = {
      id: parseInt(todoId),
      title: 'Mock Todo Title',
      description: 'Mock todo description',
      completed: false,
      priority: 'medium',
      created_at: new Date().toISOString()
    };
    
    return NextResponse.json(mockTodo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    return NextResponse.json({ error: 'Failed to fetch todo' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check for Better Auth session cookie
    const authCookie = cookies().get('better-auth-session-token');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = 'mock-user-id'; // Would come from session validation
    const todoId = params.id;
    const { title, description, completed, priority } = await request.json();

    // In a real implementation, you would update the database:
    /*
    // Check if todo belongs to user
    const checkResult = await sql`
      SELECT id FROM todos WHERE id = ${todoId} AND user_id = ${userId}
    `;

    if (checkResult.rowCount === 0) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    const result = await sql`
      UPDATE todos 
      SET title = ${title}, description = ${description || ''}, 
          completed = ${completed}, priority = ${priority || 'medium'} 
      WHERE id = ${todoId} AND user_id = ${userId} 
      RETURNING id, title, description, completed, priority, created_at
    `;

    revalidatePath('/'); // Revalidate the home page cache
    
    return NextResponse.json(result.rows[0]);
    */
    
    // Mock response for now
    const updatedTodo = {
      id: parseInt(todoId),
      title,
      description: description || '',
      completed: completed ?? false,
      priority: priority || 'medium',
      created_at: new Date().toISOString()
    };
    
    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check for Better Auth session cookie
    const authCookie = cookies().get('better-auth-session-token');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = 'mock-user-id'; // Would come from session validation
    const todoId = params.id;

    // In a real implementation, you would update the database:
    /*
    // Check if todo belongs to user
    const checkResult = await sql`
      SELECT id, completed FROM todos WHERE id = ${todoId} AND user_id = ${userId}
    `;

    if (checkResult.rowCount === 0) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    const currentCompletedStatus = checkResult.rows[0].completed;
    const newCompletedStatus = !currentCompletedStatus;

    const result = await sql`
      UPDATE todos 
      SET completed = ${newCompletedStatus} 
      WHERE id = ${todoId} AND user_id = ${userId} 
      RETURNING id, title, description, completed, priority, created_at
    `;

    revalidatePath('/');
    
    return NextResponse.json(result.rows[0]);
    */
    
    // Mock response for now - toggle completion status
    const mockTodo = {
      id: parseInt(todoId),
      title: 'Mock Todo Title',
      description: 'Mock todo description',
      completed: true, // Simulating toggle to completed
      priority: 'medium',
      created_at: new Date().toISOString()
    };
    
    return NextResponse.json(mockTodo);
  } catch (error) {
    console.error('Error toggling todo completion:', error);
    return NextResponse.json({ error: 'Failed to toggle todo completion' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check for Better Auth session cookie
    const authCookie = cookies().get('better-auth-session-token');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = 'mock-user-id'; // Would come from session validation
    const todoId = params.id;

    // In a real implementation, you would delete from the database:
    /*
    // Check if todo belongs to user
    const checkResult = await sql`
      SELECT id FROM todos WHERE id = ${todoId} AND user_id = ${userId}
    `;

    if (checkResult.rowCount === 0) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    await sql`DELETE FROM todos WHERE id = ${todoId} AND user_id = ${userId}`;

    revalidatePath('/');
    */
    
    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}
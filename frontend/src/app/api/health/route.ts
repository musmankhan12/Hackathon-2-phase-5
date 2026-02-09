// src/app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real implementation, you might check database connectivity here
    return NextResponse.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      service: 'Todo App API'
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
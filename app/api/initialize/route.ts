import { NextRequest, NextResponse } from 'next/server';

// This is a proxy to the Supabase Edge Function
// You can replace this with direct database calls if needed
export async function POST(request: NextRequest) {
  try {
    const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
    const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-32ed8237/initialize`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      }
    );
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Initialize error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initialize' },
      { status: 500 }
    );
  }
}

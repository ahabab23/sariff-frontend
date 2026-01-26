import { NextRequest, NextResponse } from 'next/server';

// Proxy to Supabase Edge Function for accounts
export async function GET(request: NextRequest) {
  try {
    const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
    const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-32ed8237/accounts`,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      }
    );
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Accounts GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
    const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const body = await request.json();

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-32ed8237/accounts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(body),
      }
    );
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Accounts POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create account' },
      { status: 500 }
    );
  }
}

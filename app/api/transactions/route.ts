import { NextRequest, NextResponse } from 'next/server';

// Proxy to Supabase Edge Function for transactions
export async function GET(request: NextRequest) {
  try {
    const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
    const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-32ed8237/transactions`,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      }
    );
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Transactions GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
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
      `https://${projectId}.supabase.co/functions/v1/make-server-32ed8237/transactions`,
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
    console.error('Transactions POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

// app/api/auth/logout/route.ts
import { WorkOS } from '@workos-inc/node';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const workos = new WorkOS(process.env.WORKOS_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }
    
    // Revoke the session in WorkOS
    await workos.userManagement.revokeSession({sessionId: sessionId});
    
    // Clear the cookies
    const cookieStore = cookies();
    cookieStore.delete('workos_access_token');
    cookieStore.delete('workos_response');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json({ error: 'Failed to log out' }, { status: 500 });
  }
}
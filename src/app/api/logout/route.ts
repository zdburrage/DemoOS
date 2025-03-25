// app/api/auth/logout/route.ts
import { WorkOS } from '@workos-inc/node';
import { NextResponse } from 'next/server';

const workos = new WorkOS(process.env.WORKOS_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId } = body;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get the logout URL from WorkOS
    const url = await workos.userManagement.getLogoutUrl({
      sessionId: sessionId,
    });

    // Create response with the logout URL
    const response = NextResponse.json({ 
      url,
      message: 'Logout successful' 
    });

    // Clear the WorkOS session cookie
    response.cookies.set('wos-session', '', {
      expires: new Date(0),
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}
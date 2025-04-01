// app/using-hosted-authkit/basic/callback/route.ts
import { WorkOS } from '@workos-inc/node';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const workos = new WorkOS(process.env.WORKOS_API_KEY);

// Function to decode JWT and extract expiration
function getTokenExpiration(token: string): number {
  try {
    // Split the token and get the payload part
    const payload = token.split('.')[1];
    // Base64 decode and parse as JSON
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());
    
    // Get expiration timestamp and calculate seconds from now
    if (decodedPayload.exp) {
      const expiresAt = decodedPayload.exp;
      const now = Math.floor(Date.now() / 1000);
      return expiresAt - now;
    }
    
    // Default expiration if not found
    return 60 * 60; // 1 hour
  } catch (error) {
    console.error('Error decoding token:', error);
    return 60 * 60; // 1 hour default
  }
}

export async function GET(request: NextRequest) {
  const code = new URL(request.url).searchParams.get('code') || '';

  try {
    // Exchange code for token
    const response = await workos.userManagement.authenticateWithCode({
      clientId: process.env.WORKOS_CLIENT_ID || '',
      code,
    });
    
    // Calculate token expiration time in seconds
    const expiresIn = getTokenExpiration(response.accessToken);
    
    // Set cookies for session management
    const cookieStore = cookies();
    
    // Store the access token in a cookie
    cookieStore.set('workos_access_token', response.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn,
      path: '/',
      sameSite: 'lax',
    });
    
    // Store the refresh token in a cookie (important for organization switching)
    if (response.refreshToken) {
      cookieStore.set('refresh_token', response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days (longer than access token)
        path: '/',
        sameSite: 'lax',
      });
    }
    
    // Store the organization ID if present
    if (response.organizationId) {
      cookieStore.set('current_organization_id', response.organizationId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: expiresIn,
        path: '/',
        sameSite: 'lax',
      });
    }
    
    // Store the full response in a separate cookie
    // We need to stringify it and potentially handle large responses
    const responseJson = JSON.stringify(response);
    cookieStore.set('workos_response', responseJson, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn,
      path: '/',
      sameSite: 'lax',
    });
    
    // Use NextResponse.redirect
    const redirectUrl = new URL(`/using-hosted-authkit/basic?response=${encodeURIComponent(responseJson)}`, request.url);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Authentication error:', error);
    
    // Use NextResponse.redirect for error case too
    const errorUrl = new URL('/using-hosted-authkit/basic?error=Authentication failed', request.url);
    return NextResponse.redirect(errorUrl);
  }
}
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode, JwtPayload } from 'jwt-decode';

// Define the WorkOS JWT payload type
interface WorkOSJwtPayload extends JwtPayload {
  sid: string;
  exp?: number;
}

export function middleware(request: NextRequest) {
  // Check if the path is a protected route
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/using-hosted-authkit/basic/profile');
  
  if (isProtectedRoute) {
    // Check for access token in cookies
    const accessToken = request.cookies.get('workos_access_token')?.value;
    
    // If no token, redirect to login
    if (!accessToken) {
      return NextResponse.redirect(new URL('/using-hosted-authkit/basic', request.url));
    }
    
    try {
      // Decode token to check expiration
      const decodedToken = jwtDecode<WorkOSJwtPayload>(accessToken);
      
      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        // Clear the expired token
        const response = NextResponse.redirect(new URL('/using-hosted-authkit/basic', request.url));
        response.cookies.delete('workos_access_token');
        return response;
      }
    } catch (error) {
      // If token is invalid, redirect to login
      const response = NextResponse.redirect(new URL('/using-hosted-authkit/basic', request.url));
      response.cookies.delete('workos_access_token');
      return response;
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/using-hosted-authkit/basic/profile/:path*', '/api/webhooks/workos'],
};
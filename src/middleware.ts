// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

// Create a middleware function that provides both request and event
export default function middleware(request: NextRequest, event: any) {
  try {
    // Pass both request and event to the authkitMiddleware
    return authkitMiddleware({
      middlewareAuth: {
        enabled: true,
        unauthenticatedPaths: ['/', '/using-hosted-authkit']
      },
      debug: true,
      redirectUri: `${process.env.ROOT_DOMAIN}/using-hosted-authkit/with-nextjs/callback`
    })(request, event);
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = { matcher: ['/using-hosted-authkit/with-nextjs/:path*'] };
// app/actions/auth-actions.ts
'use server';

import { WorkOS } from '@workos-inc/node';
import { cookies } from 'next/headers';
import { RedirectType, redirect } from 'next/navigation';

const workos = new WorkOS(process.env.WORKOS_API_KEY);

// Function to decode JWT and extract expiration
function getTokenExpiration(token: string): number {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());
    
    if (decodedPayload.exp) {
      const expiresAt = decodedPayload.exp;
      const now = Math.floor(Date.now() / 1000);
      return expiresAt - now;
    }
    
    return 60 * 60; // 1 hour default
  } catch (error) {
    console.error('Error decoding token:', error);
    return 60 * 60; // 1 hour default
  }
}

export async function switchToOrganizationAction({ organizationId }: { organizationId: string }) {
  try {
    // Get the refresh token from cookies
    const refreshToken = cookies().get('refresh_token')?.value;
    
    if (!refreshToken) {
      // Return a result instead of redirecting
      return { success: false, error: 'No refresh token available' };
    }
    
    try {
      // Use the WorkOS SDK to refresh the token with the new organization
      const authResponse = await workos.userManagement.authenticateWithRefreshToken({
        clientId: process.env.WORKOS_CLIENT_ID || '',
        refreshToken,
        organizationId,
      });
      
      // Calculate token expiration
      const expiresIn = getTokenExpiration(authResponse.accessToken);
      
      // Store the new tokens
      cookies().set('workos_access_token', authResponse.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: expiresIn,
        path: '/',
        sameSite: 'lax',
      });
      
      // Update refresh token if a new one was provided
      if (authResponse.refreshToken) {
        cookies().set('refresh_token', authResponse.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 30 * 24 * 60 * 60, // 30 days
        });
      }
      
      // Store the current organization ID
      cookies().set('current_organization_id', organizationId, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: expiresIn,
      });
      
      // Update the full response cookie
      const responseJson = JSON.stringify(authResponse);
      cookies().set('workos_response', responseJson, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: expiresIn,
        path: '/',
        sameSite: 'lax',
      });
      
      // Return success instead of redirecting
      return { success: true, redirectTo: '/using-hosted-authkit/basic/profile' };
      
    } catch (error: any) {
      console.error('Error switching organization:', error);
      
      // If user is not authorized for this organization, return auth URL
      if (error.statusCode === 401 || error.statusCode === 403) {
        // Generate authorization URL for the specific organization
        const authorizationURL = await workos.userManagement.getAuthorizationUrl({
          clientId: process.env.WORKOS_CLIENT_ID || '',
          redirectUri: process.env.WORKOS_REDIRECT_URI || '',
          organizationId,
        });
        
        return { success: false, redirectTo: authorizationURL };
      }
      
      return { success: false, error: error.message || 'Unknown error' };
    }
    
  } catch (error: any) {
    console.error('Error in organization switch action:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to switch organization' 
    };
  }
}
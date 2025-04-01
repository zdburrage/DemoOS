// app/lib/session.ts
import { cookies } from 'next/headers';
import { jwtDecode, JwtPayload } from 'jwt-decode';

// Define the WorkOS JWT payload type
interface WorkOSJwtPayload extends JwtPayload {
  sid: string;
  org_id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  metadata?: any;
}

export async function getSession() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('workos_access_token')?.value;
  const responseJson = cookieStore.get('workos_response')?.value;
  
  if (!accessToken) {
    return null;
  }
  
  try {
    // Decode the token to get session info
    const decodedToken = jwtDecode<WorkOSJwtPayload>(accessToken);
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      return null;
    }
    
    // Parse the full response if available
    let fullResponse = null;
    if (responseJson) {
      try {
        fullResponse = JSON.parse(responseJson);
      } catch (e) {
        console.error('Error parsing response JSON:', e);
      }
    }
    
    return {
      accessToken,
      user: {
        id: decodedToken.sub,
        email: decodedToken.email,
        firstName: decodedToken.first_name,
        lastName: decodedToken.last_name,
        organizationId: decodedToken.org_id,
      },
      sessionId: decodedToken.sid,
      fullResponse, // Include the full response
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}
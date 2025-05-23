// app/using-hosted-authkit/basic/page.tsx
import { WorkOS } from '@workos-inc/node';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import Link from 'next/link';
import LogoutButton from '@/app/components/LogoutButton';
import TokenDisplay from '@/app/components/TokenDisplay';
import { getSession } from '@/app/lib/session';
import { createClient } from "@workos-inc/authkit-js";
import { SignInButton } from './SignInButton';

// Define the WorkOS JWT payload type
interface WorkOSJwtPayload extends JwtPayload {
  sid: string;
  org_id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  metadata?: any;
}

const workos = new WorkOS(process.env.WORKOS_API_KEY);

export default async function Basic({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const authKitUrl = workos.userManagement.getAuthorizationUrl({
    clientId: process.env.WORKOS_CLIENT_ID || '',
    provider: 'authkit',
    redirectUri: `${process.env.ROOT_DOMAIN}/using-hosted-authkit/basic/callback`,
  });

  // const authkit = await createClient(process.env.WORKOS_CLIENT_ID || '', {
  //   redirectUri: `${process.env.ROOT_DOMAIN}/using-hosted-authkit/basic/callback`,
  //   devMode: true
  // });

  // Try to get session from cookies first
  const session = await getSession();
  
  // If no session, check query params (for initial login)
  let decodedToken: WorkOSJwtPayload | null = null;
  let result;
  let accessToken = '';
  
  if (session) {
    // Use session data
    accessToken = session.accessToken;
    result = session.fullResponse || { 
      accessToken, 
      user: session.user 
    };
    
    try {
      decodedToken = jwtDecode<WorkOSJwtPayload>(accessToken);
    } catch (err) {
      console.error('Error decoding token:', err);
    }
  } else if (searchParams.response) {
    // Use query params data (initial login)
    result = JSON.parse(String(searchParams.response));
    accessToken = result.accessToken;
    
    try {
      decodedToken = accessToken ? jwtDecode<WorkOSJwtPayload>(accessToken) : null;
    } catch (err) {
      console.error('Error decoding token:', err);
    }
  }

  // Get the session ID using 'sid'
  const sessionId = decodedToken?.sid || session?.sessionId || '';

  return (
    <main>
      <h1>Using hosted AuthKit</h1>
      {!decodedToken && !session ? (
        <SignInButton />
      ) : (
        <div>
          {/* Link to the profile page */}
          <div className="mt-4 mb-4">
            <Link
              href={`/using-hosted-authkit/basic/profile`}
              className=""
            >
              Manage Profile & Sessions
            </Link>
          </div>
        </div>
      )}

      {/* Keep token display in the original page */}
      <TokenDisplay accessToken={accessToken} response={result} />
      
      {/* Logout button */}
      {sessionId && (
        <div className="mt-2">
          <LogoutButton sessionId={sessionId} />
        </div>
      )}
    </main>
  );
}
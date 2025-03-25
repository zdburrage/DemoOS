// app/using-hosted-authkit/basic/page.tsx
import { WorkOS } from '@workos-inc/node';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import Link from 'next/link';
import LogoutButton from '@/app/components/LogoutButton';
import TokenDisplay from '@/app/components/TokenDisplay';

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

export default function Basic({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const authKitUrl = workos.userManagement.getAuthorizationUrl({
    clientId: process.env.WORKOS_CLIENT_ID || '',
    provider: 'authkit',
    redirectUri: `${process.env.ROOT_DOMAIN}/using-hosted-authkit/basic/callback`,
  });

  let decodedToken: WorkOSJwtPayload | null = null;
  const result = JSON.parse(String(searchParams.response ?? '{ "error": null }'));
  const accessToken = result.accessToken;

  try {
    decodedToken = accessToken ? jwtDecode<WorkOSJwtPayload>(accessToken) : null;
  } catch (err) {
    console.error('Error decoding token:', err);
  }

  // Get the session ID using 'sid'
  const sessionId = decodedToken?.sid || '';

  return (
    <main>
      <h1>Using hosted AuthKit</h1>
      <h2>Basic example</h2>

      {!decodedToken ? (
        <a href={authKitUrl} >
          Sign-in with AuthKit
        </a>
      ) : (
        <div>
          <p>Welcome back{decodedToken.first_name && `, ${decodedToken.first_name}`}!</p>

          {/* Link to the profile page */}
          <div className="mt-4 mb-4">
            <Link
              href={`/using-hosted-authkit/basic/profile?accessToken=${encodeURIComponent(accessToken)}`}
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
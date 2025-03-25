// app/using-hosted-authkit/basic/profile/page.tsx
import { WorkOS } from '@workos-inc/node';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { redirect } from 'next/navigation';
import WorkOSWidgetsDisplay from '@/app/components/WorkOSWidgetsDisplay';
import LogoutButton from '@/app/components/LogoutButton';
import Link from 'next/link';

// Define the WorkOS JWT payload type
interface WorkOSJwtPayload extends JwtPayload {
  sid: string;
  org_id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  metadata?: any;
}

export default function UserProfile({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Parse the response from the query parameters
  const responseParam = searchParams.response || searchParams.token;
  let result: any = { error: null };
  let accessToken = '';
  
  try {
    if (typeof responseParam === 'string') {
      result = JSON.parse(responseParam);
      accessToken = result.accessToken;
    } else if (searchParams.accessToken && typeof searchParams.accessToken === 'string') {
      accessToken = searchParams.accessToken;
      result = { accessToken };
    }
  } catch (err) {
    console.error('Error parsing response:', err);
  }
  
  // If no access token, redirect to the main page
  if (!accessToken) {
    redirect('/using-hosted-authkit/basic');
  }
  
  // Decode the token
  let decodedToken: WorkOSJwtPayload | null = null;
  try {
    decodedToken = accessToken ? jwtDecode<WorkOSJwtPayload>(accessToken) : null;
  } catch (err) {
    console.error('Error decoding token:', err);
  }
  
  // Get the session ID
  const sessionId = decodedToken?.sid || '';
  
  // If no session ID, redirect to the main page
  if (!sessionId) {
    redirect('/using-hosted-authkit/basic');
  }

  return (
    <main>
      <h1>User Profile</h1>
      <p>View and manage your profile information and sessions</p>
      
      <div className="mb-4">
        <Link href="/using-hosted-authkit/basic" className="text-blue-500 hover:underline">
          &larr; Back to Basic Example
        </Link>
      </div>
      
      
      {/* WorkOS Widgets */}
      <WorkOSWidgetsDisplay authToken={accessToken} sessionId={sessionId} />
      
      {/* Logout Button */}
      <div className="mt-6">
        <LogoutButton sessionId={sessionId} />
      </div>
    </main>
  );
}
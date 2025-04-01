// app/using-hosted-authkit/basic/profile/page.tsx
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { redirect } from 'next/navigation';
import WorkOSWidgetsDisplay from '@/app/components/WorkOSWidgetsDisplay';
import LogoutButton from '@/app/components/LogoutButton';
import Link from 'next/link';
import { getSession } from '@/app/lib/session';

// Define the WorkOS JWT payload type
interface WorkOSJwtPayload extends JwtPayload {
  sid: string;
  org_id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  metadata?: any;
}

export default async function UserProfile() {
  // Get session from cookies
  const session = await getSession();
  
  // If no session, redirect to the main page
  if (!session || !session.accessToken) {
    redirect('/using-hosted-authkit/basic');
  }
  
  const accessToken = session.accessToken;
  const sessionId = session.sessionId;
  
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
          &larr; Back
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
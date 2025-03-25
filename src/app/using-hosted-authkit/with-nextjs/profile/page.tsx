// app/using-hosted-authkit/with-nextjs/profile/page.tsx
import { Button } from '@radix-ui/themes';
import { getSession, withAuth } from '@workos-inc/authkit-nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import WorkOSWidgetsDisplay from '@/app/components/WorkOSWidgetsDisplay';

// Create a server action for sign out
async function handleSignOut() {
  'use server';
  const { signOut } = await import('@workos-inc/authkit-nextjs');
  await signOut();
}

export default async function NextJSProfile() {
  // Get session and user data
  const session = await getSession();
  const { user, sessionId } = await withAuth();
  const token = session?.accessToken;
  
  // If no session or user, redirect to the main page
  if (!session || !user) {
    redirect('/using-hosted-authkit/with-nextjs');
  }

  return (
    <main>
      <h1>User Profile</h1>
      <p>View and manage your profile information and sessions</p>
      
      <div className="mb-4">
        <Link href="/using-hosted-authkit/with-nextjs" className="text-blue-500 hover:underline">
          &larr; Back to Next.js Example
        </Link>
      </div>
      
      {/* WorkOS Widgets */}
      {token && sessionId && (
        <WorkOSWidgetsDisplay authToken={token} sessionId={sessionId} />
      )}
      
      {/* Sign Out button */}
      <div className="mt-6">
        <form action={handleSignOut}>
          <Button type="submit" variant="outline">
            Sign Out
          </Button>
        </form>
      </div>
    </main>
  );
}
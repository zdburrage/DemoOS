// app/using-hosted-authkit/with-nextjs/page.tsx
import { Button } from '@radix-ui/themes';
import { getSignInUrl, withAuth } from '@workos-inc/authkit-nextjs';
import Link from 'next/link';
import TokenDisplay from '@/app/components/TokenDisplay';

// Create a server action for sign out
async function handleSignOut() {
  'use server';
  const { signOut } = await import('@workos-inc/authkit-nextjs');
  await signOut();
}

export default async function WithNextjs() {
  // Get session and user data
  const { user, sessionId, accessToken } = await withAuth();
  
  // Get sign-in URL if needed
  const signInUrl = await getSignInUrl();

  return (
    <main>
      <h1>Using hosted AuthKit</h1>
      <h2>With Next.js library</h2>
      
      {user ? (
        <>
          <p>Welcome back{user?.firstName && `, ${user?.firstName}`}!</p>
          
          {/* Link to the profile page */}
          <div className="mt-4 mb-4">
            <Link 
              href={`/using-hosted-authkit/with-nextjs/profile`}
              className=""
            >
              Manage Profile & Sessions
            </Link>
          </div>
          
          {/* Sign Out button */}
          <form action={handleSignOut}>
            <Button type="submit" variant="outline">
              Sign Out
            </Button>
          </form>
          
          {/* Keep token display in the original page */}
          <TokenDisplay 
            accessToken={accessToken} 
            response={{ user, sessionId }} 
          />
        </>
      ) : (
        <a href={signInUrl} className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Sign in
        </a>
      )}
    </main>
  );
}
import { getSignInUrl, getSession, signOut } from '@workos-inc/authkit-nextjs';

export default async function WithNextjs() {
  // Retrieves the user from the session or returns `null` if no user is signed in
  const session = await getSession();
  const user = session?.user;

  // Get the URL to redirect the user to AuthKit to sign in
  const signInUrl = await getSignInUrl();

  return (
    <main>
      <h1>Using hosted AuthKit</h1>
      <h2>With Next.js library</h2>
      {user ? (
        <>
          <p>Welcome back {user?.firstName && `, ${user?.firstName}`}</p>
          <button onClick={signOut}>Sign out</button>
        </>
      ) : (
        <a href={signInUrl}>Sign in</a>
      )}
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </main>
  );
}

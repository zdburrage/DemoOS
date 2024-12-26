
import { Button } from '@radix-ui/themes';
import { getSignInUrl, getSession, signOut } from '@workos-inc/authkit-nextjs';
import { UsersManagement, WorkOsWidgets } from '@workos-inc/widgets';

export default async function WithNextjs() {
  // Retrieves the user from the session or returns `null` if no user is signed in
  const session = await getSession();
  const user = session?.user;
  const token = session?.accessToken;

  console.log(token)


  // Get the URL to redirect the user to AuthKit to sign in
  const signInUrl = await getSignInUrl();

  return (
    <main>
      <h1>Using hosted AuthKit</h1>
      <h2>With Next.js library</h2>
      {user ? (
        <>
          <p>Welcome back{user?.firstName && `, ${user?.firstName}`}</p>

          <hr className="h-2 w-3/4 my-8 bg-gray-500 width-100 dark:bg-gray-700"></hr>

          {token ? (
            <>
              <h1>Users in Your Organization</h1>
              <WorkOsWidgets
                theme={{
                  appearance: 'light',
                  accentColor: 'green',
                  radius: 'medium',
                }}

              >
                <UsersManagement authToken={token} />
              </WorkOsWidgets>
            </>
          ) : (
            <>
            </>
          )}
          <form action={async () => {
            "use server";
            await signOut();
          }}>
            <Button type="submit" variant="outline">
              Sign Out
            </Button>
          </form>
        </>
      ) : (
        <a href={signInUrl}>Sign in</a>
      )}

      <pre>{JSON.stringify(user, null, 2)}</pre>
    </main>
  );
}

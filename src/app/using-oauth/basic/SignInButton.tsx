'use client';

import { UserManager } from 'oidc-client-ts';

const oidcConfig = {
  authority: 'https://exemplary-march-31-staging.authkit.app',
  client_id: 'client_01JSYAEP7R1N9BFEW3X14GPY62',
  client_secret: '17e2f1ac761035ca53a964beb15a5ed13478589ffd04b36ce80827c69bcfecc9',
  redirect_uri: `http://localhost:3000/using-oauth/basic/callback`,
  response_type: 'code',
  scope: 'openid profile email',
};

export function OAuthSignInButton() {
  const handleSignIn = async () => {
    const userManager = new UserManager(oidcConfig);
    console.log(userManager);
    await userManager.signinRedirect();
  };

  return (
    <button
      onClick={handleSignIn}
      className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
    >
      Sign In
    </button>
  );
} 
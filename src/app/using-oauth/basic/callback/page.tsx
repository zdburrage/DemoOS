'use client';

import { useEffect, useState } from 'react';
import { UserManager } from 'oidc-client-ts';

const oidcConfig = {
  authority: 'https://exemplary-march-31-staging.authkit.app',
  client_id: 'client_01JSYAEP7R1N9BFEW3X14GPY62',
  client_secret: '17e2f1ac761035ca53a964beb15a5ed13478589ffd04b36ce80827c69bcfecc9',
  redirect_uri: `http://localhost:3000/using-oauth/basic/callback`,
  response_type: 'code',
  scope: 'openid profile email',
};

export default function OAuthCallback() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userManager = new UserManager(oidcConfig);
    userManager.signinRedirectCallback().then((user) => {
      setUser(user);
    });
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>Welcome, {user.profile.name || user.profile.email}</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
} 
'use client';

import { createClient } from '@workos-inc/authkit-js';
import { useState } from 'react';

export function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const authkit = await createClient("client_01HNGS5ZWKESF6P73BWMSK3825", {
        redirectUri: `${process.env.ROOT_DOMAIN}/using-hosted-authkit/basic/callback`,
        devMode: true
      });
      await authkit.signIn();
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      ) : (
        'Sign In'
      )}
    </button>
  );
} 
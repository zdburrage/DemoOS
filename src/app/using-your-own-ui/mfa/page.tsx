'use client';

import { signIn, verifyTotp } from './mfa';
import Image from 'next/image';
import { useFormState } from 'react-dom';
export default function Mfa() {
  // This example uses Next.js server actions to call functions on the server side.
  //
  // If your application is a single page app (SPA), you will need to:
  // - handle the form submission in `<form onSubmit>`
  // - make an API call to your backend (e.g using `fetch`)
  const [signInState, signInAction] = useFormState(signIn, { error: null });
  const [verifyState, verifyAction] = useFormState(verifyTotp, { error: null });

  if (!('authenticationChallenge' in signInState) || 'user' in signInState) {
    return (
      <main key="sign-in">
        <h1>Multi-Factor Auth</h1>
        <h2>Sign-in</h2>

        <form action={signInAction}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              autoCapitalize="off"
              autoComplete="username"
              autoFocus
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              autoCapitalize="off"
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit">Sign-in</button>
        </form>

        <pre>{JSON.stringify(signInState, null, 2)}</pre>
      </main>
    );
  }

  return (
    <main key="mfa">
      <h1>Multi-Factor Auth</h1>

      {signInState.authenticationFactor ? (
        <>
          <h2>Enroll</h2>
          <p>Scan the QR code</p>
          <Image
            src={signInState.authenticationFactor.totp.qrCode}
            width="160"
            height="160"
            alt="QR code"
          />
          <p>then</p>
        </>
      ) : (
        <h2>Verify</h2>
      )}

      <form action={verifyAction}>
        <div>
          <label htmlFor="code">Enter the code from your app</label>
          <input
            type="text"
            name="code"
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="^\d{6}$"
            autoFocus
            required
          />
        </div>

        <input
          type="hidden"
          name="authenticationChallengeId"
          value={signInState.authenticationChallenge.id}
        />

        <input
          type="hidden"
          name="pendingAuthenticationToken"
          value={signInState.pendingAuthenticationToken}
        />

        <button type="submit">Continue</button>
      </form>

      <pre>{JSON.stringify(verifyState, null, 2)}</pre>
    </main>
  );
}

// app/components/TokenDisplay.tsx
'use client';

import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useState, useEffect } from 'react';

// Define the WorkOS JWT payload type
interface WorkOSJwtPayload extends JwtPayload {
  sid: string;
  org_id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  metadata?: any;
}

interface TokenDisplayProps {
  accessToken?: string;
  response?: any;
}

export default function TokenDisplay({ accessToken, response }: TokenDisplayProps) {
  const [decodedToken, setDecodedToken] = useState<WorkOSJwtPayload | null>(null);

  useEffect(() => {
    if (accessToken) {
      try {
        const decoded = jwtDecode<WorkOSJwtPayload>(accessToken);
        setDecodedToken(decoded);
        
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded?.exp && currentTime >= decoded.exp) {
          console.log('Token has expired. Perform logout action.');
        } else {
          console.log('Token is still valid.');
        }
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
  }, [accessToken]);

  return (
    <div>
      {response && (
        <>
          <h2>WorkOS Response</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </>
      )}
      
      {decodedToken && (
        <>
          <h2>Decoded Access Token</h2>
          <pre>{JSON.stringify(decodedToken, null, 2)}</pre>
        </>
      )}
    </div>
  );
}
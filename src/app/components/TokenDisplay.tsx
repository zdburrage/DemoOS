// app/components/TokenDisplay.tsx
'use client';

import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useState, useEffect, ReactNode } from 'react';

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

function renderJSON(value: any, indent = 0): ReactNode {
  const pad = (n: number) => Array(n + 1).join('  ');
  if (value === null) {
    return <span className="null">null</span>;
  }
  if (typeof value === 'string') {
    return <span className="string">"{value}"</span>;
  }
  if (typeof value === 'number') {
    return <span className="number">{value}</span>;
  }
  if (typeof value === 'boolean') {
    return <span className="boolean">{value ? 'true' : 'false'}</span>;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return <span>[]</span>;
    return (
      <>
        {'['}
        <br />
        {value.map((item, i) => (
          <span key={i}>
            {pad(indent + 2)}{renderJSON(item, indent + 2)}{i < value.length - 1 ? ',' : ''}<br />
          </span>
        ))}
        {pad(indent)}{']'}
      </>
    );
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return <span>{'{}'}</span>;
    return (
      <>
        {'{'}<br />
        {keys.map((key, i) => (
          <span key={key}>
            {pad(indent + 2)}<span className="property">"{key}"</span>: {renderJSON(value[key], indent + 2)}{i < keys.length - 1 ? ',' : ''}<br />
          </span>
        ))}
        {pad(indent)}{'}'}
      </>
    );
  }
  return String(value);
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
    <div className="space-y-6">
      {response && (
        <div>
          <h2 className="text-lg font-semibold mb-3">WorkOS Response</h2>
          <div className="code-window">
            <pre>{renderJSON(response)}</pre>
          </div>
        </div>
      )}
      
      {decodedToken && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Decoded Access Token</h2>
          <div className="code-window">
            <pre>{renderJSON(decodedToken)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
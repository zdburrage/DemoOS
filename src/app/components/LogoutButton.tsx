// app/components/LogoutButton.tsx
'use client';

import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
  sessionId: string;
}

export default function LogoutButton({ sessionId }: LogoutButtonProps) {
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to log out');
      }
      
      // Redirect to the main page
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to log out. Please try again.');
    }
  };
  
  return (
    <button 
      onClick={handleLogout}
      className="inline-block px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Sign Out
    </button>
  );
}
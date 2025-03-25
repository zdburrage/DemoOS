// components/LogoutButton.tsx
'use client'

import { useRouter } from 'next/navigation'

interface LogoutButtonProps {
  sessionId: string;
}

export default function LogoutButton({ sessionId }: LogoutButtonProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
        credentials: 'include', // Important for cookie handling
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      const data = await response.json()
      
      // Redirect to the WorkOS logout URL
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-auto"
    >
      Sign Out
    </button>
  )
}
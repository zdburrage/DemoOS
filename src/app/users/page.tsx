'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    setDeletingId(userId);
    try {
      const response = await fetch('/api/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      // Optimistically update the UI
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      // Refresh the users list in the background
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      // Refresh the list to ensure consistency
      await fetchUsers();
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main className="p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Users</h1>
        <Link 
          href="/"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Created At</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {user.firstName || user.lastName ? (
                      <span>{[user.firstName, user.lastName].filter(Boolean).join(' ')}</span>
                    ) : (
                      <span className="text-gray-400">No name</span>
                    )}
                  </td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingId === user.id}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {deletingId === user.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
} 
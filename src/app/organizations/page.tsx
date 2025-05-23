'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Organization {
  id: string;
  name: string;
  domains: string[];
  createdAt: string;
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/organizations');
      if (!response.ok) {
        throw new Error('Failed to fetch organizations');
      }
      const data = await response.json();
      console.log('Received organizations data:', data);
      
      // Ensure domains are properly handled
      const processedOrgs = data.organizations.map((org: Organization) => ({
        ...org,
        domains: Array.isArray(org.domains) ? org.domains : [],
      }));
      
      setOrganizations(processedOrgs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleDelete = async (organizationId: string) => {
    if (!confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      return;
    }

    setDeletingId(organizationId);
    try {
      const response = await fetch('/api/organizations', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizationId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete organization');
      }

      // Optimistically update the UI by filtering out the deleted organization
      setOrganizations(currentOrgs => 
        currentOrgs.filter(org => org.id !== organizationId)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete organization');
      // Refresh the list to ensure consistency
      await fetchOrganizations();
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
        <h1 className="text-2xl font-semibold">Organizations</h1>
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
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Domains</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Created At</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr key={org.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{org.name}</td>
                  <td className="py-3 px-4">
                    {org.domains.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {org.domains.map((domain, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {domain}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">No domains</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(org.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(org.id)}
                      disabled={deletingId === org.id}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {deletingId === org.id ? 'Deleting...' : 'Delete'}
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
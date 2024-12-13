'use client';

import { useState } from 'react';

interface CreateOrganizationProps {
  onOrganizationCreated: () => void;
}

export default function CreateOrganization({ onOrganizationCreated }: CreateOrganizationProps) {
  const [name, setName] = useState('');
  const [domains, setDomains] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, domains }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create organization');
      }

      setName('');
      setDomains('');
      setShowForm(false);
      onOrganizationCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 border-t pt-6">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="font-medium"
        >
          + Create New Organization
        </button>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-4">Create New Organization</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Organization Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                placeholder="Enter organization name"
              />
            </div>

            <div>
              <label htmlFor="domains" className="block text-sm font-medium text-gray-700">
                Domains (optional)
              </label>
              <input
                type="text"
                id="domains"
                value={domains}
                onChange={(e) => setDomains(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="example.com, another-domain.com"
              />
              <p className="mt-1 text-sm text-gray-500">
                Comma-separated list of domains
              </p>
            </div>

            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            <div className="flex">
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-md  focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Creating...' : 'Create Organization'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
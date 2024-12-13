'use client';

import { useState, useEffect } from 'react';

interface Organization {
  id: string;
  name: string;
  domains: string[];
}

interface OrganizationDropdownProps {
  onOrganizationSelect: (organizationId: string) => void;
  selectedOrganizationId?: string;
}

export default function OrganizationDropdown({ 
  onOrganizationSelect,
  selectedOrganizationId = ''
}: OrganizationDropdownProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrganizations() {
      try {
        setLoading(true);
        const response = await fetch('/api/organizations');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch organizations');
        }
        
        setOrganizations(data.organizations);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch organizations');
        console.error('Error fetching organizations:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrganizations();
  }, []);

  const handleOrgChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onOrganizationSelect(event.target.value);
  };

  if (loading) {
    return <div>Loading organizations...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-md">
      <label 
        htmlFor="organization" 
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Select an existing organization to edit settings
      </label>
      <select
        id="organization"
        value={selectedOrganizationId}
        onChange={handleOrgChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">Select an organization</option>
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
    </div>
  );
}
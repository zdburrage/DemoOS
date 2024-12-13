'use client';

import { useState } from 'react';
import OrganizationDropdown from './OrganizationDropdown';
import type { AdminPortalLinks } from '@/types/workos';
import CreateOrganization from './CreateOrganization';

export default function OrganizationSelector() {
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [adminPortalLinks, setAdminPortalLinks] = useState<AdminPortalLinks | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOrganizationSelect = async (orgId: string) => {
    setSelectedOrgId(orgId);
    if (orgId) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/admin-portal?organization_id=${orgId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate admin portal links');
        }
        
        setAdminPortalLinks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate admin portal links');
        console.error('Error fetching admin portal links:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setAdminPortalLinks(null);
    }
  };
  const handleOrganizationCreated = () => {
    // Refresh the organizations list in the dropdown
    const dropdownElement = document.getElementById('organization') as HTMLSelectElement;
    if (dropdownElement) {
      dropdownElement.selectedIndex = 0;
    }
    setSelectedOrgId('');
    setAdminPortalLinks(null);
    window.location.reload(); // Refresh to update the organizations list
  };

  const portalLinks = [
    { key: 'sso', name: 'Single Sign-On', description: 'Configure SSO settings and connections' },
    { key: 'auditLogs', name: 'Audit Logs', description: 'View organization activity and events' },
    { key: 'directorySync', name: 'Directory Sync', description: 'Manage directory synchronization' },
    { key: 'domainVerification', name: 'Domain Verification', description: 'Verify domain ownership' },
    { key: 'logStreams', name: 'Log Streams', description: 'Configure log streaming settings' }
  ] as const;

  return (
    <div>
      <OrganizationDropdown 
        onOrganizationSelect={handleOrganizationSelect}
        selectedOrganizationId={selectedOrgId}
      />
      
      {loading && (
        <div className="mt-4 text-gray-600">
          Generating admin portal links...
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-500">
          {error}
        </div>
      )}
      
      {adminPortalLinks && (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portalLinks.map(({ key, name, description }) => (
              <a
                key={key}
                href={adminPortalLinks[key as keyof AdminPortalLinks]}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex flex-col no-underline"
              >
                <span className="font-medium text-blue-600">{name} </span>
                <span className="text-sm text-gray-600 mt-1">{description}</span>
                <br></br>
              </a>
            ))}
          </div>
        </div>
      )}

    <CreateOrganization onOrganizationCreated={handleOrganizationCreated} />    
    </div>
  );
}
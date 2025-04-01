'use client';

import { UserProfile, UserSecurity, UserSessions, UsersManagement, WorkOsWidgets } from '@workos-inc/widgets';
import { OrganizationSwitcher } from '@workos-inc/widgets/organization-switcher';
import { switchToOrganizationAction } from '../api/actions/auth-actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface WorkOSWidgetsDisplayProps {
    authToken: string;
    sessionId: string;
}

export default function WorkOSWidgetsDisplay({ authToken, sessionId }: WorkOSWidgetsDisplayProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!authToken) return null;

    const handleOrganizationSwitch = async ({ organizationId }: { organizationId: string }) => {
        try {
            setIsLoading(true);
            setError(null);

            const result = await switchToOrganizationAction({ organizationId });

            if (result.success) {
                // If successful and has a redirect URL, navigate to it
                if (result.redirectTo) {
                    router.push(result.redirectTo);
                } else {
                    // Otherwise refresh the current page
                    router.refresh();
                }
            } else if (result.redirectTo) {
                // If we need to redirect for authentication
                window.location.href = result.redirectTo;
            } else if (result.error) {
                // Display error
                setError(result.error);
            }
        } catch (error: any) {
            setError(error.message || 'An error occurred');
            console.error('Error switching organization:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="flex w-11/12 m-auto">
                <div className='w-1/2 m-2'>
                    <h1>Your Profile</h1>
                    <WorkOsWidgets
                    >
                        <UserProfile authToken={authToken} />
                    </WorkOsWidgets>
                </div>
                <div className='w-1/2 m-2'>
                    <h1>Your Authentication Factors</h1>
                    <WorkOsWidgets>
                        <UserSecurity authToken={authToken} />
                    </WorkOsWidgets>
                </div>

            </div>
            <div className='flex'>
                <div className='flex w-11/12 m-auto justify-end'>
                    {error && <div className="text-red-500 mb-2">{error}</div>}
                    <WorkOsWidgets>
                        <OrganizationSwitcher
                            authToken={authToken}
                            switchToOrganization={handleOrganizationSwitch}
                        />
                    </WorkOsWidgets>
                    {isLoading && <div className="mt-2">Switching organization...</div>}
                </div>
            </div>
            <div className='flex'>
                <div className='w-11/12 m-auto mb-10'>
                    <h1>Organization User Management</h1>
                    <WorkOsWidgets>
                        <UsersManagement authToken={authToken} />
                    </WorkOsWidgets>
                </div>
            </div>
            <div className='flex w-11/12 m-auto'>
                <div className='w-full m-5'>
                    <h1>Your Sessions</h1>
                    <WorkOsWidgets>
                        <UserSessions authToken={authToken} currentSessionId={sessionId} />
                    </WorkOsWidgets>
                </div>
            </div>
        </div>
    );
}
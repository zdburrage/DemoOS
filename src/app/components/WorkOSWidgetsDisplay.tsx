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
        <div className="space-y-6">
            <div className="widget-grid">
                <div className="card workos-card">
                    <h2 className="text-lg font-semibold mb-3">Your Profile</h2>
                    <div className="workos-widgets-wrapper">
                        <WorkOsWidgets className="workos-widgets">
                            <UserProfile authToken={authToken} />
                        </WorkOsWidgets>
                    </div>
                </div>
                <div className="card workos-card">
                    <h2 className="text-lg font-semibold mb-3">Your Authentication Factors</h2>
                    <div className="workos-widgets-wrapper">
                        <WorkOsWidgets className="workos-widgets">
                            <UserSecurity authToken={authToken} />
                        </WorkOsWidgets>
                    </div>
                </div>
            </div>

            <div className="card workos-card">
                <div className="flex justify-end">
                    {error && <div className="text-red-500 mb-2">{error}</div>}
                    <div className="workos-widgets-wrapper">
                        <WorkOsWidgets className="workos-widgets">
                            <OrganizationSwitcher
                                authToken={authToken}
                                switchToOrganization={handleOrganizationSwitch}
                            />
                        </WorkOsWidgets>
                    </div>
                    {isLoading && <div className="mt-2">Switching organization...</div>}
                </div>
            </div>

            <div className="widget-grid">
                <div className="card workos-card">
                    <h2 className="text-lg font-semibold mb-3">Organization User Management</h2>
                    <div className="workos-widgets-wrapper">
                        <WorkOsWidgets className="workos-widgets">
                            <UsersManagement authToken={authToken} />
                        </WorkOsWidgets>
                    </div>
                </div>

                <div className="card workos-card">
                    <h2 className="text-lg font-semibold mb-3">Your Sessions</h2>
                    <div className="workos-widgets-wrapper">
                        <WorkOsWidgets className="workos-widgets">
                            <UserSessions authToken={authToken} currentSessionId={sessionId} />
                        </WorkOsWidgets>
                    </div>
                </div>
            </div>
        </div>
    );
}
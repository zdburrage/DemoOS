// app/components/WorkOSWidgetsDisplay.tsx
'use client';

import { UserProfile, UserSecurity, UserSessions, UsersManagement, WorkOsWidgets } from '@workos-inc/widgets';
import { OrganizationSwitcher } from '@workos-inc/widgets/organization-switcher';



interface WorkOSWidgetsDisplayProps {
    authToken: string;
    sessionId: string;
}

export default function WorkOSWidgetsDisplay({ authToken, sessionId }: WorkOSWidgetsDisplayProps) {
    if (!authToken) return null;

    return (
        <div>
            {/* <div className='flex'>
                <div className=''>
                    <WorkOsWidgets>
                        <OrganizationSwitcher
                            authToken={authToken}
                            switchToOrganization={async ({ organizationId }) => {
                                await switchToOrganizationAction({ organizationId });
                                // Optionally refresh the page after switching
                                window.location.reload();
                            }}
                        />
                    </WorkOsWidgets>
                </div>
            </div> */}
            <div className='flex'>
                <div className='w-11/12 m-auto mb-10'>
                    <h1>Organization User Management</h1>
                    <WorkOsWidgets>
                        <UsersManagement authToken={authToken} />
                    </WorkOsWidgets>
                </div>
            </div>
            <div className="flex">
                <div className='m-5'>
                    <h1>Your Profile</h1>
                    <WorkOsWidgets
                    >
                        <UserProfile authToken={authToken} />
                    </WorkOsWidgets>
                </div>
                <div className='m-5'>
                    <h1>Your Security</h1>
                    <WorkOsWidgets>
                        <UserSecurity authToken={authToken} />
                    </WorkOsWidgets>
                </div>
                <div className='m-5'>
                    <h1>Your Sessions</h1>
                    <WorkOsWidgets>
                        <UserSessions authToken={authToken} currentSessionId={sessionId} />
                    </WorkOsWidgets>
                </div>
                {/* <div className='m-5'>
                <h1>Organization Switcher</h1>
                <WorkOsWidgets>
                    <OrganizationSwitcher
                        authToken={authToken}
                        switchToOrganization={async ({ organizationId }) => {
                            'use server';

                            await switchToOrganizationAction({
                                organizationId,
                            });
                        }}
                    />
                </WorkOsWidgets>
            </div> */}
            </div>
        </div>
    );
}
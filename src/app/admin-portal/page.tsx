'use client';

import OrganizationSelector from '../components/OrganizationSelector';

//const workos = new WorkOS(process.env.WORKOS_API_KEY);


export default function AdminPortal() {

    return (
        <main>
            <div className='w-1/2'>
                <h1>Admin Portal</h1>

                <div className="p-4">
                    <OrganizationSelector />
                </div>
            </div>
        </main>
    );
}

import { NextResponse } from 'next/server';
import {WorkOS} from '@workos-inc/node';

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

// export async function GET() {
//   try {
//     const { data } = await workos.organizations.listOrganizations({
//       limit: 100,
//     });
//     const session = await workos.passwordless.createSession({
//       email: 'socasi7357@rykone.com',
//       type: 'MagicLink',
//       redirectURI: `http://localhost:3000/using-your-own-ui/sign-in/sso/callback`
//     });
//     await workos.passwordless.sendSession(
//       session.id
//     );
//     return NextResponse.json({ organizations: data });
//   } catch (error) {
//     console.error('Error fetching organizations:', error);
//     return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
//   }
// }

export async function PUT(request: Request) {
    try {
      const body = await request.json();
      const { id, metadata } = body;
  
  
      const user = await workos.userManagement.updateUser({
        userId: id,
        metadata: metadata
      });
  
      return NextResponse.json(user);
    } catch (error) {
      console.error('Error creating organization:', error);
      return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
    }
  }
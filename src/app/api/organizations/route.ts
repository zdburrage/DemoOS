import { NextResponse } from 'next/server';
import {WorkOS} from '@workos-inc/node';

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export async function GET() {
  try {
    const organizations = await workos.organizations.listOrganizations({
      limit: 100,
    });

    const mappedOrgs = organizations.data.map(org => ({
      id: org.id,
      name: org.name,
      domains: org.domains.map(domain => domain.domain),
      createdAt: org.createdAt,
    }));

    console.log('Mapped organizations:', JSON.stringify(mappedOrgs, null, 2));

    return NextResponse.json({
      organizations: mappedOrgs,
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organizations' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { name, domains } = body;
  
      if (!name) {
        return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
      }
  
      const organization = await workos.organizations.createOrganization({
        name,
        domains: domains ? domains.split(',').map((d: string) => d.trim()) : [],
      });
  
      return NextResponse.json(organization);
    } catch (error) {
      console.error('Error creating organization:', error);
      return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
    }
  }

export async function DELETE(request: Request) {
  try {
    const { organizationId } = await request.json();
    
    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
    }

    await workos.organizations.deleteOrganization(organizationId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting organization:', error);
    return NextResponse.json({ error: 'Failed to delete organization' }, { status: 500 });
  }
}
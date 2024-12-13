import { NextResponse } from 'next/server';
import WorkOS from '@workos-inc/node';

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export async function GET() {
  try {
    const { data } = await workos.organizations.listOrganizations({
      limit: 100,
    });
    return NextResponse.json({ organizations: data });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
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
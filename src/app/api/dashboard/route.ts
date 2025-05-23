import { WorkOS } from '@workos-inc/node';
import { NextResponse } from 'next/server';

const workos = new WorkOS(process.env.WORKOS_API_KEY);

export async function GET() {
  try {
    // Get total users
    const users = await workos.userManagement.listUsers({
      limit: 100, // Maximum allowed by WorkOS
    });
    const totalUsers = users.data.length;

    // Get organizations
    const organizations = await workos.organizations.listOrganizations({
      limit: 100, // Maximum allowed by WorkOS
    });
    const totalOrgs = organizations.data.length;

    // Get authentication events for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    


    // Get recent activity


    return NextResponse.json({
      metrics: {
        totalUsers,
        totalOrgs,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 
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

    const eventsResponse = await workos.events.listEvents({
      events: [
        'authentication.oauth_succeeded',
        'authentication.sso_succeeded',
        'authentication.password_succeeded',
        'authentication.magic_auth_succeeded',
        'authentication.mfa_succeeded',
      ],
      rangeStart: thirtyDaysAgo.toISOString(),
      limit: 50,
    });

    const authEvents = eventsResponse.data.length;

    // Get recent activity
    const recentActivity = eventsResponse.data.slice(0, 5).map((event) => ({
      user: (event.data && ('email' in event.data))
        ? (event.data.email || event.data.userId || 'Unknown')
        : 'Unknown',
      action: event.event,
      time: event.createdAt,
    }));

    return NextResponse.json({
      metrics: {
        totalUsers,
        totalOrgs,
        authEvents,
      },
      recentActivity,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 
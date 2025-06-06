'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DashboardData {
  metrics: {
    totalUsers: number;
    totalOrgs: number;
    authEvents: number;
  };
  recentActivity: Array<{
    user: string;
    action: string;
    time: string;
  }>;
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        console.log('Dashboard data:', data);
        setData(data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  console.log('Current data state:', data);

  if (loading) {
    return (
      <main>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </main>
    );
  }

  if (!data || !data.metrics) {
    return (
      <main>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-red-500">No data available</div>
        </div>
      </main>
    );
  }

  const {
    totalUsers = 0,
    totalOrgs = 0,
    authEvents = 0,
  } = data.metrics;

  return (
    <main>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/users" className="card hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
            <span className="badge badge-success">Active</span>
          </div>
          <p className="text-2xl font-semibold">{(data?.metrics.totalUsers || 0).toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-2">Active users in your organization</p>
        </Link>

        <Link href="/organizations" className="card hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Organizations</h3>
            <span className="badge badge-success">Active</span>
          </div>
          <p className="text-2xl font-semibold">{(data?.metrics.totalOrgs || 0).toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-2">Connected organizations</p>
        </Link>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Auth Events</h3>
            <span className="badge badge-success">Active</span>
          </div>
          <p className="text-2xl font-semibold">{authEvents.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-2">Events in the last 30 days</p>
        </div>
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4">
            <Link href="/using-your-own-ui" className="card hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Self Hosted Auth</h3>
                  <p className="text-sm text-gray-600">Build your own authentication UI</p>
                </div>
              </div>
            </Link>

            <Link href="/using-hosted-authkit" className="card hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">AuthKit</h3>
                  <p className="text-sm text-gray-600">Use WorkOS&apos;s pre-built auth UI</p>
                </div>
              </div>
            </Link>

            <Link href="/admin-portal" className="card hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Organizations</h3>
                  <p className="text-sm text-gray-600">Manage organizations and users</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Action</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Time</th>
                </tr>
              </thead>
              <tbody>
                {data.recentActivity.map((activity, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{activity.user}</td>
                    <td className="py-3 px-4">{activity.action}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(activity.time).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

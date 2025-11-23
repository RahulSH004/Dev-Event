import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics | Dev Events',
  description: 'View analytics and insights for your events',
};

export default async function AnalyticsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/auth/signin?redirect=/admin/analytics');
  }

  return (
    <section className="container-padding py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-light-100 mb-2">Analytics Dashboard</h1>
          <p className="text-light-300">
            Track your event performance and audience engagement
          </p>
        </div>

        <AnalyticsDashboard userId={session.user.id} />
      </div>
    </section>
  );
}
